import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-item";

export default function Home() {
  const { recipeList, loading } = useContext(GlobalContext);

  if (loading)
    return (
      <div className="text-center py-32 text-2xl font-medium text-white">
        Loading... please wait.
      </div>
    );

  if (!recipeList.length)
    return (
      <p className="text-center py-32 text-3xl font-semibold text-white">
        No recipes found.
      </p>
    );

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-red-100 via-yellow-100 to-green-100">
      <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 font-[Playfair_Display] tracking-wide drop-shadow-sm">
        <span className="text-pink-500">🍲</span>{" "}
        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
          Delicious Recipes Just for You
        </span>
      </h1>

      <div className="container mx-auto flex flex-wrap justify-center gap-10">
        {recipeList.map((item) => (
          <RecipeItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
