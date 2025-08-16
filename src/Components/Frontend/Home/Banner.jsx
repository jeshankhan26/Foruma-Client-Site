// Banner.jsx
import { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import SearchResults from "./SearchResults"; // 👈 create this component

const Banner = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const res = await axios.get(`http://localhost:3000/search-posts?tag=${search.trim()}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <>
      <div className="bg-[url('https://i.ibb.co/kg0Z7hdm/Search-Bar-Facebook-Post.png')] bg-cover bg-center h-[400px] md:h-[500px] flex flex-col justify-center items-center px-4 relative text-white overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm z-0"></div>

        <div className="z-10 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            Discover What You’re Looking For
          </h1>
          <p className="text-lg md:text-xl text-gray-200 drop-shadow-sm">
            Search posts by tag and find what matters to you most.
          </p>

          <div className="flex gap-2 w-full max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search by tag..."
              className="w-full border-1 border-blue-400 rounded-lg px-5 py-3 text-black text-sm md:text-base shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 transition-transform transform hover:scale-105 flex items-center justify-center"
              onClick={handleSearch}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 🎯 Show results below the banner */}
      {results.length > 0 && <SearchResults results={results} />}
    </>
  );
};

export default Banner;
