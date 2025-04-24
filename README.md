# AlgoLearn
**Bachelor Thesis Project**

An advanced, interactive coding education platform modeled after LeetCode. **AlgoLearn** empowers students to solve algorithmic challenges, take structured quizzes, and explore core Java data structures. Professors can seamlessly add and manage both problems and quizzes, while administrators oversee platform operations.

---

## Table of Contents
1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Frontend Installation](#frontend-installation)
   - [Backend Installation](#backend-installation)
5. [Usage](#usage)
6. [Testing](#testing)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

---

## Features
- **In-Browser Java Compiler**: Secure Docker-based sandbox for writing and executing Java code.
- **Data Structures Library**: Interactive visualizations and implementations of arrays, linked lists, stacks, queues, trees, graphs, hash tables, and more.
- **Quizzes & Assessments**: Time-bound multiple-choice quizzes with instant feedback and performance tracking.
- **Algorithmic Challenges**: Real-time coding problems with integrated test cases, difficulty ratings, and solution hints.
- **Professor Dashboard**: Intuitive interface for creating, editing, and publishing problems and quizzes.
- **Progress Analytics**: Detailed student performance metrics, including attempt history, scores, and completion rates.

---

## Technology Stack
| Layer            | Framework / Tool                 |
|------------------|----------------------------------|
| Frontend         | React, TypeScript, Vite          |
| Styling          | Tailwind CSS                     |
| Routing          | React Router DOM                 |
| Compiler Sandbox | Docker                           |
| Backend          | Node.js, Express.js (Typescript) |
| Database         | PostgreSQL, Prisma ORM           |
| Animation        | Framer Motion                    |

---

## Project Structure

```text
Bachelor-Thesis/
├─ frontend/
│  ├─ node_modules/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ data/
│  │  ├─ hooks/
│  │  ├─ lib/
│  │  ├─ pages/
│  │  └─ types/
│  ├─ api.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ index.css
│  ├─ tailwind.config.ts
│  ├─ vite.config.ts
│  └─ ...
└─ backend/
   ├─ node_modules/
   ├─ prisma/
   ├─ src/
   │  ├─ code/
   │  ├─ comment/
   │  ├─ docker/
   │  ├─ main/
   │  ├─ middleware/
   │  ├─ problems/
   │  ├─ quiz/
   │  ├─ submission/
   │  ├─ types/
   │  ├─ user/
   │  └─ utils/
   ├─ server.ts
   ├─ .env
   └─ ...
```

---

## Getting Started

### Prerequisites
- **Node.js** v16 or higher
- **Docker** Desktop (for code sandboxing)
- **PostgreSQL** server

### Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

### Backend Installation
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

---

## Usage
1. Ensure Docker is running for secure Java execution.
2. Start the frontend and backend servers as per the installation steps.
3. Access the student portal at `http://localhost:3000`.
4. Professors can log in at `http://localhost:3000/professor`.

---


## Contributing
1. **Fork** the repository.
2. Create a new feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -m "Add feature description"`.
4. Push to your branch: `git push origin feature/my-feature`.
5. Open a **Pull Request**.

Please follow the existing code style and include relevant tests.

---

## License
Distributed under the [MIT License](LICENSE).

---

## Contact
**Kristi Engineer** – [GitHub: Smr002](https://github.com/Smr002) 

