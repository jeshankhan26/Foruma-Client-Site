import { useEffect, useState } from 'react';
import { Bell, Megaphone } from 'lucide-react';
import axios from 'axios';

const AnnouncementSection = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('https://foruma-server-site.vercel.app/announcements');
        if (Array.isArray(res.data)) {
          const activeAnnouncements = res.data.filter(a => a.status === 1);
          setAnnouncements(activeAnnouncements);
        }
      } catch (err) {
        console.error("Failed to load announcements", err);
      }
    };
    fetchAnnouncements();
  }, []);

  if (!announcements.length) return null;

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl border border-blue-100 p-8 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-blue-600 animate-bounce" size={26} />
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">📢 Latest Announcements</h2>
          <span className="ml-auto text-sm font-semibold bg-blue-100 text-blue-700 px-4 py-1 rounded-full shadow-sm">
            {announcements.length} New
          </span>
        </div>
        <ul className="space-y-4">
          {announcements.map((item, i) => (
            <li
              key={i}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 px-6 py-4 rounded-xl shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Megaphone className="text-blue-500" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <span className="block text-xs text-gray-400 mt-2">
                    📅 {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnnouncementSection;
