import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Games</h1>
      <p className="text-green-300 mb-6">Try out some fun mini-games below:</p>

      <div className="flex justify-center gap-8 text-xl">
        <Link to="/games/tetris" className="underline hover:text-white">Tetris</Link>
        <Link to="/games/rps" className="underline hover:text-white">Rock Paper Scissors</Link>
      </div>
    </div>
  );
}
