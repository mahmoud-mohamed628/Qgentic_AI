import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API endpoint to execute the 3-agent research synthesis
app.post('/api/crew/run', async (req, res) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'A research topic is required.' });
  }

  const cleanTopic = topic.trim();

  // If Gemini is available, generate real AI agent research
  if (ai) {
    try {
      const prompt = `You are orchestrating a sequential 3-agent autonomous intelligence crew:
1. Senior Web Researcher (finds real facts, verified statistics, recent market developments, citations)
2. Lead Market Analyst (filters noise, extracts CAGR, market sizing, key drivers, bottlenecks, risks)
3. Executive Editor (composes a C-suite executive briefing in clean Markdown)

Target Topic: "${cleanTopic}"

Please generate the final output from Agent 3 (The Executive Editor) in comprehensive, executive-level Markdown.
Include:
# Executive Intelligence Briefing: [Compelling Strategic Subtitle]
**Metadata Header**: Topic: ${cleanTopic} | Analytical Confidence: High | Classification: Strategic Briefing
## 1. Executive Summary (Bottom line up front, 2-3 structured paragraphs)
## 2. Key Quantitative Benchmarks & Market Metrics (Include a clear Markdown table with Metrics, Current Benchmark, 2026-2030 Projections, and Impact)
## 3. Core Strategic Drivers & Market Dynamics (Bulleted high-signal analysis)
## 4. Competitive Landscape & Defensible Moats (Incumbents vs Disrupters)
## 5. Strategic Risk Matrix & Operational Headwinds (Likelihood, Severity, Mitigation)
## 6. Strategic Recommendations & Roadmap (30-60-90 day horizon)
## 7. Conclusion & Strategic Horizon
## 8. Primary Sources & Citations (Organized list of authoritative industry sources)

Ensure the tone is objective, authoritative, dense with data, and free of vague filler.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const reportText = response.text || '';
      return res.json({
        success: true,
        report: reportText,
        source: 'gemini-live',
      });
    } catch (err: any) {
      console.warn('Gemini generation warning, falling back to simulated generation:', err?.message);
    }
  }

  // Graceful fallback if no API key or network error
  return res.json({
    success: true,
    report: null,
    source: 'client-synthesizer',
  });
});

// Setup Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Autonomous AI Research Studio running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
});
