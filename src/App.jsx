import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SocketManager from './components/SocketManager';
import { useAppStore } from './store/useAppStore';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ShopSelect = lazy(() => import('./pages/customer/ShopSelect'));
const CustomerHome = lazy(() => import('./pages/customer/CustomerHome'));
const CategoryItems = lazy(() => import('./pages/customer/CategoryItems'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const OrderHistory = lazy(() => import('./pages/customer/OrderHistory'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/delivery/DeliveryDashboard'));

// ── Route Guards ──────────────────────────────────────────────────────────────

// Requires login. After login, routes customer to /shop-select, admin to /admin, etc.
const ProtectedRoute = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Customer-only route: must be logged in AND have a shop selected
const ProtectedCustomerRoute = () => {
  const { currentUser, currentTenantId } = useAppStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'Customer') return <Navigate to="/" replace />;
  if (!currentTenantId) return <Navigate to="/shop-select" replace />;
  return <Outlet />;
};

// Shop-select: logged in required, routes staff directly to their dashboard
const ProtectedShopSelectRoute = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'SuperAdmin' || currentUser.role === 'ShopAdmin') return <Navigate to="/admin" replace />;
  if (currentUser.role === 'Delivery') return <Navigate to="/delivery" replace />;
  return <ShopSelect />;
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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/delivery" element={<DeliveryDashboard />} />

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
