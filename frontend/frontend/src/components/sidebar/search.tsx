import { FiCornerDownLeft, FiSearch } from "react-icons/fi";

const Search = () => {
  return (
    <>
    <div className="bg-stone-200 mb-4 relative rounded-xl flex items-center px-2 py-1.5 text-sm">
        <FiSearch className="mr-2" />
        <input
          type="text"
          placeholder="Search for Ticker"
          className="w-full bg-transparent placeholder:text-stone-400 focus:outline-none"
        />

        <span className="p-1 text-xs flex gap-0.5 items-center shadow bg-stone-50 rounded absolute right-2.5 top-1/2 -translate-y-1/2">
            <FiCornerDownLeft />
        </span>
    </div>
    </>
  );
};

export default Search;
