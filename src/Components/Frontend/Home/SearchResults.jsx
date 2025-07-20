// SearchResults.jsx
const SearchResults = ({ results }) => {
  return (
   <div className="bg-white py-5">
     <div className="bg-gradient-to-br from-white to-blue-50 backdrop-blur-md text-black mt-16 px-6 py-12 rounded-t-[2.5rem] shadow-inner w-full max-w-7xl mx-auto animate-fade-in">
      <h2 className="text-4xl font-extrabold text-center text-blue-700 drop-shadow-sm mb-10">
        🔍 Search Results
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((post) => (
          <div
            key={post._id}
            className="p-6 bg-white rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <h3 className="text-xl font-bold text-blue-600">{post.title}</h3>
            <p className="text-sm text-gray-500 italic mt-1">#{post.tag}</p>
            <p className="mt-3 text-gray-700 text-sm">
              {post.description?.slice(0, 100)}...
            </p>
          </div>
        ))}
      </div>
    </div>
   </div>
  );
};

export default SearchResults;
