import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/home', icon: 'fa-layer-group', label: 'Stack' },
  { to: '/leaders', icon: 'fa-landmark', label: 'Leaders' },
  { to: '/media', icon: 'fa-newspaper', label: 'Media' },
  { to: '/learn', icon: 'fa-graduation-cap', label: 'Learn' }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className={`fas ${item.icon}`}></i>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
