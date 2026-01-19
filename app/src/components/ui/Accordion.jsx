import { useState } from 'react';
import './Accordion.css';

export default function Accordion({
  title,
  subtitle,
  children,
  borderLeftColor,
  defaultOpen = false,
  subtitleElement,
  titleElement,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="accordion"
      style={borderLeftColor ? { borderLeft: `3px solid ${borderLeftColor}` } : undefined}
    >
      <div
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ flex: 1 }}>
          {titleElement ? (
            titleElement
          ) : (
            <div className="accordion-title">{title}</div>
          )}
          {subtitleElement ? (
            subtitleElement
          ) : subtitle && (
            <div className="accordion-subtitle">{subtitle}</div>
          )}
        </div>
        <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>
          <i className="fas fa-chevron-down"></i>
        </span>
      </div>
      {isOpen && children && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}
