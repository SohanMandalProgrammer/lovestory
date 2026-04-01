# 💕 LoveStory Creator

A full-stack romantic web application where users create personalized love pages, write shayari, generate AI love messages, and build relationship quizzes.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT-based signup/login with profile management |
| 📸 Photo Upload | Drag-and-drop, up to 5 photos, stored on Cloudinary |
| 📜 Shayari | 200+ curated Hinglish/Hindi shayari + custom editor |
| 🎨 Templates | 6 romantic templates: Instagram, Story, Letter, Proposal, Neon, Pastel |
| 🤖 AI Messages | Claude AI generates personalized love messages, shayari, letters |
| 💝 Love Quiz | Build shareable quizzes with score messages in Hinglish |
| 💌 Love Letter | Animated typewriter effect with petal rain + AI writing |
| 🔗 Sharing | Every project/quiz gets a unique public URL |
| 🌙 Dark mode | Deep romantic dark theme throughout |

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- React Router v6
- Zustand (state management)
- React Dropzone (file uploads)
- React Hot Toast (notifications)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image storage)
- Anthropic Claude API (AI features)
- Express Rate Limiting + Helmet

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)
- Anthropic API key

### 1. Clone and install

```bash
git clone https://github.com/SohanMandalProgrammer/lovestory.git
cd lovestory
npm run install:all
```

### 2. Configure Server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lovestory
JWT_SECRET=your_random_secret_string_here
ANTHROPIC_API_KEY=sk-ant-api03-...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 3. Configure Client

```bash
cd client
cp .env.example .env
```

`client/.env` (default is fine for local dev):
```env
VITE_API_URL=/api
```

### 4. Run Development

From project root:
```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## 🗂 Project Structure

```
lovestory/
├── vercel.json               # Unified Vercel configuration
├── package.json              # Root scripts + unified dependencies
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.jsx           # Routes
│   │   ├── main.jsx          # Entry point
│   │   ├── index.css         # Global styles + Tailwind
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── FloatingHearts.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx       # + RegisterPage export
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ShayariPage.jsx
│   │   │   ├── TemplatesPage.jsx
│   │   │   ├── AIPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── QuizPlayPage.jsx    # Public quiz URL
│   │   │   ├── LoveLetterPage.jsx
│   │   │   └── ViewProjectPage.jsx # Public shared page
│   │   ├── hooks/
│   │   │   └── useAuthStore.js     # Zustand auth store
│   │   └── utils/
│   │       └── api.js              # Axios instance
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/
    ├── index.js              # Express app + middleware (serverless-ready)
    ├── config/
    │   ├── db.js             # MongoDB connection
    │   └── cloudinary.js     # Cloudinary + Multer
    ├── middleware/
    │   └── auth.js           # JWT protect middleware
    ├── models/
    │   ├── User.js
    │   ├── Project.js        # Love pages
    │   ├── Quiz.js
    │   └── Shayari.js
    └── routes/
        ├── auth.js           # /api/auth
        ├── projects.js       # /api/projects
        ├── shayari.js        # /api/shayari
        ├── quiz.js           # /api/quiz
        ├── ai.js             # /api/ai (Claude)
        └── upload.js         # /api/upload
```

---

## 🌐 API Reference

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| PATCH | `/api/auth/profile` | ✅ | Update profile |

### Projects (Love Pages)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/projects` | ✅ | List user's projects |
| POST | `/api/projects` | ✅ | Create project |
| GET | `/api/projects/:slug` | Optional | View public page |
| PATCH | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |

### Quiz
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/quiz` | ✅ | Create quiz |
| GET | `/api/quiz/my` | ✅ | User's quizzes |
| GET | `/api/quiz/:slug` | — | Get quiz (no answers) |
| POST | `/api/quiz/:slug/submit` | — | Submit answers |

### AI (Claude)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/ai/message` | ✅ | Generate love message |
| POST | `/api/ai/shayari` | ✅ | Generate shayari |
| POST | `/api/ai/letter` | ✅ | Generate love letter |
| POST | `/api/ai/quiz-questions` | ✅ | Generate quiz questions |

### Upload
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/upload/photos` | ✅ | Upload up to 5 photos |
| DELETE | `/api/upload/:publicId` | ✅ | Delete a photo |

---

### Unified Deployment → Vercel (Recommended)

This project is configured for **unified deployment** (Frontend + Backend on one URL).

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo.
3. Don't change any settings (Vercel will detect the root `vercel.json`).
4. Add all environment variables from `server/.env.example` in the Vercel Dashboard.
5. Deploy ✅

### Manual (Separate) Deployment

If you prefer separate hosting (e.g., Frontend on Vercel and Backend on Render/Railway):

### MongoDB Atlas (Free Tier)

1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (allow all for Render)
4. Copy connection string → paste in `MONGODB_URI`

### Cloudinary (Free Tier)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Dashboard → API Keys
3. Copy Cloud Name, API Key, API Secret → paste in server `.env`

### Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create Key
3. Paste as `ANTHROPIC_API_KEY` in server `.env`

---

## 🔧 Customization

### Add more shayari
Use the API or seed script:
```bash
# POST to /api/shayari with your JWT token
curl -X POST http://localhost:5000/api/shayari \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"text":"...", "author":"...", "category":"romantic"}'
```

### Add new templates
Edit `TEMPLATES` array in `client/src/pages/TemplatesPage.jsx` and add the id to the Project model enum in `server/models/Project.js`.

### Change AI model
In `server/routes/ai.js`, update:
```js
model: 'claude-opus-4-5-20251001'  // for more powerful generation
```

---

## 📱 Mobile Support

The UI is fully mobile-first with:
- Responsive grid layouts
- Horizontal-scrolling mobile nav
- Touch-friendly quiz buttons
- Optimized photo upload on mobile

---

## 🔒 Security Features

- JWT authentication with 30-day expiry
- Bcrypt password hashing (12 rounds)
- Rate limiting: 100 req/15min global, 10 req/min for AI
- Helmet.js security headers
- CORS restricted to client URL
- File type validation on upload
- Private projects protected by auth

---

## 🤝 Contributing

PRs welcome! Ideas for v2:
- [ ] Firebase Auth option
- [ ] Background music integration (Spotify/YouTube)
- [ ] Download page as PDF/image (html2canvas)
- [ ] Admin panel for shayari management
- [ ] Dark/light mode toggle
- [ ] Animated proposal page with confetti
- [ ] WhatsApp share integration

---

Made with 💕 by LoveStory Creator
