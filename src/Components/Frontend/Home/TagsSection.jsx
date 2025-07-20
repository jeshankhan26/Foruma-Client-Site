import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';

const TagsSection = ({ onTagClick }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('https://foruma-server-site.vercel.app/tags');
        const data = await res.json();

        if (Array.isArray(data)) {
          setTags(data);
        } else if (Array.isArray(data.tags)) {
          setTags(data.tags);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (err) {
        console.error("Failed to load tags from JSON", err);
      }
    };
    fetchTags();
  }, []);

  if (!tags.length) return null;

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl border border-indigo-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Tag className="text-indigo-600 animate-pulse" size={24} />
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            🔖 Explore Popular Tags
          </h2>
        </div>

        <p className="mb-6 text-gray-600 text-base">
          Click on a tag below to explore relevant posts easily.
        </p>

        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => onTagClick(tag.tag)}
              className="px-4 py-2 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
            >
              #{tag.tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsSection;
