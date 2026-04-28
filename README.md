# InsightAI - Business Intelligence SaaS Platform

InsightAI is a production-grade AI-powered Business Intelligence SaaS platform that allows users to upload datasets and perform complex data analysis using natural language. Built with a modular AI Skills architecture inspired by the Model Context Protocol (MCP), it seamlessly orchestrates tasks like natural language to SQL translation, query execution, data visualization, and actionable insights generation.

## 🚀 Features

- **Natural Language Data Analysis**: Ask questions about your data in plain English and get instant answers.
- **Automated Data Visualizations**: Automatically generates appropriate charts (Bar, Line, Pie, etc.) using Recharts based on the queried data.
- **AI Skills Orchestration**: Modular backend architecture utilizing specific AI skills:
  - **Schema Analyzer**: Automatically understands and maps the structure of uploaded datasets.
  - **NL-to-SQL**: Converts natural language queries into accurate SQL statements.
  - **Query Execution**: Executes the generated SQL against the dataset safely.
  - **Visualization Config**: Determines the best way to visualize the returned data.
  - **Insight Generator**: Generates human-readable insights and summaries from the data.
  - **Prediction**: Offers basic predictive analysis based on data trends.
- **Secure User Authentication**: Complete registration and login system with JWT-based authentication.
- **Modern & Responsive UI**: Built with React, Tailwind CSS, Framer Motion, and Glassmorphism aesthetics for a premium user experience.

## 🛠️ Technology Stack

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS v4** for styling
- **Recharts** for dynamic data visualization
- **Framer Motion** for smooth, cinematic animations
- **Lucide React** for beautiful icons
- **Axios** for API communication

### Backend
- **FastAPI** for high-performance, asynchronous REST APIs
- **Python 3**
- **SQLAlchemy** for database ORM (SQLite by default)
- **Pandas** for internal data manipulation and query execution
- **JWT (JSON Web Tokens)** for secure authentication

## 📁 Project Structure

```
AI Business Intelligence SaaS/
│
├── backend/                  # FastAPI Application
│   ├── main.py               # Application entry point and API routes
│   ├── models.py             # SQLAlchemy database models
│   ├── database.py           # Database connection and session management
│   ├── auth.py               # Authentication and JWT utilities
│   ├── requirements.txt      # Python dependencies
│   └── skills/               # Modular AI Skills
│       ├── schema_analyzer.py
│       ├── nl_to_sql.py
│       └── ...
│
├── frontend/                 # React Application (Vite)
│   ├── index.html
│   ├── package.json          # Node dependencies
│   ├── vite.config.js
│   └── src/
│       ├── components/       # Reusable UI components (e.g., ChatInterface)
│       ├── App.jsx           # Main React component
│       ├── main.jsx          # React entry point
│       └── index.css         # Tailwind and global styles
│
└── README.md                 # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   python main.py
   # Or using uvicorn directly: uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## 📖 Usage

1. **Sign Up / Log In**: Create a new account or log in to your existing account.
2. **Upload Dataset**: Navigate to the upload section and upload your CSV dataset (e.g., `sample_sales.csv`). The Schema Analyzer will automatically process it.
3. **Ask Questions**: Go to the chat interface and start asking questions about your data (e.g., "What were the total sales last month?", "Show me a breakdown of revenue by product category").
4. **View Results**: The platform will display the executed SQL, data tables, beautiful charts, and AI-generated insights.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.


