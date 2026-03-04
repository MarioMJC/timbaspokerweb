import { useEffect, useRef, useState } from "react";
import { BACKGROUND_PLAYLIST } from "../config/audio";

const DEFAULT_VOLUME = 0.7;
const STORAGE_KEYS = {
  isPlaying: "timbaspoker_music_is_playing",
  volume: "timbaspoker_music_volume",
  trackIndex: "timbaspoker_music_track_index",
};

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.trackIndex);
    const parsed = saved ? Number(saved) : 0;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  });

  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.isPlaying);
    return saved === null ? true : saved === "true";
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.volume);
    const parsed = saved ? Number(saved) : DEFAULT_VOLUME;
    return Number.isFinite(parsed) ? parsed : DEFAULT_VOLUME;
  });

  const currentTrack =
    BACKGROUND_PLAYLIST[
      currentTrackIndex % Math.max(BACKGROUND_PLAYLIST.length, 1)
    ];

  const tryPlay = async () => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return false;

    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  };

  const goToNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % BACKGROUND_PLAYLIST.length);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.isPlaying, String(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.volume, String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.trackIndex, String(currentTrackIndex));
  }, [currentTrackIndex]);

  // ✅ Solo ajusta volumen, no recarga canción
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  // ✅ Solo cambia pista cuando toca, no cuando mueves el slider
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack;
    audio.preload = "auto";
    audio.load();

    if (isPlaying) {
      void tryPlay();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      goToNextTrack();
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const attemptResume = async () => {
      await tryPlay();
    };

    void attemptResume();

    const handlePageShow = () => {
      void attemptResume();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void attemptResume();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    const unlockAudio = async () => {
      const ok = await tryPlay();
      if (ok) {
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
      }
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, [isPlaying, currentTrackIndex]);

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const ok = await tryPlay();
      if (!ok) {
        // Se reanudará en la siguiente interacción permitida por el navegador
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
  };

  if (BACKGROUND_PLAYLIST.length === 0) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />

      <div className="music-player-widget">
        <button
          type="button"
          className="music-toggle-btn"
          onClick={handleTogglePlayback}
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
          title={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? "🔊 Música ON" : "🔇 Música OFF"}
        </button>

        <div className="music-volume-control">
          <span className="music-volume-label">Volumen</span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="music-volume-slider"
            aria-label="Control de volumen"
          />

          <span className="music-volume-value">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </>
  );
}