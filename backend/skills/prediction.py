import numpy as np
from sklearn.linear_model import LinearRegression

def generate_prediction(data: list, config: dict) -> dict:
    """
    Uses basic ML to predict future trends if the chart type is line/area and has numeric Y.
    """
    if not data or config.get("type") not in ["line", "area"]:
        return None

    y_keys = config.get("yAxisKeys", [])
    if not y_keys:
        return None

    y_key = y_keys[0] # Just predict the first series for simplicity
    
    try:
        # Extract y values
        y_values = [float(row[y_key]) for row in data if row.get(y_key) is not None]
        if len(y_values) < 5:
            return None # Not enough data
            
        x_values = np.arange(len(y_values)).reshape(-1, 1)
        y_values = np.array(y_values)

        model = LinearRegression()
        model.fit(x_values, y_values)

        # Predict next 3 points
        future_x = np.arange(len(y_values), len(y_values) + 3).reshape(-1, 1)
        predictions = model.predict(future_x)

        return {
            "target": y_key,
            "trend": "upward" if model.coef_[0] > 0 else "downward",
            "next_values": predictions.tolist(),
            "message": f"Based on linear regression, the {y_key} is trending {'upward' if model.coef_[0] > 0 else 'downward'}."
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return None
