import { Link } from "react-router-dom";

export default function RecipeItem({ item }) {
  return (
    <div className="flex flex-col w-80 p-5 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200 hover:scale-105 hover:shadow-2xl duration-300 transition-transform">
      <div className="h-48 overflow-hidden rounded-xl mb-4">
        <img
          src={item?.image_url}
          alt={item?.title}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-sm text-red-500 font-semibold mb-1">
        {item?.publisher}
      </span>
      <h3 className="font-semibold text-xl text-gray-800 line-clamp-2 mb-4">
        {item?.title}
      </h3>
      <Link
        to={`/recipe-item/${item?.id}`}
        className="bg-red-600 text-white py-2 rounded-lg text-center text-sm font-medium tracking-wide hover:bg-red-700 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
