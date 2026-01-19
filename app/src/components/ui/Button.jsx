import './Button.css';

export default function Button({
  variant = 'primary',
  fullWidth = false,
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    fullWidth ? 'btn-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
