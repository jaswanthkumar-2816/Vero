# Vero AI - Smart ATS Pipeline

Vero AI is a professional, AI-powered Applicant Tracking System (ATS) that automates the resume screening process using Local LLM (Llama 3). 

## 🚀 Key Features
- **500 Resume Stress-Testing**: Generate and preview 500 high-quality candidates instantly.
- **Universal File Parser**: Seamlessly extract data from PDFs, Word docs (.docx), and Text files.
- **Deep Match Analysis**: Match candidates against complex Job Descriptions using AI-extracted skills and experience.
- **Live Preview Dashboard**: View candidate summaries and full extracted resumes in a sleek modal interface.

---

## 🛠️ Tech Stack
- **AI Engine**: Ollama (Llama 3)
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Vanilla JS, CSS (Glassmorphism design)
- **File Parsing**: pdf-parse, mammoth, fs

---

## 🏁 Quick Start Guide

### 1. Requirements
- **MongoDB**: Ensure it's running locally (`mongodb://localhost:27017`)
- **Ollama**: Install from [ollama.com](https://ollama.com) and run `ollama run llama3`

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Port: 1628*

### 3. Usage Flow
1. Load **500 Sample Resumes** via the dashboard.
2. View the **Live Preview** of candidates.
3. Upload your **Job Description PDF/DOCX**.
4. Set your filter criteria (Match Score, Experience, etc.).
5. Ranked results will appear with **full resume view** capability.

---

## 📂 Project Structure
- **/backend**: Express server, AI services, and Parsers.
- **/backend/public**: Frontend HTML/CSS/JS interface.
- **/frontend**: Additional React-based workspace (optional).

---

**Developed with ❤️ for Modern Recruiting.**
