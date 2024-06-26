"use client";

// App.js или App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../app/homePage';
import GameArea from '../app/gameArea';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gamearea/:roomId" element={<GameArea />} />
      </Routes>
    </Router>
  );
}

export default App;