import './Card.css';

export default function Card({
  children,
  borderLeft,
  gradient = false,
  padding = 'normal',
  className = '',
  onClick
}) {
  const classNames = [
    'card',
    `card-padding-${padding}`,
    gradient ? 'card-gradient' : '',
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  const style = borderLeft ? { borderLeftColor: borderLeft } : {};

  return (
    <div
      className={classNames}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
