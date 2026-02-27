# ✦ Hoje na Palavra — App de Reflexões Bíblicas Diárias

App web progressivo (PWA) para reflexões bíblicas com Inteligência Artificial.  
Funciona em **qualquer navegador moderno**, pode ser instalado como app nativo no celular, e funciona parcialmente offline.

---

## 🚀 Estrutura de Arquivos

```
hoje-na-palavra/
├── index.html              ← App principal (PWA single-page)
├── manifest.json           ← Manifesto PWA
├── sw.js                   ← Service Worker (cache + notificações)
├── firebase-messaging-sw.js← Push via Firebase (opcional)
├── generate_icons.py       ← Script para gerar ícones
├── icons/
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── README.md               ← Este arquivo
```

---

## ⚙️ Configuração Rápida

### 1. Chave de IA (OpenRouter — GRATUITO)

O app usa **OpenRouter** como gateway universal de IA, compatível com:
- Google Gemini ✓
- OpenAI GPT ✓
- Anthropic Claude ✓
- Meta Llama (gratuito) ✓
- +200 modelos

**Como obter sua chave gratuita:**
1. Acesse [openrouter.ai](https://openrouter.ai)
2. Clique em "Sign In" (com Google ou GitHub)
3. Vá em **Keys → Create Key**
4. Copie a chave (começa com `sk-or-v1-...`)
5. Cole em **Configurações → Inteligência Artificial** no app

> 💡 O modelo **Gemini Flash 1.5** e **Llama 3.1 8B** são gratuitos sem custo.

---

### 2. Hospedar o App

#### Opção A — GitHub Pages (GRATUITO)
1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Vá em **Settings → Pages → Source: main branch**
4. Seu app estará em `https://SEU_USUARIO.github.io/REPO`

#### Opção B — Netlify (GRATUITO)
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `hoje-na-palavra/` para a área de deploy
3. Seu app terá uma URL própria instantaneamente

#### Opção C — Vercel (GRATUITO)
1. Instale: `npm i -g vercel`
2. Dentro da pasta: `vercel --prod`

---

### 3. Notificações Push (Firebase — Opcional)

Para notificações às **8h da manhã** via Firebase Cloud Messaging:

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto → Adicione app Web
3. Copie a `firebaseConfig`
4. Cole em `firebase-messaging-sw.js`
5. No Firebase Console → **Cloud Messaging → Web Push Certificates** → gere um par de chaves VAPID

**Para enviar notificações às 8h**, use o Firebase Admin SDK ou Cloud Functions:
```javascript
// Exemplo com Firebase Admin (Node.js)
const admin = require('firebase-admin');

// Agendar via Cloud Scheduler → 0 8 * * * (todo dia às 8h)
async function sendDailyNotification() {
  await admin.messaging().send({
    topic: 'daily-devotional',
    notification: {
      title: '☀️ Hoje na Palavra',
      body: '✦ Sua reflexão diária está pronta. Comece o dia com a Palavra!'
    }
  });
}
```

> 💡 **Alternativa simples**: O app já inclui agendamento local de notificações (sem Firebase) que funciona quando o usuário tem o app aberto ou instalado como PWA. As notificações são agendadas automaticamente para as 8h ao ativar a opção.

---

## 📱 Instalar como App no Celular

### Android (Chrome)
1. Abra o app no Chrome
2. Toque nos **3 pontos** → "Adicionar à tela inicial"
3. Ou aguarde o banner aparecer automaticamente

### iOS (Safari)
1. Abra no Safari
2. Toque no botão **Compartilhar** (quadrado com seta)
3. "Adicionar à Tela de Início"

---

## 🌐 Funcionalidades

| Feature | Status |
|---------|--------|
| Geração por IA (OpenRouter) | ✅ |
| Múltiplos modelos de IA | ✅ Gemini, GPT, Claude, Llama |
| Modo escuro/claro | ✅ |
| 6 idiomas | ✅ PT-BR, EN, ES, FR, DE, IT |
| Favoritos com badge | ✅ |
| Compartilhar (WhatsApp, Telegram, X, etc.) | ✅ |
| Baixar imagem (JPEG) | ✅ |
| Navegação por datas | ✅ |
| Cache offline | ✅ |
| Instalável como PWA | ✅ |
| Notificações locais (8h) | ✅ |
| Notificações push Firebase | ⚙️ Requer config |
| Banco de dados | ✅ LocalStorage (offline-first) |

---

## 🎨 Design

- **Paleta**: Âmbar / Ouro elegante  
- **Tipografia**: Playfair Display + Lora + Nunito  
- **Layout**: Mobile-first, máx. 480px  
- **Animações**: Entrada suave, microinterações  
- **Tema**: Claro e escuro com transição suave  

---

## 🔑 Variáveis para Personalizar

No `index.html`, você pode ajustar:

```javascript
// Trocar URL do app web
'https://fabricdeapps.github.io/hoje-na-palavra/'

// Adicionar Firebase Config (linha ~15)
const firebaseConfig = { ... };
```

---

## 📄 Licença

MIT — Uso livre, inclusive comercial.

---

**Feito com ❤️ e fé.**  
*"Porque dele, e por meio dele, e para ele são todas as coisas." — Romanos 11:36*
