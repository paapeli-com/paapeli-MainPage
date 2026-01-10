.PHONY: help install test test-watch test-coverage build dev clean lint format docker-build docker-up docker-down

help:
	@echo "🎨 Paapeli Frontend Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install        - Install dependencies"
	@echo "  make dev            - Start dev server"
	@echo "  make test           - Run tests"
	@echo "  make test-watch     - Run tests in watch mode"
	@echo "  make test-coverage  - Run tests with coverage"
	@echo "  make build          - Build for production"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-up      - Start with Docker"
	@echo "  make docker-down    - Stop Docker"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint           - Run linter"
	@echo "  make format         - Fix linting issues"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean          - Remove build artifacts"

install:
	@npm install

dev:
	@npm run dev

test:
	@npm test -- --run

test-watch:
	@npm test

test-coverage:
	@npm test -- --coverage --run

build:
	@npm run build

lint:
	@npm run lint

format:
	@npm run lint -- --fix

clean:
	@rm -rf dist node_modules

docker-build:
	@docker-compose build

docker-up:
	@docker-compose up -d

docker-down:
	@docker-compose down
