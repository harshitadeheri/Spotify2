import React, { useRef } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration, onSeek }) => {
  const progressRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickTime = (clickX / width) * duration;
    
    onSeek(clickTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={progressRef}
      className="w-full h-1 bg-gray-600 rounded-full cursor-pointer group hover:h-2 transition-all duration-200"
      onClick={handleClick}
    >
      <div
        className="h-full bg-green-500 rounded-full transition-all duration-100 relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mr-1.5"></div>
      </div>
    </div>
  );
};

export default ProgressBar;