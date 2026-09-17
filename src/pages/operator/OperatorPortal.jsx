import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shirt, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Phone, 
  RefreshCw, 
  LogOut, 
  ChevronRight, 
  Scale, 
  Search, 
  Store, 
  Filter, 
  Eye, 
  ArrowRight,
  Printer,
  X,
  User,
  MessageCircle,
  Truck
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const formatCatTitle = (it) => {
  const cat = (it?.categoryName || '').trim();
  const sub = (it?.subCategoryName || '').trim();
  if (cat && sub && cat.toLowerCase() !== sub.toLowerCase()) {
    return `${cat.toUpperCase()} › ${sub.toUpperCase()}`;
  }
  if (cat) return cat.toUpperCase();
  if (sub) return sub.toUpperCase();
  return 'GENERAL LAUNDRY';
};

const isKgItem = (it) => 
  it?.unit === 'KG' || 
  (typeof it?.name === 'string' && (it.name.toLowerCase().includes('per kg') || it.name.toLowerCase().includes('/ kg'))) || 
  Boolean(it?.kgWeight && it.kgWeight > 0);

export default function OperatorPortal() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    orders, 
    shops, 
    users, 
    updateOrderStatus, 
    fetchOrders,
    setCurrentTenantId,
    currentTenantId
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PICKED_UP' | 'WASHING' | 'IRONING' | 'READY'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(null); // orderId
  const [selectedShopId, setSelectedShopId] = useState(
    currentUser?.shopId || currentTenantId || (shops[0]?._id || '')
  );

  const isSuperAdmin = currentUser?.role === 'SuperAdmin';
  const effectiveShopId = isSuperAdmin ? selectedShopId : (currentUser?.shopId || selectedShopId);
  const currentShop = shops.find(s => s._id === effectiveShopId) || shops[0];

  // Restrict access
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const role = currentUser.role;
    if (!['Operator', 'SuperAdmin', 'ShopAdmin'].includes(role)) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Orders for current branch that are in the wash bucket
  const branchOrders = useMemo(() => {
    return (orders || []).filter(o => {
      if (!o || !o._id) return false;
      if (effectiveShopId && o.shopId !== effectiveShopId) return false;
      return ['PICKED_UP', 'WASHING', 'IRONING', 'OUT_FOR_DELIVERY'].includes(o.status);
    });
  }, [orders, effectiveShopId]);

  // Counts for wash floor metrics
  const counts = useMemo(() => {
    const activeInFloor = branchOrders.filter(o => ['PICKED_UP', 'WASHING', 'IRONING'].includes(o.status));
    return {
      all: activeInFloor.length,
      pickedUp: branchOrders.filter(o => o.status === 'PICKED_UP').length,
      washing: branchOrders.filter(o => o.status === 'WASHING').length,
      ironing: branchOrders.filter(o => o.status === 'IRONING').length,
      ready: branchOrders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
    };
  }, [branchOrders]);

  // Filtered orders
  const displayedOrders = useMemo(() => {
    return branchOrders.filter(o => {
      // Tab filter
      if (activeTab === 'ALL') {
        if (!['PICKED_UP', 'WASHING', 'IRONING'].includes(o.status)) return false;
      } else if (activeTab === 'PICKED_UP') {
        if (o.status !== 'PICKED_UP') return false;
      } else if (activeTab === 'WASHING') {
        if (o.status !== 'WASHING') return false;
      } else if (activeTab === 'IRONING') {
        if (o.status !== 'IRONING') return false;
      } else if (activeTab === 'READY') {
        if (o.status !== 'OUT_FOR_DELIVERY') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const num = o._id.slice(-6).toLowerCase();
        const cust = (o.customerName || '').toLowerCase();
        const phone = (o.customerPhone || '').toLowerCase();
        if (!num.includes(q) && !cust.includes(q) && !phone.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [branchOrders, activeTab, searchQuery]);

  const handleAdvanceStatus = async (orderId, targetStatus) => {
    setIsUpdatingStatus(orderId);
    try {
      await updateOrderStatus(orderId, targetStatus);
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => prev ? ({ ...prev, status: targetStatus }) : null);
      }
    } catch (err) {
      alert('Failed to update status: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    useAppStore.setState({ currentUser: null, currentRole: 'Customer' });
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PICKED_UP':
        return { label: 'RECEIVED / TO WASH', bg: 'bg-yellow-300 text-yellow-950', border: 'border-yellow-600' };
      case 'WASHING':
        return { label: 'IN WASHING', bg: 'bg-[#0D8DE3] text-white', border: 'border-black' };
      case 'IRONING':
        return { label: 'IN IRONING', bg: 'bg-purple-500 text-white', border: 'border-black' };
      case 'OUT_FOR_DELIVERY':
        return { label: 'READY / OUT FOR DELIVERY', bg: 'bg-[#9AE600] text-black', border: 'border-black' };
      default:
        return { label: status, bg: 'bg-gray-200 text-black', border: 'border-black' };
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans pb-16">
      {/* ─── OPERATOR CONSOLE HEADER ───────────────────────────────── */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-40 shadow-[0_4px_0_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#9AE600] border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <Shirt size={22} className="text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-300 border border-black rounded tracking-wider shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  FLOOR OPERATOR CONSOLE
                </span>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                  {currentShop?.name || 'Laundry Floor'}
                </h1>
              </div>
              <p className="text-xs font-bold text-gray-500">
                Wash & Iron Floor Console • Live Status Updates
              </p>
            </div>
          </div>

          {/* Actions & SuperAdmin Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isSuperAdmin && shops.length > 1 && (
              <div className="flex items-center gap-1.5 bg-[#FAF7F2] border-2 border-black px-2.5 py-1.5 rounded-lg">
                <Store size={14} className="text-gray-700" />
                <select
                  value={effectiveShopId}
                  onChange={(e) => {
                    setSelectedShopId(e.target.value);
                    setCurrentTenantId(e.target.value);
                  }}
                  className="bg-transparent font-black text-xs uppercase outline-none cursor-pointer"
                >
                  {shops.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => fetchOrders(true)}
              title="Refresh queue"
              className="p-2.5 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] transition-all"
            >
              <RefreshCw size={15} />
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-black text-white font-black uppercase text-xs px-3.5 py-2.5 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-800 transition-all hidden sm:flex items-center gap-1.5"
              >
                Admin Board
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-black uppercase text-xs px-3.5 py-2.5 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] transition-all flex items-center gap-1.5"
            >
              <LogOut size={15} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full space-y-6">
        {/* ─── FLOOR METRIC TILES ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div 
            onClick={() => setActiveTab('ALL')}
            className={`p-4 border-3 border-black rounded-xl cursor-pointer transition-all ${
              activeTab === 'ALL'
                ? 'bg-white shadow-[5px_5px_0px_rgba(0,0,0,1)] -translate-y-1'
                : 'bg-white/80 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-white'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">TOTAL ACTIVE FLOOR</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl font-black">{counts.all}</span>
              <span className="p-2 bg-gray-100 border border-black rounded-lg"><Shirt size={18} /></span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('PICKED_UP')}
            className={`p-4 border-3 border-black rounded-xl cursor-pointer transition-all ${
              activeTab === 'PICKED_UP'
                ? 'bg-yellow-100 shadow-[5px_5px_0px_rgba(0,0,0,1)] -translate-y-1'
                : 'bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-yellow-100'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-900 block">1. RECEIVED / TO WASH</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl font-black text-yellow-950">{counts.pickedUp}</span>
              <span className="p-2 bg-yellow-300 border border-black rounded-lg font-black text-xs">READY</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('WASHING')}
            className={`p-4 border-3 border-black rounded-xl cursor-pointer transition-all ${
              activeTab === 'WASHING'
                ? 'bg-blue-100 shadow-[5px_5px_0px_rgba(0,0,0,1)] -translate-y-1'
                : 'bg-blue-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-blue-100'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block">2. IN WASHING CYCLE</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl font-black text-blue-950">{counts.washing}</span>
              <span className="p-2 bg-[#0D8DE3] text-white border border-black rounded-lg font-black text-xs">WASH</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('IRONING')}
            className={`p-4 border-3 border-black rounded-xl cursor-pointer transition-all ${
              activeTab === 'IRONING'
                ? 'bg-purple-100 shadow-[5px_5px_0px_rgba(0,0,0,1)] -translate-y-1'
                : 'bg-purple-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-purple-100'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block">3. IN IRONING CYCLE</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-3xl font-black text-purple-950">{counts.ironing}</span>
              <span className="p-2 bg-purple-400 text-white border border-black rounded-lg font-black text-xs">IRON</span>
            </div>
          </div>
        </div>

        {/* ─── CONTROLS & SEARCH BAR ─────────────────────────────────── */}
        <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Stage Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {[
              { id: 'ALL', label: `Active Queue (${counts.all})` },
              { id: 'PICKED_UP', label: `Ready to Wash (${counts.pickedUp})` },
              { id: 'WASHING', label: `Washing (${counts.washing})` },
              { id: 'IRONING', label: `Ironing (${counts.ironing})` },
              { id: 'READY', label: `Ready for Dispatch (${counts.ready})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 border-2 border-black font-black uppercase text-xs rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#9AE600] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order # or Customer..."
              className="w-full pl-9 pr-4 py-2 border-2 border-black rounded-lg font-bold text-xs bg-[#FAF7F2] outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ─── ORDERS QUEUE ──────────────────────────────────────────── */}
        {displayedOrders.length === 0 ? (
          <div className="bg-white border-3 border-black p-12 text-center rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-[#9AE600]/30 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={32} className="text-black" />
            </div>
            <h3 className="font-black text-xl uppercase">No Orders in This Stage</h3>
            <p className="font-bold text-gray-500 text-sm mt-1">
              All clothes for {activeTab.replace(/_/g, ' ')} have been processed or moved forward.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              const customerName = order.customerName || 'Customer';
              const customerPhone = order.customerPhone || '';
              const isUpdating = isUpdatingStatus === order._id;

              return (
                <div 
                  key={order._id}
                  className="bg-white border-3 border-black rounded-2xl shadow-[5px_5px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col justify-between hover:translate-y-[-2px] transition-transform"
                >
                  {/* Card Header */}
                  <div>
                    <div className="bg-[#FAF7F2] border-b-3 border-black p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">
                          ORDER #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <h3 className="font-black text-lg leading-tight uppercase mt-0.5">
                          {customerName}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-1 border-2 font-black text-[11px] uppercase rounded-lg shadow-[1px_1px_0px_rgba(0,0,0,1)] ${badge.bg} ${badge.border}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Customer Contact Quick Bar */}
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600 bg-gray-50 p-2.5 border-2 border-black rounded-xl">
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-gray-500" />
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {customerPhone && (
                          <div className="flex items-center gap-2">
                            <a 
                              href={`tel:${customerPhone}`}
                              className="text-black font-black flex items-center gap-1 hover:underline"
                            >
                              <Phone size={12} /> {customerPhone}
                            </a>
                            <a 
                              href={`https://wa.me/${customerPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-green-600 hover:text-green-800"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Items Breakdown Accordion Preview */}
                      <div className="border-2 border-black rounded-xl p-3 bg-white space-y-2">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                            <Shirt size={13} /> Garments ({order.items?.length || 0} items)
                          </span>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-[11px] font-black uppercase text-[#0D8DE3] hover:underline flex items-center gap-1"
                          >
                            <Eye size={12} /> View Full
                          </button>
                        </div>

                        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                          {(order.items || []).map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-dashed border-gray-100 last:border-0">
                              <span className="font-bold text-gray-900 truncate max-w-[200px]">
                                {it.quantity || 1}x {it.name}
                              </span>
                              {isKgItem(it) && (
                                <span className="font-black text-[10px] bg-[#9AE600] px-1.5 py-0.5 border border-black rounded">
                                  {it.kgWeight ? `${it.kgWeight} KG` : 'KG Item'}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Wash Preferences & Instructions Highlight (Crucial for Operator) */}
                      {order.washPreferences && order.washPreferences.length > 0 && (
                        <div className="bg-[#9AE600]/15 border-2 border-black p-2.5 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#0D8DE3] flex items-center gap-1">
                            <Sparkles size={13} /> WASH ADD-ONS & SPECIAL CARE:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {order.washPreferences.map((pref, pIdx) => (
                              <span 
                                key={pIdx}
                                className="bg-white border-2 border-black px-2 py-0.5 rounded-lg text-xs font-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                              >
                                {pref.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Admin Notes if any */}
                      {order.adminNotes && (
                        <div className="bg-yellow-50 border-2 border-black p-2 rounded-lg text-xs font-bold text-yellow-950">
                          <span className="font-black uppercase text-[10px] text-yellow-800 block">NOTE:</span>
                          {order.adminNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer: Step-Advance Buttons */}
                  <div className="p-4 bg-[#FAF7F2] border-t-3 border-black space-y-2">
                    {order.status === 'PICKED_UP' && (
                      <button
                        onClick={() => handleAdvanceStatus(order._id, 'WASHING')}
                        disabled={isUpdating}
                        className="w-full bg-[#0D8DE3] text-white border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                      >
                        <Shirt size={17} /> {isUpdating ? 'Updating...' : 'START WASHING'}
                      </button>
                    )}

                    {order.status === 'WASHING' && (
                      <button
                        onClick={() => handleAdvanceStatus(order._id, 'IRONING')}
                        disabled={isUpdating}
                        className="w-full bg-purple-600 text-white border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowRight size={17} /> {isUpdating ? 'Updating...' : 'MOVE TO IRONING'}
                      </button>
                    )}

                    {order.status === 'IRONING' && (
                      <button
                        onClick={() => handleAdvanceStatus(order._id, 'OUT_FOR_DELIVERY')}
                        disabled={isUpdating}
                        className="w-full bg-[#9AE600] text-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={17} /> {isUpdating ? 'Updating...' : 'IRONING DONE (READY FOR DELIVERY)'}
                      </button>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <div className="py-2.5 px-3 bg-green-100 border-2 border-black rounded-lg text-center font-black text-xs uppercase text-green-900 flex items-center justify-center gap-1.5">
                        <Truck size={15} /> Handed Over / Ready for Dispatch
                      </div>
                    )}

                    {/* Step Revert / Status Adjuster */}
                    <div className="flex justify-between items-center pt-1 text-[11px] font-bold text-gray-500">
                      <span>Adjust Stage:</span>
                      <div className="flex gap-1.5">
                        {order.status !== 'PICKED_UP' && (
                          <button
                            onClick={() => handleAdvanceStatus(order._id, 'PICKED_UP')}
                            disabled={isUpdating}
                            className="underline hover:text-black font-black uppercase"
                          >
                            To Picked Up
                          </button>
                        )}
                        {order.status !== 'WASHING' && (
                          <button
                            onClick={() => handleAdvanceStatus(order._id, 'WASHING')}
                            disabled={isUpdating}
                            className="underline hover:text-black font-black uppercase"
                          >
                            To Wash
                          </button>
                        )}
                        {order.status !== 'IRONING' && (
                          <button
                            onClick={() => handleAdvanceStatus(order._id, 'IRONING')}
                            disabled={isUpdating}
                            className="underline hover:text-black font-black uppercase"
                          >
                            To Iron
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── ORDER DETAILS MODAL ───────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-xl max-h-[88vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b-4 border-black bg-[#9AE600]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black block">ORDER DETAILS</span>
                <h2 className="text-xl font-black uppercase">#{selectedOrder._id.slice(-6).toUpperCase()}</h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-black hover:text-white rounded-full transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer Info */}
              <div className="p-3.5 bg-gray-50 border-2 border-black rounded-xl">
                <h4 className="font-black text-sm uppercase text-gray-500 mb-1">Customer</h4>
                <p className="font-black text-base">{selectedOrder.customerName || 'Customer'}</p>
                {selectedOrder.customerPhone && (
                  <p className="font-bold text-xs text-gray-600 mt-0.5">Phone: +91 {selectedOrder.customerPhone}</p>
                )}
                <p className="font-bold text-xs text-gray-600 mt-0.5">
                  Pickup Slot: {selectedOrder.pickupTime || 'Standard'}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-black text-sm uppercase">Item Checklist ({selectedOrder.items?.length || 0})</h4>
                <div className="border-2 border-black rounded-xl divide-y-2 divide-black overflow-hidden">
                  {(selectedOrder.items || []).map((it, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <p className="font-black text-sm uppercase">{it.name}</p>
                        <p className="font-bold text-xs text-gray-500">{formatCatTitle(it)}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm">
                          {isKgItem(it) && it.kgWeight ? `${it.kgWeight} KG` : `${it.quantity || 1} Pcs`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wash Add-ons */}
              {selectedOrder.washPreferences && selectedOrder.washPreferences.length > 0 && (
                <div className="bg-[#9AE600]/15 border-2 border-black p-3.5 rounded-xl space-y-2">
                  <span className="text-xs font-black uppercase text-[#0D8DE3] flex items-center gap-1.5">
                    <Sparkles size={14} /> Selected Wash Preferences
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.washPreferences.map((pref, idx) => (
                      <span key={idx} className="bg-white border-2 border-black px-2.5 py-1 rounded-lg text-xs font-black">
                        {pref.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons inside modal */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-100 border-2 border-black py-3 font-black uppercase text-xs hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
                {selectedOrder.status === 'PICKED_UP' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder._id, 'WASHING')}
                    className="flex-1 bg-[#0D8DE3] text-white border-2 border-black py-3 font-black uppercase text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    Start Washing
                  </button>
                )}
                {selectedOrder.status === 'WASHING' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder._id, 'IRONING')}
                    className="flex-1 bg-purple-600 text-white border-2 border-black py-3 font-black uppercase text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    Move to Ironing
                  </button>
                )}
                {selectedOrder.status === 'IRONING' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder._id, 'OUT_FOR_DELIVERY')}
                    className="flex-1 bg-[#9AE600] text-black border-2 border-black py-3 font-black uppercase text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    Ironing Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
