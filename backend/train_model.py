import pandas as pd
import joblib
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "recipes.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "recipe_model.joblib"


def train_model():
    df = pd.read_csv(DATA_PATH)

    df["text_input"] = (
        df["ingredients"].astype(str)
        + " "
        + df["preference"].astype(str)
    )

    X = df["text_input"]
    y = df["category"]

    model = Pipeline([
        ("tfidf", TfidfVectorizer()),
        ("classifier", LogisticRegression(max_iter=1000))
    ])

    model.fit(X, y)

    MODEL_DIR.mkdir(exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    print("Model trained successfully!")
    print(f"Model saved at: {MODEL_PATH}")


if __name__ == "__main__":
    train_model()