import React from 'react';
import { Play, Pause } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  src: string;
}

interface PlaylistProps {
  songs: Song[];
  currentSong: Song;
  onSongSelect: (song: Song) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ songs, currentSong, onSongSelect }) => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Playlist</h3>
      <div className="space-y-2">
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => onSongSelect(song)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:bg-opacity-50 group ${
              currentSong.id === song.id ? 'bg-gray-700 bg-opacity-30' : ''
            }`}
          >
            <div className="relative mr-4 flex-shrink-0">
              <img 
                src={song.cover} 
                alt={song.album}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded flex items-center justify-center transition-all duration-200">
                {currentSong.id === song.id ? (
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                ) : (
                  <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${
                currentSong.id === song.id ? 'text-green-500' : 'text-white'
              }`}>
                {song.title}
              </p>
              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>
            
            <div className="text-sm text-gray-400 ml-4">
              {song.duration}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;