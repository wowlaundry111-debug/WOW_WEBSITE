import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import Navbar from '../../components/Navbar';
import { MapPin, Navigation, Package, Phone, CheckCircle, Clock, X, PartyPopper } from 'lucide-react';

export default function DeliveryDashboard() {
  const { currentUser, fetchOrders, orders, users, shops, updateOrderStatus, verifyOrderItems, initializeAppData } = useAppStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('PICKUP'); // 'PICKUP' or 'DELIVERY'
  const [verifyModalOrder, setVerifyModalOrder] = useState(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  
  // Verify modal state
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'Delivery') {
      navigate('/login');
    }
    if (orders.length === 0) {
      fetchOrders();
    }
    if (shops.length === 0) {
      initializeAppData();
    }
  }, [currentUser, navigate, orders.length, shops.length, fetchOrders, initializeAppData]);

  if (!currentUser) return null;

  const myOrders = orders.filter(o => o.deliveryBoyId === currentUser._id || (!o.deliveryBoyId && o.shopId === currentUser.shopId));
  const pendingPickups = myOrders.filter(o => o.status === 'PICKUP_ASSIGNED' || (o.status === 'ACCEPTED' && o.deliveryBoyId === currentUser._id));
  const pendingDeliveries = myOrders.filter(o => o.status === 'OUT_FOR_DELIVERY' || o.status === 'READY_FOR_DELIVERY');
  const pastOrders = myOrders.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');

  const displayOrders = activeTab === 'PICKUP' ? pendingPickups : pendingDeliveries;

  const handleAction = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;
    
    if (activeTab === 'PICKUP') {
      const initial = {};
      order.items.forEach(it => initial[it.itemId] = it.quantity);
      setCounts(initial);
      setVerifyModalOrder(order);
    } else {
      setPaymentModalOrder(order);
    }
  };

  const handleAdjustCount = (itemId, delta) => {
    setCounts(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }));
  };

  const handleVerify = () => {
    if (verifyModalOrder) {
      verifyOrderItems(verifyModalOrder._id, counts);
      setVerifyModalOrder(null);
    }
  };

  const handlePaymentConfirm = (mode) => {
    if (paymentModalOrder) {
      updateOrderStatus(paymentModalOrder._id, 'DELIVERED', mode, 'SUCCESS');
      setPaymentModalOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <div className="max-w-3xl w-full mx-auto px-4 py-8 flex-1">
        <div className="mb-8 flex justify-between items-end border-b-4 border-black pb-4">
          <div>
            <h1 className="text-4xl font-black text-black uppercase">Tasks</h1>
            <p className="font-bold text-gray-500 mt-2">Welcome back, {currentUser.name}</p>
          </div>
        </div>

        {/* Segment Control */}
        <div className="flex border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white mb-8">
          <button 
            onClick={() => setActiveTab('PICKUP')}
            className={`flex-1 py-4 font-black uppercase transition-colors ${activeTab === 'PICKUP' ? 'bg-[#0D8DE3] text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            Pickups ({pendingPickups.length})
          </button>
          <div className="w-1 bg-black"></div>
          <button 
            onClick={() => setActiveTab('DELIVERY')}
            className={`flex-1 py-4 font-black uppercase transition-colors ${activeTab === 'DELIVERY' ? 'bg-[#B0FF49] text-black' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            Deliveries ({pendingDeliveries.length})
          </button>
        </div>

        <div className="space-y-6">
          {displayOrders.length === 0 ? (
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-12 text-center my-8">
              <PartyPopper size={64} className="mx-auto text-black mb-4" />
              <h3 className="text-3xl font-black uppercase mb-2">All Caught Up!</h3>
              <p className="font-bold text-gray-500 text-lg">No pending {activeTab === 'PICKUP' ? 'pickups' : 'deliveries'} at the moment.</p>
            </div>
          ) : (
            displayOrders.map(order => {
              const customer = users.find(u => u._id === order.customerId);
              const customerName = customer?.name || order.customerName || 'Unknown Customer';

              const displayAddress = (activeTab === 'PICKUP' ? order.pickupAddress : order.deliveryAddress) || customer?.address || 'No Address Provided';

              return (
                <div key={order._id} className="bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
                  <div className="p-5 flex justify-between items-start border-b-4 border-black bg-gray-50">
                    <div>
                      <h3 className="font-black text-2xl uppercase">{customerName}</h3>
                      <p className="font-bold text-gray-500 text-sm uppercase tracking-widest mt-1">Order #{order._id.substring(order._id.length - 6)}</p>
                      <p className="font-bold text-sm mt-2 flex items-center gap-1"><Clock size={14}/> {new Date(order.createdAt).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      {order.pickupTime && activeTab === 'PICKUP' && (
                        <p className="font-black text-[#0D8DE3] mt-1">Pickup: {order.pickupTime}</p>
                      )}
                    </div>
                    <button className="bg-[#B0FF49] border-2 border-black p-3 hover:bg-black hover:text-[#B0FF49] transition-colors rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <Phone size={24} />
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start gap-3 bg-blue-50 border-2 border-black p-4 mb-4">
                      <MapPin size={24} className="shrink-0 text-black mt-1" />
                      <div className="flex-1">
                        <p className="font-bold text-lg">{displayAddress}</p>
                      </div>
                      <button className="bg-green-400 border-2 border-black p-2 hover:bg-black hover:text-green-400 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <Navigation size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 font-bold text-lg mb-6 text-gray-700">
                      <Package size={20} /> {order.items.reduce((sum, item) => sum + item.quantity, 0)} items to {activeTab === 'PICKUP' ? 'collect' : 'deliver'}
                    </div>
                    
                    <button 
                      onClick={() => handleAction(order._id)}
                      className={`w-full py-4 font-black uppercase text-xl border-4 border-black transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] ${activeTab === 'PICKUP' ? 'bg-[#0D8DE3] text-white' : 'bg-[#B0FF49] text-black'}`}
                    >
                      Mark {activeTab === 'PICKUP' ? 'Picked Up' : 'Delivered'}
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {pastOrders.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> Completed Today ({pastOrders.length})
              </h2>
              
              <div className="space-y-3">
                {pastOrders.slice(0, 5).map(order => {
                  const customer = users.find(u => u._id === order.customerId);
                  const customerName = customer?.name || order.customerName || 'Unknown Customer';
                  
                  return (
                    <div key={order._id} className="bg-white p-4 border-2 border-black flex justify-between items-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <div>
                        <p className="font-black text-lg">{customerName}</p>
                        <p className="font-bold text-gray-500 text-sm uppercase tracking-widest">#{order._id.substring(order._id.length - 6)} • ₹{order.totalAmount}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.paymentMode && (
                          <span className="text-xs font-black uppercase px-2.5 py-1 bg-[#B0FF49] border-2 border-black rounded-lg text-black">
                            {order.paymentMode === 'COD' ? 'Cash (COD)' : order.paymentMode === 'UPI' ? 'UPI' : order.paymentMode}
                          </span>
                        )}
                        <span className={`text-sm font-black uppercase px-3 py-1 border-2 border-black ${order.status === 'DELIVERED' ? 'bg-[#0D8DE3] text-white' : 'bg-red-400 text-white'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verify Items Modal (Pickup) */}
      {verifyModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b-4 border-black bg-[#0D8DE3] text-white">
              <h2 className="text-2xl font-black uppercase">Verify Picked Items</h2>
              <button onClick={() => setVerifyModalOrder(null)} className="p-2 hover:bg-black hover:text-white rounded-full transition-colors border-2 border-transparent hover:border-black">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1 border-b-4 border-black">
              {verifyModalOrder.items.map(it => (
                <div key={it.itemId} className="bg-white border-2 border-black p-4 mb-4 flex items-center justify-between shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div>
                    <h3 className="font-black text-lg">{it.name}</h3>
                    <p className="font-bold text-gray-500 text-sm">Customer Stated: {it.quantity}</p>
                  </div>
                  
                  <div className="flex items-center bg-gray-100 border-2 border-black">
                    <button 
                      onClick={() => handleAdjustCount(it.itemId, -1)}
                      className="w-10 h-10 flex items-center justify-center border-r-2 border-black hover:bg-black hover:text-white font-black text-xl transition-colors"
                    >
                      -
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center font-black text-lg bg-white">
                      {counts[it.itemId]}
                    </div>
                    <button 
                      onClick={() => handleAdjustCount(it.itemId, 1)}
                      className="w-10 h-10 flex items-center justify-center border-l-2 border-black hover:bg-black hover:text-white font-black text-xl transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-white flex gap-4">
              <button 
                onClick={() => setVerifyModalOrder(null)}
                className="flex-1 border-4 border-black py-4 font-black uppercase hover:bg-gray-100 transition-colors text-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleVerify}
                className="flex-[2] bg-[#0D8DE3] text-white border-4 border-black py-4 font-black uppercase hover:translate-y-[2px] hover:shadow-[none] shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all text-lg"
              >
                Confirm & Pick Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Collection Modal (Delivery) */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-md text-center">
            <div className="p-6 bg-[#B0FF49] border-b-4 border-black">
              <h2 className="text-3xl font-black uppercase">Collect Payment</h2>
            </div>
            
            <div className="p-8 border-b-4 border-black">
              <p className="font-bold text-gray-500 uppercase tracking-widest text-sm mb-2">Total Amount Due</p>
              <p className="text-5xl font-black text-[#0D8DE3] mb-8">₹{paymentModalOrder.totalAmount}</p>

              {(() => {
                const shop = shops.find(s => s._id === paymentModalOrder.shopId);
                const upiId = shop?.paymentInfo?.upiId;
                const qrData = shop?.paymentInfo?.qrValue 
                  ? (shop.paymentInfo.qrValue.includes('&am=') ? shop.paymentInfo.qrValue : `${shop.paymentInfo.qrValue}&am=${paymentModalOrder.totalAmount}&tn=LaundryPayment`) 
                  : (upiId ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(shop?.name || 'Laundry')}&am=${paymentModalOrder.totalAmount}&cu=INR` : null);

                if (qrData) {
                  return (
                    <div className="border-4 border-black p-4 inline-block shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white mb-6">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`} 
                        alt="UPI QR Code" 
                        className="w-44 h-44 mx-auto"
                      />
                      {upiId && <p className="font-black mt-4 uppercase tracking-wider text-sm">{upiId}</p>}
                      <p className="text-xs text-gray-500 font-bold mt-1">Scan with any UPI app</p>
                    </div>
                  );
                }
                return (
                  <div className="bg-red-50 border-2 border-red-500 p-4 mb-6 rounded">
                    <p className="font-black text-red-600 mb-1">No UPI ID Configured</p>
                    <p className="text-xs font-bold text-gray-600">Please collect cash or ask admin to set UPI ID in settings.</p>
                  </div>
                );
              })()}
            </div>
            
            <div className="p-6 bg-gray-50 flex gap-4">
              <button 
                onClick={() => handlePaymentConfirm('COD')}
                className="flex-1 bg-green-400 border-4 border-black py-4 font-black uppercase hover:translate-y-[2px] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all text-lg"
              >
                Cash
              </button>
              <button 
                onClick={() => handlePaymentConfirm('UPI')}
                className="flex-1 bg-[#0D8DE3] text-white border-4 border-black py-4 font-black uppercase hover:translate-y-[2px] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all text-lg"
              >
                Online
              </button>
            </div>
            
            <button 
              onClick={() => setPaymentModalOrder(null)}
              className="w-full border-t-4 border-black p-4 font-black uppercase hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
