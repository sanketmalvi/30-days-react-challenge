import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

const GitHubFinder = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('created'); 
  const [langData, setLangData] = useState([]);

  const fetchGitHubUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error('User not found');
      const user = await userRes.json();
      setUserData(user);

      const repoRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=50`);
      let repoData = await repoRes.json();

      // Sort repos
      if (sortBy === 'stars') {
        repoData = repoData.sort((a, b) => b.stargazers_count - a.stargazers_count);
      } else {
        repoData = repoData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      setRepos(repoData.slice(0, 6));

      // Language aggregation
      const langMap = {};
      await Promise.all(
        repoData.slice(0, 10).map(async (repo) => {
          const res = await fetch(repo.languages_url);
          const langs = await res.json();
          for (let key in langs) {
            langMap[key] = (langMap[key] || 0) + langs[key];
          }
        })
      );

      const langArray = Object.entries(langMap).map(([name, value]) => ({ name, value }));
      setLangData(langArray);
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-10 font-sans">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-400 tracking-wide">🔍 GitHub Profile Finder</h1>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="px-4 py-2 rounded-lg shadow-lg text-black w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
        <button
          onClick={fetchGitHubUser}
          className="bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 rounded-lg font-semibold shadow-md"
        >
          Search
        </button>
      </div>

      {userData && (
        <div className="flex justify-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setSortBy('created')}
              className={`px-3 py-1 rounded-md ${sortBy === 'created' ? 'bg-indigo-500' : 'bg-gray-700'}`}
            >
              ⏱ Latest
            </button>
            <button
              onClick={() => setSortBy('stars')}
              className={`px-3 py-1 rounded-md ${sortBy === 'stars' ? 'bg-indigo-500' : 'bg-gray-700'}`}
            >
              🌟 Popular
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-center animate-pulse text-indigo-300">🔄 Loading...</p>}
      {error && <p className="text-center text-red-400">❌ {error}</p>}

      {userData && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
            <img
              src={userData.avatar_url}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4 shadow-md"
            />
            <h2 className="text-xl font-bold text-indigo-300">{userData.name || userData.login}</h2>
            <p className="text-gray-400 text-sm italic">{userData.bio}</p>
            <div className="mt-4 text-sm text-gray-300 space-y-1">
              <p>👥 Followers: {userData.followers} | Following: {userData.following}</p>
              <p>📦 Public Repos: {userData.public_repos}</p>
              <a
                href={userData.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-indigo-400 hover:underline"
              >
                View GitHub Profile ↗
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-2xl mb-4 font-semibold text-indigo-300">📊 Language Breakdown</h3>
            {langData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={langData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {langData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400">No language data found.</p>
            )}

            <h3 className="text-2xl mt-8 mb-4 font-semibold text-indigo-300">🛠 Repositories</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="bg-gray-700 p-4 rounded-lg shadow-lg hover:bg-gray-600 transition duration-200"
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-semibold text-indigo-200 hover:underline"
                  >
                    {repo.name}
                  </a>
                  <p className="text-sm text-gray-400 mt-1">{repo.description || 'No description provided.'}</p>
                  <div className="mt-2 text-xs text-gray-300">
                    ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | 🕒 Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center text-gray-400 text-sm">
        Built with ❤️ by Sanket using React & GitHub API
      </footer>
    </div>
  );
};

export default GitHubFinder;
