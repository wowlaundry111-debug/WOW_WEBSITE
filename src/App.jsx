import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ScrollToTop from './components/ScrollToTop';
import { useAppStore } from './store/useAppStore';

const SocketManager = lazy(() => import('./components/SocketManager'));

import Home from './pages/Home';
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ShopSelect = lazy(() => import('./pages/customer/ShopSelect'));
const CustomerHome = lazy(() => import('./pages/customer/CustomerHome'));
const CategoryItems = lazy(() => import('./pages/customer/CategoryItems'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const OrderHistory = lazy(() => import('./pages/customer/OrderHistory'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/delivery/DeliveryDashboard'));
const OperatorPortal = lazy(() => import('./pages/operator/OperatorPortal'));

// ── Route Guards ──────────────────────────────────────────────────────────────

// Customer-only or Staff POS route: must be logged in AND have a shop selected
const ProtectedCustomerRoute = () => {
  const { currentUser, currentTenantId } = useAppStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  const isAllowed =
    currentUser.role === 'Customer' ||
    currentUser.email?.toLowerCase().trim() === 'wowlaundry111@gmail.com' ||
    currentUser.role === 'SuperAdmin' ||
    currentUser.role === 'ShopAdmin';
  if (!isAllowed) return <Navigate to="/" replace />;
  if (!currentTenantId) return <Navigate to="/shop-select" replace />;
  return <Outlet />;
};

// Shop-select: logged in required, routes delivery/operator directly to their dashboard
const ProtectedShopSelectRoute = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'Delivery') return <Navigate to="/delivery" replace />;
  if (currentUser.role === 'Operator') return <Navigate to="/operator" replace />;
  return <ShopSelect />;
};

// Staff Admin route: blocks wowlaundry111@gmail.com and customers from admin pages
const ProtectedAdminRoute = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.email?.toLowerCase().trim() === 'wowlaundry111@gmail.com') {
    return <Navigate to="/shop-select" replace />;
  }
  if (currentUser.role !== 'ShopAdmin' && currentUser.role !== 'SuperAdmin') {
    return <Navigate to="/shop-select" replace />;
  }
  return <AdminDashboard />;
};

function SkeletonFallback() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#FAF7F2]">
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
  const currentUser = useAppStore((state) => state.currentUser);

  React.useEffect(() => {
    initializeAppData();

    // Idle route prefetching — loads chunks into browser cache during idle time
    // Eliminates route transition delay when user clicks navigation buttons
    const prefetchKeyRoutes = () => {
      const routes = [
        () => import('./pages/customer/CustomerHome'),
        () => import('./pages/customer/CategoryItems'),
        () => import('./pages/customer/Cart'),
        () => import('./pages/customer/OrderHistory'),
        () => import('./pages/customer/ShopSelect'),
        () => import('./pages/auth/Login'),
        () => import('./pages/auth/Register'),
      ];
      routes.forEach((load) => {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(() => { load().catch(() => {}); });
        } else {
          setTimeout(() => { load().catch(() => {}); }, 1200);
        }
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchKeyRoutes);
    } else {
      setTimeout(prefetchKeyRoutes, 1000);
    }
  }, [initializeAppData]);

  return (
    <>
      {currentUser && (
        <Suspense fallback={null}>
          <SocketManager />
        </Suspense>
      )}
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<SkeletonFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Shop selection — for customers only, staff get redirected */}
            <Route path="/shop-select" element={<ProtectedShopSelectRoute />} />

            {/* Customer routes — requires Customer role + shop selected */}
            <Route element={<ProtectedCustomerRoute />}>
              <Route path="/order" element={<CustomerHome />} />
              <Route path="/order/:categoryId" element={<CategoryItems />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-history" element={<OrderHistory />} />
            </Route>

            {/* Staff routes — protected by role inside the dashboards themselves */}
            <Route path="/admin" element={<ProtectedAdminRoute />} />
            <Route path="/delivery" element={<DeliveryDashboard />} />
            <Route path="/operator" element={<OperatorPortal />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
