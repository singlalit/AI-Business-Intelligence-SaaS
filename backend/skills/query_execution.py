import pandas as pd
import sqlite3

def execute_query(file_path: str, sql_query: str) -> list:
    """
    Executes a SQL query against the dataset.
    """
    try:
        # Load the dataset
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx') or file_path.endswith('.xls'):
            df = pd.read_excel(file_path)
        else:
            raise ValueError("Unsupported file format")

        # Clean column names (replace spaces with underscores, etc)
        df.columns = [c.replace(' ', '_') for c in df.columns]

        # Create an in-memory SQLite database
        conn = sqlite3.connect(':memory:')
        
        # Write the dataframe to a table named 'dataset'
        df.to_sql('dataset', conn, index=False, if_exists='replace')

        # Execute the query
        result_df = pd.read_sql_query(sql_query, conn)
        
        # Convert to dictionary (records)
        return result_df.to_dict(orient='records')
        
    except Exception as e:
        print(f"Error executing query: {e}")
        return [{"error": str(e)}]
