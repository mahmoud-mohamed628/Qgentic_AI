# Autonomous AI Research Team (CrewAI + LangChain + Streamlit)

An enterprise-grade, autonomous multi-agent research and intelligence system. Built with **CrewAI**, **LangChain**, and **Streamlit**, powered by cost-optimized **`gpt-4o-mini`** and real-time **Tavily Web Search**.

---

## 🏗️ Folder Structure

```text
autonomous-research-crew/
│
├── .env.example          # Environment variables template (API keys)
├── requirements.txt      # Production Python dependencies
├── agents.py             # Agent definitions, personas, backstories & tools
├── tasks.py              # Sequential task definitions & expected outputs
├── crew.py               # Crew assembly and execution orchestration logic
├── app.py                # Streamlit web user interface
└── README.md             # Architecture documentation and setup guide
```

---

## 👥 The 3-Agent Autonomous Team

| Agent | Role | Tools | Primary Objective |
| :--- | :--- | :--- | :--- |
| **1. Senior Web Researcher** | OSINT & Intelligence Specialist | `TavilySearchResults` | Scours live internet data, academic publications, regulatory filings, and market statistics. Extracts primary sources and citations. |
| **2. Lead Market Analyst** | Quantitative & Strategy Analyst | *None (Pure LLM Reasoning)* | Ingests the raw research dossier, filters marketing buzzwords, extracts CAGR/KPIs, identifies macro trends, and builds a market dynamics matrix. |
| **3. Executive Editor** | Chief Communications Strategist | *None (Editorial Synthesis)* | Transforms analytical models into a C-suite executive briefing in clean Markdown, complete with KPI cards, bulleted takeaways, risk matrices, and strategic roadmaps. |

---

## ⚡ Step-by-Step Setup Guide

### 1. Prerequisites
- **Python**: Version `3.10`, `3.11`, or `3.12` installed.
- **OpenAI API Key**: Obtain from [platform.openai.com](https://platform.openai.com) (used for `gpt-4o-mini`).
- **Tavily API Key**: Obtain a free API key from [tavily.com](https://tavily.com) (enables live web grounding).

### 2. Clone or Navigate to the Directory
```bash
cd autonomous-research-crew
```

### 3. Create and Activate a Python Virtual Environment

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 4. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Configure Environment Variables (`.env`)
Copy `.env.example` to create your active `.env` file:

```bash
cp .env.example .env
```

Open `.env` in your text editor and input your actual API keys:

```dotenv
# .env
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TAVILY_API_KEY="tvly-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Optional overrides
OPENAI_MODEL_NAME="gpt-4o-mini"
OTEL_SDK_DISABLED="true"
```

---

## 🚀 Running the Application

### Option A: Launch the Streamlit Web UI (Recommended)
Launch the interactive browser application:

```bash
streamlit run app.py
```

The Streamlit dashboard will open in your default browser at `http://localhost:8501`.

1. Select a pre-built strategic topic or type your own complex query.
2. Adjust LLM temperature or switch between `gpt-4o-mini` and `gpt-4o`.
3. Click **"🚀 Launch Autonomous Crew"**.
4. Watch the real-time agent execution pipeline in the status container.
5. Inspect the rendered executive briefing or download the `.md` deliverable with one click.

### Option B: Run via CLI / Standalone Script
You can also run the crew directly from the terminal without the web interface:

```bash
python crew.py
```

---

## 💡 Architecture & Design Decisions

- **Sequential Pipeline (`Process.sequential`)**: Ensures that Task 2 (Analysis) strictly waits for and receives the verified citations and data from Task 1 (Research), and Task 3 (Editorial) receives the synthesized dynamics from Task 2.
- **Cost-Optimized Model (`gpt-4o-mini`)**: Combines cutting-edge reasoning with minimal token consumption, making repeated deep web searches and multi-step syntheses exceptionally affordable.
- **Dedicated Web Retrieval Tool (`TavilySearchResults`)**: Tailored specifically for AI agents, Tavily extracts clean, factual text from relevant URLs without scraping bloated advertising or boilerplate scripts.
- **Deterministic Temperature (0.2)**: Reduces hallucination rates while keeping analytical prose sharp, direct, and authoritative.
- **Safe State & One-Click Download**: Streamlit `st.session_state` preserves the generated report even if the user resizes or interacts with UI widgets, and `st.download_button` exports the report in UTF-8 Markdown format.
