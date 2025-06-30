import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-item";

export default function Home() {
  const { recipeList, loading } = useContext(GlobalContext);

  if (loading) return <div className="text-center py-20 text-xl">Loading... please wait.</div>;

  if (!recipeList.length)
    return (
      <p className="text-center py-20 text-2xl font-bold text-gray-500">
        Use the search box to find delicious recipes 🍳
      </p>
    );

  return (
    <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {recipeList.map((item) => (
        <RecipeItem key={item.id} item={item} />
      ))}
    </div>
  );
}