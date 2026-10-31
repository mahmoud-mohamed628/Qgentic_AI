import os
import time
import streamlit as st
from dotenv import load_dotenv

from crew import run_research_crew
from agents import get_gemini_keys

load_dotenv()

st.set_page_config(
    page_title="Autonomous AI Research Crew | Multi-Agent Intelligence",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    .main-header { font-size: 2.25rem; font-weight: 700; color: #1E293B; margin-bottom: 0.25rem; }
    .sub-header { font-size: 1.05rem; color: #64748B; margin-bottom: 1.5rem; }
    .agent-card { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
    .agent-title { font-weight: 600; color: #0F172A; font-size: 0.95rem; }
    .agent-desc { color: #475569; font-size: 0.82rem; margin-top: 4px; }
    .stDownloadButton > button { background-color: #2563EB; color: white; font-weight: 600; border-radius: 6px; padding: 0.5rem 1rem; }
</style>
""", unsafe_allow_html=True)

with st.sidebar:
    st.image(
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
        caption="Autonomous Multi-Agent Swarm",
        use_container_width=True
    )
    st.title("Crew Configuration")

    gemini_keys = get_gemini_keys()
    tavily_key = os.getenv("TAVILY_API_KEY", "")

    has_gemini = len(gemini_keys) > 0
    has_tavily = bool(tavily_key and not tavily_key.lower().startswith(("tvly-your-", "your-", "placeholder", "example", "changeme", "replace-me")))

    st.subheader("Credential Status")
    col1, col2 = st.columns(2)
    with col1:
        if has_gemini:
            st.success(f"Gemini: {len(gemini_keys)} Keys", icon="✅")
        else:
            st.error("Gemini: Missing", icon="⚠️")
    with col2:
        if has_tavily:
            st.success("Tavily: Connected", icon="✅")
        else:
            st.error("Tavily: Missing", icon="⚠️")

    if not (has_gemini and has_tavily):
        st.warning("Veuillez configurer `GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3` et `TAVILY_API_KEY` dans le fichier `.env`.")

    st.divider()

    st.subheader("Model Parameters")
    selected_model = st.selectbox(
        "LLM Backbone",
        options=["gemini/gemini-3.5-flash", "gemini/gemini-2.0-flash"],
        index=0
    )

    temperature = st.slider("Temperature", min_value=0.0, max_value=1.0, value=0.2, step=0.05)
    verbose_logging = st.checkbox("Verbose Terminal Logging", value=True)

st.markdown('<div class="main-header">Autonomous AI Research Crew</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Deploy a specialized 3-agent autonomous team with API key rotation.</div>', unsafe_allow_html=True)

user_topic = st.text_area(
    "Enter Research Topic or Strategic Query:",
    value=st.session_state.get("topic_input", ""),
    placeholder="e.g. Market trend analysis...",
    height=110
)

col_run, col_clear = st.columns([1, 5])
with col_run:
    run_button = st.button("🚀 Launch Autonomous Crew", type="primary", use_container_width=True)
with col_clear:
    if st.button("Reset"):
        st.session_state["topic_input"] = ""
        st.session_state["latest_report"] = None
        st.rerun()

if run_button:
    if not user_topic.strip():
        st.error("Please enter a research topic before launching the crew.", icon="⚠️")
    elif not has_gemini or not has_tavily:
        st.error("Missing required API keys in `.env` file.", icon="🚨")
    else:
        status_box = st.status("🤖 Assembling Autonomous Research Crew...", expanded=True)
        try:
            start_time = time.time()
            status_box.write("🕵️ **Senior Web Researcher** searching live web via Tavily...")
            status_box.write("📊 **Lead Market Analyst** structuring analytical models...")
            status_box.write("🖋️ **Executive Editor** composing final C-suite report...")

            report_markdown = run_research_crew(
                topic=user_topic.strip(),
                model_name=selected_model,
                temperature=temperature,
                verbose=verbose_logging
            )

            elapsed_time = round(time.time() - start_time, 2)
            status_box.update(label=f"✅ Completed in {elapsed_time}s!", state="complete", expanded=False)
            st.session_state["latest_report"] = report_markdown

        except Exception as e:
            error_message = str(e).strip() or e.__class__.__name__
            status_box.write(f"**Error:** {error_message}")
            status_box.update(label="❌ Execution Failed", state="error", expanded=True)
            st.error(f"An error occurred during execution: {error_message}", icon="🚨")

if st.session_state.get("latest_report"):
    st.divider()
    st.subheader("📄 Executive Deliverable")
    st.markdown(st.session_state["latest_report"])
    st.divider()
    st.download_button(
        label="📥 Download Executive Report (.md)",
        data=st.session_state["latest_report"],
        file_name=f"Executive_Report_{int(time.time())}.md",
        mime="text/markdown"
    )