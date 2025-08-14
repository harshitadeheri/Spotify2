import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import Playlist from './Playlist';
import ProgressBar from './ProgressBar';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  src: string;
}

const sampleSongs: Song[] = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 2,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    duration: "3:01",
    cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 3,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: "6:30",
    cover: "https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=300",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 4,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: "8:02",
    cover: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 5,
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: "5:03",
    cover: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  }
];

const MusicPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song>(sampleSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    const currentIndex = sampleSongs.findIndex(song => song.id === currentSong.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : sampleSongs.length - 1;
    setCurrentSong(sampleSongs[previousIndex]);
    setCurrentTime(0);
  };

  const handleNext = () => {
    if (isRepeated) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    const currentIndex = sampleSongs.findIndex(song => song.id === currentSong.id);
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * sampleSongs.length);
    } else {
      nextIndex = currentIndex < sampleSongs.length - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentSong(sampleSongs[nextIndex]);
    setCurrentTime(0);
  };

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    if (isPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <audio ref={audioRef} src={currentSong.src} />
      
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Spotify Clone</h1>
            <p className="text-gray-400">Your music, your way</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Playlist Sidebar */}
        <div className="w-80 bg-black bg-opacity-30 backdrop-blur-sm border-r border-gray-700 overflow-y-auto">
          <Playlist 
            songs={sampleSongs} 
            currentSong={currentSong} 
            onSongSelect={handleSongSelect}
          />
        </div>

        {/* Now Playing Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-md w-full text-center">
            {/* Album Art */}
            <div className="relative mb-8 group">
              <img 
                src={currentSong.cover} 
                alt={currentSong.album}
                className="w-80 h-80 rounded-lg shadow-2xl mx-auto transform transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Song Info */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
                {currentSong.title}
              </h2>
              <p className="text-xl text-gray-300 mb-1">{currentSong.artist}</p>
              <p className="text-gray-400">{currentSong.album}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={(time) => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = time;
                  }
                }}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isShuffled ? 'text-green-500 bg-green-500 bg-opacity-20' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              
              <button
                onClick={handlePrevious}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={togglePlay}
                className="bg-green-500 hover:bg-green-400 text-white p-4 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              
              <button
                onClick={handleNext}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setIsRepeated(!isRepeated)}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isRepeated ? 'text-green-500 bg-green-500 bg-opacity-20' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center space-x-3">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume}%, #374151 ${volume}%, #374151 100%)`
                }}
              />
              <span className="text-sm text-gray-400 w-8">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;