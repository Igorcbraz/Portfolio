const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const METADATA_FILE = path.join(ROOT_DIR, 'data', 'metadata.json');
const CACHE_FILE = path.join(ROOT_DIR, 'data', 'github-cache.json');

function getGithubToken() {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }
  try {
    const envPath = path.join(ROOT_DIR, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/GITHUB_TOKEN\s*=\s*(.+)/);
      if (match) {
        return match[1].trim();
      }
    }
  } catch (e) {
    console.warn('Could not read GITHUB_TOKEN from .env file:', e.message);
  }
  return null;
}

function getGithubUser(metadata) {
  try {
    return metadata.social.github.username || 'igorcbraz';
  } catch (e) {
    return 'igorcbraz';
  }
}

async function fetchJson(url, token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'igorcbraz-portfolio',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}; body=${text.slice(0, 150)}`);
  }
  return response.json();
}

async function main() {
  console.log('--- FETCHING GITHUB DATA CACHE ---');
  let metadata = {};
  try {
    metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
  } catch (e) {
    console.error('Could not read metadata.json:', e.message);
  }

  const githubUser = getGithubUser(metadata);
  const token = getGithubToken();

  if (token) {
    console.log(`Using GITHUB_TOKEN (starts with ${token.substring(0, 8)}...)`);
  } else {
    console.log('No GITHUB_TOKEN found. Fetching unauthenticated (subject to strict rate limits)...');
  }

  try {
    console.log(`Fetching profile for ${githubUser}...`);
    const user = await fetchJson(`https://api.github.com/users/${githubUser}`, token);

    console.log(`Fetching repositories for ${githubUser}...`);
    const repos = await fetchJson(`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`, token);

    const totals = repos.reduce(
      (acc, repo) => {
        acc.totalStars += repo.stargazers_count || 0;
        acc.totalForks += repo.forks_count || 0;
        acc.totalWatchers += repo.watchers_count || 0;
        return acc;
      },
      { totalStars: 0, totalForks: 0, totalWatchers: 0 }
    );

    const createdDate = new Date(user.created_at);
    const now = new Date();
    const yearsDiff = now.getFullYear() - createdDate.getFullYear();
    const monthsDiff = now.getMonth() - createdDate.getMonth();
    const yearsOnGitHub = monthsDiff < 0 ? yearsDiff - 1 : yearsDiff;
    const yearsExperience = Math.max(1, yearsOnGitHub - 1);

    const formattedRepos = repos.map((repo) => ({
      name: repo.name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'Unknown',
      watchers: repo.watchers_count,
      openIssues: repo.open_issues_count,
      updatedAt: repo.updated_at,
      size: repo.size,
      topics: repo.topics || [],
    }));

    const payload = {
      userData: {
        metadata: metadata,
        github: {
          username: user.login,
          totalStars: totals.totalStars,
          totalForks: totals.totalForks,
          totalWatchers: totals.totalWatchers,
          totalRepos: user.public_repos,
          yearsOnGitHub,
          yearsExperience,
          createdAt: user.created_at,
        },
        personal: {
          name: metadata.author?.name || 'Igor Braz',
          title: metadata.author?.role || 'Desenvolvedor Full Stack',
          bio: metadata.author?.bio || '',
          location: metadata.author?.location || 'Brasil',
          email: metadata.author?.email || 'igorcbraz1@gmail.com',
          website: metadata.site?.url || 'https://igorcbraz.vercel.app/',
        },
        social: {
          github: metadata.social?.github?.url || 'https://github.com/igorcbraz',
          linkedin: metadata.social?.linkedin?.url || 'https://www.linkedin.com/in/igorcbraz/',
        },
      },
      repos: formattedRepos,
      fromCache: true,
      cachedAt: new Date().toISOString(),
    };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2), 'utf8');
    console.log(`Saved GitHub cache data successfully to ${CACHE_FILE}`);
  } catch (error) {
    console.error('Error fetching/writing GitHub cache:', error.message);
    if (fs.existsSync(CACHE_FILE)) {
      console.log('A cache file already exists. Keeping the existing cache file.');
    } else {
      console.log('No cache file exists yet. Writing dummy fallback cache to avoid crash...');
      const fallback = {
        userData: {
          metadata: metadata,
          github: {
            username: githubUser,
            totalStars: 100,
            totalForks: 16,
            totalWatchers: 100,
            totalRepos: 43,
            yearsOnGitHub: 5,
            yearsExperience: 4,
            createdAt: '2021-03-24T00:00:00Z',
          },
          personal: {
            name: metadata.author?.name || 'Igor Braz',
            title: metadata.author?.role || 'Desenvolvedor Full Stack',
            bio: metadata.author?.bio || '',
            location: metadata.author?.location || 'Brasil',
            email: metadata.author?.email || 'igorcbraz1@gmail.com',
            website: metadata.site?.url || 'https://igorcbraz.vercel.app/',
          },
          social: {
            github: metadata.social?.github?.url || 'https://github.com/igorcbraz',
            linkedin: metadata.social?.linkedin?.url || 'https://www.linkedin.com/in/igorcbraz/',
          },
        },
        repos: [],
        fromCache: true,
        cachedAt: new Date().toISOString(),
      };
      fs.writeFileSync(CACHE_FILE, JSON.stringify(fallback, null, 2), 'utf8');
    }
  }
}

main();
