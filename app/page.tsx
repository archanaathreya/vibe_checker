"use client";
import { useState } from "react";
import { getVibeSpots } from "./actions";

export default function VibeCheck() {
  const [vibe, setVibe] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  // 1. Request Location from Browser (Works on Mobile and Laptop)
  const handleLocate = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported by your browser.");
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        alert("Please enable location permissions in your browser settings.");
      }
    );
  };

  // 2. Trigger the AI Search
  async function handleSearch() {
    if (!vibe) return alert("Please enter a vibe first!");
    setLoading(true);
    
    // Pass coordinates (if available) to the Server Action
    const data = await getVibeSpots(vibe, location?.lat, location?.lng);
    setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900">🌍 VibeCheck</h1>
          <p className="text-gray-500 text-sm mt-1">Find your next favorite spot in seconds.</p>
        </div>

        <div className="space-y-4">
          {/* Location Toggle */}
          <button 
            onClick={handleLocate}
            className={`w-full py-3 rounded-xl font-semibold transition-all border-2 ${
              location 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {location ? "📍 Location Secured" : "🎯 Use My Current Location"}
          </button>

          {/* Vibe Input */}
          <input 
            type="text"
            placeholder="What's the vibe? (e.g., 'Cozy jazz bar')" 
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
            onChange={(e) => setVibe(e.target.value)}
          />

          {/* Action Button */}
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
            {loading ? "Scanning the neighborhood..." : "Find My Spots"}
          </button>
        </div>

        {/* AI Output Area */}
        {result && (
          <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <h2 className="text-blue-900 font-bold mb-3 flex items-center">
              ✨ Recommended for you:
            </h2>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}