# Paapeli IoT Platform - Main Page

A modern React-based frontend for the Paapeli IoT Platform, providing comprehensive device management, monitoring, and development tools.

## Features

### Device Management
- **Device Registry**: Register and manage IoT gateways and devices
- **Device Groups**: Organize devices into logical groups by project
- **Real-time Monitoring**: View device status, connectivity, and telemetry data

### Analytics & Insights
- **Dashboard**: Overview of system health, device counts, and alerts
- **Predictive Maintenance**: AI-powered failure prediction and recommendations
- **Anomaly Detection**: Automated detection of unusual device behavior

### Team Collaboration
- **Project Management**: Organize devices and users by projects
- **Team Members**: Invite and manage team access with role-based permissions
- **Audit Logs**: Track system activities and changes

### Development Tools
- **DevCenter**: API documentation, health monitoring, and SDK examples
- **OTA Updates**: Over-the-air firmware updates for device fleets
- **API Explorer**: Interactive API testing and documentation

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Package Manager**: bun (recommended), npm, or yarn
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Testing**: Vitest with React Testing Library
- **Internationalization**: Custom i18n system
- **User Avatars**: Gravatar integration with fallback initials
- **Build Automation**: Makefile for common tasks

## Getting Started

### Prerequisites
- Node.js 18+
- Package manager: npm, yarn, or [bun](https://bun.sh/) (recommended for faster installs)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd paapeli-mainpage
   ```

2. Install dependencies:

   **Using bun (recommended):**
   ```bash
   bun install
   ```

   **Using npm:**
   ```bash
   npm install
   ```

   **Using yarn:**
   ```bash
   yarn install
   ```

   > **Note**: If you encounter permission errors with npm, consider using bun or yarn as alternatives.

3. Start the development server:

   **Using bun:**
   ```bash
   bun run dev
   ```

   **Using npm:**
   ```bash
   npm run dev
   ```

   **Using Makefile:**
   ```bash
   make dev
   ```

   The application will be available at `http://localhost:5173`.

### Running Tests

**Using bun:**
```bash
bun run test          # Run all tests
bun run test:watch    # Run tests in watch mode
bun run test:coverage # Run tests with coverage
```

**Using npm:**
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

**Using Makefile:**
```bash
make test             # Run all tests
make test-watch       # Run tests in watch mode
make test-coverage    # Run tests with coverage
```

### Building for Production

**Using bun:**
```bash
bun run build
```

**Using npm:**
```bash
npm run build
```

**Using Makefile:**
```bash
make build
```

> **Tip**: Use `make clean && make install && make build` for a complete clean build.

## Development Workflow

### Using Make Commands

The project includes a Makefile for common development tasks:

```bash
make help           # Show all available commands
make install        # Install dependencies
make dev            # Start development server
make build          # Build for production
make test           # Run all tests
make test-coverage  # Run tests with coverage
make lint           # Run linter
make lint-fix       # Run linter with auto-fix
make clean          # Remove build artifacts and dependencies
```

### Docker Deployment

#### Using Docker Compose (Recommended)

```bash
make docker-up      # Start with Docker Compose
make docker-down    # Stop Docker containers
```

#### Manual Docker Build

```bash
# Build the image
make docker-build

# Run the container
docker run -p 8080:8080 paapeli-mainpage
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...
├── pages/              # Page components
│   ├── panel/          # Main application pages
│   └── ...
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and API clients
├── layouts/            # Layout components
├── i18n/               # Internationalization
└── test/               # Test utilities
```

## API Integration

The frontend integrates with the Paapeli backend API providing:

- Device management endpoints
- User authentication and authorization
- Project and team management
- Telemetry data processing
- OTA update management

## Troubleshooting

### Common Issues

**npm permission errors:**
```bash
# Option 1: Use bun instead
curl -fsSL https://bun.sh/install | bash
bun install

# Option 2: Clear npm cache and reinstall
npm cache clean --force
npm install

# Option 3: Use yarn
yarn install
```

**Build fails after `make clean`:**
```bash
# Always reinstall dependencies after cleaning
make clean
make install
make build
```

**Port 5173 already in use:**
```bash
# Kill process using the port or use a different port
npm run dev -- --port 3000
```

## Contributing

1. Follow the [Code of Conduct](../CODE_OF_CONDUCT.md)
2. Create feature branches from `main`
3. Write tests for new features
4. Follow commit message format: `type(scope): description`
5. Ensure all tests pass before submitting PR

## License

This project is part of the Paapeli IoT Platform. See LICENSE file for details.


