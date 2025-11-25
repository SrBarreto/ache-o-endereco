let map;
let marker;

function initMap() {
  const defaultLat = -23.55052; // São Paulo as default
  const defaultLng = -46.633308;

  map = L.map('map').setView([defaultLat, defaultLng], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  marker = L.marker([defaultLat, defaultLng], {draggable: true}).addTo(map);

  // when marker dragged, update inputs and reverse-geocode
  marker.on('dragend', function (e) {
    const p = marker.getLatLng();
    setInputs(p.lat, p.lng);
    reverseGeocode(p.lat, p.lng);
  });

  // when map clicked, move marker, update inputs and reverse-geocode
  map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    setMarker(lat, lng);
    setInputs(lat, lng);
    reverseGeocode(lat, lng);
  });

  // if user types coordinates and presses Enter in inputs, go
  document.getElementById('lat').addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') showMapAtCoordinates();
  });
  document.getElementById('lng').addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') showMapAtCoordinates();
  });
}

function setMarker(lat, lng) {
  if (!marker) {
    marker = L.marker([lat, lng], {draggable: true}).addTo(map);
  } else {
    marker.setLatLng([lat, lng]);
  }
  map.setView([lat, lng], 15);
}

function updateOverlay(addressText, lat, lng) {
  const overlayAddress = document.getElementById('overlayAddress');
  const overlayCoords = document.getElementById('overlayCoords');
  if (overlayAddress) overlayAddress.textContent = addressText || '';
  if (overlayCoords) overlayCoords.textContent = lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : '';
}

// Reverse geocoding (lat/lng -> address)
async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&addressdetails=1`;
  try {
    const resp = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
    const data = await resp.json();
    if (data && data.address) {
      const addr = data.address;
      const road = addr.road || addr.pedestrian || addr.cycleway || '';
      const neighbourhood = addr.neighbourhood || addr.suburb || addr.village || addr.hamlet || '';
      const city = addr.city || addr.town || addr.village || addr.county || '';
      document.getElementById('inputRua').value = road;
      document.getElementById('inputBairro').value = neighbourhood;
      document.getElementById('inputCidade').value = city;
      updateOverlay([road, neighbourhood, city].filter(Boolean).join(', '), lat, lng);
    } else {
      updateOverlay('', lat, lng);
    }
  } catch (err) {
    console.warn('reverseGeocode error', err);
    updateOverlay('', lat, lng);
  }
}

function setInputs(lat, lng) {
  document.getElementById('lat').value = Number(lat).toFixed(6);
  document.getElementById('lng').value = Number(lng).toFixed(6);
}

function showMapAtCoordinates() {
  const lat = parseFloat(document.getElementById('lat').value);
  const lng = parseFloat(document.getElementById('lng').value);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    setMarker(lat, lng);
    setInputs(lat, lng);
  } else {
    alert('Por favor insira valores numéricos válidos para latitude e longitude.');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  try {
    initMap();
    // set initial inputs from default marker
    const p = marker.getLatLng();
    setInputs(p.lat, p.lng);
    updateOverlay('', p.lat, p.lng);
    // locate button
    const locateBtn = document.getElementById('locateBtn');
    if (locateBtn) locateBtn.addEventListener('click', function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          setMarker(pos.coords.latitude, pos.coords.longitude);
          setInputs(pos.coords.latitude, pos.coords.longitude);
          reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        }, function () { alert('Não foi possível obter a localização.'); });
      } else {
        alert('Geolocalização não suportada neste navegador.');
      }
    });
  } catch (e) {
    console.error('Erro ao inicializar o mapa:', e);
  }
});

// Geocoding usando Nominatim (OpenStreetMap)
async function geocodeAddress() {
  const rua = document.getElementById('inputRua')?.value || '';
  const bairro = document.getElementById('inputBairro')?.value || '';
  const cidade = document.getElementById('inputCidade')?.value || '';
  const cep = document.getElementById('cep')?.value || '';
  const parts = [rua, bairro, cidade, cep, 'Brasil'].filter(Boolean).join(', ');
  if (!parts) return;

  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=' + encodeURIComponent(parts) + '&countrycodes=br';
  try {
    const resp = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
    const results = await resp.json();
    if (results && results.length) {
      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);
      setMarker(lat, lon);
      setInputs(lat, lon);
    } else {
      console.log('Geocoding não retornou resultados para:', parts);
    }
  } catch (err) {
    console.warn('Erro durante geocoding:', err);
  }
}

// Autocomplete (search) usando Nominatim
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const searchInput = () => document.getElementById('searchAddress');
const resultsList = () => document.getElementById('searchResults');

async function performSearch(query) {
  if (!query || query.length < 3) { clearSearchResults(); return; }
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(query)}&addressdetails=1&countrycodes=br`;
  try {
    const resp = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
    const data = await resp.json();
    showSearchResults(data);
  } catch (err) {
    console.warn('search error', err);
    clearSearchResults();
  }
}

function showSearchResults(items) {
  const ul = resultsList();
  if (!ul) return;
  ul.innerHTML = '';
  items.forEach((it) => {
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action';
    li.textContent = it.display_name;
    li.tabIndex = 0;
    li.addEventListener('click', () => selectSearchResult(it));
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter') selectSearchResult(it); });
    ul.appendChild(li);
  });
}

function clearSearchResults() {
  const ul = resultsList();
  if (ul) ul.innerHTML = '';
}

function selectSearchResult(item) {
  if (!item) return;
  const lat = parseFloat(item.lat);
  const lon = parseFloat(item.lon);
  setMarker(lat, lon);
  setInputs(lat, lon);
  // fill address fields if available
  if (item.address) {
    const addr = item.address;
    document.getElementById('inputRua').value = addr.road || addr.pedestrian || addr.house_number || '';
    document.getElementById('inputBairro').value = addr.neighbourhood || addr.suburb || '';
    document.getElementById('inputCidade').value = addr.city || addr.town || addr.village || '';
  }
  updateOverlay(item.display_name, lat, lon);
  clearSearchResults();
  // also clear the input to show chosen address (optional)
  const inp = searchInput(); if (inp) inp.value = item.display_name;
}

// wire up input with debounce
document.addEventListener('DOMContentLoaded', function () {
  const inp = searchInput();
  if (inp) {
    inp.addEventListener('input', debounce((e) => {
      performSearch(e.target.value);
    }, 300));
    // click outside to close results
    document.addEventListener('click', (ev) => {
      const ul = resultsList();
      if (!ul) return;
      if (!ev.target.closest('#searchAddress') && !ev.target.closest('#searchResults')) clearSearchResults();
    });
  }
});
