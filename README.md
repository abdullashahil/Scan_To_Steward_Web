# ScanToSteward

AI-powered antibiotic stewardship assistant that analyzes prescriptions and provides hospital policy-aligned guidance.

## Setup

### Server (FastAPI)
```bash
cd server
source venv/bin/activate
pip install -r requirements.txt
python ingest.py  # Build FAISS index
python migrations/run_migrations.py

python3 -m uvicorn main:app --reload    # Runs on http://localhost:8000
```

### Client (Next.js)
```bash
cd client
npm install
npm run dev  # Runs on http://localhost:3000
```

## Environment Variables

Create `.env` in `server/`:
```
OPENROUTER_API_KEY=your_key_here
RESEND_API_KEY=optional_for_reminders
DATABASE_URL=optional_postgres_url
```