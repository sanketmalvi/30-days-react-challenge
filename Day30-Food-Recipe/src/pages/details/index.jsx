import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";
import { motion, AnimatePresence } from "framer-motion";


export default function Details() {
  const { id } = useParams();
  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
  } = useContext(GlobalContext);

  const [adjustedServings, setAdjustedServings] = useState(null);

  useEffect(() => {
    async function getRecipeDetails() {
      try {
        const response = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        );
        const data = await response.json();
        if (data?.data?.recipe) {
          setRecipeDetailsData(data.data);
          setAdjustedServings(data.data.recipe.servings);
        }
      } catch (e) {
        console.error(e);
      }
    }
    getRecipeDetails();
  }, [id, setRecipeDetailsData]);

  if (!recipeDetailsData)
    return <p className="text-center py-20 text-xl">Loading recipe...</p>;

  const recipe = recipeDetailsData.recipe;
  const isFav = favoritesList.some((item) => item.id === recipe.id);

  const handleServingsChange = (type) => {
    setAdjustedServings((prev) => {
      if (type === "decrease" && prev > 1) return prev - 1;
      if (type === "increase") return prev + 1;
      return prev;
    });
  };

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-gray-50 px-6 rounded-2xl shadow-lg">
      {/* Image */}
      <div>
        <div className="h-96 overflow-hidden rounded-2xl group shadow-md">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 duration-300"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        {/* Title and Publisher */}
        <div>
          <span className="text-sm text-red-500 font-medium">{recipe.publisher}</span>
          <h3 className="font-bold text-3xl text-gray-800 mt-2">{recipe.title}</h3>
        </div>

        {/* Cooking Time & Servings */}
        <div className="flex gap-6 text-gray-700 font-medium items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏱️</span>
            <p>{recipe.cooking_time} mins</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <p>{adjustedServings} servings</p>
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => handleServingsChange("decrease")}
                className="bg-gray-300 px-2 rounded hover:bg-gray-400 text-lg"
              >
                -
              </button>
              <button
                onClick={() => handleServingsChange("increase")}
                className="bg-gray-300 px-2 rounded hover:bg-gray-400 text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Favorites Button */}
        <button
          onClick={() => handleAddToFavorite(recipe)}
          className={`py-3 px-6 rounded-lg text-sm font-semibold tracking-wide w-fit ${
            isFav ? "bg-gray-700 text-white" : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isFav ? "❤️ Remove from Favorites" : "➕ Add to Favorites"}
        </button>

        {/* Ingredients */}
        <div>
          <h4 className="text-xl font-bold mb-4">🧾 Ingredients</h4>
          <AnimatePresence mode="popLayout">
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients.map((ing, idx) => {
                const adjustedQty =
                  ing.quantity && recipe.servings
                    ? ((ing.quantity / recipe.servings) * adjustedServings).toFixed(2)
                    : "-";

                return (
                  <motion.li
                    key={`${ing.description}-${ing.unit}-${idx}`} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-700"
                  >
                    <span className="font-semibold">
                      {adjustedQty} {ing.unit}
                    </span>{" "}
                    {ing.description}
                  </motion.li>
                );
              })}

            </ul>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
