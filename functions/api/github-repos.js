// Cloudflare Pages Function: GET /api/github-repos
// Auto-fetches and caches your latest public repos from GitHub.
// Optional: set GITHUB_USERNAME and GITHUB_TOKEN in Cloudflare Pages → Settings → Environment variables.

export async function onRequestGet({ env, request }) {
  const username = env.GITHUB_USERNAME || 'Erekle-P';
  const perPage = 12; // tweak to show more/less
  const ghUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=updated&per_page=${perPage}`;

  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const headers = {
    'User-Agent': 'cf-pages-fn',
    'Accept': 'application/vnd.github+json',
  };
  if (env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;

  const ghRes = await fetch(ghUrl, { headers });
  if (!ghRes.ok) {
    return new Response(JSON.stringify({ error: 'GitHub fetch failed', status: ghRes.status }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }

  const repos = await ghRes.json();

  // Shape and filter results for the UI
  const data = (repos || [])
    .filter(r => !r.fork) // hide forks
    .map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage,
      stars: r.stargazers_count,
      language: r.language,
      topics: r.topics || [],
      updated_at: r.pushed_at,
    }));

  const body = JSON.stringify({ username, repos: data }, null, 2);
  const resp = new Response(body, {
    headers: {
      'content-type': 'application/json',
      // Cache at the edge to keep your site fast and GitHub-friendly
      'Cache-Control': 'public, max-age=1800', // 30 minutes
    },
  });

  // Store in Cloudflare cache
  await cache.put(cacheKey, resp.clone());
  return resp;
}
