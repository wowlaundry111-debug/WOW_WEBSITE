import React, { useState, useMemo } from 'react';
import { Clock, CreditCard, Phone, Truck, X, MapPin, Printer, MessageCircle, ChevronRight, Download, FileSpreadsheet, Calendar, CheckCircle2, Sparkles, ArrowUpDown } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { downloadOrdersReport } from '../../../utils/exportCsv';

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

export default function OrderBoard({ 
  tenantOrders = [], 
  displayFilters, 
  counts, 
  activeFilter, 
  setActiveFilter, 
  users = [], 
  shops = [],
  SERVICE_LABEL_FOR_CATEGORY,
  stripeColor,
  deliveryBoys = []
}) {
  const { updateOrderStatus, updateOrderAdminDetails, assignDeliveryBoy } = useAppStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState(null);

  // Sorting state for Admin Order History
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'price_high' | 'price_low' | 'customer' | 'payment_mode'

  // Excel / CSV Export Report Modal State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);

  const uniqueTenantOrders = useMemo(() => {
    const seen = new Set();
    return (tenantOrders || []).filter(o => {
      if (!o || !o._id || seen.has(o._id)) return false;
      seen.add(o._id);
      return true;
    });
  }, [tenantOrders]);

  const currentFilter = displayFilters.find(f => f.key === activeFilter) || displayFilters[0];
  const filteredOrders = uniqueTenantOrders.filter(o => currentFilter.statuses.includes(o.status));

  // Compute sorted orders based on active sortBy selection
  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    if (sortBy === 'oldest') {
      return list.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    }
    if (sortBy === 'price_high') {
      return list.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
    }
    if (sortBy === 'price_low') {
      return list.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
    }
    if (sortBy === 'customer') {
      return list.sort((a, b) => {
        const nameA = (users.find(u => u._id === a.customerId)?.name || a.customerName || '').toLowerCase();
        const nameB = (users.find(u => u._id === b.customerId)?.name || b.customerName || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }
    if (sortBy === 'payment_mode') {
      return list.sort((a, b) => (a.paymentMode || '').localeCompare(b.paymentMode || ''));
    }
    return list;
  }, [filteredOrders, sortBy, users]);

  // Compute available months dynamically from orders
  const availableMonths = useMemo(() => {
    const months = new Set();
    tenantOrders.forEach(o => {
      if (o.createdAt) {
        const d = new Date(o.createdAt);
        months.add(d.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
      }
    });
    return Array.from(months);
  }, [tenantOrders]);

  // Compute orders matching the export criteria
  const exportMatchingOrders = useMemo(() => {
    const now = new Date();
    return tenantOrders.filter(order => {
      // 1. Status Filter
      if (selectedStatusFilter === 'DELIVERED' && order.status !== 'DELIVERED') return false;
      if (selectedStatusFilter === 'ACTIVE' && order.status === 'DELIVERED') return false;

      // 2. Timeframe Filter
      if (selectedTimeframe === 'All Time') return true;

      const orderDate = new Date(order.createdAt || Date.now());

      if (selectedTimeframe === 'Today') {
        return orderDate.toDateString() === now.toDateString();
      }

      if (selectedTimeframe === 'This Week') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= sevenDaysAgo;
      }

      if (selectedTimeframe === 'This Month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }

      // Specific Month (e.g. "August 2026")
      const orderMonthYear = orderDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      return orderMonthYear === selectedTimeframe;
    });
  }, [tenantOrders, selectedTimeframe, selectedStatusFilter]);

  const handleExportDownload = () => {
    setIsExporting(true);
    const label = `${selectedTimeframe}_${selectedStatusFilter}`;
    downloadOrdersReport({
      orders: exportMatchingOrders,
      timeframe: label,
      users,
      shops
    });
    setIsExporting(false);
    setExportModalOpen(false);
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setEditPrice(order.totalAmount ? String(order.totalAmount) : '');
    setEditNotes(order.adminNotes || '');
  };

  const handleAssign = (orderId) => {
    setOrderToAssign(orderId);
    setAssignModalOpen(true);
  };

  const confirmAssign = async (boyId) => {
    if (orderToAssign) {
      try {
        await assignDeliveryBoy(orderToAssign, boyId);
        const assignedBoy = deliveryBoys?.find(b => b._id === boyId);
        setAssignModalOpen(false);
        setOrderToAssign(null);
        alert(`Order assigned to ${assignedBoy?.name || 'delivery staff'} successfully!`);
      } catch (err) {
        alert(err?.response?.data?.error || err?.message || 'Failed to assign order');
      }
    }
  };

  const handleStatusUpdate = (orderId, status) => {
    updateOrderStatus(orderId, status);
  };

  const handleSaveAdminDetails = async () => {
    if (!selectedOrder) return;
    setIsSavingDetails(true);
    await updateOrderAdminDetails(selectedOrder._id, {
      totalAmount: editPrice ? Number(editPrice) : selectedOrder.totalAmount,
      adminNotes: editNotes
    });
    setSelectedOrder({
      ...selectedOrder,
      totalAmount: editPrice ? Number(editPrice) : selectedOrder.totalAmount,
      adminNotes: editNotes
    });
    setIsSavingDetails(false);
  };

  const handlePrintOrder = (order) => {
    if (!order) return;
    const customer = users.find(u => u._id === order.customerId) || {};
    const customerName = customer.name || order.customerName || 'Customer';
    const customerPhone = customer.phone || order.customerPhone || 'N/A';
    const shop = shops.find(s => s._id === order.shopId) || {};
    const shopName = shop.name || 'WOW Laundry Express';

    const subtotal = order.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const washPrefsTotal = (order.washPreferences && order.washPreferences.length > 0)
      ? order.washPreferences.reduce((sum, p) => sum + (p.price || 0), 0)
      : 0;

    const washPrefsHtml = (order.washPreferences && order.washPreferences.length > 0)
      ? `
        <div style="margin-top: 15px; padding: 12px; background: #f8f9fa; border: 2px solid #000; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Selected Wash Add-ons & Preferences:</h4>
          ${order.washPreferences.map(p => `
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 4px;">
              <span>${p.name}</span>
              <span>+₹${p.price || 0}</span>
            </div>
          `).join('')}
        </div>
      `
      : '';

    const itemsHtml = order.items.map(it => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">
          ${it.name}
          ${(it.categoryName || it.subCategoryName) ? `<div style="font-size: 11px; color: #666; font-weight: 600; margin-top: 2px;">${it.categoryName || ''}${it.subCategoryName ? ` › ${it.subCategoryName}` : ''}${it.isBucket ? ' • Bucket' : ''}</div>` : (it.isBucket ? `<div style="font-size: 11px; color: #666; font-weight: 600; margin-top: 2px;">Bucket</div>` : '')}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${it.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${it.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${it.price * it.quantity}</td>
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank', 'width=700,height=850');
    if (!printWindow) return alert('Pop-up blocked. Please allow pop-ups to print receipt.');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 24px; color: #000; margin: 0; }
            .receipt-card { max-width: 580px; margin: auto; border: 3px solid #000; padding: 24px; border-radius: 16px; box-shadow: 6px 6px 0px #000; }
            .badge { display: inline-block; background: #9AE600; border: 2px solid #000; padding: 2px 8px; font-weight: 900; font-size: 11px; text-transform: uppercase; border-radius: 6px; }
            .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 16px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 900; text-transform: uppercase; }
            .grid { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
            .box { flex: 1; border: 2px solid #000; padding: 12px; border-radius: 8px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; border: 2px solid #000; border-radius: 8px; overflow: hidden; margin-top: 12px; }
            th { background: #000; color: #fff; padding: 8px 10px; font-size: 11px; text-transform: uppercase; text-align: left; }
            .totals { margin-top: 16px; border-top: 2px solid #000; padding-top: 12px; }
            .totals-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px; }
            .grand-total { font-size: 20px; font-weight: 900; background: #9AE600; border: 2px solid #000; padding: 10px; border-radius: 8px; margin-top: 10px; }
            .footer { text-align: center; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-top: 24px; padding-top: 12px; border-top: 2px dashed #000; }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="header">
              <span class="badge">Official Order Invoice</span>
              <h1 style="margin-top: 6px;">${shopName}</h1>
              <p style="margin: 4px 0 0 0; font-weight: 900; font-size: 14px;">ORDER #${order._id.slice(-6).toUpperCase()}</p>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #555;">Date: ${new Date(order.createdAt || Date.now()).toLocaleString()}</p>
            </div>

            <div class="grid">
              <div class="box">
                <strong style="text-transform: uppercase; color: #666; font-size: 10px;">Customer Details</strong><br/>
                <strong style="font-size: 14px;">${customerName}</strong><br/>
                <span>Phone: ${customerPhone}</span>
              </div>
              <div class="box">
                <strong style="text-transform: uppercase; color: #666; font-size: 10px;">Delivery Address</strong><br/>
                <span>${order.deliveryAddress || 'Customer Address'}</span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:right;">Rate</th>
                  <th style="text-align:right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            ${washPrefsHtml}

            <div class="totals">
              <div class="totals-row"><span>Item Subtotal:</span> <span>₹${subtotal}</span></div>
              ${washPrefsTotal > 0 ? `<div class="totals-row"><span>Wash Add-ons:</span> <span>+₹${washPrefsTotal}</span></div>` : ''}
              <div class="totals-row"><span>Delivery Fee:</span> <span>₹${order.deliveryFee || 0}</span></div>
              <div class="totals-row"><span>Taxes:</span> <span>₹${order.taxAmount || 0}</span></div>
              ${order.discountAmount > 0 ? `<div class="totals-row"><span>Discount:</span> <span>-₹${order.discountAmount}</span></div>` : ''}
              <div class="totals-row grand-total"><span>TOTAL AMOUNT:</span> <span>₹${order.totalAmount}</span></div>
            </div>

            <div class="footer">
              Thank you for choosing ${shopName}!
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-black uppercase">Order Console</h1>
          <p className="font-bold text-gray-500 mt-1">Managing {tenantOrders.length} total orders across your shop.</p>
        </div>

        {/* Download Excel / CSV Report Button */}
        <button
          onClick={() => setExportModalOpen(true)}
          className="bg-[#9AE600] hover:bg-[#9de83a] text-black border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] px-5 py-2.5 font-black uppercase text-xs sm:text-sm hover:translate-y-[1px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
        >
          <FileSpreadsheet size={18} /> Download Excel Report
        </button>
      </div>

      {/* Filter Capsules & History Sort Control */}
      <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
        {displayFilters.map(f => {
          const isActive = f.key === activeFilter;
          const count = counts[f.key] || 0;
          return (
            <React.Fragment key={f.key}>
              <button
                onClick={() => setActiveFilter(f.key)}
                className={`flex items-center gap-2 px-6 py-3 border-2 border-black whitespace-nowrap font-black uppercase text-sm transition-all ${isActive ? 'bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_rgba(0,0,0,1)]'}`}
              >
                {f.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-[#9AE600] text-black' : 'bg-gray-200'}`}>
                  {count}
                </span>
              </button>

              {/* Small compact Sort Button shown ONLY next to History tab when history filter is active */}
              {f.key === 'history' && activeFilter === 'history' && (
                <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-xl animate-fade-in-up">
                  <ArrowUpDown size={14} className="text-[#0D8DE3]" />
                  <span className="text-xs font-black uppercase text-black">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-black uppercase outline-none cursor-pointer text-black"
                  >
                    <option value="newest">Latest Delivered</option>
                    <option value="oldest">Oldest Delivered</option>
                    <option value="price_high">Price High</option>
                    <option value="price_low">Price Low</option>
                    <option value="customer">Customer (A-Z)</option>
                  </select>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Order Cards */}
      {sortedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          <CheckCircle2 size={56} strokeWidth={2} className="text-[#0D8DE3] mb-4" />
          <h3 className="text-2xl font-black text-gray-900 uppercase">Queue is Clear</h3>
          <p className="text-gray-500 font-bold mt-2">No orders currently pending in this filter channel.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedOrders.map(order => {
            const customer = users.find(u => u._id === order.customerId);
            const customerName = customer?.name || order.customerName || 'Unknown Customer';
            const customerPhone = customer?.phone || order.customerPhone || 'N/A';
            const serviceInfo = SERVICE_LABEL_FOR_CATEGORY(order.items[0]?.name);
            
            return (
              <div key={order._id} className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex overflow-hidden group cursor-pointer hover:translate-y-[-2px] transition-transform" onClick={() => handleOpenModal(order)}>
                {/* Stripe */}
                <div className={`w-4 shrink-0 ${stripeColor(order.status)} border-r-2 border-black`}></div>
                
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#9AE600] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center">
                        <span className="font-black text-lg">{customerName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-black text-xs text-gray-400 uppercase tracking-widest">ORDER #{order._id.slice(-6).toUpperCase()}</p>
                        <h3 className="font-black text-xl leading-none mt-1">{customerName}</h3>
                      </div>
                    </div>
                    <span className="border-2 border-black px-3 py-1 bg-white font-black text-xs uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Category & Items Section on Outer Card */}
                  {(() => {
                    const itemsByCat = (order.items || []).reduce((acc, it) => {
                      const title = formatCatTitle(it);
                      if (!acc[title]) acc[title] = [];
                      acc[title].push(it);
                      return acc;
                    }, {});

                    return (
                      <div className="space-y-3 mb-4">
                        {Object.entries(itemsByCat).map(([catTitle, catItems], groupIdx) => (
                          <div key={groupIdx} className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                            {/* Big Words Category Header Banner */}
                            <div className="bg-[#0D8DE3] text-white py-2 px-3.5 flex flex-wrap items-center justify-between gap-2 border-b-2 border-black">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-black bg-[#9AE600] px-2 py-0.5 rounded border border-black tracking-wider shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                                  CATEGORY
                                </span>
                                <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wider lilita-one-regular drop-shadow-sm">
                                  {catTitle}
                                </h4>
                              </div>
                              <span className="text-[10px] font-black text-black bg-white border border-black px-2.5 py-0.5 rounded uppercase shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                                {catItems.length} {catItems.length === 1 ? 'Item' : 'Items'}
                              </span>
                            </div>

                            {/* Items in this Category */}
                            <div className="p-3 divide-y-2 divide-dashed divide-gray-200 bg-[#FAF9F6] space-y-2">
                              {catItems.map((it, idx) => {
                                const isKg = it.unit === 'KG' || (typeof it.name === 'string' && (it.name.toLowerCase().includes('per kg') || it.name.toLowerCase().includes('/ kg'))) || Boolean(it.kgWeight && it.kgWeight > 0);
                                return (
                                  <div key={idx} className={`flex justify-between items-center gap-2 ${idx > 0 ? 'pt-2' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-black text-black uppercase">
                                          {it.quantity}x {it.name}
                                        </span>
                                        {it.isBucket && (
                                          <span className="bg-[#0D8DE3] text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-black uppercase tracking-wider">
                                            Bucket (Per KG)
                                          </span>
                                        )}
                                      </div>
                                      {isKg ? (
                                        <div className="mt-0.5 space-y-0.5">
                                          <p className="text-[11px] font-bold text-gray-700 uppercase">
                                            {it.kgWeight ? `Measured Weight: ${it.kgWeight} KG` : 'Awaiting delivery agent weight entry'}
                                          </p>
                                          {it.isBucket && (
                                            <p className="text-[11px] font-black text-[#0D8DE3] uppercase">
                                              Clothes Count: {it.quantity}
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">
                                          ₹{it.price} / Item
                                        </p>
                                      )}
                                    </div>

                                    <div className="shrink-0 text-right">
                                      {isKg ? (
                                        order.kgPriceUpdated && it.price > 0 ? (
                                          <span className="text-xs font-black text-black bg-[#9AE600] px-2.5 py-1 border-2 border-black rounded-lg inline-block shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                                            ₹{it.price}
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-black text-yellow-900 bg-yellow-200 border border-black px-2 py-0.5 rounded-lg uppercase tracking-wider inline-block">
                                            Pending Weighing
                                          </span>
                                        )
                                      ) : (
                                        <span className="text-xs font-black text-black bg-white px-2.5 py-1 border-2 border-black rounded-lg inline-block shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                                          ₹{it.price * it.quantity}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {/* Wash Add-ons & Preferences if present */}
                        {order.washPreferences && order.washPreferences.length > 0 && (
                          <div className="border-2 border-black p-2.5 bg-[#9AE600]/15 rounded-xl space-y-1.5">
                            <p className="font-black text-[11px] uppercase tracking-widest text-black flex items-center gap-1.5">
                              <Sparkles size={13} className="text-[#0D8DE3]" /> Selected Wash Add-ons & Preferences
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {order.washPreferences.map((pref, idx) => (
                                <div key={idx} className="bg-white border-2 border-black px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 text-xs font-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                                  <span>{pref.name}</span>
                                  <span className="bg-[#9AE600] px-1.5 py-0.2 border border-black rounded text-[10px]">+₹{pref.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex gap-4 mb-4 text-sm font-bold text-gray-600 flex-wrap items-center">
                    <span className="flex items-center gap-1"><Clock size={16}/> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    {(() => {
                      const hasKg = order.items.some(it => it.unit === 'KG');
                      if (hasKg && !order.kgPriceUpdated) {
                        return (
                          <span className="flex items-center gap-1.5 font-black text-black">
                            <CreditCard size={16}/> ₹{order.totalAmount}
                            <span className="text-[10px] font-black bg-yellow-300 border border-black px-1.5 py-0.2 rounded uppercase">
                              + KG Pending
                            </span>
                          </span>
                        );
                      }
                      return (
                        <span className="flex items-center gap-1 font-black"><CreditCard size={16}/> ₹{order.totalAmount}</span>
                      );
                    })()}
                    <span className={`px-2.5 py-0.5 border-2 border-black rounded-lg text-xs font-black uppercase shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] ${
                      order.paymentMode === 'COD' 
                        ? 'bg-[#9AE600] text-black' 
                        : order.paymentMode === 'UPI' || order.paymentMode === 'CARD'
                        ? 'bg-[#0D8DE3] text-white' 
                        : 'bg-yellow-300 text-black'
                    }`}>
                      {order.paymentMode === 'COD' ? 'Offline Cash' : order.paymentMode ? `Online (${order.paymentMode})` : 'Pending Payment'}
                    </span>
                    <span className="flex items-center gap-1"><Phone size={16}/> {customerPhone}</span>
                  </div>

                  {order.deliveryBoyName && (
                    <div className="mb-3 px-3 py-1.5 bg-blue-50 border-2 border-black rounded-lg flex items-center justify-between text-xs font-black">
                      <span className="flex items-center gap-1.5 text-blue-800">
                        <Truck size={14} /> Agent: {order.deliveryBoyName}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAssign(order._id); }}
                        className="text-blue-600 underline hover:text-black uppercase text-[10px]"
                      >
                        Reassign
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3" onClick={e => e.stopPropagation()}>
                    {(order.status === 'PLACED' || order.status === 'ACCEPTED') && (
                      <button 
                        onClick={() => handleAssign(order._id)}
                        className="flex-1 bg-[#9AE600] text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2.5 font-black uppercase text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all flex justify-center items-center gap-2"
                      >
                        <Truck size={16}/> Assign Delivery
                      </button>
                    )}
                    {order.status === 'PICKUP_ASSIGNED' && (
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleStatusUpdate(order._id, 'PICKED_UP')}
                          className="flex-1 bg-[#9AE600] text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2 font-black uppercase text-xs sm:text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all flex justify-center items-center gap-1.5"
                        >
                          Mark Picked Up (To Wash)
                        </button>
                        <button 
                          onClick={() => handleAssign(order._id)}
                          className="px-3 bg-white text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2 font-black uppercase text-xs hover:bg-gray-100 transition-all flex items-center gap-1"
                        >
                          <Truck size={14} /> Reassign
                        </button>
                      </div>
                    )}
                    {(order.status === 'PICKED_UP' || order.status === 'WASHING') && (
                      <button 
                        onClick={() => handleStatusUpdate(order._id, 'IRONING')}
                        className="flex-1 bg-white text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2.5 font-black uppercase text-sm hover:bg-gray-50 transition-colors"
                      >
                        Move to Ironing
                      </button>
                    )}
                    {order.status === 'IRONING' && (
                      <button 
                        onClick={() => handleStatusUpdate(order._id, 'OUT_FOR_DELIVERY')}
                        className="flex-1 bg-[#0D8DE3] text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2.5 font-black uppercase text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        Out for Delivery
                      </button>
                    )}
                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleStatusUpdate(order._id, 'DELIVERED')}
                          className="flex-1 bg-[#9AE600] text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2 font-black uppercase text-xs sm:text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          Mark Delivered
                        </button>
                        <button 
                          onClick={() => handleAssign(order._id)}
                          className="px-3 bg-white text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-2 font-black uppercase text-xs hover:bg-gray-100 transition-all flex items-center gap-1"
                        >
                          <Truck size={14} /> Reassign
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── EXPORT EXCEL / CSV REPORT MODAL ───────────────────────── */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-[#9AE600]">
              <h2 className="text-xl font-black uppercase flex items-center gap-2">
                <FileSpreadsheet size={22} /> Download Orders Report (Excel / CSV)
              </h2>
              <button 
                onClick={() => setExportModalOpen(false)} 
                className="p-1 hover:bg-black hover:text-white rounded border-2 border-transparent hover:border-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Timeframe selector */}
              <div>
                <label className="block font-black text-xs uppercase mb-2 flex items-center gap-1.5 text-gray-700">
                  <Calendar size={14} /> 1. Select Timeframe
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['All Time', 'Today', 'This Week', 'This Month', ...availableMonths].map(tf => {
                    const isPicked = selectedTimeframe === tf;
                    return (
                      <button
                        type="button"
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`p-2.5 border-2 border-black font-black uppercase text-xs rounded transition-all text-center ${
                          isPicked 
                            ? 'bg-[#0D8DE3] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                            : 'bg-white text-black hover:bg-gray-100'
                        }`}
                      >
                        {tf}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status filter selector */}
              <div>
                <label className="block font-black text-xs uppercase mb-2 text-gray-700">
                  2. Filter by Order Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ALL', label: 'All Orders' },
                    { id: 'DELIVERED', label: 'Delivered Only' },
                    { id: 'ACTIVE', label: 'Active Orders' }
                  ].map(st => {
                    const isPicked = selectedStatusFilter === st.id;
                    return (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => setSelectedStatusFilter(st.id)}
                        className={`p-2.5 border-2 border-black font-black uppercase text-xs rounded transition-all text-center ${
                          isPicked 
                            ? 'bg-[#9AE600] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                            : 'bg-white text-black hover:bg-gray-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Stats */}
              <div className="p-4 bg-yellow-50 border-2 border-black rounded-lg flex items-center justify-between">
                <div>
                  <span className="block font-black text-xs uppercase text-gray-600">Matching Records</span>
                  <span className="text-2xl font-black text-black">{exportMatchingOrders.length} orders</span>
                </div>
                <div className="text-right text-xs font-bold text-gray-600">
                  <p>Total Revenue:</p>
                  <p className="text-base font-black text-[#0D8DE3]">
                    ₹{exportMatchingOrders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Download CTA */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExportModalOpen(false)}
                  className="flex-1 bg-gray-100 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-xs hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExportDownload}
                  disabled={isExporting || exportMatchingOrders.length === 0}
                  className="flex-1 bg-[#9AE600] text-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-xs hover:translate-y-[1px] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  <Download size={16} /> Download (.CSV / Excel)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ORDER DETAILS MODAL ───────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b-4 border-black bg-[#9AE600]">
              <div>
                <p className="font-black text-xs text-black uppercase tracking-widest">ORDER DETAILS</p>
                <h2 className="text-2xl font-black uppercase">#{selectedOrder._id.slice(-6).toUpperCase()}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handlePrintOrder(selectedOrder)}
                  className="bg-black text-[#9AE600] font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-[#9AE600] hover:text-black transition-all flex items-center gap-1.5"
                >
                  <Printer size={15} /> Print Receipt
                </button>
                <button onClick={() => setSelectedOrder(null)} className="hover:bg-black hover:text-white rounded-full p-2 border-2 border-transparent hover:border-black transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* ─── 1. ORDER ITEMS SECTION (UP) ─────────────────────── */}
              {(() => {
                const itemsByCat = (selectedOrder.items || []).reduce((acc, it) => {
                  const title = formatCatTitle(it);
                  if (!acc[title]) acc[title] = [];
                  acc[title].push(it);
                  return acc;
                }, {});

                return (
                  <div className="border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                    <div className="bg-black text-white p-4 flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <span className="text-[11px] font-black text-[#9AE600] uppercase tracking-widest block">ORDER PROCESSING</span>
                        <h3 className="text-xl font-black uppercase tracking-wide lilita-one-regular">
                          Order Items ({selectedOrder.items?.length || 0})
                        </h3>
                      </div>
                      {selectedOrder.items?.some(it => it.unit === 'KG') && (
                        <span className={`text-xs px-3 py-1 rounded-lg font-black uppercase border-2 border-black ${
                          selectedOrder.kgPriceUpdated ? 'bg-[#9AE600] text-black' : 'bg-yellow-300 text-black'
                        }`}>
                          {selectedOrder.kgPriceUpdated ? 'KG WEIGHED' : 'KG PENDING WEIGHING'}
                        </span>
                      )}
                    </div>

                    <div className="p-4 sm:p-5 bg-white space-y-5">
                      {Object.entries(itemsByCat).map(([catTitle, catItems], groupIdx) => (
                        <div key={groupIdx} className="border-4 border-black rounded-2xl overflow-hidden bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                          {/* Big Words Category Header Banner */}
                          <div className="bg-[#0D8DE3] text-white p-3.5 px-5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-black">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black uppercase text-black bg-[#9AE600] px-3 py-1 rounded-md border-2 border-black tracking-wider shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                                CATEGORY
                              </span>
                              <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wider lilita-one-regular drop-shadow-sm">
                                {catTitle}
                              </h4>
                            </div>
                            <span className="text-xs font-black text-black bg-white border-2 border-black px-3.5 py-1 rounded-md uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                              {catItems.length} {catItems.length === 1 ? 'Item' : 'Items'}
                            </span>
                          </div>

                          {/* Items in this Category */}
                          <div className="p-4 sm:p-5 divide-y-2 divide-dashed divide-gray-200 bg-[#FAF9F6]">
                            {catItems.map((it, idx) => {
                              const isKg = it.unit === 'KG' || (typeof it.name === 'string' && (it.name.toLowerCase().includes('per kg') || it.name.toLowerCase().includes('/ kg'))) || Boolean(it.kgWeight && it.kgWeight > 0);
                              return (
                                <div key={idx} className="py-3 flex flex-wrap justify-between items-start gap-3">
                                  <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-base sm:text-lg font-black text-black uppercase">
                                        {it.quantity}x {it.name}
                                      </span>
                                      {it.isBucket && (
                                        <span className="bg-[#0D8DE3] text-white text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase tracking-wider">
                                          Bucket (Per KG)
                                        </span>
                                      )}
                                    </div>
                                    {isKg ? (
                                      <div className="mt-1 space-y-0.5">
                                        <p className="text-xs font-bold text-gray-700 uppercase">
                                          {it.kgWeight ? `Measured Weight: ${it.kgWeight} KG` : 'Awaiting delivery agent weight entry'}
                                        </p>
                                        {it.isBucket && (
                                          <p className="text-xs font-black text-[#0D8DE3] uppercase">
                                            Clothes Count: {it.quantity}
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-xs font-bold text-gray-500 uppercase mt-0.5">
                                        ₹{it.price} / Item
                                      </p>
                                    )}
                                  </div>

                                  <div className="text-right shrink-0">
                                    {isKg ? (
                                      selectedOrder.kgPriceUpdated && it.price > 0 ? (
                                        <span className="text-base font-black text-black bg-[#9AE600] px-3 py-1 border-2 border-black rounded-lg inline-block">
                                          ₹{it.price}
                                        </span>
                                      ) : (
                                        <span className="text-xs font-black text-yellow-900 bg-yellow-200 border-2 border-black px-2.5 py-1 rounded-lg uppercase tracking-wider inline-block">
                                          Pending Weighing
                                        </span>
                                      )
                                    ) : (
                                      <span className="text-base font-black text-black bg-white px-3 py-1 border-2 border-black rounded-lg inline-block shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                        ₹{it.price * it.quantity}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Wash Add-ons & Preferences */}
                      {selectedOrder.washPreferences && selectedOrder.washPreferences.length > 0 && (
                        <div className="border-2 border-black p-3.5 bg-[#9AE600]/15 rounded-xl space-y-2">
                          <h4 className="font-black text-xs uppercase tracking-widest text-black flex items-center gap-1.5">
                            <Sparkles size={15} className="text-[#0D8DE3]" /> Selected Wash Add-ons & Preferences
                          </h4>
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {selectedOrder.washPreferences.map((pref, idx) => (
                              <div key={idx} className="bg-white border-2 border-black px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                <span>{pref.name}</span>
                                <span className="bg-[#9AE600] px-1.5 py-0.5 border border-black rounded text-[11px]">+₹{pref.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Financial / Billing Summary Card */}
                      <div className="bg-gray-100 p-4 border-2 border-black rounded-xl space-y-2">
                        <div className="flex justify-between text-sm font-bold text-gray-600">
                          <span>Items Subtotal</span>
                          <span>
                            ₹{selectedOrder.items
                              .filter(it => it.unit !== 'KG')
                              .reduce((sum, it) => sum + (it.price * it.quantity), 0)}
                            {selectedOrder.items.some(it => it.unit === 'KG') && (
                              <span className="text-xs text-[#0D8DE3] ml-1">
                                {selectedOrder.kgPriceUpdated 
                                  ? `+ ₹${selectedOrder.items.filter(it => it.unit === 'KG').reduce((s, it) => s + (it.price || 0), 0)} (KG)` 
                                  : '(+ KG Pending)'}
                              </span>
                            )}
                          </span>
                        </div>
                        {selectedOrder.washPreferences && selectedOrder.washPreferences.length > 0 && (
                          <div className="flex justify-between text-sm font-bold text-gray-700">
                            <span className="flex items-center gap-1"><Sparkles size={14} className="text-[#0D8DE3]" /> Wash Add-ons ({selectedOrder.washPreferences.length})</span>
                            <span>+₹{selectedOrder.washPreferences.reduce((sum, p) => sum + (p.price || 0), 0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold text-gray-600">
                          <span>Delivery Fee</span>
                          <span>₹{selectedOrder.deliveryFee || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-gray-600">
                          <span>Tax</span>
                          <span>₹{selectedOrder.taxAmount || 0}</span>
                        </div>
                        {selectedOrder.discountAmount > 0 && (
                          <div className="flex justify-between text-sm font-bold text-green-700">
                            <span>Discount</span>
                            <span>-₹{selectedOrder.discountAmount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-black pt-2 border-t-2 border-black">
                          <span className="uppercase">Total Amount</span>
                          <span className="text-[#0D8DE3]">
                            ₹{selectedOrder.totalAmount}
                            {selectedOrder.items.some(it => it.unit === 'KG') && !selectedOrder.kgPriceUpdated && (
                              <span className="text-xs font-bold text-yellow-800 bg-yellow-200 border border-black px-1.5 py-0.5 rounded ml-2">
                                KG Pending
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ─── 2. CUSTOMER & DELIVERY DETAILS SECTION (DOWN) ───── */}
              <div className="border-3 border-black rounded-2xl p-5 bg-white space-y-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <div className="border-b-2 border-black pb-2">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block">CONTACT & LOGISTICS</span>
                  <h3 className="text-base font-black uppercase tracking-wide">Customer & Delivery Details</h3>
                </div>

                {/* Customer Contact Card */}
                <div className="flex flex-wrap justify-between items-center bg-gray-50 border-2 border-black p-4 rounded-xl gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Customer Name</span>
                    <h4 className="font-black text-lg text-black">{users.find(u => u._id === selectedOrder.customerId)?.name || selectedOrder.customerName || 'Customer'}</h4>
                    <p className="font-bold text-gray-600 text-sm flex items-center gap-1 mt-0.5">
                      <Phone size={14}/> {users.find(u => u._id === selectedOrder.customerId)?.phone || selectedOrder.customerPhone || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${users.find(u => u._id === selectedOrder.customerId)?.phone || selectedOrder.customerPhone}`}
                      className="px-3.5 py-2 bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    >
                      <Phone size={14}/> Call
                    </a>
                    <a 
                      href={`https://wa.me/${users.find(u => u._id === selectedOrder.customerId)?.phone || selectedOrder.customerPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-[#9AE600] text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    >
                      <MessageCircle size={14}/> WhatsApp
                    </a>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-black p-4 rounded-xl bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="font-black text-xs uppercase text-gray-500 block mb-1">Pickup Address</span>
                    <p className="font-bold text-sm flex items-start gap-1.5">
                      <MapPin size={16} className="text-[#0D8DE3] shrink-0 mt-0.5"/>
                      {selectedOrder.pickupAddress || 'Shop Branch'}
                    </p>
                  </div>
                  <div className="border-2 border-black p-4 rounded-xl bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="font-black text-xs uppercase text-gray-500 block mb-1">Delivery Address</span>
                    <p className="font-bold text-sm flex items-start gap-1.5">
                      <MapPin size={16} className="text-[#9AE600] shrink-0 mt-0.5"/>
                      {selectedOrder.deliveryAddress || 'Customer Address'}
                    </p>
                  </div>
                </div>

                {/* Payment Mode & Status Summary */}
                <div className="flex flex-wrap items-center justify-between border-2 border-black p-4 bg-gray-50 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] gap-3">
                  <div>
                    <span className="font-black text-[10px] uppercase text-gray-500 block mb-0.5">Mode of Payment</span>
                    <span className="font-black text-sm uppercase flex items-center gap-1.5 text-black">
                      <CreditCard size={16} className="text-[#0D8DE3]" />
                      {selectedOrder.paymentMode === 'COD' 
                        ? 'Offline Cash (COD)' 
                        : selectedOrder.paymentMode 
                        ? `Online Payment (${selectedOrder.paymentMode})` 
                        : 'Pending Payment Mode'}
                    </span>
                  </div>

                  <div>
                    <span className="font-black text-[10px] uppercase text-gray-500 block mb-0.5">Payment Status</span>
                    <span className={`font-black text-xs uppercase px-3 py-1 border-2 border-black rounded-lg ${
                      selectedOrder.paymentStatus === 'SUCCESS' || selectedOrder.status === 'DELIVERED'
                        ? 'bg-[#9AE600] text-black' 
                        : 'bg-yellow-300 text-black'
                    }`}>
                      {selectedOrder.paymentStatus || (selectedOrder.status === 'DELIVERED' ? 'SUCCESS' : 'PENDING')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Note / Adjust Price (In Wash Cycle) */}
              {['WASHING', 'PICKED_UP', 'IRONING'].includes(selectedOrder.status) && (
                <div className="border-4 border-black p-6 bg-blue-50 space-y-4">
                  <h3 className="font-black text-lg uppercase">Update In-Wash Details</h3>
                  <div>
                    <label className="block font-black text-xs uppercase mb-1">Adjust Final Price (₹)</label>
                    <input 
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full border-2 border-black p-3 font-bold bg-white"
                      placeholder="Enter new total"
                    />
                  </div>
                  <div>
                    <label className="block font-black text-xs uppercase mb-1">Admin Notes / Special Instructions</label>
                    <textarea 
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full border-2 border-black p-3 font-bold bg-white h-24"
                      placeholder="Enter processing notes..."
                    ></textarea>
                  </div>
                  
                  <button 
                    onClick={handleSaveAdminDetails}
                    disabled={isSavingDetails}
                    className="bg-black text-white font-black uppercase px-6 py-3 hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all border-2 border-transparent w-full"
                  >
                    {isSavingDetails ? 'Saving...' : 'Save Details'}
                  </button>
                </div>
              )}

              {/* Readonly Admin Notes (Post-Wash Phase) */}
              {['OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder.status) && selectedOrder.adminNotes && (
                <div className="border-4 border-black p-6 bg-yellow-100 shadow-[6px_6px_0px_rgba(0,0,0,1)] mt-8">
                  <h3 className="font-black text-lg mb-2 uppercase">Admin Notes</h3>
                  <p className="font-bold">{selectedOrder.adminNotes}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ─── ASSIGN DELIVERY BOY MODAL ─────────────────────────────── */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-[#9AE600]">
              <h2 className="text-xl font-black uppercase">Assign Delivery</h2>
              <button onClick={() => setAssignModalOpen(false)} className="hover:bg-black hover:text-white rounded-full p-1"><X size={24} /></button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 bg-white">
              {deliveryBoys && deliveryBoys.length > 0 ? (
                deliveryBoys.map(boy => (
                  <button 
                    key={boy._id}
                    onClick={() => confirmAssign(boy._id)}
                    className="w-full flex items-center justify-between p-4 border-2 border-black bg-white hover:bg-[#9AE600] hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all text-left"
                  >
                    <div>
                      <p className="font-black text-lg uppercase">{boy.name}</p>
                      <p className="font-bold text-gray-600 text-sm">{boy.email}</p>
                    </div>
                    <ChevronRight size={20} className="text-black" />
                  </button>
                ))
              ) : (
                <p className="font-bold text-gray-500 text-center py-4">No delivery boys found for this shop. Please add them in Shop Settings.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
