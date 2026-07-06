# JavaScript Quiz App

A vanilla JavaScript quiz application built from scratch as part of my JavaScript engineering learning journey.

The goal of this project is **not** to use frameworks or libraries, but to deeply understand how JavaScript works in the browser by building real applications using only the Web Platform APIs.
<img width="1023" height="661" alt="image" src="https://github.com/user-attachments/assets/4aa6b18d-6500-4f4d-8af7-2c4580a8f1f2" />
<img width="1023" height="661" alt="image" src="https://github.com/user-attachments/assets/8bf222c9-66a9-46d0-bc33-f6a8fb5320c8" />

---

## Objectives

This project focuses on writing clean, maintainable JavaScript while reinforcing core engineering concepts such as:

- State management
- DOM manipulation
- Event-driven programming
- Async programming (`fetch`, `async/await`)
- Browser APIs
- Error handling
- Modular function design
- Progressive UI rendering
- Clean code practices

---

## Features

- Load quiz questions from a JSON file
- Async data fetching with proper error handling
- Dynamic question rendering
- Progress indicator
- Answer validation
- Score calculation
- Question review after completion
- Restart quiz functionality
- Multiple application screens
- Responsive interface

---

## Project Structure

```
.
├── index.html
├── style.css
├── script.js
└── questions.json
```

---

## Engineering Concepts Practiced

### State Management

The application keeps its state centralized using simple JavaScript variables.

```javascript
let questions = [];
let currentIndex = 0;
let selectedAnswer = null;
let results = [];
```

Instead of relying on a framework, the UI is rendered directly from application state.

---

### DOM References

DOM elements are cached once to avoid repeated lookups.

```javascript
const progressText = $('progress-text');
const optionsList = $('options-list');
```

---

### Screen Management

The application behaves like a small state machine.

Available screens:

- Start
- Question
- Result
- Error

```javascript
showScreen("question");
```

---

### Async Programming

Quiz questions are loaded asynchronously.

```javascript
const response = await fetch("questions.json");
```

Including:

- HTTP status validation
- Exception handling
- User-friendly error screen

---

### Dynamic Rendering

Questions and answer buttons are generated using the DOM API.

Instead of using `innerHTML`, elements are created explicitly:

```javascript
const button = document.createElement("button");
```

This encourages safer and more maintainable DOM manipulation.

---

### Event-Driven Architecture

The application responds to user interactions through event listeners.

Examples include:

- Selecting an answer
- Moving to the next question
- Restarting the quiz
- Starting the application

---

### Result Tracking

Each answer is stored for later review.

Example structure:

```javascript
{
    question,
    options,
    correct,
    chosenIndex,
    answerIndex
}
```

This allows the final screen to display detailed feedback instead of only a total score.

---

## Why Vanilla JavaScript?

Frameworks solve many problems automatically.

This project intentionally avoids them in order to gain a deeper understanding of:

- Browser rendering
- DOM APIs
- State management
- Event handling
- Application flow
- Software engineering fundamentals

Learning these concepts first makes modern frameworks much easier to understand.

---

## Future Improvements

- Timer per question
- Difficulty levels
- Randomized questions
- Local Storage support
- Keyboard navigation
- Accessibility improvements
- Unit testing
- Modular ES Modules
- TypeScript version

---

## Learning Goals

This repository is part of my broader journey into JavaScript engineering and software engineering fundamentals.

Rather than simply making the app work, the focus is on understanding **why** each architectural decision is made and writing code that is readable, maintainable, and scalable.

---

## License

MIT
