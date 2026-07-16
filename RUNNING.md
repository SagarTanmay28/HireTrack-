# How to run HireTrack (quick)

Quick Docker (recommended):

```bash
cd hiretrack
docker-compose up --build
```

- Frontend: http://localhost (port 80)
- Backend API: http://localhost:5000

Run backend locally (without Docker):

```bash
cd hiretrack/backend
npm install
# copy .env.example to .env and edit if needed
npm run dev
```

Run frontend locally (without Docker):

```bash
cd hiretrack/frontend
npm install
# create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

View logs:

- Docker Compose: `docker-compose logs -f` or `docker-compose logs -f backend`
- Single container: `docker logs -f hiretrack_backend`
- Local: the terminal running `npm run dev` shows server output

Notes:

- If you run backend locally against a local Postgres, set `DB_HOST=localhost` in `backend/.env`.
- Replace placeholder passwords and `JWT_SECRET` before deploying.
