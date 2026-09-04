import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SocketManager from './components/SocketManager';
import { useAppStore } from './store/useAppStore';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register')); // Shows "contact admin" page
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/delivery/DeliveryDashboard'));

// ── Staff-Only Route Guard ────────────────────────────────────────────────────
// The website is a STAFF portal. Only SuperAdmin, ShopAdmin, and Delivery
// roles may access protected routes. Customers use the mobile app.
const ProtectedStaffRoute = ({ allowedRoles }) => {
  const currentUser = useAppStore((state) => state.currentUser);

  if (!currentUser) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Logged-in but wrong role (e.g. Customer somehow got a token)
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function SkeletonFallback() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-50">
      <div className="w-full max-w-4xl p-5">
        <Skeleton height={50} width="40%" className="mb-5" />
        <Skeleton height={30} width="60%" className="mb-3" />
        <Skeleton height={20} width="80%" className="mb-3" />
        <Skeleton height={20} width="70%" className="mb-3" />
        <Skeleton height={400} className="mt-5" />
      </div>
    </div>
  );
}

function App() {
  const initializeAppData = useAppStore((state) => state.initializeAppData);

  React.useEffect(() => {
    initializeAppData();
  }, [initializeAppData]);

  return (
    <>
      <SocketManager />
      <BrowserRouter>
        <Suspense fallback={<SkeletonFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* /register shows "contact admin" info — not a real registration form */}
            <Route path="/register" element={<Register />} />

            {/* Admin Dashboard — SuperAdmin + ShopAdmin only */}
            <Route element={<ProtectedStaffRoute allowedRoles={['SuperAdmin', 'ShopAdmin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Delivery Dashboard — Delivery staff only */}
            <Route element={<ProtectedStaffRoute allowedRoles={['Delivery']} />}>
              <Route path="/delivery" element={<DeliveryDashboard />} />
            </Route>

            {/* Catch-all — redirect unknown paths to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
