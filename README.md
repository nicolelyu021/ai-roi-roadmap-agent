# AI ROI & Roadmap Agent

A strategic planning tool powered by **Google Gemini** that helps organizations capture AI use cases, calculate rigorous financial metrics (ROI, NPV), optimize portfolios based on effort vs. value, and auto-generate a professional execution roadmap canvas.

## 🚀 Features

*   **Structured Capture:** Guided wizard to interview stakeholders for AI use cases (Problem, KPI, Costs, Benefits).
*   **Financial Rigor:** Auto-calculates **ROI**, **Net Present Value (NPV @ 10%)**, and **Payback Period** based on low/high estimates.
*   **Portfolio Optimization:** Logic-based selection engine that prioritizes high-value/low-effort wins while adhering to resource constraints.
*   **Intelligent Roadmap:** Automatically maps use cases to **Q1 (Quick Wins)**, **1-Year (Core)**, or **3-Year (Transformational)** timelines based on risk and dependencies.
*   **AI Strategy Agent:** Uses **Google Gemini 2.5 Flash** to analyze the portfolio and generate strategic focus, risk mitigations, and organizational requirements.
*   **Export Ready:** Generates a printable PDF Strategy Canvas and JSON export.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **AI:** Google GenAI SDK (`@google/genai`) - Gemini 2.5 Flash
*   **Icons:** Lucide React
*   **Utilities:** `html2pdf.js` for report generation

## ⚡ Quick Start

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set your Google Gemini API Key in your environment variables.
4.  Run the application:
    ```bash
    npm start
    ```

## 🧠 How it Works

1.  **Context:** Input your business objective, industry, and constraints.
2.  **Interview:** Add at least 5 potential AI use cases.
3.  **Compute:** The agent normalizes estimates and calculates financial scores.
4.  **Visualize:** The agent selects the optimal portfolio and draws the roadmap.

---

*Designed for Solution Architects, CTOs, and Innovation Strategists.*