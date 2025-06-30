import { Link } from "react-router-dom";

export default function RecipeItem({ item }) {
  return (
    <div className="flex flex-col w-80 p-5 bg-white shadow-xl rounded-2xl border hover:scale-105 duration-300">
      <div className="h-40 overflow-hidden rounded-xl mb-3">
        <img
          src={item?.image_url}
          alt={item?.title}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-sm text-red-500 font-medium">{item?.publisher}</span>
      <h3 className="font-semibold text-xl text-black truncate mb-4">
        {item?.title}
      </h3>
      <Link
        to={`/recipe-item/${item?.id}`}
        className="bg-red-600 text-white py-2 rounded-lg text-center text-sm font-medium tracking-wide hover:bg-red-700"
      >
        View Details
      </Link>
    </div>
  );
}