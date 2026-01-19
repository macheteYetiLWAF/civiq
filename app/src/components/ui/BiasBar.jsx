import './BiasBar.css';

export default function BiasBar({
  position = 50,
  showMarker = true
}) {
  // Clamp position between 0 and 100
  const clampedPosition = Math.max(0, Math.min(100, position));

  return (
    <div className="bias-bar">
      <div className="bias-bar-track">
        <div className="bias-bar-gradient"></div>
        {showMarker && (
          <div
            className="bias-bar-marker"
            style={{ left: `${clampedPosition}%` }}
          >
            <div className="bias-bar-marker-dot"></div>
          </div>
        )}
      </div>
      <div className="bias-bar-labels">
        <span className="bias-bar-label bias-bar-label-left">Left</span>
        <span className="bias-bar-label bias-bar-label-center">Center</span>
        <span className="bias-bar-label bias-bar-label-right">Right</span>
      </div>
    </div>
  );
}
