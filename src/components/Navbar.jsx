import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-center space-x-6 p-4 bg-black border-b border-green-600 text-green-400">
      <Link to="/" className="hover:text-white">Home</Link>
      <Link to="/projects" className="hover:text-white">Projects</Link>
      <Link to="/games" className="hover:text-white">Games</Link>
      <Link to="/blog" className="hover:text-white">Blog</Link>
      <Link to="/contact" className="hover:text-white">Contact</Link>
    </nav>
  );
}
