import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MatrixRain from './components/MatrixRain';

// Lazy-load pages/games to shrink the initial bundle
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Games = lazy(() => import('./pages/Games'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const TetrisGame = lazy(() => import('./games/Tetris'));
const RockPaperScissors = lazy(() => import('./games/RockPaperScissors'));

const NotFound = () => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold text-green-400 mb-2">404 — Not Found</h1>
    <p className="text-green-300">The page you’re looking for doesn’t exist.</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <Navbar />
          <main role="main">
            <Suspense fallback={<div className="p-8">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/games" element={<Games />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/games/tetris" element={<TetrisGame />} />
                <Route path="/games/rps" element={<RockPaperScissors />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}
