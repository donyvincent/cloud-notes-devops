# cloud-notes-devops

An AI-powered notes application containerized with Docker, infrastructure as code with Terraform, and automated CI/CD pipelines with GitHub Actions.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Frontend │────▶│  FastAPI Backend │────▶│   PostgreSQL DB  │
│   (Nginx)        │     │   (Python 3.12)  │     │   (pgvector)     │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    Groq AI API   │
                         │ (Llama 3.3 70B)  │
                         └─────────────────┘
```

## Features

- **Voice/Text to Note** — converts messy brain-dumps into clean structured markdown notes with headings, bullet points, and action items
- **Debate Mode** — AI argues the opposing side of any position to stress-test your thinking
- **Knowledge Graph** — visualizes semantic relationships between notes
- **Full CRUD** — create, read, update, delete notes

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Python 3.12, FastAPI, SQLAlchemy (async) |
| Database | PostgreSQL 16 with pgvector extension |
| AI | Groq API (Llama 3.3 70B) |
| Containerization | Docker, Docker Compose |
| Infrastructure | Terraform (AWS ECS, ECR, VPC, IAM) |
| CI/CD | GitHub Actions |

## Project Structure

```
cloud-notes-devops/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── config.py        # Environment configuration
│   │   ├── database.py      # Async SQLAlchemy setup
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API route handlers
│   │   └── services/        # Business logic + AI integration
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page views
│   │   └── services/        # API client
│   ├── Dockerfile
│   └── nginx.conf
├── terraform/               # AWS infrastructure as code
│   ├── main.tf
│   ├── vpc.tf
│   ├── ecs.tf
│   ├── ecr.tf
│   └── iam.tf
├── .github/workflows/       # CI/CD pipelines
│   ├── ci.yml               # Run tests on pull requests
│   └── cd.yml               # Deploy to AWS ECS on merge
└── docker-compose.yml       # Local development setup
```

## Running Locally

### Prerequisites
- Docker Desktop
- Groq API key (free at console.groq.com)

### Steps

1. Clone the repository:
```bash
git clone https://github.com/donyvincent/cloud-notes-devops.git
cd cloud-notes-devops
```

2. Create the backend environment file:
```bash
cp backend/.env.example backend/.env
```

3. Add your Groq API key to `backend/.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

4. Start the application:
```bash
docker compose up --build
```

5. Open in browser:
- Frontend: http://localhost:5174
- Backend API docs: http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notes/` | Get all notes |
| POST | `/notes/` | Create a note |
| PUT | `/notes/{id}` | Update a note |
| DELETE | `/notes/{id}` | Delete a note |
| POST | `/ai/voice-to-note` | Convert text to structured note |
| POST | `/ai/debate` | Generate debate response |
| GET | `/ai/graph` | Get knowledge graph data |
| GET | `/health` | Health check |

## Infrastructure (AWS)

The Terraform configuration provisions:
- **VPC** with public/private subnets
- **ECS Cluster** for running Docker containers
- **ECR** repositories for storing container images
- **IAM** roles and policies for ECS tasks
- **Security Groups** for network access control

## CI/CD Pipeline

- **CI** (`ci.yml`) — runs on every pull request: installs dependencies and runs tests
- **CD** (`cd.yml`) — runs on merge to main: builds Docker images, pushes to ECR, deploys to ECS

## Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for AI features |
| `DATABASE_URL` | PostgreSQL connection string |
| `AWS_ACCESS_KEY_ID` | AWS credentials (for deployment) |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials (for deployment) |
| `AWS_REGION` | AWS region (default: us-east-1) |
