import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  PauseIcon,
  TriangleRightIcon,
  UnmuteIcon,
  MuteIcon,
} from "@primer/octicons-react";
import { loadRadioPlayerState, saveRadioPlayerState } from "../../helpers/radioPlayerState";

export const CODE_RADIO_STREAM_URL =
  "https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3";
export const CODE_RADIO_NOW_PLAYING_URL =
  "https://coderadio-admin-v2.freecodecamp.org/api/nowplaying_static/coderadio.json";

const SONG_REFRESH_INTERVAL = 30_000;

type CodeRadioSong = {
  artist: string;
  title: string;
};

type RadioPlayerProps = {
  autoPlayOnPomodoroStart?: boolean;
  lowerVolumeDuringBreak?: boolean;
  lowerVolumeForAlert?: boolean;
  pomodoroStarted?: boolean;
};

const getCurrentSong = (value: unknown): CodeRadioSong | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const nowPlaying = (value as Record<string, unknown>).now_playing;

  if (typeof nowPlaying !== "object" || nowPlaying === null) {
    return null;
  }

  const song = (nowPlaying as Record<string, unknown>).song;

  if (typeof song !== "object" || song === null) {
    return null;
  }

  const { artist, title } = song as Record<string, unknown>;

  return typeof artist === "string" && typeof title === "string"
    ? { artist, title }
    : null;
};

const RadioPlayer = ({
  autoPlayOnPomodoroStart = false,
  lowerVolumeDuringBreak = false,
  lowerVolumeForAlert = false,
  pomodoroStarted = false,
}: RadioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wasPomodoroStarted = useRef(pomodoroStarted);
  const [savedPlayerState] = useState(loadRadioPlayerState);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(savedPlayerState.isMuted);
  const [volume, setVolume] = useState(savedPlayerState.volume);
  const previousVolumeRef = useRef(savedPlayerState.previousVolume);
  const [currentSong, setCurrentSong] = useState<CodeRadioSong | null>(null);

  const effectiveVolume = lowerVolumeDuringBreak && lowerVolumeForAlert
    ? volume * 0.4
    : volume;

  const startPlayback = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = effectiveVolume;
    }
  }, [effectiveVolume]);

  useEffect(() => {
    saveRadioPlayerState({
      isMuted,
      previousVolume: previousVolumeRef.current,
      volume,
    });
  }, [isMuted, volume]);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentSong = async (): Promise<void> => {
      try {
        const response = await fetch(CODE_RADIO_NOW_PLAYING_URL);

        if (!response.ok) {
          return;
        }

        const song = getCurrentSong(await response.json());

        if (isMounted && song) {
          setCurrentSong(song);
        }
      } catch {
        // The stream can still play when the metadata service is unavailable.
      }
    };

    void loadCurrentSong();
    const refreshId = window.setInterval(() => void loadCurrentSong(), SONG_REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(refreshId);
    };
  }, []);

  useEffect(() => {
    if (!wasPomodoroStarted.current && pomodoroStarted && autoPlayOnPomodoroStart) {
      startPlayback();
    }

    wasPomodoroStarted.current = pomodoroStarted;
  }, [autoPlayOnPomodoroStart, pomodoroStarted, startPlayback]);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    startPlayback();
  }, [isPlaying, startPlayback]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isMuted) {
      const restoredVolume = previousVolumeRef.current;
      audio.muted = false;
      audio.volume = restoredVolume;
      setIsMuted(false);
      setVolume(restoredVolume);
      return;
    }

    if (volume > 0) {
      previousVolumeRef.current = volume;
    }

    audio.muted = true;
    audio.volume = 0;
    setIsMuted(true);
    setVolume(0);
  }, [isMuted, volume]);

  const changeVolume = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const nextVolume = Number(event.target.value);

    if (!audio) {
      return;
    }

    if (nextVolume > 0) {
      previousVolumeRef.current = nextVolume;

      if (isMuted) {
        audio.muted = false;
        setIsMuted(false);
      }
    }

    audio.volume = nextVolume;
    setVolume(nextVolume);
  }, [isMuted]);

  return (
    <footer className="radio-player">
      <audio
        aria-label="Code Radio stream"
        muted={isMuted}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        ref={audioRef}
        src={CODE_RADIO_STREAM_URL}
      />
      <span className="radio-player-name">Code Radio</span>
      {currentSong && (
        <div aria-live="polite" className="radio-current-song">
          <span className="radio-song-title">{currentSong.title}</span>
          <span className="radio-song-artist">{currentSong.artist}</span>
        </div>
      )}
      <button
        aria-label={isPlaying ? "Pause Code Radio" : "Play Code Radio"}
        className="radio-player-button"
        onClick={togglePlayback}
        type="button"
      >
        {isPlaying ? <PauseIcon size={16} /> : <TriangleRightIcon size={16} />}
      </button>
      <button
        aria-label={isMuted ? "Unmute Code Radio" : "Mute Code Radio"}
        className="radio-player-button"
        onClick={toggleMute}
        type="button"
      >
        {isMuted ? <MuteIcon size={16} /> : <UnmuteIcon size={16} />}
      </button>
      <label className="radio-player-volume" htmlFor="radio-volume">
        <span>Volume</span>
        <input
          aria-label="Code Radio volume"
          id="radio-volume"
          max="1"
          min="0"
          onChange={changeVolume}
          step="0.05"
          style={{ "--range-progress": `${volume * 100}%` } as CSSProperties}
          type="range"
          value={volume}
        />
      </label>
    </footer>
  );
};

export default RadioPlayer;
