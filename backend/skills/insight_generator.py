import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "placeholder"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

def generate_insights(query: str, data: list) -> list:
    """
    Generates bullet-point insights from query results.
    """
    if not data or (len(data) == 1 and "error" in data[0]):
        return ["No valid data to generate insights from."]

    # Limit data size to avoid token limit issues
    sample_data = data[:100]

    prompt = f"""
    You are an expert Data Analyst.
    The user asked: "{query}"
    Here is the resulting data (or a sample of it): {sample_data}
    
    Generate 3-5 concise, bullet-point insights based on this data.
    Do not use introductory or concluding phrases, just return the bullet points.
    Each bullet point should start with a '-'.
    """

    try:
        response = client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        content = response.choices[0].message.content.strip()
        # Parse bullet points
        lines = [line.strip().lstrip('- ').lstrip('* ') for line in content.split('\n') if line.strip()]
        return lines
    except Exception as e:
        print(f"Error generating insights: {e}")
        return ["Could not generate insights."]
