.PHONY: build build-docker up up-docker down down-docker clean clean-docker lint

# Build targets
build:
	npm run build

build-docker:
	docker-compose build

# Up targets
up:
	npm run dev

up-docker:
	docker-compose up

# Down targets
down:
	@echo "Stop the development server manually (Ctrl+C in terminal)"

down-docker:
	docker-compose down

# Clean targets
clean:
	rm -rf dist

clean-docker:
	docker-compose down --volumes --rmi all

# Lint
lint:
	npm run lint