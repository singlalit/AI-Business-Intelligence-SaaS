import os
from openai import OpenAI
import json

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "placeholder"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

def generate_visualization_config(query: str, data: list) -> dict:
    """
    Determines the best chart type and configuration for Recharts.
    """
    if not data or (len(data) == 1 and "error" in data[0]):
        return {"type": "none"}
        
    sample_data = data[:5] # Send only a sample to save tokens
    keys = list(data[0].keys())

    prompt = f"""
    You are an expert Data Visualizer.
    The user asked: "{query}"
    The data has columns: {keys}
    Here is a sample of the data: {sample_data}
    
    Decide the best chart type to visualize this data using Recharts (React).
    Supported types: "line", "bar", "pie", "area", "composed", "scatter", "none" (if it's just a single number/text, return none).
    
    Provide a JSON configuration specifying:
    - type: the chart type
    - xAxisKey: the column name for the x-axis
    - yAxisKeys: a list of column names for the y-axis
    
    Output ONLY valid JSON, no markdown formatting.
    """

    try:
        response = client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content.replace("```json\n", "").replace("\n```", "")
        return json.loads(content)
    except Exception as e:
        print(f"Error generating visualization config: {e}")
        return {"type": "none"}
