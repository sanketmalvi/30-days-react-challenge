import React, { useEffect, useState, useRef } from 'react';
import logo from './assets/musicMania.jpg';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef();

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const fetchSongs = async (query) => {
    try {
      const response = await fetch(`https://v1.nocodeapi.com/sanket/spotify/BXsbAztKqhjSeXFR/search?q=${query}&type=track`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        redirect: "follow"
      });
      const data = await response.json();
      const tracks = data.tracks.items.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        cover: track.album.images[0]?.url,
        url: track.preview_url
      })).filter(song => song.url);
      setSongs(tracks);
      setCurrentSong(tracks[0]);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    fetchSongs("trending");
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };
      audio.addEventListener('timeupdate', updateProgress);
      return () => audio.removeEventListener('timeupdate', updateProgress);
    }
  }, [currentSong]);

  const playPauseHandler = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (forward = true) => {
    if (!songs.length) return;
    const index = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = forward ? (index + 1) % songs.length : (index - 1 + songs.length) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentSong]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      fetchSongs(searchQuery);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 pb-28 relative">
      <img src={logo} alt="MusicMania Logo" className="h-20 mb-6" />

      <form onSubmit={handleSearch} className="mb-6 w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a song..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-full bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button type="submit" className="absolute right-1 top-1 bottom-1 px-5 bg-green-500 text-white rounded-full">Search</button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-8">
        {songs.map(song => (
          <div
            key={song.id}
            className={`p-3 rounded-lg cursor-pointer transition duration-300 ${song.id === currentSong?.id ? 'bg-green-600 animate-pulse-glow' : 'bg-zinc-800 hover:bg-zinc-700'}`}
            onClick={() => {
              setCurrentSong(song);
              setIsPlaying(true);
            }}>
            <img src={song.cover} alt="cover" className="w-full h-40 object-cover rounded-md" />
            <h4 className="mt-2 text-sm font-medium">{song.title}</h4>
            <p className="text-xs text-gray-400">{song.artist}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-white p-4 border-t border-zinc-700 shadow-lg z-50">
        {currentSong && (
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <img src={currentSong.cover} alt="cover" className="w-16 h-16 object-cover rounded-md" />
              <div>
                <h4 className="text-sm font-medium animate-pulse-glow">{currentSong.title}</h4>
                <p className="text-xs text-gray-400">{currentSong.artist}</p>
              </div>
            </div>

            <div className="flex flex-col items-center w-full max-w-md">
              <div className="flex items-center space-x-4 mb-2">
                <button onClick={() => skipTrack(false)} className="text-2xl">⏮️</button>
                <button onClick={playPauseHandler} className="text-3xl">{isPlaying ? '⏸️' : '▶️'}</button>
                <button onClick={() => skipTrack(true)} className="text-2xl">⏭️</button>
              </div>
              <div className="flex items-center space-x-2 w-full">
                <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-green-500 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs w-10">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-32">
              <span className="text-xs">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} src={currentSong?.url} onEnded={() => skipTrack(true)} />
    </div>
  );
}

export default App;