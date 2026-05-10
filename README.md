# 🧮 MathsQuizZ — Full Stack Quiz App

> A colorful, interactive math quiz web app built with Python (Flask) + HTML/CSS/JS
>
> 🌐 **Live Demo:** [mathsquizz.onrender.com](https://mathsquizz.onrender.com)

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.x-black?style=flat-square&logo=flask)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=flat-square&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-CSS3-orange?style=flat-square&logo=html5)

---

## ✨ Features

- 🎯 **3 Difficulty Levels** — Easy (1–30) / Normal (30–100) / Hard (100–1000)
- ➕➖✖️➗ **4 Operations** — Add, Subtract, Multiply, Divide
- 🎲 **Mix Mode** — Random operation every question
- ⏱ **Countdown Timer** — Harder levels = less time per question
- 🔥 **Streak Counter** — Tracks consecutive correct answers
- 💡 **Hint System** — One contextual hint per question
- ✕ **Quit Mid-Quiz** — Exit anytime with full summary shown
- 📋 **Question Review** — See every answer after the quiz ends
- 🌈 **Colorful Playful UI** — Animated bubbles, bouncy buttons, smooth transitions

---

## 🗂 Project Structure

```
mathsquizz/
├── app.py                  # Flask backend — routes, logic, session
├── templates/
│   └── index.html          # Single-page UI (3 screens)
├── static/
│   ├── script.js           # Quiz logic, timer, hint, quit
│   └── style.css           # Colorful playful design
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip

### Installation & Run

```bash
# 1. Clone the repo
git clone https://github.com/Djmoolya20/mathsquizz.git
cd mathsquizz

# 2. Install dependency
pip install flask

# 3. Run the app
python app.py
```

Open your browser at **http://127.0.0.1:5000** 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/start` | Start quiz with settings |
| GET | `/api/question` | Fetch next question |
| POST | `/api/answer` | Submit answer |
| GET | `/api/hint` | Get hint for current question |
| GET | `/api/score` | Get final score & history |
| POST | `/api/quit` | Quit mid-quiz with summary |

---

## 🎮 How to Play

1. Choose **difficulty**, **operation**, and **number of questions**
2. Answer before the **timer** runs out
3. Use **💡 Hint** if stuck (one per question)
4. Hit **✕ Quit** anytime to see your score so far
5. Review every question at the end!

---

## 📈 Scoring

| Score | Grade |
|-------|-------|
| 100% | PERFECT! 🏆 |
| 80%+ | AMAZING! 🌟 |
| 60%+ | GREAT JOB! 🎉 |
| 40%+ | GOOD EFFORT! 👍 |
| <40% | KEEP GOING! 💪 |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3, Flask, flask-session |
| Frontend | HTML5, CSS3, Vanilla JS |
| Styling | CSS animations, Google Fonts (Fredoka One, Nunito) |
| State | Flask server-side sessions |

---

> 💡 This project is an evolution of an original [C terminal version](https://github.com/Djmoolya20/mathsquizz-c) — rebuilt as a full-stack web app.
