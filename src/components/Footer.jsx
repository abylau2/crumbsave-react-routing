import { Link } from 'react-router-dom';
import { Brand } from './Brand.jsx';

export function Footer() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div><Brand /><p>Good food, another chance.<br />A little less waste. A lot more taste.</p></div>
      <nav aria-label="Footer navigation"><Link to="/bags">Explore bags</Link><Link to="/#how-it-works">How it works</Link><Link to="/about">About</Link><Link to="/dashboard">Dashboard</Link><Link to="/login">Login</Link><Link to="/add">List a bag</Link><Link to="/reservations">My reservations</Link></nav>
      <div className="footer-note"><strong>Made for Almaty, Kazakhstan.</strong><p>Student project with unofficial fan-inspired listings and fictional sellers. Reservations do not place real orders.</p></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} CrumbSave</span><span>Made with a second chance in mind.</span></div>
  </footer>;
}
