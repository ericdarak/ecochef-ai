from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from typing import List
import pandas as pd
import joblib


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "recipes.csv"
MODEL_PATH = BASE_DIR / "models" / "recipe_model.joblib"


app = FastAPI(
    title="EcoChef AI API",
    description="API for recipe recommendation and food waste risk estimation.",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Ingredient(BaseModel):
    name: str
    days_to_expire: int


class RecommendationRequest(BaseModel):
    ingredients: List[Ingredient]
    preference: str


def load_recipes():
    return pd.read_csv(DATA_PATH)


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Model file not found. Run train_model.py first."
        )

    return joblib.load(MODEL_PATH)


def calculate_waste_risk(ingredients: List[Ingredient]):
    lowest_days = min(item.days_to_expire for item in ingredients)

    if lowest_days <= 1:
        return "High"
    elif lowest_days <= 3:
        return "Medium"
    else:
        return "Low"


def get_urgent_ingredients(ingredients: List[Ingredient]):
    return [
        item.name
        for item in ingredients
        if item.days_to_expire <= 3
    ]


def recommend_recipes(user_ingredients, preference, predicted_category):
    df = load_recipes()

    user_ingredient_names = [
        ingredient.name.lower().strip()
        for ingredient in user_ingredients
    ]

    recommendations = []

    for _, row in df.iterrows():
        recipe_ingredients = str(row["ingredients"]).lower().split()

        matching_ingredients = set(user_ingredient_names).intersection(
            set(recipe_ingredients)
        )

        score = len(matching_ingredients)

        if row["preference"].lower() == preference.lower():
            score += 1

        if row["category"].lower() == predicted_category.lower():
            score += 1

        if score > 0:
            recommendations.append({
                "recipe_name": row["recipe_name"],
                "category": row["category"],
                "preference": row["preference"],
                "matching_ingredients": list(matching_ingredients),
                "estimated_co2_saved": float(row["estimated_co2_saved"]),
                "score": score
            })

    recommendations = sorted(
        recommendations,
        key=lambda item: item["score"],
        reverse=True
    )

    return recommendations[:3]


@app.get("/")
def home():
    return {
        "message": "EcoChef AI API is running."
    }


@app.post("/recommend")
def recommend(data: RecommendationRequest):
    model = load_model()

    ingredient_text = " ".join([
        item.name.lower().strip()
        for item in data.ingredients
    ])

    model_input = ingredient_text + " " + data.preference.lower()

    predicted_category = model.predict([model_input])[0]

    waste_risk = calculate_waste_risk(data.ingredients)
    urgent_ingredients = get_urgent_ingredients(data.ingredients)

    recipes = recommend_recipes(
        user_ingredients=data.ingredients,
        preference=data.preference,
        predicted_category=predicted_category
    )

    total_co2_saved = sum(recipe["estimated_co2_saved"] for recipe in recipes)

    return {
        "predicted_category": predicted_category,
        "waste_risk": waste_risk,
        "urgent_ingredients": urgent_ingredients,
        "recommended_recipes": recipes,
        "environmental_impact": {
            "estimated_co2_saved_kg": round(total_co2_saved, 2),
            "message": f"By using these ingredients, you may help avoid approximately {round(total_co2_saved, 2)} kg of CO2 equivalent."
        }
    }