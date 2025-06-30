import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Navbar() {
  const { searchParam, setSearchParam, handleSubmit } = useContext(GlobalContext);

  const activeClass =
    "text-red-600 font-semibold underline underline-offset-4 duration-300";

  return (
    <nav className="flex flex-col lg:flex-row justify-between items-center py-8 container mx-auto gap-5 lg:gap-0">
      <h2 className="text-3xl font-bold text-red-600">
        <NavLink to="/">FoodRecipe</NavLink>
      </h2>
      <form onSubmit={handleSubmit} className="w-full lg:w-auto">
        <input
          type="text"
          name="search"
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          placeholder="Search recipes..."
          className="bg-white p-3 px-6 rounded-full outline-none w-full lg:w-96 shadow focus:shadow-lg"
        />
      </form>
      <ul className="flex gap-6 text-lg">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeClass : "hover:text-red-600 duration-300")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? activeClass : "hover:text-red-600 duration-300")}
          >
            Favorites
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
