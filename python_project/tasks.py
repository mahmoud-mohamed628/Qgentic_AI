"""
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
            f"Conduct comprehensive, up-to-date web research on the topic: '{topic}'.\n\n"
            "Execution Instructions:\n"
            "1. Formulate multiple distinct search queries focusing on: recent breakthroughs (past 12-24 months), "
            "authoritative market figures, regulatory movements, key players, and enterprise adoption metrics.\n"
            "2. Utilize the Tavily search tool to query high-authority sources (industry reports, financial publications, "
            "academic releases, government agencies, and verified news outlets).\n"
            "3. Extract specific quantitative data: market sizes ($USD), compound annual growth rates (CAGR %), "
            "adoption percentages, milestone dates, and key performance indicators.\n"
            "4. Cross-verify conflicting figures and document the original publication URLs as citations.\n"
            "5. Compile the raw intelligence into a dense, fact-checked dossier. Do not editorialize or gloss over nuances."
        ),
        expected_output=(
            "A structured research dossier containing:\n"
            "- Core Fact Sheet: Verified statistics, market sizing, CAGR, and dates.\n"
            "- Key Developments: Detailed summary of major events and technological breakthroughs.\n"
            "- Stakeholders & Players: Notable companies, research labs, or regulators.\n"
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
            f"Critically analyze the raw research dossier provided for the topic: '{topic}'.\n\n"
            "Execution Instructions:\n"
            "1. Noise Filtering: Strip away vendor bias, PR buzzwords, and speculative claims lacking empirical support.\n"
            "2. Trend Synthesis: Identify the top 3-5 macro and micro trends shaping this domain.\n"
            "3. Market Dynamics Matrix: Break down:\n"
            "   - Key Drivers: What economic, technical, or consumer forces are accelerating growth?\n"
            "   - Core Constraints & Bottlenecks: What supply chain, regulatory, technical, or cost barriers exist?\n"
            "   - Disruption Potential: Who wins and who loses as this space evolves?\n"
            "4. Quantitative Evaluation: Synthesize the numbers into clear operational insights (e.g., ROI, payback timelines, market penetration).\n"
            "5. Risk Assessment: Evaluate technological risks, cybersecurity/compliance hurdles, and competitive threats.\n"
            "6. Prepare a rigorous strategic breakdown ready for editorial formatting."
        ),
        expected_output=(
            "A comprehensive strategic analysis breakdown containing:\n"
            "- Executive Trend Summary: Top 3-5 macro trends with quantitative backing.\n"
            "- Market Forces Matrix: Catalog of drivers, restraints, bottlenecks, and catalysts.\n"
            "- Competitive Landscape & Moats: Analysis of incumbent defenses vs. insurgent disruptions.\n"
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
            f"Transform the market analysis into an executive-level intelligence report on '{topic}'.\n\n"
            "Formatting & Tone Guidelines:\n"
            "1. Audience: C-suite executives, Board Members, VCs, and Principal Engineers.\n"
            "2. Tone: Objective, authoritative, strategic, concise, and deeply actionable.\n"
            "3. Required Markdown Sections:\n"
            "   - # Executive Intelligence Briefing: [Compelling Subtitle]\n"
            "   - **Metadata Header**: Topic, Date, Classification Level, Analytical Confidence.\n"
            "   - ## Executive Summary (High-impact 2-3 paragraph synthesis delivering the bottom line up front).\n"
            "   - ## Key Quantitative Benchmarks (KPI cards / Markdown table comparing metrics, growth, and timeline).\n"
            "   - ## Core Strategic Themes & Market Dynamics (Detailed breakdown with crisp bullet points).\n"
            "   - ## Competitive Landscape & Industry Implications (Winners, losers, and defensibility).\n"
            "   - ## Risk Matrix & Headwinds (Categorized barriers and mitigation strategies).\n"
            "   - ## Strategic Recommendations & Roadmap (30-60-90 day advisory takeaways).\n"
            "   - ## Conclusion & Forward Outlook (Forward-looking summary statement).\n"
            "   - ## Verified Citations & Information Sources (Organized bibliography).\n"
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

    return research_task, analysis_task, report_task
