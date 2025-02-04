import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const InterestForm = () => {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests }),
      });
      if (response.ok) {
        navigate('/matching');
      }
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">What are your interests?</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter an interest"
          />
          <button
            type="button"
            onClick={() => {
              if (newInterest) {
                setInterests([...interests, newInterest]);
                setNewInterest('');
              }
            }}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Interest
          </button>
        </div>
        <div className="mb-4">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {interest}
            </span>
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded"
        >
          Find Matches
        </button>
      </form>
    </div>
  );
};