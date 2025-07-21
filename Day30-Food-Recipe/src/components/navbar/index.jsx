import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../context";
import { FaSearch, FaHeart, FaHome } from "react-icons/fa";

export default function Navbar() {
  const { searchParam, setSearchParam, handleSubmit } = useContext(GlobalContext);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Logo */}
      <Link to="/" className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 flex items-center gap-2">
        <span className="text-black">🍽️</span>
         Foodie<span className="text-xl hidden sm:inline">Hub</span>
      </Link>


      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 w-full md:max-w-lg"
      >
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full w-full">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:opacity-90 text-sm font-semibold transition-all duration-200"
        >
          Search
        </button>
      </form>

      {/* Nav Links */}
      <div className="flex items-center gap-4 text-gray-700 font-medium">
        <Link
          to="/"
          className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all ${
            location.pathname === "/"
              ? "bg-red-100 text-red-600 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <FaHome />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <Link
          to="/favorites"
          className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all ${
            location.pathname === "/favorites"
              ? "bg-pink-100 text-pink-600 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <FaHeart />
          <span className="hidden sm:inline">Favorites</span>
        </Link>
      </div>
    </nav>
  );
}
