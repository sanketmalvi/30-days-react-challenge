import React, { useEffect, useState, useRef, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const TOPICS = ['general', 'technology', 'sports', 'business', 'entertainment', 'health', 'science'];

export default function NewsApp() {
  const [articles, setArticles] = useState([]);
  const [topic, setTopic] = useState('general');
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const observer = useRef();
  const lastArticleRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    setArticles([]);
    setPage(1);
  }, [topic]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${topic}&pageSize=12&page=${page}&apiKey=${API_KEY}`);
        const data = await res.json();
        if (data.status === 'ok') {
          setArticles(prev => [...prev, ...data.articles]);
        } else {
          throw new Error(data.message || 'Unable to fetch news');
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchNews();
  }, [topic, page]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <h1 className="text-2xl font-bold">🗞️ News App</h1>
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="bg-white text-indigo-600 px-4 py-2 rounded shadow-md transition hover:scale-105"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <div className="px-6 py-4 flex flex-wrap gap-2 justify-center bg-indigo-100 dark:bg-gray-800">
        {TOPICS.map(t => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`px-3 py-1 rounded-full text-sm font-medium shadow transition-all hover:scale-105 ${
              topic === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 dark:bg-gray-600 dark:text-white'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="px-6 py-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {articles.map((article, idx) => {
          const isLast = idx === articles.length - 1;
          return (
            <div
              key={idx}
              ref={isLast ? lastArticleRef : null}
              onClick={() => window.open(article.url, '_blank')}
              className="cursor-pointer bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg flex flex-col transition transform hover:scale-[1.03] hover:shadow-2xl duration-300"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt="thumbnail"
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-grow space-y-2">
                <h3 className="font-semibold text-md dark:text-white line-clamp-2">{article.title}</h3>
                <p className="text-sm dark:text-gray-300 line-clamp-3">{article.description}</p>
                <div className="text-xs text-indigo-500 dark:text-indigo-300 font-medium">
                  {article.source?.name} · {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <p className="text-center py-4 text-sm text-gray-500">⏳ Loading more news...</p>}
      {error && <p className="text-center text-red-500">❌ {error}</p>}
    </div>
  );
}
