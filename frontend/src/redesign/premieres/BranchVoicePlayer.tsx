import { Captions, Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from "react";
import {
  branchVoiceChapters, branchVoiceDefaultChapter, branchVoiceMedia, chapterAt, replayClock,
  type BranchVoiceChapter,
} from "../../data/branchVoice";

export type WorkbenchTrack = (
  interaction: string,
  context: Record<string, string | number>,
) => void;

export interface BranchVoiceTransport {
  cue(seconds: number): void;
  pause(): void;
  focus(): void;
}

interface PlayerProps {
  ref: Ref<BranchVoiceTransport>;
  children: ReactNode;
  onTimeChange: (chapter: BranchVoiceChapter) => void;
  onPlay: () => void;
  onSeek: () => void;
  onJump: (chapter: BranchVoiceChapter, origin: "keyboard" | "from_start") => void;
  track: WorkbenchTrack;
}

const initialSeconds = branchVoiceDefaultChapter.seek;
const initialWholeSecond = Math.floor(initialSeconds);
const duration = branchVoiceMedia.duration;
const tenth = (seconds: number) => Math.round(seconds * 10) / 10;
const rangeLabel = (seconds: number) => `${replayClock(seconds)} of ${replayClock(duration)}`;
const rangeProgress = (seconds: number) => `${seconds / duration * 100}%`;

function usePlaybackAnalytics(track: WorkbenchTrack) {
  const origin = useRef("transport");
  const lastSample = useRef<number | null>(null);
  const elapsed = useRef(0);
  const milestone = useRef(0);
  const recording = useRef(false);
  const playedToEnd = useRef(false);

  function sample(now: number) {
    const previous = lastSample.current;
    lastSample.current = now;
    if (previous === null || now <= previous) return;

    elapsed.current += now - previous;
    while (milestone.current < 3 && elapsed.current >= (milestone.current + 1) * duration / 4) {
      milestone.current += 1;
      track("demo_progress", { played_percent: milestone.current * 25, video_seconds: tenth(now) });
    }
  }

  return {
    setOrigin: (next: string) => { origin.current = next; },
    start(video: HTMLVideoElement) {
      if (recording.current) return false;
      recording.current = true;
      lastSample.current = video.seeking ? null : video.currentTime;
      track("demo_play", { origin: origin.current, video_seconds: tenth(video.currentTime) });
      return true;
    },
    update(video: HTMLVideoElement) {
      if (!video.paused && recording.current) sample(video.currentTime);
    },
    seek() {
      lastSample.current = null;
      playedToEnd.current = false;
    },
    pause(video: HTMLVideoElement) {
      if (recording.current && !video.seeking && lastSample.current !== null) {
        sample(video.currentTime);
        playedToEnd.current = video.ended;
      }
      recording.current = false;
      lastSample.current = null;
    },
    finish() {
      if (playedToEnd.current) track("demo_complete", { played_seconds: tenth(elapsed.current), video_seconds: duration });
    },
  };
}

export default function BranchVoicePlayer({ ref, children, onTimeChange, onPlay, onSeek, onJump, track }: PlayerProps) {
  const playback = usePlaybackAnalytics(track);
  const hostRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const fullscreenRef = useRef<HTMLButtonElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const captionsRef = useRef<HTMLTrackElement>(null);
  const position = useRef(initialSeconds);
  const shownSecond = useRef(initialWholeSecond);
  const pendingSeek = useRef<number | null>(initialSeconds);
  const activeChapter = useRef(branchVoiceDefaultChapter);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    const host = hostRef.current;
    let wasFullscreen = false;
    function syncFullscreen() {
      const isFullscreen = document.fullscreenElement === host;
      setFullscreen(isFullscreen);
      if (wasFullscreen && !isFullscreen && (document.activeElement === document.body || host?.contains(document.activeElement))) {
        fullscreenRef.current?.focus({ preventScroll: true });
      }
      wasFullscreen = isFullscreen;
    }

    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => {
      video?.pause();
      document.removeEventListener("fullscreenchange", syncFullscreen);
    };
  }, []);

  function drawPosition(seconds: number) {
    position.current = seconds;
    const range = rangeRef.current;
    if (range) {
      range.value = String(tenth(seconds));
      range.style.setProperty("--bv-progress", rangeProgress(seconds));
    }
    const second = Math.floor(seconds);
    if (second !== shownSecond.current) {
      shownSecond.current = second;
      range?.setAttribute("aria-valuetext", rangeLabel(seconds));
      if (clockRef.current) clockRef.current.textContent = replayClock(seconds);
    }
    const chapter = chapterAt(seconds);
    if (chapter !== activeChapter.current) {
      activeChapter.current = chapter;
      onTimeChange(chapter);
    }
  }

  function applyPendingSeek(video: HTMLVideoElement) {
    const seconds = pendingSeek.current;
    if (seconds === null || video.readyState < 1 || !Number.isFinite(video.duration)) return;
    pendingSeek.current = null;
    video.currentTime = Math.min(seconds, video.duration);
  }

  function seek(seconds: number) {
    playback.seek();
    pendingSeek.current = seconds;
    setEnded(false);
    drawPosition(seconds);
    if (videoRef.current) applyPendingSeek(videoRef.current);
  }

  useImperativeHandle(ref, () => ({
    cue(seconds) {
      videoRef.current?.pause();
      seek(seconds);
    },
    pause() {
      videoRef.current?.pause();
    },
    focus() {
      playRef.current?.focus({ preventScroll: true });
      hostRef.current?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
    },
  }));

  function handleTimeUpdate(video: HTMLVideoElement) {
    if (pendingSeek.current !== null || video.seeking) return;
    drawPosition(Math.min(video.currentTime, duration));
    playback.update(video);
  }

  function handlePlaying(video: HTMLVideoElement) {
    setPlaying(true);
    setEnded(false);
    setMessage("");
    if (playback.start(video)) onPlay();
  }

  function play(origin: string) {
    const video = videoRef.current;
    if (!video) return;
    playback.setOrigin(origin);
    setMessage("");
    void video.play().catch((error: DOMException) => {
      if (error.name !== "AbortError" && video.isConnected && !video.error) {
        setMessage("Playback could not start. Try Play again.");
      }
    });
  }

  function retry() {
    const video = videoRef.current;
    if (!video) return;
    pendingSeek.current = position.current;
    setLoadFailed(false);
    setMessage("");
    video.load();
  }

  function toggle(origin: string) {
    const video = videoRef.current;
    if (!video) return;
    if (loadFailed) {
      retry();
    } else if (video.paused) {
      if (video.ended || position.current >= duration) seek(0);
      play(origin);
    } else {
      video.pause();
    }
  }

  function handleVideoKey(event: KeyboardEvent<HTMLVideoElement>) {
    if (event.key === " " && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      if (!event.repeat) toggle("keyboard");
    }
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = branchVoiceChapters.indexOf(activeChapter.current);
    const next = branchVoiceChapters[index + (event.key === "ArrowLeft" ? -1 : 1)];
    if (next) onJump(next, "keyboard");
  }

  function scrub(seconds: number, origin: string) {
    onSeek();
    seek(seconds);
    track("demo_seek", { origin, video_seconds: tenth(seconds) });
  }

  function toggleCaptions() {
    const track = captionsRef.current?.track;
    if (!track) return;
    track.mode = captions ? "disabled" : "showing";
    setCaptions(!captions);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === hostRef.current) await document.exitFullscreen();
      else await hostRef.current?.requestFullscreen();
    } catch {
      setMessage("Full screen is unavailable in this browser.");
    }
  }

  return (
    <section className="bv-player" ref={hostRef} aria-label="Edited recording" data-analytics-section data-section-id="branch_voice_replay" data-section-type="demo">
      <div className="bv-screen">
        <video
          ref={videoRef}
          src={branchVoiceMedia.replay}
          poster={branchVoiceMedia.poster}
          preload="metadata"
          playsInline
          width={1280}
          height={720}
          tabIndex={0}
          aria-label="Japan planning replay. Space plays or pauses. Arrow keys change chapter."
          onLoadedMetadata={(event) => applyPendingSeek(event.currentTarget)}
          onDurationChange={(event) => applyPendingSeek(event.currentTarget)}
          onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget)}
          onSeeking={playback.seek}
          onPlaying={(event) => handlePlaying(event.currentTarget)}
          onPause={(event) => { setPlaying(false); playback.pause(event.currentTarget); }}
          onEnded={() => {
            setPlaying(false);
            setEnded(true);
            playback.finish();
          }}
          onError={(event) => {
            if (event.target !== event.currentTarget) return;
            setLoadFailed(true);
            setPlaying(false);
            setMessage("The recording couldn’t load. You can still explore the chapter snapshots and turn store.");
          }}
          onClick={() => toggle("video")}
          onKeyDown={handleVideoKey}
        >
          <track ref={captionsRef} kind="captions" label="English" srcLang="en" src={branchVoiceMedia.captions} />
        </video>
        {loadFailed && <img src={branchVoiceMedia.poster} alt="Tokyo and Kyoto compared with Furano in Branch Voice" />}
      </div>
      <div className="bv-transport" aria-label="Playback controls" role="group">
        <button ref={playRef} type="button" className="bv-play" onClick={() => toggle("transport")}>
          {playing ? <Pause size={15} fill="currentColor" aria-hidden="true" /> : <Play size={15} fill="currentColor" aria-hidden="true" />}
          {loadFailed ? "Retry" : ended ? "Replay" : playing ? "Pause" : "Play"}
        </button>
        <input
          ref={rangeRef}
          className="bv-seek"
          type="range"
          min={0}
          max={duration}
          step={0.1}
          defaultValue={initialSeconds}
          style={{ "--bv-progress": rangeProgress(initialSeconds) } as CSSProperties}
          aria-label="Seek recording"
          aria-valuetext={rangeLabel(initialSeconds)}
          disabled={loadFailed}
          onInput={(event) => {
            onSeek();
            seek(event.currentTarget.valueAsNumber);
          }}
          onPointerUp={() => {
            if (rangeRef.current) track("demo_seek", { origin: "slider", video_seconds: rangeRef.current.valueAsNumber });
          }}
          onKeyDown={(event) => {
            const time = event.currentTarget.valueAsNumber;
            const targets: Record<string, number> = {
              ArrowLeft: time - 2, ArrowDown: time - 2, ArrowRight: time + 2, ArrowUp: time + 2,
              Home: 0, End: duration, PageUp: time + 10, PageDown: time - 10,
            };
            const next = targets[event.key];
            if (next === undefined) return;
            event.preventDefault();
            scrub(Math.max(0, Math.min(duration, next)), "keyboard");
          }}
        />
        <span className="bv-clock"><span ref={clockRef}>{replayClock(initialSeconds)}</span> / {replayClock(duration)}</span>
        <button type="button" className="bv-icon-button" disabled={loadFailed} aria-label="Mute audio" aria-pressed={muted}
          onClick={() => { if (videoRef.current) videoRef.current.muted = !muted; setMuted(!muted); }}>
          {muted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
        </button>
        <button type="button" className="bv-icon-button" disabled={loadFailed} aria-label="Captions" aria-pressed={captions} onClick={toggleCaptions}>
          <Captions size={17} aria-hidden="true" />
        </button>
        {document.fullscreenEnabled && (
          <button ref={fullscreenRef} type="button" className="bv-icon-button" aria-label={fullscreen ? "Exit full screen" : "Full screen"} disabled={loadFailed} onClick={() => void toggleFullscreen()}>
            {fullscreen ? <Minimize size={17} aria-hidden="true" /> : <Maximize size={17} aria-hidden="true" />}
          </button>
        )}
        <button type="button" className="bv-from-start" disabled={loadFailed} onClick={() => {
          onJump(branchVoiceChapters[0], "from_start");
          playRef.current?.focus({ preventScroll: true });
          play("from_start");
        }}>From start</button>
      </div>
      {children}
      <p className={message ? "bv-media-message" : "bv-sr-only"} role="status">{message}</p>
    </section>
  );
}
