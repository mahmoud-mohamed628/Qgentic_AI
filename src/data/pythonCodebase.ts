import { FileItem, ResearchPreset } from '../types';

export const FOLDER_STRUCTURE_TEXT = `autonomous-research-crew/
│
├── .env.example          # Environment variables template (API keys)
├── requirements.txt      # Production Python dependencies
├── agents.py             # Agent definitions, personas, backstories & tools
├── tasks.py              # Sequential task definitions & expected outputs
├── crew.py               # Crew assembly and execution orchestration logic
├── app.py                # Streamlit web user interface
└── README.md             # Architecture documentation and setup guide`;

export const PYTHON_FILES: FileItem[] = [
  {
    name: 'requirements.txt',
    path: 'requirements.txt',
    language: 'plaintext',
    description: 'Dependencies including crewai, langchain-openai, streamlit, tavily-python, and python-dotenv.',
    content: `# ==============================================================================
# Autonomous AI Research Team - Python Dependencies
# Multi-Agent Architecture using CrewAI, LangChain, and Streamlit
# ==============================================================================

# Core Multi-Agent Framework
crewai>=0.86.0
crewai-tools>=0.17.0

# LangChain & Model Provider Integrations
langchain>=0.3.0
langchain-core>=0.3.0
langchain-community>=0.3.0
langchain-openai>=0.2.0

# Web Search & Grounding Tools
tavily-python>=0.5.0

# User Interface & Frontend Dashboard
streamlit>=1.39.0

# Environment Variable & Configuration Management
python-dotenv>=1.0.1
pydantic>=2.9.0`
  },
  {
    name: '.env.example',
    path: '.env.example',
    language: 'shell',
    description: 'Configuration template for OpenAI and Tavily API keys.',
    content: `# ==============================================================================
# Environment Configuration for Autonomous AI Research Crew
# ==============================================================================

# OpenAI API Key (Required for gpt-4o-mini and LangChain agent reasoning)
OPENAI_API_KEY="your-openai-api-key-here"

# Tavily API Key (Required for TavilySearchResults web search tool)
# Get your free API key at: https://tavily.com
TAVILY_API_KEY="tvly-your-tavily-api-key-here"

# Optional: Default LLM Model override (default is gpt-4o-mini)
OPENAI_MODEL_NAME="gpt-4o-mini"

# Optional: CrewAI Telemetry (set to 'false' to disable telemetry)
OTEL_SDK_DISABLED="true"`
  },
  {
    name: 'agents.py',
    path: 'agents.py',
    language: 'python',
    description: 'Initializes the 3 specialized agents with distinct roles, goals, backstories, and Tavily tool.',
    content: `"""
agents.py - Autonomous AI Research Team Agents
==============================================================================
Defines the specialized AI agents participating in the research workflow.
Each agent is configured with a distinct role, high-impact goal, deep backstory,
and tailored toolsets to ensure domain-specific performance.

Agents:
1. Senior Web Researcher: Discovers up-to-date web intelligence via Tavily.
2. Lead Market Analyst: Synthesizes raw findings, extracts metrics, eliminates noise.
3. Executive Editor: Crafts C-suite grade executive markdown reports.
==============================================================================
"""

import os
from dotenv import load_dotenv
from crewai import Agent
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults

# Load environment variables (.env file)
load_dotenv()


def get_llm(model_name: str = "gpt-4o-mini", temperature: float = 0.2) -> ChatOpenAI:
    """
    Initializes and returns the ChatOpenAI client configured for cost-effective,
    high-reasoning performance across all agents.

    Args:
        model_name: The OpenAI model identifier (default: 'gpt-4o-mini').
        temperature: Sampling temperature for deterministic analytical consistency.

    Returns:
        ChatOpenAI: Configured LangChain chat model instance.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError(
            "Missing OPENAI_API_KEY in environment variables. "
            "Please configure your .env file with a valid OpenAI API key."
        )

    return ChatOpenAI(
        model=model_name,
        temperature=temperature,
        api_key=api_key
    )


def create_tavily_tool(max_results: int = 5) -> TavilySearchResults:
    """
    Initializes the Tavily search tool configured specifically for factual retrieval,
    market statistics, and authoritative web intelligence.

    Args:
        max_results: Number of top-ranked search results to return per query.

    Returns:
        TavilySearchResults: The LangChain-compatible search tool.
    """
    tavily_api_key = os.getenv("TAVILY_API_KEY")
    if not tavily_api_key:
        raise ValueError(
            "Missing TAVILY_API_KEY in environment variables. "
            "Please register at https://tavily.com and add TAVILY_API_KEY to your .env file."
        )

    return TavilySearchResults(
        max_results=max_results,
        search_depth="advanced",
        include_answer=True,
        include_raw_content=False,
        include_domains=[]
    )


def create_senior_web_researcher(llm: ChatOpenAI, tavily_tool: TavilySearchResults) -> Agent:
    """
    Agent 1: Senior Web Researcher
    Responsible for scouring the open web, extracting primary sources, academic findings,
    financial data, and recent press statements regarding the target topic.
    """
    return Agent(
        role="Senior Web Researcher & Intelligence Specialist",
        goal=(
            "Conduct exhaustive, real-time web research on '{topic}'. Gather authoritative data, "
            "verified market statistics, industry benchmark figures, recent breakthroughs, "
            "and primary source citations from reputable publications, regulatory filings, and news."
        ),
        backstory=(
            "You are a world-class investigative intelligence researcher who previously led "
            "open-source intelligence (OSINT) and market due diligence at a tier-1 global research institute. "
            "You possess an uncanny ability to formulate surgical search queries, distinguish authoritative "
            "facts from marketing hyperbole, and pinpoint exact percentages, dollar amounts, and quotes. "
            "You never rely on stale training data or hallucinations—you relentlessly cross-reference "
            "verified online sources using Tavily."
        ),
        tools=[tavily_tool],
        llm=llm,
        verbose=True,
        memory=True,
        allow_delegation=False,
        max_iter=5
    )


def create_lead_market_analyst(llm: ChatOpenAI) -> Agent:
    """
    Agent 2: Lead Market Analyst
    Synthesizes unstructured research into structured market dynamics, core drivers,
    risk profiles, and quantifiable trends without needing additional web access.
    """
    return Agent(
        role="Lead Market & Quantitative Analyst",
        goal=(
            "Distill unstructured research intelligence on '{topic}' into high-signal strategic insights. "
            "Filter out irrelevant noise, organize key catalysts, map competitive market dynamics, "
            "categorize risks and head-winds, and quantify business implications with extreme precision."
        ),
        backstory=(
            "You are a seasoned principal strategy consultant and Wall Street technology analyst with 15+ years "
            "evaluating disruptive markets and business models. You excel at taking massive, messy dumps of raw "
            "information and isolating the underlying economic engines, systemic trends, and second-order impacts. "
            "Your peers admire your skepticism, analytical rigor, and ability to separate temporary hype "
            "from durable competitive moats. You operate purely on verified evidence without making unsubstantiated claims."
        ),
        tools=[],  # No tools needed; relies entirely on superior LLM reasoning and the Researcher's inputs
        llm=llm,
        verbose=True,
        memory=True,
        allow_delegation=False,
        max_iter=3
    )


def create_executive_editor(llm: ChatOpenAI) -> Agent:
    """
    Agent 3: Executive Editor
    Packages the analyst's synthesis into an immaculate, publication-ready executive briefing
    formatted in clean Markdown with executive-level clarity.
    """
    return Agent(
        role="Chief Executive Editor & Communications Strategist",
        goal=(
            "Synthesize the analyst's findings on '{topic}' into an executive-level, C-suite ready "
            "intelligence briefing in Markdown format. The report must feature executive summaries, "
            "key performance indicators, strategic implications, clean bullet points, and actionable conclusions."
        ),
        backstory=(
            "You are a veteran executive editor formerly at Harvard Business Review and McKinsey Quarterly. "
            "You specialize in communicating complex technological and commercial phenomena to Fortune 500 CEOs, "
            "board members, and institutional investors. You insist on crisp headings, scannable structures, "
            "compelling data callouts, and decisive conclusions. You eliminate jargon and corporate fluff, "
            "ensuring every sentence delivers strategic clarity and maximum cognitive efficiency."
        ),
        tools=[],  # Pure editorial synthesis and Markdown formatting
        llm=llm,
        verbose=True,
        memory=True,
        allow_delegation=False,
        max_iter=3
    )


def initialize_research_agents(model_name: str = "gpt-4o-mini", temperature: float = 0.2):
    """
    Factory function that instantiates the shared LLM, Tavily tool, and all 3 specialized agents.

    Returns:
        tuple[Agent, Agent, Agent]: (senior_researcher, lead_analyst, executive_editor)
    """
    llm = get_llm(model_name=model_name, temperature=temperature)
    tavily_tool = create_tavily_tool(max_results=5)

    researcher = create_senior_web_researcher(llm=llm, tavily_tool=tavily_tool)
    analyst = create_lead_market_analyst(llm=llm)
    editor = create_executive_editor(llm=llm)

    return researcher, analyst, editor`
  },
  {
    name: 'tasks.py',
    path: 'tasks.py',
    language: 'python',
    description: 'Defines the 3 sequential tasks with explicit hand-offs, guidelines, and expected outputs.',
    content: `"""
tasks.py - Autonomous AI Research Team Tasks
==============================================================================
Defines the three sequential tasks that orchestrate the end-to-end intelligence pipeline:
1. web_research_task: Deep web search, data gathering, fact extraction via Tavily.
2. market_analysis_task: Trend detection, noise removal, quantitative and strategic structuring.
3. executive_report_task: Production of a C-suite grade, polished Markdown report.

Each task specifies strict guidelines, contextual handoffs, and clear expected_outputs.
==============================================================================
"""

from crewai import Agent, Task


def create_web_research_task(agent: Agent, topic: str) -> Task:
    """
    Task 1: Web Intelligence Gathering
    Assigned to the Senior Web Researcher. Performs live queries via Tavily,
    extracts concrete metrics, verified figures, and lists reputable citations.
    """
    return Task(
        description=(
            f"Conduct comprehensive, up-to-date web research on the topic: '{topic}'.\\n\\n"
            "Execution Instructions:\\n"
            "1. Formulate multiple distinct search queries focusing on: recent breakthroughs (past 12-24 months), "
            "authoritative market figures, regulatory movements, key players, and enterprise adoption metrics.\\n"
            "2. Utilize the Tavily search tool to query high-authority sources (industry reports, financial publications, "
            "academic releases, government agencies, and verified news outlets).\\n"
            "3. Extract specific quantitative data: market sizes ($USD), compound annual growth rates (CAGR %), "
            "adoption percentages, milestone dates, and key performance indicators.\\n"
            "4. Cross-verify conflicting figures and document the original publication URLs as citations.\\n"
            "5. Compile the raw intelligence into a dense, fact-checked dossier. Do not editorialize or gloss over nuances."
        ),
        expected_output=(
            "A structured research dossier containing:\\n"
            "- Core Fact Sheet: Verified statistics, market sizing, CAGR, and dates.\\n"
            "- Key Developments: Detailed summary of major events and technological breakthroughs.\\n"
            "- Stakeholders & Players: Notable companies, research labs, or regulators.\\n"
            "- Citations & References: A clean list of source titles and URLs used during the research."
        ),
        agent=agent
    )


def create_market_analysis_task(agent: Agent, topic: str, context_task: Task) -> Task:
    """
    Task 2: Market & Strategic Analysis
    Assigned to the Lead Market Analyst. Consumes the raw research dossier,
    removes marketing hype, isolates durable trends, and evaluates market dynamics.
    """
    return Task(
        description=(
            f"Critically analyze the raw research dossier provided for the topic: '{topic}'.\\n\\n"
            "Execution Instructions:\\n"
            "1. Noise Filtering: Strip away vendor bias, PR buzzwords, and speculative claims lacking empirical support.\\n"
            "2. Trend Synthesis: Identify the top 3-5 macro and micro trends shaping this domain.\\n"
            "3. Market Dynamics Matrix: Break down:\\n"
            "   - Key Drivers: What economic, technical, or consumer forces are accelerating growth?\\n"
            "   - Core Constraints & Bottlenecks: What supply chain, regulatory, technical, or cost barriers exist?\\n"
            "   - Disruption Potential: Who wins and who loses as this space evolves?\\n"
            "4. Quantitative Evaluation: Synthesize the numbers into clear operational insights (e.g., ROI, payback timelines, market penetration).\\n"
            "5. Risk Assessment: Evaluate technological risks, cybersecurity/compliance hurdles, and competitive threats.\\n"
            "6. Prepare a rigorous strategic breakdown ready for editorial formatting."
        ),
        expected_output=(
            "A comprehensive strategic analysis breakdown containing:\\n"
            "- Executive Trend Summary: Top 3-5 macro trends with quantitative backing.\\n"
            "- Market Forces Matrix: Catalog of drivers, restraints, bottlenecks, and catalysts.\\n"
            "- Competitive Landscape & Moats: Analysis of incumbent defenses vs. insurgent disruptions.\\n"
            "- Strategic Risk Matrix: High-impact risks mapped by likelihood and operational severity."
        ),
        agent=agent,
        context=[context_task]  # Explicit dependency on Task 1 output
    )


def create_executive_report_task(agent: Agent, topic: str, context_task: Task) -> Task:
    """
    Task 3: Executive Report Generation
    Assigned to the Executive Editor. Formats the strategic analysis into a
    publication-ready C-suite Markdown report with compelling typography and structure.
    """
    return Task(
        description=(
            f"Transform the market analysis into an executive-level intelligence report on '{topic}'.\\n\\n"
            "Formatting & Tone Guidelines:\\n"
            "1. Audience: C-suite executives, Board Members, VCs, and Principal Engineers.\\n"
            "2. Tone: Objective, authoritative, strategic, concise, and deeply actionable.\\n"
            "3. Required Markdown Sections:\\n"
            "   - # Executive Intelligence Briefing: [Compelling Subtitle]\\n"
            "   - **Metadata Header**: Topic, Date, Classification Level, Analytical Confidence.\\n"
            "   - ## Executive Summary (High-impact 2-3 paragraph synthesis delivering the bottom line up front).\\n"
            "   - ## Key Quantitative Benchmarks (KPI cards / Markdown table comparing metrics, growth, and timeline).\\n"
            "   - ## Core Strategic Themes & Market Dynamics (Detailed breakdown with crisp bullet points).\\n"
            "   - ## Competitive Landscape & Industry Implications (Winners, losers, and defensibility).\\n"
            "   - ## Risk Matrix & Headwinds (Categorized barriers and mitigation strategies).\\n"
            "   - ## Strategic Recommendations & Roadmap (30-60-90 day advisory takeaways).\\n"
            "   - ## Conclusion & Forward Outlook (Forward-looking summary statement).\\n"
            "   - ## Verified Citations & Information Sources (Organized bibliography).\\n"
            "4. Ensure flawless Markdown syntax, callouts, bold highlights, and clean typography throughout."
        ),
        expected_output=(
            "A complete, professional, publication-ready Markdown report strictly adhering to the requested "
            "section structure, featuring actionable C-suite insights, data tables, bulleted takeaways, "
            "and a decisive conclusion with primary source citations."
        ),
        agent=agent,
        context=[context_task]  # Explicit dependency on Task 2 output
    )


def initialize_research_tasks(
    researcher: Agent,
    analyst: Agent,
    editor: Agent,
    topic: str
):
    """
    Factory function that wires together all three sequential tasks with proper agent assignments
    and context pipeline handoffs.

    Args:
        researcher: The Senior Web Researcher agent.
        analyst: The Lead Market Analyst agent.
        editor: The Executive Editor agent.
        topic: The user's input research topic.

    Returns:
        tuple[Task, Task, Task]: (research_task, analysis_task, report_task)
    """
    research_task = create_web_research_task(agent=researcher, topic=topic)
    analysis_task = create_market_analysis_task(agent=analyst, topic=topic, context_task=research_task)
    report_task = create_executive_report_task(agent=editor, topic=topic, context_task=analysis_task)

    return research_task, analysis_task, report_task`
  },
  {
    name: 'crew.py',
    path: 'crew.py',
    language: 'python',
    description: 'Assembles the agents, tasks, and Process.sequential into an operational CrewAI execution flow.',
    content: `"""
crew.py - Autonomous AI Research Crew Orchestrator
==============================================================================
Assembles the specialized Agents and sequential Tasks into an operational CrewAI Crew.
Provides a clean, modular entrypoint \`run_research_crew(topic)\` that can be invoked
by the Streamlit UI, CLI, or automated pipelines.
==============================================================================
"""

import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from crewai import Crew, Process

from agents import initialize_research_agents
from tasks import initialize_research_tasks

# Ensure environment variables are loaded
load_dotenv()


class AutonomousResearchCrew:
    """
    Encapsulates the lifecycle, configuration, and sequential execution
    of the 3-agent Autonomous Research Team.
    """

    def __init__(
        self,
        model_name: str = "gpt-4o-mini",
        temperature: float = 0.2,
        verbose: bool = True
    ):
        """
        Initializes the research crew configuration.

        Args:
            model_name: The OpenAI model name (default: 'gpt-4o-mini' for cost optimization).
            temperature: LLM temperature for analytical accuracy.
            verbose: If True, prints internal agent reasoning and tool usage to stdout.
        """
        self.model_name = model_name
        self.temperature = temperature
        self.verbose = verbose

        # Validate mandatory keys upfront before running
        self._validate_credentials()

    def _validate_credentials(self) -> None:
        """Validates that necessary API credentials are present."""
        missing = []
        if not os.getenv("OPENAI_API_KEY"):
            missing.append("OPENAI_API_KEY")
        if not os.getenv("TAVILY_API_KEY"):
            missing.append("TAVILY_API_KEY")

        if missing:
            raise ValueError(
                f"Missing required environment variable(s): {', '.join(missing)}. "
                "Please configure them in your .env file or environment before executing."
            )

    def kickoff(self, topic: str) -> str:
        """
        Kicks off the autonomous sequential research process for a given topic.

        Process Workflow:
        1. Senior Web Researcher retrieves real-time data & statistics via Tavily.
        2. Lead Market Analyst filters noise, models trends, and structures insights.
        3. Executive Editor composes the final Markdown intelligence report.

        Args:
            topic: The complex research topic or query string.

        Returns:
            str: The final, comprehensive Markdown report generated by the Executive Editor.
        """
        clean_topic = topic.strip()
        if not clean_topic:
            raise ValueError("Research topic cannot be empty.")

        # 1. Instantiate the specialized agents
        researcher, analyst, editor = initialize_research_agents(
            model_name=self.model_name,
            temperature=self.temperature
        )

        # 2. Instantiate sequential tasks wired with context
        research_task, analysis_task, report_task = initialize_research_tasks(
            researcher=researcher,
            analyst=analyst,
            editor=editor,
            topic=clean_topic
        )

        # 3. Assemble the Crew
        crew = Crew(
            agents=[researcher, analyst, editor],
            tasks=[research_task, analysis_task, report_task],
            process=Process.sequential,  # Sequential execution constraint
            verbose=self.verbose,
            memory=True,                 # Shared memory for coherent context
            max_rpm=30                  # Rate limit safeguard against API throttling
        )

        # 4. Kickoff execution with input interpolation
        inputs: Dict[str, Any] = {"topic": clean_topic}
        result = crew.kickoff(inputs=inputs)

        # Return the final task output as a clean string
        return str(result)


def run_research_crew(
    topic: str,
    model_name: str = "gpt-4o-mini",
    temperature: float = 0.2,
    verbose: bool = True
) -> str:
    """
    Convenience function to run the full autonomous research pipeline with a single call.

    Args:
        topic: The topic to research.
        model_name: LLM identifier (defaults to gpt-4o-mini).
        temperature: Sampling temperature.
        verbose: Verbose logging toggle.

    Returns:
        str: Final markdown report.
    """
    orchestrator = AutonomousResearchCrew(
        model_name=model_name,
        temperature=temperature,
        verbose=verbose
    )
    return orchestrator.kickoff(topic=topic)


if __name__ == "__main__":
    # Test CLI execution entrypoint
    sample_topic = "Impact of Generative AI on Enterprise Cybersecurity in 2025"
    print(f"[*] Starting Autonomous Research Crew for topic: '{sample_topic}'...\\n")
    try:
        report = run_research_crew(sample_topic)
        print("\\n" + "=" * 80)
        print("FINAL EXECUTIVE REPORT DELIVERABLE:")
        print("=" * 80 + "\\n")
        print(report)
    except Exception as e:
        print(f"[!] Execution failed: {e}")`
  },
  {
    name: 'app.py',
    path: 'app.py',
    language: 'python',
    description: 'Streamlit dashboard interface capturing input, showing live spinners, and rendering reports.',
    content: `"""
app.py - Streamlit Interface for Autonomous AI Research Team
==============================================================================
Production-grade interactive web application powered by Streamlit, CrewAI,
LangChain, and Tavily.
Captures user topic inputs, manages execution lifecycles with dynamic status
spinners, and renders polished executive Markdown reports with export tools.
==============================================================================
"""

import os
import time
from datetime import datetime
import streamlit as st
from dotenv import load_dotenv

# Import the core Crew orchestration logic
from crew import run_research_crew

# Load environment configuration
load_dotenv()

# ==============================================================================
# Page Configuration & Styling
# ==============================================================================
st.set_page_config(
    page_title="Autonomous AI Research Crew | Multi-Agent Intelligence",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for executive polish and typography
st.markdown("""
<style>
    .main-header {
        font-size: 2.25rem;
        font-weight: 700;
        color: #1E293B;
        margin-bottom: 0.25rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #64748B;
        margin-bottom: 1.5rem;
    }
    .agent-card {
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 10px;
    }
    .agent-title {
        font-weight: 600;
        color: #0F172A;
        font-size: 0.95rem;
    }
    .agent-desc {
        color: #475569;
        font-size: 0.82rem;
        margin-top: 4px;
    }
    .status-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .stDownloadButton > button {
        background-color: #2563EB;
        color: white;
        font-weight: 600;
        border-radius: 6px;
        padding: 0.5rem 1rem;
    }
</style>
""", unsafe_allow_html=True)


# ==============================================================================
# Sidebar Configuration & Telemetry
# ==============================================================================
with st.sidebar:
    st.image(
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
        caption="Autonomous Multi-Agent Swarm",
        use_container_width=True
    )
    st.title("Crew Configuration")

    # API Keys Validation in Environment
    openai_key = os.getenv("OPENAI_API_KEY", "")
    tavily_key = os.getenv("TAVILY_API_KEY", "")

    has_openai = bool(openai_key and not openai_key.startswith("your-"))
    has_tavily = bool(tavily_key and not tavily_key.startswith("tvly-your-"))

    st.subheader("Credential Status")
    col1, col2 = st.columns(2)
    with col1:
        if has_openai:
            st.success("OpenAI: Connected", icon="✅")
        else:
            st.error("OpenAI: Missing", icon="⚠️")
    with col2:
        if has_tavily:
            st.success("Tavily: Connected", icon="✅")
        else:
            st.error("Tavily: Missing", icon="⚠️")

    if not (has_openai and has_tavily):
        st.warning(
            "Please configure \`OPENAI_API_KEY\` and \`TAVILY_API_KEY\` in your \`.env\` file."
        )

    st.divider()

    # Agent Pipeline Visualizer
    st.subheader("Autonomous Crew Team")

    st.markdown("""
    <div class="agent-card">
        <div class="agent-title">🕵️ 1. Senior Web Researcher</div>
        <div class="agent-desc">Scours live web via <b>Tavily Search</b> for primary sources, verified statistics, and breakthroughs.</div>
    </div>
    <div class="agent-card">
        <div class="agent-title">📊 2. Lead Market Analyst</div>
        <div class="agent-desc">Synthesizes unstructured data, models trends, filters marketing noise, and quantifies market dynamics.</div>
    </div>
    <div class="agent-card">
        <div class="agent-title">🖋️ 3. Executive Editor</div>
        <div class="agent-desc">Formats intelligence into a publication-ready, C-suite Markdown report with KPIs and strategic roadmaps.</div>
    </div>
    """, unsafe_allow_html=True)

    st.divider()

    # LLM Parameters
    st.subheader("Model Parameters")
    selected_model = st.selectbox(
        "LLM Backbone",
        options=["gpt-4o-mini", "gpt-4o"],
        index=0,
        help="gpt-4o-mini is optimized for low latency and minimal token cost while retaining superior reasoning."
    )

    temperature = st.slider(
        "Temperature",
        min_value=0.0,
        max_value=1.0,
        value=0.2,
        step=0.05,
        help="Lower values yield more factual and deterministic analytical output."
    )

    verbose_logging = st.checkbox(
        "Verbose Terminal Logging",
        value=True,
        help="Outputs internal agent scratchpads and tool execution logs to your terminal."
    )


# ==============================================================================
# Main Application Interface
# ==============================================================================
st.markdown('<div class="main-header">Autonomous AI Research Crew</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-header">'
    'Deploy a specialized 3-agent autonomous team to investigate, analyze, and publish '
    'executive-grade intelligence briefings on any complex domain.'
    '</div>',
    unsafe_allow_html=True
)

# Suggested Research Topics
st.caption("💡 Quick-start with high-impact research topics:")
col_p1, col_p2, col_p3 = st.columns(3)

if col_p1.button("🧬 Quantum Computing in Drug Discovery 2025-2026"):
    st.session_state["topic_input"] = "Breakthroughs in Quantum Computing for Molecular Drug Discovery and Pharmaceutical Commercialization 2025-2026"
if col_p2.button("🛡️ Autonomous AI Agents in Cyber Defense"):
    st.session_state["topic_input"] = "The Rise of Autonomous AI Agents in Enterprise Cybersecurity: Automated Threat Hunting, Zero-Day Defense, and Market Sizing"
if col_p3.button("🔋 Solid-State Battery Commercialization Roadmaps"):
    st.session_state["topic_input"] = "Global Solid-State EV Battery Commercialization: Energy Density Benchmarks, Production Bottlenecks, and Key Player Roadmaps"

# Topic Input Area
user_topic = st.text_area(
    "Enter Research Topic or Strategic Query:",
    value=st.session_state.get("topic_input", ""),
    placeholder="e.g. Commercial viability of Small Modular Nuclear Reactors (SMRs) for AI Datacenter power demands in North America...",
    height=110,
    help="Be as specific or multi-faceted as you like. The Web Researcher will break it down into tactical sub-queries."
)

col_run, col_clear = st.columns([1, 5])
with col_run:
    run_button = st.button("🚀 Launch Autonomous Crew", type="primary", use_container_width=True)
with col_clear:
    if st.button("Reset"):
        st.session_state["topic_input"] = ""
        st.session_state["latest_report"] = None
        st.rerun()

# ==============================================================================
# Execution Lifecycle
# ==============================================================================
if run_button:
    if not user_topic.strip():
        st.error("Please enter a research topic before launching the crew.", icon="⚠️")
    elif not has_openai or not has_tavily:
        st.error(
            "Execution blocked: Missing required API keys. "
            "Please configure \`OPENAI_API_KEY\` and \`TAVILY_API_KEY\` in your \`.env\` file.",
            icon="🚨"
        )
    else:
        status_box = st.status("🤖 Assembling Autonomous Research Crew...", expanded=True)

        try:
            start_time = time.time()

            # Step 1: Senior Web Researcher
            status_box.write("🕵️ **Senior Web Researcher** activated. Formulating search queries and querying Tavily...")
            time.sleep(0.5)

            # Step 2 & 3: Run the orchestrator
            status_box.write("📊 **Lead Market Analyst** preparing quantitative models and noise-filtering algorithms...")
            status_box.write("🖋️ **Executive Editor** queued to compose final C-suite Markdown report...")

            # Run the actual CrewAI pipeline
            report_markdown = run_research_crew(
                topic=user_topic.strip(),
                model_name=selected_model,
                temperature=temperature,
                verbose=verbose_logging
            )

            elapsed_time = round(time.time() - start_time, 2)
            status_box.update(
                label=f"✅ Research Completed Successfully in {elapsed_time}s!",
                state="complete",
                expanded=False
            )

            # Store in session state for persistence across interactions
            st.session_state["latest_report"] = report_markdown
            st.session_state["latest_topic"] = user_topic.strip()
            st.session_state["elapsed_time"] = elapsed_time

        except Exception as e:
            status_box.update(label="❌ Execution Failed", state="error", expanded=True)
            st.error(f"An error occurred during crew execution: {str(e)}", icon="🚨")
            st.info("Check terminal logs for full CrewAI traceback and verify your API keys.")


# ==============================================================================
# Deliverable Presentation & Export
# ==============================================================================
if st.session_state.get("latest_report"):
    report_content = st.session_state["latest_report"]
    topic_name = st.session_state.get("latest_topic", "Research_Report")
    elapsed = st.session_state.get("elapsed_time", "N/A")

    st.markdown("---")
    st.subheader("📄 Executive Deliverable")

    # Header Meta Summary
    meta_c1, meta_c2, meta_c3 = st.columns([2, 1, 1])
    with meta_c1:
        st.caption(f"**Topic**: {topic_name}")
    with meta_c2:
        st.caption(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    with meta_c3:
        st.caption(f"**Execution Time**: {elapsed} seconds")

    # Export & Download Options
    filename = f"Executive_Report_{int(time.time())}.md"
    st.download_button(
        label="📥 Download Executive Report (.md)",
        data=report_content,
        file_name=filename,
        mime="text/markdown",
        help="Download the complete executive intelligence briefing in clean Markdown format."
    )

    # Presentation Tabs
    tab_rendered, tab_raw, tab_architecture = st.tabs([
        "📊 Rendered Executive Briefing",
        "📝 Raw Markdown Source",
        "🏗️ Agent Architecture & Hand-offs"
    ])

    with tab_rendered:
        st.markdown(report_content)

    with tab_raw:
        st.code(report_content, language="markdown")

    with tab_architecture:
        st.markdown("""
        ### Sequential Multi-Agent Execution Flow

        \`\`\`text
        [User Topic Input]
               │
               ▼
        ┌──────────────────────────────────────────────────────────────┐
        │ 1. Senior Web Researcher                                      │
        │    • Tool: TavilySearchResults (LangChain)                   │
        │    • Output: Raw Fact Sheet, Statistics, Primary Citations   │
        └──────────────────────────────┬───────────────────────────────┘
                                       │ Context Handoff
                                       ▼
        ┌──────────────────────────────────────────────────────────────┐
        │ 2. Lead Market Analyst                                       │
        │    • Tool: None (Pure LLM Analytical Reasoning)              │
        │    • Output: Filtered Signals, Market Dynamics, Risk Matrix  │
        └──────────────────────────────┬───────────────────────────────┘
                                       │ Context Handoff
                                       ▼
        ┌──────────────────────────────────────────────────────────────┐
        │ 3. Executive Editor                                          │
        │    • Tool: None (Editorial Synthesis & Formatting)           │
        │    • Output: C-Suite Markdown Report with KPIs & Roadmaps    │
        └──────────────────────────────┬───────────────────────────────┘
                                       │
                                       ▼
                         [Streamlit Dashboard & .md Export]
        \`\`\`
        """)`
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    description: 'Complete setup guide, requirements, virtual environment, and execution manual.',
    content: `# Autonomous AI Research Team (CrewAI + LangChain + Streamlit)

An enterprise-grade, autonomous multi-agent research and intelligence system. Built with **CrewAI**, **LangChain**, and **Streamlit**, powered by cost-optimized **\`gpt-4o-mini\`** and real-time **Tavily Web Search**.

---

## 🏗️ Folder Structure

\`\`\`text
autonomous-research-crew/
│
├── .env.example          # Environment variables template (API keys)
├── requirements.txt      # Production Python dependencies
├── agents.py             # Agent definitions, personas, backstories & tools
├── tasks.py              # Sequential task definitions & expected outputs
├── crew.py               # Crew assembly and execution orchestration logic
├── app.py                # Streamlit web user interface
└── README.md             # Architecture documentation and setup guide
\`\`\`

---

## 👥 The 3-Agent Autonomous Team

| Agent | Role | Tools | Primary Objective |
| :--- | :--- | :--- | :--- |
| **1. Senior Web Researcher** | OSINT & Intelligence Specialist | \`TavilySearchResults\` | Scours live internet data, academic publications, regulatory filings, and market statistics. Extracts primary sources and citations. |
| **2. Lead Market Analyst** | Quantitative & Strategy Analyst | *None (Pure LLM Reasoning)* | Ingests the raw research dossier, filters marketing buzzwords, extracts CAGR/KPIs, identifies macro trends, and builds a market dynamics matrix. |
| **3. Executive Editor** | Chief Communications Strategist | *None (Editorial Synthesis)* | Transforms analytical models into a C-suite executive briefing in clean Markdown, complete with KPI cards, bulleted takeaways, risk matrices, and strategic roadmaps. |

---

## ⚡ Step-by-Step Setup Guide

### 1. Prerequisites
- **Python**: Version \`3.10\`, \`3.11\`, or \`3.12\` installed.
- **OpenAI API Key**: Obtain from [platform.openai.com](https://platform.openai.com) (used for \`gpt-4o-mini\`).
- **Tavily API Key**: Obtain a free API key from [tavily.com](https://tavily.com) (enables live web grounding).

### 2. Clone or Navigate to the Directory
\`\`\`bash
cd autonomous-research-crew
\`\`\`

### 3. Create and Activate a Python Virtual Environment

**On macOS / Linux:**
\`\`\`bash
python3 -m venv venv
source venv/bin/activate
\`\`\`

**On Windows (PowerShell):**
\`\`\`powershell
python -m venv venv
.\\venv\\Scripts\\Activate.ps1
\`\`\`

### 4. Install Dependencies
\`\`\`bash
pip install --upgrade pip
pip install -r requirements.txt
\`\`\`

### 5. Configure Environment Variables (\`.env\`)
Copy \`.env.example\` to create your active \`.env\` file:

\`\`\`bash
cp .env.example .env
\`\`\`

Open \`.env\` in your text editor and input your actual API keys:

\`\`\`dotenv
# .env
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TAVILY_API_KEY="tvly-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Optional overrides
OPENAI_MODEL_NAME="gpt-4o-mini"
OTEL_SDK_DISABLED="true"
\`\`\`

---

## 🚀 Running the Application

### Option A: Launch the Streamlit Web UI (Recommended)
Launch the interactive browser application:

\`\`\`bash
streamlit run app.py
\`\`\`

The Streamlit dashboard will open in your default browser at \`http://localhost:8501\`.

1. Select a pre-built strategic topic or type your own complex query.
2. Adjust LLM temperature or switch between \`gpt-4o-mini\` and \`gpt-4o\`.
3. Click **"🚀 Launch Autonomous Crew"**.
4. Watch the real-time agent execution pipeline in the status container.
5. Inspect the rendered executive briefing or download the \`.md\` deliverable with one click.

### Option B: Run via CLI / Standalone Script
You can also run the crew directly from the terminal without the web interface:

\`\`\`bash
python crew.py
\`\`\`
`
  }
];

