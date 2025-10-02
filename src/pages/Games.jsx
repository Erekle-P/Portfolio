import { Link } from 'react-router-dom';

export default function Games() {
  return (
    <>
      <title>Games — Erekle Papuashvili</title>
      <meta
        name="description"
        content="Play Tetris and Rock–Paper–Scissors on my portfolio."
      />

      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-green-400 mb-2">Games</h1>
        <p className="text-green-300 mb-6">Just for fun. Enjoy!</p>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          <Link
            to="/games/tetris"
            className="px-5 py-3 border border-green-600 rounded-xl hover:border-green-400 hover:-translate-y-0.5 transition text-green-300"
          >
            Tetris →
          </Link>
          <Link
            to="/games/rps"
            className="px-5 py-3 border border-green-600 rounded-xl hover:border-green-400 hover:-translate-y-0.5 transition text-green-300"
          >
            Rock–Paper–Scissors →
          </Link>
        </div>
      </div>
    </>
  );
}
