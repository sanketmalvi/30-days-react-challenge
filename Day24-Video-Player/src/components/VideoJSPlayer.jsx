import React, { useRef } from 'react';
import VideoJS from './VideoJS';
import './VideoPlayer.css';

const VideoJSPlayer = () => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    autoplay: false,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: [
      {
        src: 'https://ik.imagekit.io/6gqk2bs1v/2025-07-08%2022-49-56.mp4?updatedAt=1752075513764',
        type: 'video/mp4',
      },
    ],
    poster: 'https://ik.imagekit.io/6gqk2bs1v/Screenshot%20(193).png?updatedAt=1752079809088',
    tracks: [
      {
        kind: 'captions',
        src: '/english.vtt',
        srclang: 'en',
        label: 'English',
        default: true,
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on('waiting', () => console.log('Buffering...'));
    player.on('loadedmetadata', () => console.log('Metadata loaded'));
  };

  return (
    <section className="video-container">
      <div className="video-wrapper">
        <h2 className="video-title">🎬 Ultimate Video Player</h2>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
    </section>
  );
};

export default VideoJSPlayer;