import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Package, Clock, CheckCircle, Navigation, Sparkles, CreditCard } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function OrderHistory() {
  const { orders, fetchOrders, isOrdersLoading, currentUser } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const successMsg = location.state?.successMsg;

  useEffect(() => {
    if (currentUser) {
      fetchOrders(1);
    }
  }, [currentUser, fetchOrders]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-outfit selection:bg-black selection:text-[#B0FF49]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-black font-black uppercase tracking-widest mb-6">Please login to view your orders</p>
          <button onClick={() => navigate('/login')} className="bg-[#B0FF49] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all text-black px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-lg">Login</button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-black bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'ACCEPTED': return 'text-white bg-[#0D8DE3] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'OUT_FOR_PICKUP': return 'text-black bg-purple-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'IN_PROCESSING': return 'text-black bg-pink-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'READY_FOR_DELIVERY': return 'text-black bg-teal-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'OUT_FOR_DELIVERY': return 'text-black bg-orange-400 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'DELIVERED': return 'text-black bg-[#B0FF49] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      case 'CANCELLED': return 'text-white bg-red-600 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
      default: return 'text-black bg-gray-200 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit selection:bg-black selection:text-[#B0FF49]">
      <Navbar />

      <div className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="inline-block bg-[#0D8DE3] border-2 border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-1">
            <h1 className="text-3xl sm:text-4xl lilita-one-regular text-white uppercase tracking-wider">My <span className="text-[#B0FF49]">Orders</span></h1>
          </div>
          <Link to="/order" className="bg-[#B0FF49] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all text-black font-black px-4 sm:px-6 py-2 sm:py-3 rounded-xl uppercase tracking-widest text-sm sm:text-base">
            New Order
          </Link>
        </div>

        {successMsg && (
          <div className="mb-8 bg-[#B0FF49] border-2 border-black rounded-2xl p-5 flex items-start gap-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-fade-in-up">
            <div className="bg-black text-[#B0FF49] rounded-full border-2 border-black shrink-0 mt-0.5 p-1 shadow-[2px_2px_0px_rgba(255,255,255,1)]">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="font-black text-black text-xl uppercase tracking-wider">Order Placed Successfully!</h3>
              <p className="text-sm text-black font-bold uppercase mt-1 bg-white inline-block px-2 py-1 border-2 border-black rounded-lg">{successMsg}</p>
            </div>
          </div>
        )}

        {isOrdersLoading && orders.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-3xl p-12 text-center shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <div className="w-24 h-24 bg-[#0D8DE3] border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-6 hover:rotate-12 transition-transform">
              <Package size={40} />
            </div>
            <h3 className="text-3xl font-black text-black mb-3 lilita-one-regular uppercase tracking-wide">No orders yet</h3>
            <p className="text-gray-700 font-bold mb-8 uppercase tracking-widest">Looks like you haven't placed any orders.</p>
            <Link to="/order" className="inline-block bg-[#B0FF49] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all text-black font-black px-8 py-4 rounded-2xl uppercase tracking-widest text-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, idx) => (
              <div key={order._id} className="bg-white rounded-3xl border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-hidden transition-transform animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>

                {/* Order Header */}
                <div className="p-5 sm:p-6 border-b-2 border-black flex flex-wrap gap-6 items-center justify-between bg-gray-50">
                  <div>
                    <p className="text-[10px] sm:text-xs text-black bg-[#B0FF49] border-2 border-black px-2 py-0.5 rounded-lg uppercase tracking-widest font-black mb-2 w-fit">Order ID</p>
                    <p className="text-lg sm:text-xl font-black text-black lilita-one-regular tracking-wide">{order._id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-white bg-black border-2 border-black px-2 py-0.5 rounded-lg uppercase tracking-widest font-black mb-2 w-fit">Date</p>
                    <p className="text-sm sm:text-base font-black text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-black bg-[#B0FF49] border-2 border-black px-2 py-0.5 rounded-lg uppercase tracking-widest font-black mb-2 w-fit">Total Amount</p>
                    {(() => {
                      const isKgCheck = (it) => it.unit === 'KG' || (typeof it.name === 'string' && (it.name.toLowerCase().includes('per kg') || it.name.toLowerCase().includes('/ kg'))) || Boolean(it.kgWeight && it.kgWeight > 0);
                      const hasKgItems = order.items.some(isKgCheck);
                      const isKgPending = hasKgItems && !order.kgPriceUpdated;

                      if (isKgPending) {
                        return (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl sm:text-2xl font-black text-[#0D8DE3] lilita-one-regular tracking-wide">
                                ₹{order.totalAmount}
                              </span>
                              <span className="text-[10px] sm:text-xs font-black bg-yellow-300 text-black border-2 border-black px-2 py-0.5 rounded-lg uppercase tracking-wider animate-pulse">
                                + KG Pending
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Final price updated on delivery</p>
                          </div>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <p className="text-xl sm:text-2xl font-black text-[#0D8DE3] lilita-one-regular tracking-wide">₹{order.totalAmount}</p>
                          {hasKgItems && order.kgPriceUpdated && (
                            <span className="text-[10px] font-black bg-[#B0FF49] text-black border border-black px-1.5 py-0.5 rounded uppercase">
                              KG Calculated ✓
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  {order.paymentMode && (
                    <div>
                      <p className="text-[10px] sm:text-xs text-white bg-[#0D8DE3] border-2 border-black px-2 py-0.5 rounded-lg uppercase tracking-widest font-black mb-2 w-fit">Payment Mode</p>
                      <span className="text-xs sm:text-sm font-black text-black uppercase bg-white border-2 border-black px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
                        <CreditCard size={14} className="text-[#0D8DE3]" /> {order.paymentMode === 'COD' ? 'CASH (COD)' : order.paymentMode === 'UPI' ? 'UPI' : order.paymentMode}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-5 sm:p-6 bg-white space-y-6">
                  {/* Top Items Section: 2 Columns Side-by-Side (Left: Per-Item, Right: Per-KG) */}
                  {(() => {
                    const isKgCheck = (it) => it.unit === 'KG' || (typeof it.name === 'string' && (it.name.toLowerCase().includes('per kg') || it.name.toLowerCase().includes('/ kg'))) || Boolean(it.kgWeight && it.kgWeight > 0);
                    const perItemProducts = order.items.filter(it => !isKgCheck(it));
                    const perKgProducts = order.items.filter(isKgCheck);

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* ── Left Column: Per-Item Category ── */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-black text-black flex items-center gap-2 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                              <div className="bg-black p-1 rounded-lg border border-black text-white">
                                <Package size={14} />
                              </div>
                              Per-Item Category ({perItemProducts.length})
                            </h4>
                            {perItemProducts.length > 0 && (
                              <span className="text-[10px] font-black uppercase text-green-700 bg-green-100 border border-green-400 px-2 py-0.5 rounded-md">
                                Directly Calculated
                              </span>
                            )}
                          </div>
                          
                          {perItemProducts.length === 0 ? (
                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50">
                              <p className="text-xs font-bold text-gray-400 uppercase">No per-piece items in this order</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {perItemProducts.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm p-3 border-2 border-black rounded-xl bg-gray-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                  <span className="font-bold text-black uppercase">
                                    {item.quantity}x <span className="ml-1 text-gray-800">{item.name}</span>
                                  </span>
                                  <span className="font-black text-black bg-[#B0FF49] border-2 border-black px-2.5 py-0.5 rounded-lg text-sm">
                                    ₹{(item.price || 0) * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* ── Right Column: Per-KG Category ── */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-black text-black flex items-center gap-2 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-xl border-2 border-[#0D8DE3] shadow-[2px_2px_0px_rgba(13,141,227,1)]">
                              <div className="bg-[#0D8DE3] p-1 rounded-lg border border-black text-white">
                                <span className="text-xs font-black">⚖️</span>
                              </div>
                              Per-KG Category ({perKgProducts.length})
                            </h4>
                            {perKgProducts.length > 0 && (
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                order.kgPriceUpdated 
                                  ? 'bg-[#B0FF49] text-black border-black' 
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-400'
                              }`}>
                                {order.kgPriceUpdated ? 'Weighed & Finalized' : 'Pending Weighing'}
                              </span>
                            )}
                          </div>

                          {perKgProducts.length === 0 ? (
                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50">
                              <p className="text-xs font-bold text-gray-400 uppercase">No per-kg items in this order</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {perKgProducts.map((item, idx) => (
                                <div key={idx} className="p-3 border-2 border-black rounded-xl bg-blue-50/50 flex flex-wrap justify-between items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                  <div>
                                    <p className="font-black text-black text-sm uppercase">
                                      {item.quantity}x {item.name}
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-600 uppercase mt-0.5">
                                      {item.kgWeight ? `Weighed: ${item.kgWeight} KG` : 'Weight taken upon delivery'}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    {order.kgPriceUpdated && item.price > 0 ? (
                                      <span className="font-black text-black bg-[#B0FF49] border-2 border-black px-2.5 py-1 rounded-lg text-sm">
                                        ₹{item.price}
                                      </span>
                                    ) : (
                                      <span className="font-black text-xs text-yellow-900 bg-yellow-200 border-2 border-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                        Pending Calculation
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Horizontal Divider */}
                  <div className="border-t-2 border-black my-4"></div>

                  {/* Bottom Horizontally Placed Section: Delivery Details, Requested Pickup & Wash Add-ons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-black mb-2 flex items-center gap-2 uppercase tracking-widest bg-gray-100 p-2 rounded-xl border-2 border-black w-fit shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <div className="bg-[#0D8DE3] p-1 rounded-lg border-2 border-black text-white">
                          <Navigation size={14} />
                        </div>
                        Delivery Details
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-gray-700 uppercase p-3 border-2 border-black rounded-xl bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        {order.deliveryAddress}
                      </p>
                    </div>

                    {order.pickupTime && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-black mb-2 flex items-center gap-2 uppercase tracking-widest bg-gray-100 p-2 rounded-xl border-2 border-black w-fit shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          <div className="bg-[#B0FF49] p-1 rounded-lg border-2 border-black text-black">
                            <Clock size={14} />
                          </div>
                          Requested Pickup
                        </h4>
                        <p className="text-xs sm:text-sm font-black text-black uppercase bg-[#B0FF49] p-3 border-2 border-black rounded-xl w-fit shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          {order.pickupTime}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Wash Add-ons */}
                  {order.washPreferences && order.washPreferences.length > 0 && (
                    <div className="p-3 bg-[#B0FF49]/20 border-2 border-black rounded-xl space-y-2">
                      <h5 className="font-black text-xs uppercase text-black flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#0D8DE3]" /> Wash Add-ons:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {order.washPreferences.map((p, pIdx) => (
                          <span key={pIdx} className="bg-white border-2 border-black px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1">
                            <Sparkles size={12} className="text-[#0D8DE3]" /> {p.name} (+₹{p.price})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

