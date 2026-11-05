import { useEffect, useState } from 'react';
import { getBags } from '../services/service.js';

export function useBags() {
  const [request, setRequest] = useState({ status: 'loading', bags: [], error: '' });
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setRequest((current) => ({ ...current, status: 'loading', error: '' }));
    getBags({ signal: controller.signal })
      .then((bags) => setRequest({ status: 'success', bags, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setRequest({ status: 'error', bags: [], error: error.message });
      });
    return () => controller.abort();
  }, [revision]);

  return { ...request, retry: () => setRevision((value) => value + 1) };
}
