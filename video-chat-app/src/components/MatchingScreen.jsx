import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const MatchingScreen = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get from auth context in real app
        const response = await fetch(`/api/matches/${userId}`);
        const data = await response.json();
        setMatches(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const startChat = (matchId) => {
    const roomId = `room-${Date.now()}`;
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Your Matches</h2>
      <div className="grid gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Match #{match.id}</h3>
                <p className="text-gray-600">
                  Similarity: {(match.similarity * 100).toFixed(1)}%
                </p>
              </div>
              <button
                onClick={() => startChat(match.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Start Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};