import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { BagDetailsPage } from './pages/BagDetailsPage.jsx';
import { AddBagPage } from './pages/AddBagPage.jsx';
import { ReservationsPage } from './pages/ReservationsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

const BagsPage = lazy(() => import('./pages/BagsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));

export default function App() {
  return <Routes><Route element={<RootLayout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="bags" element={<BagsPage />} />
    <Route path="bags/:id" element={<BagDetailsPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="add" element={<AddBagPage />} />
    <Route path="reservations" element={<ReservationsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes>;
}
