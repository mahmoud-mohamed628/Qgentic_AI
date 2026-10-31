import os
from typing import Dict, Any
from dotenv import load_dotenv
from crewai import Crew, Process

from agents import GEMINI_KEYS, initialize_research_agents, get_gemini_keys
from tasks import initialize_research_tasks

load_dotenv()

class AutonomousResearchCrew:
    def __init__(
        self,
        model_name: str = "gemini/gemini-3.5-flash",
        temperature: float = 0.2,
        verbose: bool = True
    ):
        self.model_name = model_name
        self.temperature = temperature
        self.verbose = verbose
        self._validate_credentials()

    def _validate_credentials(self) -> None:
        missing = []
        gemini_keys = GEMINI_KEYS or get_gemini_keys()
        if not gemini_keys:
            missing.append("au moins une GEMINI_API_KEY_1 / GEMINI_API_KEY")
        if not os.getenv("TAVILY_API_KEY"):
            missing.append("TAVILY_API_KEY")

        if missing:
            raise ValueError(
                f"Missing required environment variable(s): {', '.join(missing)}. "
                "Please configure them in your .env file before executing."
            )

    def kickoff(self, topic: str) -> str:
        clean_topic = topic.strip()
        if not clean_topic:
            raise ValueError("Research topic cannot be empty.")

        researcher, analyst, editor = initialize_research_agents(
            model_name=self.model_name,
            temperature=self.temperature
        )

        research_task, analysis_task, report_task = initialize_research_tasks(
            researcher=researcher,
            analyst=analyst,
            editor=editor,
            topic=clean_topic
        )

        crew = Crew(
            agents=[researcher, analyst, editor],
            tasks=[research_task, analysis_task, report_task],
            process=Process.sequential,
            verbose=self.verbose,
            memory=False,
            max_rpm=30
        )

        inputs: Dict[str, Any] = {"topic": clean_topic}
        result = crew.kickoff(inputs=inputs)
        return str(result)

def run_research_crew(
    topic: str,
    model_name: str = "gemini/gemini-3.5-flash",
    temperature: float = 0.2,
    verbose: bool = True
) -> str:
    orchestrator = AutonomousResearchCrew(
        model_name=model_name,
        temperature=temperature,
        verbose=verbose
    )
    return orchestrator.kickoff(topic=topic)