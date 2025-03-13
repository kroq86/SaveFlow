# SaveFlow
# SafeFlow Project Management System

A modern project management system built with React and the SafeFlow Reactive Framework.

## GitHub Repository

This project is hosted on GitHub at [https://github.com/kroq86/SaveFlow](https://github.com/kroq86/SaveFlow).

## Overview

This application demonstrates the capabilities of the SafeFlow Framework, showcasing:

1. **Transactional Guarantees**: All state updates are atomic and consistent
2. **Reactive Programming**: UI automatically updates when state changes
3. **Type Safety**: Full TypeScript integration
4. **Code Generation**: Automated infrastructure generation
5. **AI Output Validation**: Security and integrity validation for AI-generated code

## Features

- User authentication and role-based access control
- Project management (create, read, update, delete)
- Task management with priorities, statuses, and deadlines
- Team member assignment and collaboration
- Activity tracking and notifications
- Dashboard with statistics and insights
- Responsive design for desktop and mobile

## Architecture

The application is built using the following architecture:

- **Frontend**: React with Material UI
- **State Management**: SafeFlow Reactive System
- **Data Storage**: Local storage (mock API)
- **Validation**: SafeFlow AI Validator

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/safeflow-example-app.git
cd safeflow-example-app
```

2. Install dependencies
```bash
npm install
```

3. Link local SafeFlow packages (if developing locally)
```bash
./setup-local-packages.sh
```

4. Start the development server
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Accounts

The application comes with pre-configured demo accounts:

- **Admin**: Username: `admin`, Password: `admin`
- **Project Manager**: Username: `manager`, Password: `manager`
- **Developer 1**: Username: `dev1`, Password: `dev1`
- **Developer 2**: Username: `dev2`, Password: `dev2`

## Project Structure

```
safeflow-example-app/
├── public/                  # Static files
├── src/
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── layout/          # Layout components
│   │   ├── projects/        # Project management components
│   │   ├── tasks/           # Task management components
│   │   └── users/           # User management components
│   ├── domain/              # Domain models and types
│   ├── services/            # Services for API interactions
│   ├── state/               # State management with SafeFlow
│   ├── App.tsx              # Main application component
│   └── index.tsx            # Application entry point
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## SafeFlow Framework Integration

This application demonstrates the integration of the SafeFlow Framework:

### Transactional Operations

All state updates are wrapped in transactions using the `@Transactional()` decorator:

```typescript
@Transactional()
async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  // This operation is atomic - either succeeds completely or fails completely
  // If any part fails, all changes are rolled back
}
```

### Reactive State Management

The application uses the SafeFlow Reactive System for state management:

```typescript
// Create a reactive store
const appStore = new SafeFlowStore<AppState>(initialAppState);

// Subscribe to state changes
const subscription = appStoreService.subscribe(
  (state) => {
    setAppState(state);
  }
);
```

### Type Safety

The application leverages TypeScript for type safety:

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  managerId: string;
  teamMemberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The SafeFlow Framework team
- Material UI for the component library
- React and TypeScript communities 