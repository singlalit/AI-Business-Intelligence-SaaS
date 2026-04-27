import pandas as pd
import json

def analyze_schema(file_path: str) -> dict:
    """
    Reads a dataset and returns its schema and basic statistics.
    """
    try:
        # Determine file type
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx') or file_path.endswith('.xls'):
            df = pd.read_excel(file_path)
        else:
            raise ValueError("Unsupported file format")

        schema = {}
        for col in df.columns:
            dtype = str(df[col].dtype)
            sample_values = df[col].dropna().head(3).tolist()
            unique_count = df[col].nunique()
            
            # Simple typing
            col_type = "categorical"
            if "int" in dtype or "float" in dtype:
                col_type = "numeric"
            elif "datetime" in dtype:
                col_type = "date"
            else:
                # Try to infer date from strings
                try:
                    pd.to_datetime(df[col].dropna().head(10))
                    col_type = "date"
                except Exception:
                    col_type = "categorical"

            schema[col] = {
                "type": col_type,
                "pandas_dtype": dtype,
                "sample_values": sample_values,
                "unique_values": unique_count
            }
        
        return {
            "columns": schema,
            "row_count": len(df),
            "column_count": len(df.columns)
        }
    except Exception as e:
        return {"error": str(e)}
