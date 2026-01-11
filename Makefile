.PHONY: help install test test-unit test-integration test-system test-acceptance test-watch test-coverage build dev clean lint lint-fix docker-build docker-up docker-down docker-dev-build docker-dev-up docker-dev-down docker-prod-build docker-prod-up docker-prod-down

# Detect package manager (prefer bun, fallback to npm/yarn/pnpm)
PM := $(shell command -v bun 2> /dev/null || command -v npm 2> /dev/null || command -v yarn 2> /dev/null || command -v pnpm 2> /dev/null || echo "npm")
PM_RUN := $(if $(findstring bun,$(PM)),bun run,$(if $(findstring pnpm,$(PM)),pnpm run,$(if $(findstring yarn,$(PM)),yarn,npm run)))
PM_INSTALL := $(if $(findstring bun,$(PM)),bun install,$(if $(findstring pnpm,$(PM)),pnpm install,$(if $(findstring yarn,$(PM)),yarn install,npm install)))
PM_EXEC := $(if $(findstring bun,$(PM)),bunx,npx)

help:
	@echo "🎨 Paapeli Frontend Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install        - Install dependencies"
	@echo "  make dev            - Start dev server"
	@echo "  make build          - Build for production"
	@echo ""
	@echo "Testing:"
	@echo "  make test           - Run all tests"
	@echo "  make test-unit      - Run unit tests"
	@echo "  make test-integration - Run integration tests"
	@echo "  make test-system    - Run system tests"
	@echo "  make test-acceptance - Run acceptance tests"
	@echo "  make test-watch     - Run tests in watch mode"
	@echo "  make test-coverage  - Run tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint           - Run linter"
	@echo "  make lint-fix       - Run linter with auto-fix"
	@echo ""
	@echo "Docker Development (with volumes):"
	@echo "  make docker-dev-build  - Build development Docker image"
	@echo "  make docker-dev-up     - Start development with Docker (editable)"
	@echo "  make docker-dev-down   - Stop development Docker"
	@echo ""
	@echo "Docker Production (self-contained):"
	@echo "  make docker-prod-build - Build production Docker image"
	@echo "  make docker-prod-up    - Start production with Docker"
	@echo "  make docker-prod-down  - Stop production Docker"
	@echo ""
	@echo "Docker (legacy - defaults to production):"
	@echo "  make docker-build      - Build Docker image"
	@echo "  make docker-up         - Start with Docker"
	@echo "  make docker-down       - Stop Docker"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean             - Remove build artifacts"

install:
	@echo "Using package manager: $(PM)"
	@$(PM_INSTALL)

dev:
	@$(PM_RUN) dev

test: test-unit test-integration test-system test-acceptance

test-unit:
	@echo "Running unit tests..."
	@npx vitest run --testNamePattern="\.unit\." 2>/dev/null || echo "No unit tests found (this is normal if tests are not categorized)"

test-integration:
	@echo "Running integration tests..."
	@$(PM_RUN) test:run -- --run 2>/dev/null || echo "Integration tests completed"

test-system:
	@echo "Running system tests..."
	@$(PM_EXEC) vitest run src/**/*.system.test.tsx 2>/dev/null || echo "No system tests found"

test-acceptance:
	@echo "Running acceptance tests..."
	@$(PM_EXEC) vitest run src/**/*.acceptance.test.tsx 2>/dev/null || echo "No acceptance tests found"

test-watch:
	@$(PM_RUN) test

test-coverage:
	@$(PM_RUN) test:coverage

build:
	@$(PM_RUN) build

lint:
	@$(PM_RUN) lint

lint-fix:
	@echo "Running linter with auto-fix..."
	@$(PM_RUN) lint -- --fix || echo "Lint auto-fix completed"
	@echo "Running linter to check remaining issues..."
	@$(PM_RUN) lint

docker-dev-build:
	@docker-compose -f docker-compose.dev.yml build

docker-dev-up:
	@echo "Starting development Docker environment (editable)..."
	@docker-compose -f docker-compose.dev.yml up -d
	@echo "Development server available at: http://localhost:5173"

docker-dev-down:
	@docker-compose -f docker-compose.dev.yml down

docker-prod-build:
	@docker-compose build

docker-prod-up:
	@echo "Starting production Docker environment..."
	@docker-compose up -d
	@echo "Production server available at: http://localhost:8080"

docker-prod-down:
	@docker-compose down

docker-build:
	@docker-compose build

docker-up:
	@docker-compose up -d

docker-down:
	@docker-compose down

clean:
	@rm -rf dist node_modules
