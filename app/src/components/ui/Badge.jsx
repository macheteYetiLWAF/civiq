import './Badge.css';

export default function Badge({
  variant = 'earned',
  icon,
  label
}) {
  return (
    <div className={`badge badge-${variant}`}>
      {icon && (
        <div className="badge-icon">
          <i className={icon}></i>
        </div>
      )}
      {label && <span className="badge-label">{label}</span>}
    </div>
  );
}
