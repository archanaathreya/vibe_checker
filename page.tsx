"use client";
import { useState } from "react";
import { getVibeSpots } from "./actions";

export default function VibeCheck() {
  const [city, setCity] = useState("");
  const [vibe, setVibe] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const data = await getVibeSpots(city, vibe);
    setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-24 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">🌍 VibeCheck</h1>
        <p className="text-slate-500 mb-8 text-sm">Instant spots based on your mood.</p>
        
        <div className="space-y-4">
          <input 
            placeholder="Which city?" 
            className="w-full p-4 bg-slate-100 rounded-2xl focus:outline-blue-500 text-black"
            onChange={(e) => setCity(e.target.value)}
          />
          <input 
            placeholder="What's the vibe? (e.g. 'Coffee & Art')" 
            className="w-full p-4 bg-slate-100 rounded-2xl focus:outline-blue-500 text-black"
            onChange={(e) => setVibe(e.target.value)}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Scouting the city..." : "Find My Spots"}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h2 className="font-bold text-blue-900 mb-4">Your 3-Stop Plan:</h2>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}