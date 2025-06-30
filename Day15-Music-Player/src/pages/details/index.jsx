import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Details() {
  const { id } = useParams();
  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
  } = useContext(GlobalContext);

  useEffect(() => {
    async function getRecipeDetails() {
      try {
        const response = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        );
        const data = await response.json();
        if (data?.data) setRecipeDetailsData(data.data);
      } catch (e) {
        console.error(e);
      }
    }
    getRecipeDetails();
  }, [id, setRecipeDetailsData]);

  if (!recipeDetailsData)
    return <p className="text-center py-20 text-xl">Loading recipe...</p>;

  const isFav = favoritesList.some((item) => item.id === recipeDetailsData.recipe.id);

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="h-96 overflow-hidden rounded-xl group">
          <img
            src={recipeDetailsData.recipe.image_url}
            alt={recipeDetailsData.recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <span className="text-sm text-red-500 font-medium">
            {recipeDetailsData.recipe.publisher}
          </span>
          <h3 className="font-bold text-2xl text-black mt-2">
            {recipeDetailsData.recipe.title}
          </h3>
        </div>

        <button
          onClick={() => handleAddToFavorite(recipeDetailsData.recipe)}
          className={`py-3 rounded-lg text-sm font-semibold tracking-wide w-full lg:w-1/2 ${
            isFav ? "bg-gray-700 text-white" : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isFav ? "Remove from Favorites" : "Add to Favorites"}
        </button>

        <div>
          <h4 className="text-xl font-bold mb-3">Ingredients</h4>
          <ul className="list-disc list-inside space-y-2">
            {recipeDetailsData.recipe.ingredients.map((ing) => (
              <li key={ing.description} className="text-gray-700">
                <span className="font-semibold">
                  {ing.quantity || "-"} {ing.unit}
                </span>{" "}
                {ing.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}