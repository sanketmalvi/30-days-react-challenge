import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-item";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favoritesList } = useContext(GlobalContext);

  if (!favoritesList.length)
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text font-[Playfair_Display]">
          ❤️ No Favorites Yet!
        </h2>
        <p className="text-lg text-gray-500 mb-6">
          You haven't added any recipes to your favorites.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full font-semibold transition"
        >
          Explore Recipes
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text font-[Playfair_Display]">
        ❤️ Your Favorite Recipes
      </h1>

      <div className="flex flex-wrap justify-center gap-10">
        {favoritesList.map((item) => (
          <RecipeItem key={item.id} item={item} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/"
          className="inline-block underline text-red-500 hover:text-red-700 text-sm"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
