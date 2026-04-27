import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "placeholder"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

def generate_sql(query: str, schema: dict) -> str:
    """
    Converts a natural language query into a SQL query based on the schema.
    The dataset table is named 'dataset'.
    """
    prompt = f"""
    You are an expert Data Analyst and SQL developer.
    You have a table named 'dataset' with the following schema:
    {schema}
    
    User Query: "{query}"
    
    Generate a valid SQLite query to answer the user's question.
    Only return the SQL query, nothing else. No markdown formatting.
    """
    
    try:
        response = client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=[
                {"role": "system", "content": "You are a helpful data assistant that outputs raw SQL."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )
        sql_query = response.choices[0].message.content.strip()
        # Remove markdown if accidentally added
        if sql_query.startswith("```sql"):
            sql_query = sql_query.replace("```sql\n", "").replace("\n```", "")
        return sql_query
    except Exception as e:
        print(f"Error generating SQL: {e}")
        return ""
