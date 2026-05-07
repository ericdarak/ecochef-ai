import { useState } from "react";
import "./App.css";

function App() {
  const [ingredients, setIngredients] = useState([
    { name: "", days_to_expire: "" },
  ]);

  const [preference, setPreference] = useState("quick");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  function handleIngredientChange(index, field, value) {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  }

  function addIngredient() {
    setIngredients([
      ...ingredients,
      { name: "", days_to_expire: "" },
    ]);
  }

  function removeIngredient(index) {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedIngredients = ingredients
      .filter((item) => item.name.trim() !== "")
      .map((item) => ({
        name: item.name.trim(),
        days_to_expire: Number(item.days_to_expire),
      }));

    if (cleanedIngredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${apiUrl}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ingredients: cleanedIngredients,
          preference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendation.");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Check if the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="tag">AI-powered food waste assistant</p>
          <h1>EcoChef AI</h1>
          <p className="subtitle">
            Turn ingredients you already have at home into smart recipe
            suggestions while reducing food waste.
          </p>
        </div>
      </section>

      <section className="content">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Your ingredients</h2>
          <p className="muted">
            Add the ingredients you have and how many days are left before they
            expire.
          </p>

          {ingredients.map((ingredient, index) => (
            <div className="ingredient-row" key={index}>
              <input
                type="text"
                placeholder="Ingredient, e.g. tomato"
                value={ingredient.name}
                onChange={(event) =>
                  handleIngredientChange(index, "name", event.target.value)
                }
              />

              <input
                type="number"
                placeholder="Days"
                min="0"
                value={ingredient.days_to_expire}
                onChange={(event) =>
                  handleIngredientChange(
                    index,
                    "days_to_expire",
                    event.target.value
                  )
                }
              />

              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeIngredient(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" className="secondary-button" onClick={addIngredient}>
            + Add ingredient
          </button>

          <label className="label">Preference</label>

          <select
            value={preference}
            onChange={(event) => setPreference(event.target.value)}
          >
            <option value="quick">Quick</option>
            <option value="healthy">Healthy</option>
            <option value="cheap">Cheap</option>
            <option value="vegetarian">Vegetarian</option>
          </select>

          <button className="primary-button" type="submit">
            {loading ? "Generating..." : "Generate recommendations"}
          </button>
        </form>

        <section className="card result-card">
          <h2>AI results</h2>

          {!result && (
            <p className="muted">
              Your recipe recommendations will appear here.
            </p>
          )}

          {result && (
            <div className="results">
              <div className="result-grid">
                <div className="metric">
                  <span>Predicted category</span>
                  <strong>{result.predicted_category}</strong>
                </div>

                <div className="metric">
                  <span>Waste risk</span>
                  <strong className={`risk ${result.waste_risk.toLowerCase()}`}>
                    {result.waste_risk}
                  </strong>
                </div>

                <div className="metric">
                  <span>Estimated impact</span>
                  <strong>
                    {result.environmental_impact.estimated_co2_saved_kg} kg CO₂e
                  </strong>
                </div>
              </div>

              <div>
                <h3>Urgent ingredients</h3>

                {result.urgent_ingredients.length > 0 ? (
                  <div className="chips">
                    {result.urgent_ingredients.map((item) => (
                      <span className="chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="muted">
                    No urgent ingredients. Your food waste risk is low.
                  </p>
                )}
              </div>

              <div>
                <h3>Recommended recipes</h3>

                <div className="recipe-list">
                  {result.recommended_recipes.map((recipe) => (
                    <article className="recipe-card" key={recipe.recipe_name}>
                      <h4>{recipe.recipe_name}</h4>
                      <p>
                        Category: <strong>{recipe.category}</strong>
                      </p>
                      <p>
                        Preference: <strong>{recipe.preference}</strong>
                      </p>

                      <p>
                        Matching ingredients:{" "}
                        {recipe.matching_ingredients.length > 0
                          ? recipe.matching_ingredients.join(", ")
                          : "No direct match"}
                      </p>

                      <p>
                        Estimated CO₂ saved:{" "}
                        <strong>{recipe.estimated_co2_saved} kg CO₂e</strong>
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <p className="impact-message">
                {result.environmental_impact.message}
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;