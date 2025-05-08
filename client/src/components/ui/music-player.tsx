import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause, Music } from "lucide-react";
import { useMusicPlayer } from "@/contexts/music-player-context";

// Playlist of royalty-free punk rock style music
const musicPlaylist = [
  {
    title: "Skate Punk",
    artist: "Free Music Archive",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Frequecy/Ketsa_-_08_-_Stride.mp3",
  },
  {
    title: "Urban Grind",
    artist: "Free Music Archive",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_09_-_Headway.mp3",
  },
  {
    title: "Concrete Dreams",
    artist: "Free Music Archive",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Mid-Air_Machine/Snooze_Button/Mid-Air_Machine_-_05_-_Skylark.mp3",
  },
  {
    title: "Sidewalk Rebels",
    artist: "Free Music Archive",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Ketsa/Raising_Frequecy/Ketsa_-_13_-_Offbeat_Oddity.mp3",
  },
  {
    title: "Drop In",
    artist: "Free Music Archive",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_02_-_Moonlight_Reprise.mp3",
  }
];

interface MusicPlayerProps {
  initialVolume?: number;
}

const MusicPlayer = ({ initialVolume = 30 }: MusicPlayerProps) => {
  const { isPlayerEnabled } = useMusicPlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [prevVolume, setPrevVolume] = useState(initialVolume);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Define these functions first with useCallback to prevent unnecessary re-renders
  const playNextTrack = useCallback(() => {
    setCurrentTrackIndex(prevIndex => 
      prevIndex === musicPlaylist.length - 1 ? 0 : prevIndex + 1
    );
  }, []);
  
  const playPreviousTrack = useCallback(() => {
    setCurrentTrackIndex(prevIndex => 
      prevIndex === 0 ? musicPlaylist.length - 1 : prevIndex - 1
    );
  }, []);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const togglePlayer = () => {
    setIsOpen(!isOpen);
  };
  
  // Initialize the audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicPlaylist[currentTrackIndex].src);
      audioRef.current.volume = volume / 100;
      
      // Set up event listeners for when a track ends
      const handleTrackEnd = () => playNextTrack();
      audioRef.current.addEventListener('ended', handleTrackEnd);
      
      // Cleanup function
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleTrackEnd);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [playNextTrack, currentTrackIndex, volume]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  // Play/pause functionality
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Change track when currentTrackIndex changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = musicPlaylist[currentTrackIndex].src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, isPlaying]);
  
  const currentTrack = musicPlaylist[currentTrackIndex];
  
  // If music player is disabled, don't render anything
  if (!isPlayerEnabled) {
    return null;
  }
  
  return (
    <div className={`fixed bottom-20 right-6 z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-96'}`}>
      {/* Music player toggle button */}
      <button 
        onClick={togglePlayer}
        className="absolute left-0 top-1/2 transform -translate-x-12 -translate-y-1/2 bg-primary rounded-full p-3 shadow-lg text-white hover:bg-opacity-90 transition-colors"
        aria-label={isOpen ? "Close music player" : "Open music player"}
      >
        <Music size={20} />
      </button>
      
      {/* Music player container */}
      <div className="bg-secondary text-white w-72 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 bg-primary text-white">
          <h3 className="font-bold">Skate Radio</h3>
          <p className="text-sm opacity-80">Punk tracks to skate to</p>
        </div>
        
        {/* Current track info */}
        <div className="p-4 text-center">
          <h4 className="font-bold mb-1">{currentTrack.title}</h4>
          <p className="text-sm opacity-80">{currentTrack.artist}</p>
        </div>
        
        {/* Player controls */}
        <div className="px-4 pb-2 flex justify-between items-center">
          <button 
            onClick={playPreviousTrack}
            className="p-2 hover:text-primary transition-colors"
            aria-label="Previous track"
          >
            <SkipBack size={22} />
          </button>
          
          <button 
            onClick={togglePlayPause}
            className="p-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          
          <button 
            onClick={playNextTrack}
            className="p-2 hover:text-primary transition-colors"
            aria-label="Next track"
          >
            <SkipForward size={22} />
          </button>
        </div>
        
        {/* Volume control */}
        <div className="px-4 pb-4 flex items-center">
          <button 
            onClick={toggleMute}
            className="p-2 hover:text-primary transition-colors mr-2"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-neutral rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label="Volume control"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;