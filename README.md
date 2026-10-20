# TaskTracker — Smart Task Management App

A modern, interactive task management application designed to help users organize daily activities, track productivity, and build consistent habits.

## 🚀 Overview

TaskTracker is a web-based productivity application built to make task management simple and engaging. It provides task organization, progress tracking, analytics, and achievement features to help users stay focused and accomplish their goals.

## ✨ Features

- **Task Management** — Create, organize, and manage daily tasks.
- **Task Filtering** — Filter tasks based on their status or other available criteria.
- **Progress Tracking** — Monitor task completion and productivity.
- **Analytics Dashboard** — View task-related statistics and performance insights.
- **Streak Tracking** — Track consistency in completing tasks.
- **Achievement Badges** — Celebrate milestones and productivity achievements.
- **AI Integration** — Includes an AI utility module for supported smart task features.
- **Responsive Interface** — Built with modern web technologies for a smooth user experience.

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Build Tool:** Vite
- **Language:** JavaScript (JSX)
- **Styling:** CSS
- **Code Quality:** ESLint
- **Package Management:** npm

## 📂 Project Structure

```text
TaskTracker/
├── public/
├── src/
│   ├── api/
│   │   └── ai.js
│   ├── components/
│   │   ├── Analytics.jsx
│   │   ├── Badges.jsx
│   │   ├── FilterBar.jsx
│   │   ├── ProgressTracker.jsx
│   │   ├── Streak.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   └── TaskList.jsx
│   ├── utils/
│   │   ├── dates.js
│   │   ├── parseTask.js
│   │   └── tasks.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── Style.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/lithinkumar844-art/tasktracker.git
```

### 2. Navigate to the Project Folder

```bash
cd tasktracker
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

If your AI functionality requires API credentials, check `.env.example` for the required variable names. Create a local `.env` file and configure the necessary values.

**Never commit API keys, passwords, or other secrets to GitHub.**

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal to use the application.

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production version |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint checks |

## 🔐 Security

- Keep API keys and credentials private.
- Use environment variables for sensitive configuration.
- Review `.gitignore` before committing changes.
- Never publish your `.env` file containing secrets.

## 🎯 Project Goals

- Improve daily productivity and task organization.
- Encourage consistent habits through streak tracking.
- Provide useful insights into task completion.
- Make task management intuitive and engaging.

## 🔮 Future Improvements

Potential enhancements include:

- User authentication and personalized dashboards.
- Cloud synchronization across devices.
- Push notifications and reminders.
- Advanced productivity analytics.
- Additional AI-powered task planning features.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request.

## 📄 License

No license has been specified yet. Please add a suitable open-source license before permitting others to reuse or distribute the project.

---

**Developed with ❤️ by Lithinkumar P**

*Organize your tasks. Track your progress. Achieve more.*
