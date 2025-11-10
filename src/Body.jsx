import React from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Body() {
  const [ingredients, setIngredients] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);

//   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// // Replace this safely
//   const genAI = new GoogleGenerativeAI(API_KEY);

  function SubmitForm(formData) {
    const newingredient = formData.get("ingredient").trim().toLowerCase();
    if (!newingredient) return;

    const repetition = ingredients.some(
      (another) => another === newingredient
    );

    if (repetition) {
      setErrorMessage(`${newingredient} already exists in your list`);
    } else {
      setIngredients((prev) => [...prev, newingredient]);
      setErrorMessage(`${newingredient} added to your list`);
    }
  }

  function Remove(index) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  async function generateRecipe() {
  setLoading(true);
  setRecipe("");

  try {
    const response = await fetch("https://xandre-backend-production.up.railway.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) throw new Error("Failed to generate recipe");

    const data = await response.json();
    setRecipe(data.recipe);
  } catch (error) {
    console.error("Error generating recipe:", error);
    setRecipe("Something went wrong while generating the recipe.");
  } finally {
    setLoading(false);
  }
}

  const IngredientsList = ingredients.map((ingredient, index) => (
    <li key={index}>
      {ingredient}{" "}
      <button onClick={() => Remove(index)}>remove</button>
    </li>
  ));

  return (
    <main>
      <form
       action={SubmitForm}
        className="addIngredientForm"
      >
        <input
          aria-label="add ingredient"
          type="text"
          placeholder="e.g. oil"
          name="ingredient"
        />
        <button>+ Add Ingredient</button>
      </form>

      {errorMessage && <i>{errorMessage}</i>}

      {ingredients.length ? (
        <section>
          <h2>Ingredients on hand:</h2>
          <ul>{IngredientsList}</ul>

          {ingredients.length >= 4 && (
            <div className="get-recipe-container">
              <h3>Ready For Some Recipe?</h3>
              <p>Generate a recipe from your list of ingredients</p>
              <button onClick={generateRecipe} disabled={loading}>
                {loading ? "Generating..." : "Get a recipe"}
              </button>
            </div>
          )}
        </section>
      ) : (
        <h3>Input at least four ingredients...</h3>
      )}

      {recipe && (
        <div style={{ marginTop: "20px" }}>
          <h2>Suggested Recipes:</h2>
          <pre>{recipe}</pre>
        </div>
      )}
    </main>
  );
}
