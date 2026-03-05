import { useEffect, useRef, useState } from "react";
import { BACKGROUND_PLAYLIST } from "../config/audio";

const DEFAULT_VOLUME = 0.7;
const MOBILE_STEP = 0.1;

const STORAGE_KEYS = {
  volume: "timbaspoker_music_volume",
  previousVolume: "timbaspoker_music_previous_volume",
  trackIndex: "timbaspoker_music_track_index",
};

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.trackIndex);
    const parsed = saved ? Number(saved) : 0;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.volume);
    const parsed = saved ? Number(saved) : DEFAULT_VOLUME;
    return Number.isFinite(parsed) ? clampVolume(parsed) : DEFAULT_VOLUME;
  });

  const [previousVolume, setPreviousVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.previousVolume);
    const parsed = saved ? Number(saved) : DEFAULT_VOLUME;
    return Number.isFinite(parsed) ? clampVolume(parsed) : DEFAULT_VOLUME;
  });

  const [isMobileVolumeUI, setIsMobileVolumeUI] = useState(false);

  const currentTrack =
    BACKGROUND_PLAYLIST[
    currentTrackIndex % Math.max(BACKGROUND_PLAYLIST.length, 1)
    ];

  const isMuted = volume === 0;

  const tryPlay = async () => {
    const audio = audioRef.current;
    if (!audio) return false;

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
    const updateMobileVolumeUI = () => {
      const isCoarsePointer =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches;

      const isSmallScreen =
        typeof window !== "undefined" ? window.innerWidth <= 768 : false;

      setIsMobileVolumeUI(isCoarsePointer || isSmallScreen);
    };

    updateMobileVolumeUI();
    window.addEventListener("resize", updateMobileVolumeUI);

    return () => {
      window.removeEventListener("resize", updateMobileVolumeUI);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.volume, String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.previousVolume, String(previousVolume));
  }, [previousVolume]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.trackIndex, String(currentTrackIndex));
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack;
    audio.preload = "auto";
    audio.load();

    void tryPlay();
  }, [currentTrack]);

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
  }, [currentTrackIndex]);

  useEffect(() => {
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
  }, [currentTrackIndex]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = clampVolume(Number(event.target.value));
    if (newVolume > 0) {
      setPreviousVolume(newVolume);
    }
    setVolume(newVolume);
  };

  const changeVolumeBy = (delta: number) => {
    setVolume((prev) => {
      const next = clampVolume(prev + delta);
      if (next > 0) {
        setPreviousVolume(next);
      }
      return next;
    });
  };

  const toggleMute = () => {
    if (isMuted) {
      const restored = previousVolume > 0 ? previousVolume : DEFAULT_VOLUME;
      setVolume(restored);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
    }
  };

  if (BACKGROUND_PLAYLIST.length === 0) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />

      <div className="music-player-widget">
        <div className="music-volume-control">
          <span className="music-volume-label">Volumen</span>

          {isMobileVolumeUI ? (
            <div className="music-volume-mobile">
              <button
                type="button"
                className="music-volume-step-btn"
                onClick={() => changeVolumeBy(-MOBILE_STEP)}
                aria-label="Bajar volumen"
              >
                −
              </button>

              <span className="music-volume-pill">
                {Math.round(volume * 100)}%
              </span>

              <button
                type="button"
                className="music-volume-step-btn"
                onClick={() => changeVolumeBy(MOBILE_STEP)}
                aria-label="Subir volumen"
              >
                +
              </button>

              <button
                type="button"
                className={`music-mute-btn ${isMuted ? "muted" : ""}`}
                onClick={toggleMute}
                aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
                title={isMuted ? "Activar sonido" : "Silenciar sonido"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>
          ) : (
            <>
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

              <button
                type="button"
                className={`music-mute-btn desktop ${isMuted ? "muted" : ""}`}
                onClick={toggleMute}
                aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
                title={isMuted ? "Activar sonido" : "Silenciar sonido"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}