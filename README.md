# 🧠 Angular Quiz App

A dynamic, responsive **Quiz Application** built with **Angular v19** and **Angular Material**. This app allows users to take a quiz, receive instant feedback, and view their final score. It’s designed to demonstrate real-world Angular concepts such as state management, dynamic rendering, and conditional logic.

![Angular Quiz App](https://img.shields.io/badge/angular-v19-red.svg)
![Angular Material](https://img.shields.io/badge/material-ui-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🚀 Features

- ✅ Dynamic question rendering
- ✅ Real-time feedback on answers
- ✅ Score calculation and result summary
- ✅ User state tracking
- ✅ Angular Material UI components
- ✅ Optional: randomized questions, timers, and explanations

---

## 📸 Demo

> _Add a link or GIF here once deployed or recorded_

---

## 📚 What You'll Learn

- 🌀 Looping through dynamic arrays of questions
- 🔄 Managing component and service-based state
- 🎯 Handling user input, feedback, and conditionals
- 💅 Using Angular Material for modern UI/UX
- 🧪 Structuring Angular apps with best practices

---

## 🛠 Tech Stack

- **Framework**: Angular v19  
- **UI Library**: Angular Material  
- **Language**: TypeScript  
- **Styling**: SCSS / Material Themes  
- **Tooling**: Angular CLI

---

## 📁 Folder Structure
```
src/app/
├── components/
│ ├── quiz/
│ ├── question-card/
│ └── result-summary/
├── services/
│ └── quiz.service.ts
├── models/
│ └── question.model.ts
├── data/
│ └── questions.json
```

## 🧩 Installation

### Clone the repo
```
git clone https://github.com/sachinksamad1/QuizApp.git
```

### Navigate into the project folder
```
cd QuizApp
```

### Install dependencies
```
npm install
```

### Run the app locally
```
ng serve
```

## 🧪 Sample JSON Question Format
```
[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "Berlin", "Madrid", "London"],
    "answer": "Paris",
    "explanation": "Paris has been France’s capital since 508 A.D."
  }
]
```
## ✅ To-Do / Future Enhancements
- Add quiz timer
- Add category or difficulty filters
- Save past quiz results
- Deploy to Firebase or Vercel

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.
