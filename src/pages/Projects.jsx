import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/github-repos');
        if (!res.ok) throw new Error(`Bad response: ${res.status}`);
        const data = await res.json();
        setRepos(data.repos || []);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-400 mb-2">Projects</h1>
      <p className="text-green-300 mb-6">Latest public repos from GitHub (auto-updates).</p>

      {loading && <div className="text-green-300">Loading projects…</div>}
      {err && <div className="text-red-400">Couldn’t load projects: {err}</div>}

      {!loading && !err && (
        <div className="grid gap-6 max-w-5xl mx-auto md:grid-cols-2">
          {repos.map(r => (
            <ProjectCard
              key={r.id}
              title={r.name}
              description={r.description}
              link={r.html_url}
              homepage={r.homepage}
              stars={r.stars}
              language={r.language}
              topics={r.topics}
            />
          ))}
        </div>
      )}
    </div>
  );
}
