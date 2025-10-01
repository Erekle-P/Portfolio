export default function ProjectCard({ title, description, link, homepage, stars, language, topics = [] }) {
  return (
    <div className="border border-green-600/70 p-5 rounded-xl bg-black/50 backdrop-blur hover:shadow-lg hover:-translate-y-0.5 hover:border-green-400 transition-all duration-300 text-left">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-bold text-green-300">{title}</h3>
        {stars != null && (
          <span className="text-xs px-2 py-1 border border-green-700 rounded-full text-green-300">★ {stars}</span>
        )}
      </div>

      {description && <p className="text-sm text-green-200/80 mt-2">{description}</p>}

      {(language || topics.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {language && <span className="px-2 py-1 border border-green-700 rounded-full">{language}</span>}
          {topics.slice(0, 4).map(t => (
            <span key={t} className="px-2 py-1 border border-green-700 rounded-full">{t}</span>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <a href={link} target="_blank" rel="noopener noreferrer" className="underline text-green-400 hover:text-white">
          Code →
        </a>
        {homepage && (
          <a href={homepage} target="_blank" rel="noopener noreferrer" className="underline text-green-400 hover:text-white">
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
}
