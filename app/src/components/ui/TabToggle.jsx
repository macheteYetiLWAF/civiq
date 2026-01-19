import './TabToggle.css';

export default function TabToggle({
  options = [],
  activeValue,
  onChange
}) {
  return (
    <div className="tab-toggle">
      {options.map((option) => (
        <button
          key={option.value}
          className={`tab-toggle-option ${activeValue === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
