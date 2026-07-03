import { useEffect, useRef, useState } from "react";
import "./HeroTurbine.css";
import turbineVideo from "../assets/Turbine-spininng.mp4";

function getPlaybackRate(rpm) {
  if (!rpm || rpm <= 0) return 0.5;
  return Math.min(3, Math.max(0.5, 0.5 + rpm / 400));
}

function HeroTurbine({ data, isRunning }) {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const rate = getPlaybackRate(data.genSpeed_rpm);
    video.playbackRate = rate;

    if (isRunning) {
      video
        .play()
        .catch(() => {
          // ignore autoplay rejection, we still show the video if available
        });
    } else {
      video.pause();
    }
  }, [isRunning, data.genSpeed_rpm]);

  return (
    <section className={`turbine-card ${isRunning ? "turbine-active" : ""}`}>
      {/* Header */}
      <div className="turbine-header">
        <div>
          <p className="eyebrow">Animated Turbine Unit</p>
          <h2>Main Generator Turbine</h2>
        </div>
        <div className={`machine-badge ${isRunning ? "badge-active" : "badge-idle"}`}>
          {isRunning ? "● ACTIVE" : "● IDLE"}
        </div>
      </div>

      {/* Stage */}
      <div className="turbine-stage">
        <div className="grid-overlay" />

        {/* Water inlet pipe */}
        <div className="pipe-in">
          {isRunning && (
            <>
              <span className="flow" />
              <span className="flow" />
              <span className="flow" />
            </>
          )}
        </div>
        <div className="penstock-label">
          PENSTOCK<br />{data.penstockPressure_bar.toFixed(2)} bar
        </div>

        {/* Runner */}
        <div className="runner-wrap">
          <div className={`turbine-video-card ${isRunning ? "video-live" : "video-idle"}`}>
            <video
              ref={videoRef}
              className="turbine-video"
              src={turbineVideo}
              poster="/icons.svg"
              preload="auto"
              autoPlay={!!isRunning}
              loop
              muted
              playsInline
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0.05;
                }
              }}
              onError={() => setVideoError(true)}
            />
            <div className="video-overlay">
              <div className="video-arrow top" />
              <div className="video-arrow right" />
              <div className="video-arrow bottom" />
              <div className="video-arrow left" />
              <div className="rpm-indicator">
                <div className="rpm-arrow-icon" />
                <span>{Math.round(data.genSpeed_rpm)} RPM</span>
              </div>
              <div className="video-glow" />
            </div>
            {videoError && (
              <div className="video-pause-state">VIDEO UNAVAILABLE</div>
            )}
            {!videoError && !isRunning && (
              <div className="video-pause-state">IDLE</div>
            )}
          </div>
        </div>

        {/* Generator block */}
        <div className="gen-block">
          <div className="gen-label">Generator</div>
          <div className="gen-text">GEN</div>
          <div className="gen-divider" />
          <div className="gen-current">{data.genCurrentL1_A.toFixed(0)} A</div>
        </div>

        {/* Power beam */}
        {isRunning && (
          <div className="power-beam">
            <span />
          </div>
        )}

      </div>

      {/* Bottom metrics */}
      <div className="turbine-metrics">
        <div className="t-metric">
          <span>Penstock Pressure</span>
          <strong>{data.penstockPressure_bar.toFixed(2)} bar</strong>
        </div>
        <div className="t-metric">
          <span>Hydraulic Pressure</span>
          <strong>{data.hydPressure_bar.toFixed(1)} bar</strong>
        </div>
        <div className="t-metric">
          <span>Head Water Level</span>
          <strong>{data.headWaterLevel_cm.toFixed(1)} cm</strong>
        </div>
      </div>
    </section>
  );
}

export default HeroTurbine;