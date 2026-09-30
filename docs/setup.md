# Setup & Installation Guide

## Prerequisites
- Node.js >= 18.0.0 (v22 recommended)
- Python >= 3.10
- npm or pnpm

## 1. Quick Start (Web Application & Server)
```bash
# Clone the repository
git clone <repo_url>
cd geo-infrastructure-intelligence

# Install npm dependencies
npm install

# Start the full-stack server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` to interact with the platform.

## 2. Setting Up the Python Computer Vision Service (Optional / Live ML)
```bash
# Navigate to the Python ML microservice directory
cd services/ml

# Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install computer vision and deep learning dependencies
pip install -r requirements.txt

# Start the FastAPI ML microservice on port 8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

When active, the top banner indicator switches to **Python ML Online**, and real PyTorch inference will process uploaded inspection photographs.

## 3. Running Automated Tests
```bash
npm test
```
Executes all 32 verification tests covering analytical formulas, database repository CRUD, GeoJSON compliance, and provenance tagging.
