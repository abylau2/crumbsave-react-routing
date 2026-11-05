import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Clock3, MapPin, ShoppingBag } from 'lucide-react';
import { getBagById, getReservations, reserveBag } from '../services/service.js';
import { ErrorState } from '../components/States.jsx';
import { discountPercent, formatKzt, pickupWindow } from '../utils/catalog.js';
import { imageSrc } from '../utils/imageSrc.js';

export function BagDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const catalog = /^\/bags(?:\?|$)/.test(location.state?.catalog || '') ? location.state.catalog : '/bags';
  function goBack() {
    if (location.state?.fromApp && window.history.state?.idx > 0) navigate(-1);
    else navigate(catalog);
  }
  const [request, setRequest] = useState({ status: 'loading', bag: null, error: '', reserved: false });
  const [action, setAction] = useState({ status: 'idle', message: '' });
  const [revision, setRevision] = useState(0);
  const reservationController = useRef(null);
  const reservationPending = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setRequest({ status: 'loading', bag: null, error: '', reserved: false });
    setAction({ status: 'idle', message: '' });
    Promise.all([getBagById(id, { signal: controller.signal }), getReservations({ signal: controller.signal })])
      .then(([bag, reservations]) => setRequest({ status: 'success', bag, error: '', reserved: reservations.some((item) => item.bagId === id) }))
      .catch((error) => { if (error.name !== 'AbortError') setRequest({ status: 'error', bag: null, error: error.message, reserved: false }); });
    return () => { controller.abort(); reservationController.current?.abort(); };
  }, [id, revision]);

  async function reserve() {
    if (!request.bag || reservationPending.current || request.reserved) return;
    reservationPending.current = true;
    const controller = new AbortController();
    reservationController.current = controller;
    setAction({ status: 'pending', message: '' });
    try {
      const result = await reserveBag(id, { signal: controller.signal });
      setRequest((current) => ({ ...current, bag: result.bag, reserved: true }));
      setAction({ status: 'success', message: 'A good find is yours. Your reservation is saved.' });
    } catch (error) {
      if (error.name !== 'AbortError') setAction({ status: 'error', message: error.message });
    } finally {
      reservationPending.current = false;
      if (!controller.signal.aborted) reservationController.current = null;
    }
  }

  if (request.status === 'loading') return <div className="container detail-loading"><div className="shimmer detail-placeholder" /><div><div className="shimmer skeleton-line title" /><div className="shimmer skeleton-line" /><div className="shimmer skeleton-line medium" /></div><span className="sr-only">Loading bag details…</span></div>;
  if (request.status === 'error') return <div className="container page-state"><ErrorState message={request.error} onRetry={() => setRevision((value) => value + 1)} /></div>;
  if (!request.bag) return <div className="container page-state"><p className="eyebrow">BAG NOT FOUND</p><h1>Looks like this one's gone missing.</h1><p>That bag might have been removed or the link may be wrong.</p><Link className="back-link" to="/">Home</Link><Link className="button button-primary" to={catalog}>Explore bags <ArrowUpRight size={17} /></Link></div>;
  const bag = request.bag;
  const soldOut = bag.quantity === 0;
  return <div className="container detail-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to={catalog}>Explore bags</Link><span>/</span><span aria-current="page">{bag.title}</span></nav>
    <div className="detail-grid"><div className="detail-media"><img src={imageSrc(bag.image)} width="1000" height="750" alt={`Image of ${bag.title}`} /><div className="detail-image-caption">GOOD FOOD, ONE MORE CHANCE <span>CRUMBSAVE · ALMATY</span></div></div>
      <div className="detail-info"><p className="eyebrow">{bag.category.toUpperCase()} · ALMATY</p><h1>{bag.title}</h1><p className="detail-business">by {bag.businessName}</p>{bag.reference && <p className="detail-reference">Inspired by {bag.reference} · Unofficial fan-inspired listing</p>}<p className="detail-description">{bag.description} The exact contents can vary from day to day.</p>
        <div className="detail-facts"><div><MapPin size={20} /><div><span>Pickup area</span><strong>{bag.district}, Almaty</strong></div></div><div><Clock3 size={20} /><div><span>Pickup window</span><strong>{pickupWindow(bag)}</strong></div></div><div><ShoppingBag size={20} /><div><span>Availability</span><strong>{soldOut ? 'Sold out' : `${bag.quantity} ${bag.quantity === 1 ? 'bag' : 'bags'} left`}</strong></div></div></div>
        <div className="reservation-panel"><div className="reservation-price"><div><del>{formatKzt(bag.originalPrice)}</del><strong>{formatKzt(bag.price)}</strong></div><span className="discount-tag inline">SAVE {discountPercent(bag)}%</span></div><p>Saved in this browser. No payment is taken.</p><button className="button button-primary button-full" type="button" disabled={soldOut || request.reserved || action.status === 'pending'} onClick={reserve}>{action.status === 'pending' ? 'Reserving…' : request.reserved ? 'Already reserved' : soldOut ? 'Sold out' : 'Reserve this bag'} <ArrowUpRight size={18} /></button>
          {action.message && <p className={`feedback ${action.status}`} role={action.status === 'error' ? 'alert' : 'status'}>{action.message}{action.status === 'success' && <> <Link to="/reservations">View my reservations <ArrowUpRight size={15} /></Link></>}</p>}</div>
      </div></div>
    <div className="surprise-info"><div><p className="eyebrow">A LITTLE NOTE</p><h2>What's inside a <em>Surprise Bag?</em></h2></div><p>The exact selection depends on what's left at the end of the day. The category, pickup area, and price are shown before you reserve; the contents are the surprise.</p></div>
    <div className="detail-navigation"><button className="button button-secondary" type="button" onClick={goBack}><ArrowLeft size={18} /> Back</button><Link className="back-link" to={catalog}>All Bags</Link></div>
  </div>;
}
