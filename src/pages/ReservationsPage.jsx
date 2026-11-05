import { useEffect, useState } from 'react';
import { getReservations } from '../services/service.js';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { ReservationCard } from '../components/ReservationCard.jsx';

export function ReservationsPage() {
  const [request, setRequest] = useState({ status: 'loading', items: [], error: '' });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setRequest({ status: 'loading', items: [], error: '' });
    getReservations({ signal: controller.signal })
      .then((items) => setRequest({ status: 'success', items, error: '' }))
      .catch((error) => { if (error.name !== 'AbortError') setRequest({ status: 'error', items: [], error: error.message }); });
    return () => controller.abort();
  }, [revision]);
  return <div className="container reservations-page"><div className="page-intro"><p className="eyebrow">YOUR GOOD FINDS</p><h1>My <em>reservations.</em></h1><p>Your saved bags, with prices and pickup details in one place.</p></div>
    {request.status === 'loading' && <div className="reservation-loading" role="status"><div className="shimmer skeleton-line title" /><div className="shimmer skeleton-line" /><span className="sr-only">Loading reservations…</span></div>}
    {request.status === 'error' && <ErrorState message={request.error} onRetry={() => setRevision((value) => value + 1)} />}
    {request.status === 'success' && (request.items.length ? <div className="reservations-list">{request.items.map((item) => <ReservationCard key={item.id} reservation={item} />)}</div> : <EmptyState kind="reservations" />)}
  </div>;
}
