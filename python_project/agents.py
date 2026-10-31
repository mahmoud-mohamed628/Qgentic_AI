import os
from itertools import cycle

import litellm
from dotenv import load_dotenv
from crewai import Agent, LLM
from crewai.tools import tool
from tavily import TavilyClient

load_dotenv()

_PLACEHOLDER_MARKERS = ("your-", "placeholder", "example", "changeme", "replace-me")


def get_gemini_keys():
    keys = [
        os.getenv("GEMINI_API_KEY_1"),
        os.getenv("GEMINI_API_KEY_2"),
        os.getenv("GEMINI_API_KEY_3"),
        os.getenv("GEMINI_API_KEY"),
    ]
    return [key.strip() for key in keys if key and key.strip()
            and not key.strip().lower().startswith(_PLACEHOLDER_MARKERS)]


GEMINI_KEYS = get_gemini_keys()
_key_iterator = None


def _is_rate_limit_error(error: Exception) -> bool:
    status_code = getattr(error, "status_code", None)
    response = getattr(error, "response", None)
    if status_code == 429 or getattr(response, "status_code", None) == 429:
        return True
    return "429" in str(error) or "RESOURCE_EXHAUSTED" in str(error).upper()


_original_litellm_completion = getattr(litellm, "completion", None)
if _original_litellm_completion is not None and not getattr(_original_litellm_completion, "_gemini_key_fallback", False):
    def gemini_key_fallback_completion(*args, **kwargs):
        if not GEMINI_KEYS:
            return _original_litellm_completion(*args, **kwargs)

        requested_key = kwargs.get("api_key")
        keys = [requested_key] if requested_key in GEMINI_KEYS else []
        keys.extend(key for key in GEMINI_KEYS if key not in keys)

        last_error = None
        for key in keys:
            call_kwargs = dict(kwargs)
            call_kwargs["api_key"] = key
            os.environ["GEMINI_API_KEY"] = key
            try:
                return _original_litellm_completion(*args, **call_kwargs)
            except Exception as error:
                last_error = error
                if not _is_rate_limit_error(error):
                    raise

        raise last_error

    gemini_key_fallback_completion._gemini_key_fallback = True
    litellm.completion = gemini_key_fallback_completion

_key_iterator = None

@tool("Tavily Web Search Tool")
def tavily_search_tool(query: str) -> str:
    """
    Scours the live web using Tavily API to find verified facts, recent statistics,
    market sizing, CAGR, and authoritative citations for a given search query.
    """
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise ValueError("Missing TAVILY_API_KEY in environment variables.")
    client = TavilyClient(api_key=api_key)
    response = client.search(query=query, search_depth="advanced", max_results=5)
    return str(response)

def get_llm(model_name: str = "gemini/gemini-3.5-flash", temperature: float = 0.2) -> LLM:
    global _key_iterator
    keys = get_gemini_keys()
    if not keys:
        raise ValueError("Aucune clé GEMINI_API_KEY valide trouvée dans le fichier .env.")
    
    if _key_iterator is None:
        _key_iterator = cycle(keys)
    
    # Sélectionne la clé suivante de façon tournante
    selected_key = next(_key_iterator)
    
    return LLM(
        model=model_name,
        temperature=temperature,
        api_key=selected_key
    )

def create_senior_web_researcher(llm: LLM) -> Agent:
    return Agent(
        role="Senior Web Researcher",
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
        tools=[tavily_search_tool],
        llm=llm,
        verbose=True,
        memory=False,
        allow_delegation=False,
        max_iter=2
    )

def create_lead_market_analyst(llm: LLM) -> Agent:
    return Agent(
        role="Lead Market Analyst",
        goal=(
            "Distill unstructured research intelligence on '{topic}' into high-signal strategic insights. "
            "Filter out irrelevant noise, organize key catalysts, map competitive market dynamics, "
            "categorize risks and headwinds, and quantify business implications with extreme precision."
        ),
        backstory=(
            "You are a seasoned principal strategy consultant and Wall Street technology analyst with 15+ years "
            "evaluating disruptive markets and business models. You excel at taking massive, messy dumps of raw "
            "information and isolating the underlying economic engines, systemic trends, and second-order impacts. "
            "Your peers admire your skepticism, analytical rigor, and ability to separate temporary hype "
            "from durable competitive moats. You operate purely on verified evidence without making unsubstantiated claims."
        ),
        tools=[],
        llm=llm,
        verbose=True,
        memory=False,
        allow_delegation=False,
        max_iter=2
    )

def create_executive_editor(llm: LLM) -> Agent:
    return Agent(
        role="Executive Editor",
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
        tools=[],
        llm=llm,
        verbose=True,
        memory=False,
        allow_delegation=False,
        max_iter=2
    )

def initialize_research_agents(model_name: str = "gemini/gemini-3.5-flash", temperature: float = 0.2):
    researcher = create_senior_web_researcher(llm=get_llm(model_name=model_name, temperature=temperature))
    analyst = create_lead_market_analyst(llm=get_llm(model_name=model_name, temperature=temperature))
    editor = create_executive_editor(llm=get_llm(model_name=model_name, temperature=temperature))
    return researcher, analyst, editor