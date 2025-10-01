import { FaGithub, FaLinkedin, FaMedium, FaEnvelope } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] text-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-green-400">Erekle Papuashvili</h1>
      <p className="text-lg sm:text-xl max-w-2xl mb-6 text-green-300">
        Full-Stack Software Engineer with a background in law. I love building modern apps with React, Python, and AI integrations.
      </p>

      <div className="flex gap-6 text-3xl">
        <a aria-label="Email Erekle" href="mailto:erekle.papuashvili@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          <FaEnvelope />
        </a>
        <a aria-label="GitHub Profile" href="https://github.com/Erekle-P" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          <FaGithub />
        </a>
        <a aria-label="Medium Articles" href="https://medium.com/@erekle.papuashvili" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          <FaMedium />
        </a>
        <a aria-label="LinkedIn Profile" href="https://www.linkedin.com/in/erekle-papuashvili/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          <FaLinkedin />
        </a>
      </div>
    </div>
  );
}
