# 🧠 MindRush — AI-Powered Adaptive Quiz & Learning Platform

<p align="center">
  <b>Generate personalized, interactive quizzes from topics, custom text, or PDF documents in seconds using RAG & Gemini AI.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.139-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Groq_API-Fast_LLM-f55036?style=for-the-badge&logo=groq" alt="Groq API" />
  <img src="https://img.shields.io/badge/Google_OAuth-Auth.js-4285F4?style=for-the-badge&logo=google" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/LangChain-RAG-121212?style=for-the-badge&logo=chainlink" alt="LangChain" />
  <img src="https://img.shields.io/badge/ChromaDB-Vector_DB-FF6F61?style=for-the-badge&logo=databricks" alt="ChromaDB" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_DB-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</p>

---

## 📌 Overview

**MindRush** is an intelligent, full-stack educational web application designed to transform learning into an engaging, adaptive, and gamified experience. Using **Retrieval-Augmented Generation (RAG)** powered by **LangChain**, **Google Gemini AI**, and **ChromaDB**, MindRush allows users to instantly generate custom multiple-choice quizzes on any topic or directly from uploaded PDF documents and raw text notes.

With an aesthetic dark-themed glassmorphism user interface, real-time timers, comprehensive answer reviews, streak tracking heatmaps, and subject-wise performance analytics, MindRush empowers learners, students, and professionals to master any subject effortlessly.

---

## 📸 Screen Showcase

### ⚡ 1. AI Quiz Generator
Generate targeted quizzes on demand. Choose any custom topic or upload a PDF / paste text notes, set difficulty levels (Easy, Medium, Hard), and select the number of questions.

![AI Quiz Generator](./assets/quiz-generator.png)

---

### 📊 2. User Overview & Streak Heatmap
Track your learning intensity over the past 52 weeks with GitHub-style contribution heatmaps, active day counters, quick-start topic recommendations, and recent attempt logs.

![User Overview](./assets/dashboard-overview.png)

---

### 🎯 3. Timed Interactive Quiz Interface
Experience a distraction-free, real-time quiz interface complete with live countdown timers, question counters, smooth option selections, and score progression.

![Interactive Quiz Interface](./assets/quiz-interface.png)

---

### 🏆 4. Quiz Completion & Answer Review
Get immediate score summaries with accuracy percentages, difficulty badges, and step-by-step answer reviews detailing correct answers and explanations.

![Quiz Results](./assets/quiz-results.png)

---

### 📈 5. Performance Analytics Dashboard
Gain deep insight into your learning growth with score progression trend graphs, category strength breakdowns (Coding, Science, Logic, History), average completion speed, and AI-driven study tips.

![Performance Analytics](./assets/analytics-dashboard.png)

---

## ✨ Key Features

- 🤖 **Multi-Source Quiz Generation**: Create quizzes from custom topics, raw notes, or uploaded PDF documents.
- 📄 **RAG Engine (Retrieval-Augmented Generation)**: Uses **PyMuPDF** for text extraction, chunking via `RecursiveCharacterTextSplitter`, and similarity search in **ChromaDB** for accurate, context-aware question creation.
- ⏱️ **Interactive Quiz Execution**: Live timer controls, progress tracking, and instant answer evaluations.
- 🔍 **Detailed Answer Review**: Review past quiz attempts with question-by-question breakdowns and correct answer explanations.
- 🔥 **Gamified Streak Tracking**: Visual 52-week activity log heatmap keeping users consistent and motivated.
- 📊 **Comprehensive Performance Analytics**: Monitor total questions answered, score growth over time, and topic-specific accuracy metrics.
- 🔒 **Secure User Authentication**: Powered by **NextAuth.js v5 (Auth.js)** with PostgreSQL and Prisma Adapter.
- 🎨 **Modern Dark UI/UX**: Crafted with Next.js 16, Tailwind CSS v4, and dynamic visual state components.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Auth**: NextAuth.js v5 (Auth.js) with Prisma Adapter & `bcryptjs`
- **Database & ORM**: PostgreSQL (Neon DB) with Prisma ORM v7

