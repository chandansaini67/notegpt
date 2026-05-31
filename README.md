# ✨ NoteGPT — AI-Powered Note Taking App

> **Founder / Key Developer: Chandan Saini**

NoteGPT is a modern, full-stack note-taking application powered by AI. Built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Google Gemini AI**, it lets you create, organise, and summarise notes and PDFs in seconds.

---

## 🚀 Live Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure JWT-based login & signup |
| 📝 **Notes CRUD** | Create, view, edit, and delete notes |
| 📌 **Pin Notes** | Pin important notes to the top |
| 🔍 **Full-Text Search** | Search by title or content instantly |
| 📄 **PDF Upload** | Upload PDFs and extract all text automatically |
| 🤖 **AI Summarize** | One-click AI summary using Google Gemini |
| 🏷️ **Auto Tags** | AI-generated tags for every note |
| 🌙 **Dark / Light Mode** | Toggle between themes with one click |
| 📱 **Responsive UI** | Works beautifully on desktop and mobile |
| 🏠 **Landing Page** | Public hero page with features & how-it-works |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- React Toastify
- React Icons

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (PDF uploads)
- pdf-parse (text extraction)

**AI**
- Google Gemini API (`gemini-2.5-flash`)

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Atlas](https://cloud.mongodb.com/) free account (or local MongoDB)
- [Google Gemini API Key](https://aistudio.google.com/apikey)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/notegpt.git
cd notegpt
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/notegpt?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

> **Tip:** If your MongoDB password contains special characters (like `@`), URL-encode them. For example `@` → `%40`.

> **Important:** In MongoDB Atlas → Network Access → add `0.0.0.0/0` to allow connections from any IP.

Start the backend:

```bash
npm run dev
```

Backend runs on → `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Frontend runs on → `http://localhost:3000`

---

### 4. Open the App

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📁 Project Structure

```
notegpt/
├── server/                  # Express.js backend
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── middleware/
│   │   └── auth.js          # JWT auth middleware
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Note.js          # Note schema
│   ├── routes/
│   │   ├── auth.js          # Login / signup routes
│   │   ├── notes.js         # Notes CRUD routes
│   │   └── ai.js            # AI summarize & tag routes
│   ├── uploads/             # Uploaded PDF files
│   ├── server.js            # Entry point
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
│
└── client/                  # React + Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ThemeToggle.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── TagBadge.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx   # Public landing page
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── NoteView.jsx
    │   │   └── NoteEdit.jsx
    │   ├── services/
    │   │   └── api.js        # Axios API service
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    └── package.json
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any random secret string for signing JWTs |
| `GEMINI_API_KEY` | Your Google Gemini API key from [AI Studio](https://aistudio.google.com/apikey) |
| `PORT` | Backend port (default: 5000) |

---

## 🤖 AI Summarization

NoteGPT uses the **Google Gemini API** to:
- Summarise notes into 3–5 bullet points
- Auto-generate relevant tags
- Process extracted PDF text

The app automatically falls back through available models:
`gemini-2.0-flash` → `gemini-2.0-flash-lite` → `gemini-2.5-flash`

---

## 🐛 Troubleshooting

**MongoDB connection fails?**
- Go to MongoDB Atlas → Network Access → add `0.0.0.0/0`
- Check your connection string has the correct password (URL-encode special characters)

**AI summarize not working?**
- Verify your Gemini API key at [aistudio.google.com](https://aistudio.google.com)
- Free tier has rate limits — wait a minute and try again

**Port already in use?**
- Change `PORT` in `server/.env`
- Or kill the process: `npx kill-port 5000`

---

## 📜 License

MIT License — free to use and modify.

---

<div align="center">
  <strong>✨ NoteGPT</strong> · Built with ❤️ by <strong>Chandan Saini</strong>
</div>