export const SAMPLE_PRESETS: ResearchPreset[] = [
  {
    id: 'quantum-pharma',
    title: 'Quantum Computing in Drug Discovery',
    category: 'Biotech & DeepTech',
    icon: '🧬',
    topic: 'Breakthroughs in Quantum Computing for Molecular Drug Discovery and In-Silico Target Identification 2025-2026',
    description: 'Quantum annealing & gate-based simulation of kinase inhibitors, folding benchmarks, and top pharmaceutical partnerships.'
  },
  {
    id: 'cyber-agents',
    title: 'Autonomous AI Agents in Cyber Defense',
    category: 'Cybersecurity',
    icon: '🛡️',
    topic: 'The Commercial Rise of Autonomous AI Agents in Enterprise Cybersecurity: Automated Threat Hunting, Zero-Day Containment, and Market Sizing',
    description: 'Automated adversary emulation, SIEM copilot disruption, MTTR reduction, and regulatory compliance standards.'
  },
  {
    id: 'solid-state-ev',
    title: 'Solid-State Battery Roadmaps',
    category: 'CleanTech & Mobility',
    icon: '🔋',
    topic: 'Global Solid-State EV Battery Commercialization: Energy Density Benchmarks, Anode Chemistry, Manufacturing Bottlenecks, and OEM Timelines',
    description: 'Silicon vs lithium-metal anodes, gigafactory yield rates, cell-level costs ($/kWh), and 2026-2030 EV adoption forecasts.'
  },
  {
    id: 'smr-datacenters',
    title: 'SMR Nuclear for AI Datacenters',
    category: 'Energy & Infrastructure',
    icon: '⚛️',
    topic: 'Feasibility and Commercial Contracts for Small Modular Nuclear Reactors (SMRs) Powering Hyperscale AI Datacenters in North America',
    description: 'PPA agreements, baseload energy metrics, NRC licensing milestones, and capital expenditure comparisons.'
  }
];
