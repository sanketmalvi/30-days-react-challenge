import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-item";

export default function Favorites() {
  const { favoritesList } = useContext(GlobalContext);

  if (!favoritesList.length)
    return (
      <p className="text-center py-20 text-2xl font-bold text-gray-500">
        Your favorites list is empty.
      </p>
    );

  return (
    <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {favoritesList.map((item) => (
        <RecipeItem key={item.id} item={item} />
      ))}
    </div>
  );
}
