import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { 
  Package, Clock, CheckCircle, Navigation, Sparkles, CreditCard, 
  Phone, MessageCircle, XCircle, ChevronDown, ChevronUp, Scale, AlertCircle, AlertTriangle 
} from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function OrderHistory() {
  const { orders, fetchOrders, isOrdersLoading, currentUser, cancelOrder, shops } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const successMsg = location.state?.successMsg;

  const [expandedOrders, setExpandedOrders] = useState({});
  const [now, setNow] = useState(Date.now());
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchOrders(1);
    }
  }, [currentUser, fetchOrders]);

  // Real-time 10-second ticker for remaining cancellation time
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-outfit selection:bg-black selection:text-[#9AE600]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-black font-black uppercase tracking-widest mb-6">Please login to view your orders</p>
          <button onClick={() => navigate('/login')} className="bg-[#9AE600] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all text-black px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-lg">Login</button>
        </div>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED':
      case 'PENDING': return 'text-black bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'ACCEPTED': return 'text-white bg-[#0D8DE3] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'PICKUP_ASSIGNED':
      case 'OUT_FOR_PICKUP': return 'text-black bg-purple-300 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'PICKED_UP': return 'text-black bg-teal-300 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'WASHING':
      case 'IN_PROCESSING': return 'text-black bg-pink-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'IRONING':
      case 'READY_FOR_DELIVERY': return 'text-black bg-teal-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'OUT_FOR_DELIVERY': return 'text-black bg-orange-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'DELIVERED': return 'text-black bg-[#9AE600] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'CANCELLED': return 'text-white bg-red-600 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      default: return 'text-black bg-gray-200 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
    }
  };

  const getCleanPhone = (phone) => {
    if (!phone) return '';
    return String(phone).replace(/[^0-9]/g, '');
  };

  const getShopContact = (order) => {
    if (order.shopPhone) return order.shopPhone;
    const shop = (shops || []).find(s => s._id === order.shopId);
    return shop?.contactNumber || '9999999999';
  };

  const getWaLink = (phone, orderId) => {
    const clean = getCleanPhone(phone);
    if (!clean) return '#';
    const intlPhone = clean.length === 10 ? '91' + clean : clean;
    const msg = encodeURIComponent(`Hi, I need help with my WOW Laundry Order #${String(orderId).slice(-6).toUpperCase()}`);
    return `https://wa.me/${intlPhone}?text=${msg}`;
  };

  const getCancelTimeRemainingMs = (createdAt) => {
    if (!createdAt) return 0;
    const elapsed = now - new Date(createdAt).getTime();
    return Math.max(0, (15 * 60 * 1000) - elapsed);
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);
    setCancelError('');
    const res = await cancelOrder(cancelModalOrder._id, 'Cancelled by customer within 15 minutes');
    setIsCancelling(false);
    if (res.success) {
      setCancelModalOrder(null);
    } else {
      setCancelError(res.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-outfit selection:bg-black selection:text-[#9AE600]">
      <Navbar />

      <div className="max-w-4xl w-full mx-auto px-3.5 sm:px-4 py-4 sm:py-8 flex-1">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="inline-block bg-[#0D8DE3] border-2 border-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_rgba(0,0,0,1)] transform -rotate-1">
            <h1 className="text-2xl sm:text-4xl lilita-one-regular text-white uppercase tracking-wider">
              My <span className="text-[#9AE600]">Orders</span>
            </h1>
          </div>
          <Link to="/order" className="bg-[#9AE600] hover:bg-[#86d000] border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all text-black font-black px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-xl uppercase tracking-wider text-xs sm:text-base">
            New Order
          </Link>
        </div>

        {successMsg && (
          <div className="mb-4 sm:mb-6 bg-[#9AE600] border-2 border-black rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-fade-in-up">
            <div className="bg-black text-[#9AE600] rounded-full border-2 border-black shrink-0 mt-0.5 p-1">
              <CheckCircle size={20} />
            </div>
            <div>
              <h3 className="font-black text-black text-base sm:text-lg uppercase tracking-wider">Order Placed Successfully!</h3>
              <p className="text-xs text-black font-bold uppercase mt-0.5 bg-white inline-block px-2 py-0.5 border border-black rounded-md">{successMsg}</p>
            </div>
          </div>
        )}

        {isOrdersLoading && orders.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-black"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            <div className="w-20 h-20 bg-[#0D8DE3] border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <Package size={36} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-black mb-2 lilita-one-regular uppercase tracking-wide">No orders yet</h3>
            <p className="text-gray-700 font-bold mb-6 text-xs sm:text-sm uppercase tracking-wider">Looks like you haven't placed any orders.</p>
            <Link to="/order" className="inline-block bg-[#9AE600] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all text-black font-black px-6 py-3 rounded-xl uppercase tracking-wider text-base">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => {
              const isExpanded = !!expandedOrders[order._id];
              const isKgCheck = (it) => it.unit === 'KG' || (typeof it.name === 'string' && (it.name.toLowerCase().includes('per kg') || it.name.toLowerCase().includes('/ kg'))) || Boolean(it.kgWeight && it.kgWeight > 0);
              const hasKgItems = (order.items || []).some(isKgCheck);
              const isKgPending = hasKgItems && !order.kgPriceUpdated;
              const perItemProducts = (order.items || []).filter(it => !isKgCheck(it));
              const perKgProducts = (order.items || []).filter(isKgCheck);

              const shopContact = getShopContact(order);
              const deliveryPhone = order.deliveryBoyPhone || '';
              const cancelRemainingMs = getCancelTimeRemainingMs(order.createdAt);
              const canCancel = ['PLACED', 'ACCEPTED', 'PICKUP_ASSIGNED'].includes(order.status) && cancelRemainingMs > 0;
              const cancelMinsLeft = Math.ceil(cancelRemainingMs / 60000);

              return (
                <div 
                  key={order._id} 
                  className="bg-white rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden transition-all"
                >
                  {/* Order Tab Header / Summary Dock */}
                  <div className="p-3.5 sm:p-5 border-b-2 border-black bg-gray-50 flex flex-col gap-3">
                    {/* Top Row: Order ID, Date, Status */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-black bg-[#9AE600] border border-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Middle Row: Bill Total, Mode & Quick Help Icons */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-black lilita-one-regular">
                          ₹{order.totalAmount}
                        </span>
                        {isKgPending ? (
                          <span className="text-[10px] font-black bg-yellow-300 text-black border border-black px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1">
                            <Scale size={11} strokeWidth={2.5} /> KG Pending at Pickup
                          </span>
                        ) : hasKgItems && order.kgPriceUpdated ? (
                          <span className="text-[10px] font-black bg-[#9AE600] text-black border border-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                            ✓ Weighed at Pickup
                          </span>
                        ) : null}

                        {order.paymentMode && (
                          <span className="text-[10px] font-black uppercase text-gray-700 bg-white border border-gray-300 px-2 py-0.5 rounded-md hidden sm:inline-flex items-center gap-1">
                            <CreditCard size={11} /> {order.paymentMode === 'COD' ? 'CASH' : order.paymentMode}
                          </span>
                        )}
                      </div>

                      {/* Quick Contact Icons (Shop Admin & Delivery Agent) */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Shop Admin Help Icons */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                          <span className="text-[10px] font-black uppercase text-gray-600 px-1">Shop:</span>
                          <a 
                            href={`tel:${shopContact}`}
                            title="Call Shop Support"
                            className="w-7 h-7 bg-[#0D8DE3] hover:bg-blue-600 text-white rounded-lg flex items-center justify-center border border-black transition-colors"
                          >
                            <Phone size={13} strokeWidth={2.5} />
                          </a>
                          <a 
                            href={getWaLink(shopContact, order._id, 'shop')}
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="WhatsApp Shop Support"
                            className="w-7 h-7 bg-[#25D366] hover:bg-green-600 text-white rounded-lg flex items-center justify-center border border-black transition-colors"
                          >
                            <MessageCircle size={13} strokeWidth={2.5} />
                          </a>
                        </div>

                        {/* Assigned Rider Contact Icons */}
                        {(order.deliveryBoyName || order.deliveryBoyId) && (
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                            <span className="text-[10px] font-black uppercase text-black px-1">
                              Delivery:
                            </span>
                            {deliveryPhone && (
                              <a 
                                href={`tel:${deliveryPhone}`}
                                title="Call Delivery Agent"
                                className="w-7 h-7 bg-[#9AE600] hover:bg-[#86d000] text-black rounded-lg flex items-center justify-center border border-black transition-colors"
                              >
                                <Phone size={13} strokeWidth={2.5} />
                              </a>
                            )}
                            {deliveryPhone && (
                              <a 
                                href={getWaLink(deliveryPhone, order._id, 'rider')}
                                target="_blank" 
                                rel="noopener noreferrer"
                                title="WhatsApp Delivery Agent"
                                className="w-7 h-7 bg-[#25D366] hover:bg-green-600 text-white rounded-lg flex items-center justify-center border border-black transition-colors"
                              >
                                <MessageCircle size={13} strokeWidth={2.5} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Bar: Cancel Button (15m window) & Slide Toggle */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200">
                      <div>
                        {canCancel ? (
                          <button
                            onClick={() => setCancelModalOrder(order)}
                            className="bg-red-100 hover:bg-red-200 text-red-800 border border-red-400 rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
                          >
                            <XCircle size={13} strokeWidth={2.5} /> Cancel Order ({cancelMinsLeft}m left)
                          </button>
                        ) : order.status === 'CANCELLED' ? (
                          <span className="text-[10px] font-bold uppercase text-red-600 flex items-center gap-1">
                            <AlertCircle size={12} /> {order.cancellationReason || 'Order Cancelled'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500 uppercase">
                            {order.items?.length || 0} items
                          </span>
                        )}
                      </div>

                      {/* Accordion / Slide Toggle Button */}
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="bg-black hover:bg-gray-800 text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-black flex items-center gap-1.5 shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Full Info'}</span>
                        {isExpanded ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>

                  {/* ── Slide / Drawer: Full Order Details (Collapsible) ── */}
                  {isExpanded && (
                    <div className="p-3.5 sm:p-5 bg-white space-y-4 border-t-2 border-black animate-fade-in-up">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {/* ── Left Column: Per-Item Category ── */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-black flex items-center gap-1.5 uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-lg border border-black">
                              <Package size={13} /> Per-Item Products ({perItemProducts.length})
                            </h4>
                          </div>
                          
                          {perItemProducts.length === 0 ? (
                            <div className="p-3 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                              <p className="text-[11px] font-bold text-gray-400 uppercase">No per-piece items</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {perItemProducts.map((item, iIdx) => (
                                <div key={iIdx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-gray-50 border border-gray-200">
                                  <div className="truncate pr-2">
                                    <span className="font-bold text-black uppercase">{item.quantity}x {item.name}</span>
                                    {(item.categoryName || item.subCategoryName) && (
                                      <p className="text-[10px] font-bold text-gray-500 uppercase truncate">
                                        {item.categoryName}{item.subCategoryName ? ` › ${item.subCategoryName}` : ''}
                                      </p>
                                    )}
                                  </div>
                                  <span className="font-black text-black bg-[#9AE600] border border-black px-2 py-0.5 rounded text-xs shrink-0">
                                    ₹{(item.price || 0) * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* ── Right Column: Per-KG Category ── */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-[#0D8DE3] flex items-center gap-1.5 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg border border-[#0D8DE3]">
                              <Scale size={13} /> Per-KG Clothes ({perKgProducts.length})
                            </h4>
                            {perKgProducts.length > 0 && (
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                                order.kgPriceUpdated 
                                  ? 'bg-[#9AE600] text-black border-black' 
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-400'
                              }`}>
                                {order.kgPriceUpdated ? '✓ Weighed' : 'Pending Weighing'}
                              </span>
                            )}
                          </div>

                          {perKgProducts.length === 0 ? (
                            <div className="p-3 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                              <p className="text-[11px] font-bold text-gray-400 uppercase">No per-kg items</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {perKgProducts.map((item, iIdx) => (
                                <div key={iIdx} className="p-2 rounded-lg bg-blue-50/60 border border-blue-200 flex justify-between items-center text-xs">
                                  <div className="truncate pr-2">
                                    <p className="font-bold text-black uppercase truncate">{item.quantity}x {item.name}</p>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase">
                                      {item.kgWeight ? `Weighed at pickup: ${item.kgWeight} KG` : 'Weighed upon pickup'}
                                    </p>
                                  </div>
                                  <div className="shrink-0">
                                    {order.kgPriceUpdated && item.price > 0 ? (
                                      <span className="font-black text-black bg-[#9AE600] border border-black px-2 py-0.5 rounded text-xs">
                                        ₹{item.price}
                                      </span>
                                    ) : (
                                      <span className="font-black text-[10px] text-yellow-900 bg-yellow-200 border border-yellow-400 px-1.5 py-0.5 rounded uppercase">
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delivery Address & Pickup Slot */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-gray-200">
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                          <h5 className="text-[11px] font-black uppercase text-gray-700 flex items-center gap-1 mb-1">
                            <Navigation size={12} className="text-[#0D8DE3]" /> Delivery Address
                          </h5>
                          <p className="text-xs font-bold text-gray-800 uppercase">{order.deliveryAddress || 'Standard Address'}</p>
                        </div>

                        {order.pickupTime && (
                          <div className="bg-[#9AE600]/20 p-2.5 rounded-xl border border-[#9AE600]">
                            <h5 className="text-[11px] font-black uppercase text-black flex items-center gap-1 mb-1">
                              <Clock size={12} className="text-black" /> Requested Pickup Slot
                            </h5>
                            <p className="text-xs font-black text-black uppercase">{order.pickupTime}</p>
                          </div>
                        )}
                      </div>

                      {/* Wash Add-ons */}
                      {order.washPreferences && order.washPreferences.length > 0 && (
                        <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1.5">
                          <h5 className="font-black text-[11px] uppercase text-black flex items-center gap-1">
                            <Sparkles size={12} className="text-[#0D8DE3]" /> Wash Add-ons:
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {order.washPreferences.map((p, pIdx) => (
                              <span key={pIdx} className="bg-white border border-black px-2 py-0.5 rounded-md text-[10px] font-black">
                                {p.name} (+₹{p.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3 text-red-600">
              <AlertTriangle size={28} strokeWidth={2.5} />
              <h3 className="font-black text-black text-xl uppercase lilita-one-regular tracking-wide">
                Cancel Order #{cancelModalOrder._id.slice(-6).toUpperCase()}?
              </h3>
            </div>
            
            <p className="text-xs sm:text-sm font-bold text-gray-700 uppercase mb-4 leading-relaxed">
              Are you sure you want to cancel this order? Customers can cancel within 15 minutes of placing an order. Once confirmed, this action cannot be undone.
            </p>

            {cancelError && (
              <p className="text-xs font-black text-red-600 bg-red-100 p-2.5 rounded-lg border border-red-300 uppercase mb-4">
                {cancelError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => { setCancelModalOrder(null); setCancelError(''); }}
                className="flex-1 bg-white hover:bg-gray-100 text-black border-2 border-black py-2.5 rounded-xl font-black uppercase text-xs tracking-wider"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white border-2 border-black py-2.5 rounded-xl font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
