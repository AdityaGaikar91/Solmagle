import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VideoRoom } from './components/VideoRoom';
import { InterestForm } from './components/InterestForm';
import { MatchingScreen } from './components/MatchingScreen';
import './App.css';

function App() {
  return (
        <Router>
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg p-4">
              <h1 className="text-2xl font-bold text-center">Video Chat Matcher</h1>
            </nav>
            <Routes>
              <Route path="/" element={<InterestForm />} />
              <Route path="/matching" element={<MatchingScreen />} />
              <Route path="/room/:roomId" element={<VideoRoom />} />
            </Routes>
          </div>
        </Router>
  );
}

export default App;
