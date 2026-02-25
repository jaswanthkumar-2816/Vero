# Vero AI - Backend Setup Guide (AI-Powered ATS)

This backend powers Vero, an AI-based resume screening system. It allows recruiters to upload job descriptions and bulk resumes, uses Llama 3 to extract skills and experience, calculates match scores, and provides filtering and dashboard analytics.

---

## 1. Requirements

Before running the backend, install:
- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Ollama** (for running Llama 3 locally)
- **Git**

---

## 2. Clone Repository

Clone the project:
```bash
git clone https://github.com/jaswanthkumar-2816/Vero.git
cd Vero/backend
```

---

## 3. Install Dependencies

Install required Node.js packages:
```bash
npm install
```
This will create the `node_modules` folder automatically.

---

## 4. Create Environment File

Create a new file inside `backend` folder:
`.env`

Add the following:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vero-ats
OLLAMA_URL=http://localhost:11434/api/generate
MODEL_NAME=llama3
```

---

## 5. Start MongoDB

### If using local MongoDB:
1. Start MongoDB service.
2. Test connection using `mongosh`.

If connected successfully, MongoDB is ready.

---

## 6. Install and Run Llama 3 (AI Model)

1. Install Ollama from: [https://ollama.com](https://ollama.com)
2. Run:
   ```bash
   ollama run llama3
   ```
This downloads and runs the Llama 3 model locally. Keep this running while the backend is active.

The backend uses this for:
- Resume parsing
- Skill extraction
- Match scoring

---

## 7. Start Backend Server

Run:
```bash
npm run dev
```

Expected output:
```text
Server running on port 5000
MongoDB connected
```

---

## 8. Backend Folder Structure

```text
backend/
  src/
    models/
    modules/
    services/
    utils/
  uploads/
  package.json
  server.js
  .env.example
  README.md
```

---

## 9. Main Features

This backend supports:
- Upload job description
- Upload bulk resumes (up to 500)
- AI parsing using Llama 3
- Match score calculation (0–100)
- Candidate filtering
- Dashboard analytics
- Shortlisting candidates

---

## 10. Important Notes

Do **NOT** commit these files to Git:
- `.env`
- `node_modules/`
- `uploads/`

These are ignored using `.gitignore`.

---

## 11. AI Integration

The backend communicates with Ollama at:
`http://localhost:11434/api/generate`

This is used for:
- Extracting skills from resumes
- Extracting experience
- Matching candidates to job description

---

## 12. Troubleshooting

If backend does not start:
1. Check MongoDB is running
2. Check Ollama is running
3. Check `.env` file exists
4. Run `npm install` again

---

## 13. Next Steps

After backend setup is complete:
- Connect frontend using React
- Use API endpoints to upload resumes
- Display dashboard analytics

---

**Backend is now ready for development and integration.**
