# start frontend
start-frontend:
	cd client && npm run dev

# start backend
start-backend:
	cd server && uv sync && uv run uvicorn main:app --reload

# stop processes
stop-backend:
	@echo "Stopping FastAPI backend..."
	lsof -ti:8000 | xargs kill -9 || true

stop-frontend:
	@echo "Stopping Next.js frontend..."
	lsof -ti:3000 | xargs kill -9 || true

start-all:
	make start-backend &
	make start-frontend
	
stop-all:
	@echo "Stopping All Processes..."
	make stop-backend &
	make stop-frontend
	

	