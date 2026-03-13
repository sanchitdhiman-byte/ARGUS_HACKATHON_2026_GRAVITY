.PHONY: up down build logs ps clean dev

# Start all services
up:
	docker compose up -d

# Stop all services
down:
	docker compose down

# Build all images
build:
	docker compose build

# Build and start
start:
	docker compose up --build -d

# View logs (all services)
logs:
	docker compose logs -f

# View logs for a specific service: make logs-auth
logs-%:
	docker compose logs -f $*-service

# Show running containers
ps:
	docker compose ps

# Stop and remove volumes (full reset)
clean:
	docker compose down -v --remove-orphans

# Dev: run just postgres for local development
dev-db:
	docker compose up postgres -d
	@echo "PostgreSQL running on localhost:5432"
	@echo "  DB: grantflow | User: grantflow | Password: grantflow_secret"

# Run database migrations for a specific service
migrate-%:
	docker compose exec $*-service python -c "from database import engine, Base; import models; Base.metadata.create_all(bind=engine); print('Tables created for $*-service')"

# Seed the database
seed:
	docker compose exec auth-service python seed.py

# Health check all services
health:
	@echo "Checking service health..."
	@curl -sf http://localhost/api/v1/auth/health && echo " auth-service OK" || echo " auth-service FAIL"
	@curl -sf http://localhost/api/v1/applications/health && echo " application-service OK" || echo " application-service FAIL"
	@curl -sf http://localhost/api/v1/screening/health && echo " screening-service OK" || echo " screening-service FAIL"
	@curl -sf http://localhost/api/v1/reviews/health && echo " review-service OK" || echo " review-service FAIL"
	@curl -sf http://localhost/api/v1/awards/health && echo " award-service OK" || echo " award-service FAIL"
	@curl -sf http://localhost/api/v1/reports/health && echo " reporting-service OK" || echo " reporting-service FAIL"
	@curl -sf http://localhost/api/v1/notifications/health && echo " comms-service OK" || echo " comms-service FAIL"
	@curl -sf http://localhost/api/v1/admin/health && echo " admin-service OK" || echo " admin-service FAIL"
