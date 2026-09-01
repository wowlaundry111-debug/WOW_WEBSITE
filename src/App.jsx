import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedCustomerRoute = () => {
  const { currentUser, currentTenantId } = useAppStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'Customer') return <Navigate to="/" replace />;
  if (!currentTenantId) return <Navigate to="/shop-select" replace />;
  return <Outlet />;
};

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

import SocketManager from './components/SocketManager';
import { useAppStore } from './store/useAppStore';

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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop-select" element={<ProtectedShopSelectRoute />} />
            <Route element={<ProtectedCustomerRoute />}>
              <Route path="/order" element={<CustomerHome />} />
              <Route path="/order/:categoryId" element={<CategoryItems />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-history" element={<OrderHistory />} />
            </Route>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/delivery" element={<DeliveryDashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
