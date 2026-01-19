import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/stack" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><i className="fa-solid fa-layer-group"></i></span>
        Stack
      </NavLink>
      <NavLink to="/leaders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><i className="fa-solid fa-landmark"></i></span>
        Leaders
      </NavLink>
      <NavLink to="/media" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><i className="fa-solid fa-file-lines"></i></span>
        Media
      </NavLink>
      <NavLink to="/learn" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><i className="fa-solid fa-graduation-cap"></i></span>
        Learn
      </NavLink>
    </nav>
  )
}
