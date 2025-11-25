# Ache o Endereço

Uma aplicação web interativa para buscar e localizar endereços no mapa usando CEP, busca por endereço, ou clique direto no mapa.

## 🎯 Funcionalidades

- 🔍 **Busca por CEP** — Procure por CEP e visualize o endereço no mapa
- 🗺️ **Autocomplete de Endereço** — Digite rua, bairro ou cidade para autocomplete interativo
- 📍 **Clique no Mapa** — Clique em qualquer ponto do mapa para visualizar coordenadas e endereço
- 🎯 **Localização Automática** — Botão para centralizar no seu local atual (via GPS)
- 📌 **Marcador Arrastável** — Arraste o marcador para obter novas coordenadas e endereço
- 🌐 **Mapa Interativo** — Powered by OpenStreetMap e Leaflet

## 🛠️ Stack Técnico

- **Frontend:** HTML5, CSS3, Bootstrap 5
- **Mapa:** Leaflet.js + OpenStreetMap
- **APIs:**
  - ViaCEP (busca por CEP)
  - Nominatim (geocoding/reverse geocoding)
- **Ícones:** Bootstrap Icons

## 📦 Como Usar

### 1. Clonar ou Baixar
```bash
git clone <seu-repo-url>
cd "Ache o endereço"
```

### 2. Executar Localmente
Use um servidor estático (recomendado):

**Com Python 3:**
```bash
python -m http.server 8000
```

**Com Node.js (http-server):**
```bash
npx http-server
```

Depois abra no navegador:
```
http://localhost:8000/index.html
```

### 3. Usar a Aplicação
1. **Via CEP:** Digita um CEP (ex: `01001-000`) e clique em "Localizar"
2. **Via Busca:** Digite endereço na caixa "Pesquisar endereço" e escolha um resultado
3. **Via Mapa:** Clique no mapa para posicionar o marcador
4. **Via GPS:** Clique no botão "Localizar" (canto superior direito) para usar sua localização

## 📝 Estrutura de Arquivos

```
Ache o endereço/
├── index.html          # Página principal
├── style.css           # Estilos customizados
├── script.js           # Lógica JavaScript (mapa, geocoding, etc)
├── .gitignore          # Arquivos a ignorar no Git
└── README.md           # Este arquivo
```

## ⚙️ Configuração

### APIs Externas
- **ViaCEP:** Sem autenticação (público, Brasil apenas)
- **Nominatim (OSM):** Sem chave, mas com limites de uso (respeite os ToS)
- **OpenStreetMap Tiles:** Público

Para produção, recomenda-se usar APIs com chave:
- Mapbox
- Google Maps
- Ou hospedar Nominatim próprio

## 🚀 Deploy

### GitHub Pages
1. Faça push para o GitHub
2. Em **Settings → Pages**, selecione **Deploy from a branch**
3. Escolha **main** como branch de source
4. A app estará disponível em `https://<seu-usuario>.github.io/<repo-name>`

### Vercel / Netlify
1. Conecte o repositório
2. Escolha **Deploy** — será servido automaticamente

## 📋 Roadmap Futuro

- [ ] Adicionar suporte a múltiplos marcadores
- [ ] Salvar locais favoritos (localStorage)
- [ ] Dark mode
- [ ] Geolocalização de precisão (com permissão)
- [ ] Integração com Google Maps / Mapbox
- [ ] Mobile app nativa (React Native)

## 🤝 Contribuições

Contribuições são bem-vindas! Faça um fork, crie uma branch e abra um Pull Request.

## 📄 Licença

MIT — Fique livre para usar e modificar.

## 📞 Contato

Dúvidas ou sugestões? Abra uma issue no repositório!

---

**Desenvolvido com ❤️ usando tecnologias web abertas**
