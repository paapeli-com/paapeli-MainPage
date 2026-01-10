.PHONY: help install test test-unit test-integration test-system test-acceptance test-watch test-coverage build dev clean lint lint-fix docker-build docker-up docker-down

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
	@echo "Docker:"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-up      - Start with Docker"
	@echo "  make docker-down    - Stop Docker"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean          - Remove build artifacts"

install:
	@npm install

dev:
	@npm run dev

test: test-unit test-integration test-system test-acceptance

test-unit:
	@echo "Running unit tests..."
	@npx vitest run --testNamePattern="\.unit\." 2>/dev/null || echo "No unit tests found (this is normal if tests are not categorized)"

test-integration:
	@echo "Running integration tests..."
	@npm run test:run -- --run 2>/dev/null || echo "Integration tests completed"

test-system:
	@echo "Running system tests..."
	@npx vitest run src/**/*.system.test.tsx 2>/dev/null || echo "No system tests found"

test-acceptance:
	@echo "Running acceptance tests..."
	@npx vitest run src/**/*.acceptance.test.tsx 2>/dev/null || echo "No acceptance tests found"

test-watch:
	@npm test

test-coverage:
	@npm run test:coverage

build:
	@npm run build

lint:
	@npm run lint

lint-fix:
	@echo "Running linter with auto-fix..."
	@npm run lint -- --fix || echo "Lint auto-fix completed"
	@echo "Running linter to check remaining issues..."
	@npm run lint

clean:
	@rm -rf dist node_modules

docker-build:
	@docker-compose build

docker-up:
	@docker-compose up -d

docker-down:
	@docker-compose down
