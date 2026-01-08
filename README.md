# Welcome to Paapeli

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Running with Docker

To run the application using Docker:

1. Ensure you have Docker installed on your system.

2. Build the Docker image:
   ```bash
   docker build -t paapeli-mainpage .
   ```

3. Run the container:
   ```bash
   docker run -p 8080:8080 paapeli-mainpage
   ```

   The application will be available at `http://localhost:8080`.

Alternatively, use Docker Compose for easier management:

1. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

   This will build the image and start the container with hot reloading enabled.


