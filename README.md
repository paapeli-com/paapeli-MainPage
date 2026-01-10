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
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Testing**: Vitest with React Testing Library
- **Internationalization**: Custom i18n system

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd paapeli-mainpage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
npm run build
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

### Manual Docker Build

```bash
# Build the image
docker build -t paapeli-mainpage .

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

## Contributing

1. Follow the [Code of Conduct](../CODE_OF_CONDUCT.md)
2. Create feature branches from `main`
3. Write tests for new features
4. Follow commit message format: `type(scope): description`
5. Ensure all tests pass before submitting PR

## License

This project is part of the Paapeli IoT Platform. See LICENSE file for details.


