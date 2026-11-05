import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Brand } from './Brand.jsx';

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  const close = () => setOpen(false);
  return <header className="site-header">
    <div className="container header-inner">
      <Brand onClick={close} />
      <button className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      <nav id="primary-navigation" className={`primary-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        <NavLink to="/" end onClick={close} className="nav-link">Home</NavLink>
        <NavLink to="/bags" onClick={close} className="nav-link">Explore Bags</NavLink>
        <NavLink to="/about" onClick={close} className="nav-link">About</NavLink><NavLink to="/dashboard" onClick={close} className="nav-link">Dashboard</NavLink><NavLink to="/login" onClick={close} className="nav-link">Login</NavLink>
        <NavLink to="/reservations" onClick={close} className="nav-link">My reservations</NavLink>
        <Link to="/add" onClick={close} className="button button-primary header-cta">List a bag <ArrowUpRight size={16} /></Link>
      </nav>
    </div>
  </header>;
}
