export default function BlogCard({ title, summary, link }) {
    return (
      <div className="border border-green-600 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-transform duration-300">
        <h3 className="text-xl font-bold text-green-300 mb-2">{title}</h3>
        <p className="text-sm mb-4">{summary}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="underline text-green-400 hover:text-white">
          Read More →
        </a>
      </div>
    );
  }
  