### **Backend**
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn / Gunicorn
- **AI & RAG Framework**: LangChain (`langchain-core`, `langchain-community`, `langchain-google-genai`)
- **LLM Providers**: Google Gemini AI (`gemini-2.5-flash` / `gemini-1.5-flash`), Groq API
- **Vector Database**: ChromaDB (isolated session vector collections)
- **PDF Processing**: PyMuPDF (`fitz`), NumPy, Pydantic v2

---

## 📁 Repository Structure

```
mindrush/
├── frontend/                     # Next.js Frontend Application
│   ├── app/                      # Next.js App Router (Pages, Layouts, APIs)
│   │   ├── dashboard/            # Dashboard routes (Analytics, History, Quizzes, Settings)
│   │   ├── generated/            # Dynamic generated quiz interface
│   │   ├── api/                  # API routes (Auth, Users)
│   │   └── page.tsx              # Main Landing & Quiz Generator page
│   ├── components/               # UI & Layout components
│   ├── prisma/                   # Prisma schema & migrations
│   ├── auth.ts                   # NextAuth.js configuration
│   └── package.json
│
├── backend/                      # FastAPI Backend RAG Application
│   ├── app.py                    # Main FastAPI application entrypoint & `/generate-quiz` API
│   ├── core/                     # Configuration & LLM initializations
│   ├── models/                   # Pydantic schemas & response models
│   ├── services/                 # RAG components (Ingestion, Embeddings, VectorStore, Retriever, Quiz)
│   └── requirements.txt
│
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your environment:
- **Node.js**: v18.0.0 or later
- **Python**: v3.10 or later
- **PostgreSQL**: Neon DB connection string or local PostgreSQL instance
- **API Keys & OAuth Credentials**:
  - `GEMINI_API_KEY` (Google AI Studio)
  - `GROQ_API_KEY` (Groq Console / Cloud)
  - `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET` (Google Cloud OAuth Console)

---

### 1️⃣ Setting Up Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate
     ```
   - **macOS/Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ALLOW_ORIGINS=http://localhost:3000
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn app:app --reload --port 8000
   ```
   The backend service will run at `http://localhost:8000`.

---

### 2️⃣ Setting Up Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `frontend/` directory:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   AUTH_SECRET="your_nextauth_secret_key"
   AUTH_GOOGLE_ID="your_google_oauth_client_id"
   AUTH_GOOGLE_SECRET="your_google_oauth_client_secret"
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   ```

4. Run Prisma database migrations & client generation:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## 📡 API Reference

### POST `/generate-quiz`
Generates a structured quiz based on the user's input type (`topic`, `pdf`, or `text`).

#### **Form Data Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `input_type` | `string` | `"topic"`, `"pdf"`, or `"text"` |
| `difficulty` | `string` | `"Easy"`, `"Medium"`, or `"Hard"` |
| `questions_count` | `integer` | Number of questions to generate (e.g., 5, 10) |
| `topic` | `string` *(optional)* | Topic prompt (used when `input_type="topic"`) |
| `text` | `string` *(optional)* | Raw text content (used when `input_type="text"`) |
| `file` | `file` *(optional)* | PDF document upload (used when `input_type="pdf"`) |

#### **Example Response:**
```json
{
  "status": "success",
  "session_id": "c9bf9e57-1685-4c89-bafb-ff5af830be8a",
  "quiz": {
    "title": "Machine Learning Fundamentals",
    "questions": [
      {
        "id": 1,
        "question": "What is the primary objective of supervised learning?",
        "options": [
          "A) To cluster unlabeled data points",
          "B) To map input data to known target labels",
          "C) To maximize reward in an environment",
          "D) To compress high-dimensional features"
        ],
        "answer": "B",
        "explanation": "Supervised learning algorithms are trained using labeled datasets containing inputs and target outputs."
      }
    ]
  }
}
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the repository issues or submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
