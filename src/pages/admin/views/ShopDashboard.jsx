import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trophy, 
  Calendar, 
  Filter, 
  TrendingUp, 
  BarChart2, 
  CreditCard, 
  Users, 
  Layers, 
  Sparkles,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import api from '../../../services/api';

export default function ShopDashboard({ tenantOrders = [], deliveryBoys = [], users = [], currentShop }) {
  // ─── Filter States ──────────────────────────────────────────────────────────
  const [timeRange, setTimeRange] = useState('all'); // 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'custom' | 'all'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  
  // Backend analytics API result state (used when custom range is applied)
  const [apiAnalytics, setApiAnalytics] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);

  // ─── Query Backend Aggregation Endpoint when 'custom' range is applied ─────
  useEffect(() => {
    if (timeRange === 'custom' && (customStartDate || customEndDate)) {
      setLoadingApi(true);
      api.get('/orders/analytics', {
        params: {
          range: 'custom',
          startDate: customStartDate,
          endDate: customEndDate,
          shopId: currentShop?._id
        }
      })
      .then(res => setApiAnalytics(res.data))
      .catch(err => console.error('Failed to query custom backend analytics', err))
      .finally(() => setLoadingApi(false));
    } else {
      setApiAnalytics(null);
    }
  }, [timeRange, customStartDate, customEndDate, currentShop]);

  // ─── Filtered Orders (Pre-saved client-side computation for preset options) ──
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return tenantOrders.filter(o => {
      const orderDate = new Date(o.createdAt || Date.now());

      if (timeRange === 'today') {
        return orderDate >= todayStart;
      }
      if (timeRange === 'yesterday') {
        const yestStart = new Date(todayStart);
        yestStart.setDate(yestStart.getDate() - 1);
        const yestEnd = new Date(todayStart);
        return orderDate >= yestStart && orderDate < yestEnd;
      }
      if (timeRange === '7days') {
        const d7 = new Date(now);
        d7.setDate(d7.getDate() - 7);
        return orderDate >= d7;
      }
      if (timeRange === '30days') {
        const d30 = new Date(now);
        d30.setDate(d30.getDate() - 30);
        return orderDate >= d30;
      }
      if (timeRange === 'this_month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return orderDate >= monthStart;
      }
      if (timeRange === 'custom') {
        if (!customStartDate && !customEndDate) return true;
        const start = customStartDate ? new Date(customStartDate) : new Date(0);
        const end = customEndDate ? new Date(`${customEndDate}T23:59:59`) : new Date();
        return orderDate >= start && orderDate <= end;
      }
      return true; // 'all'
    });
  }, [tenantOrders, timeRange, customStartDate, customEndDate]);

  // ─── Key Performance Indicators (KPIs) ──────────────────────────────────────
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  }, [filteredOrders]);

  const totalOrdersCount = filteredOrders.length;

  const deliveredOrdersCount = useMemo(() => {
    return filteredOrders.filter(o => o.status === 'DELIVERED').length;
  }, [filteredOrders]);

  const pendingOrdersCount = useMemo(() => {
    return filteredOrders.filter(o => ['PLACED', 'ACCEPTED', 'PICKUP_ASSIGNED', 'WASHING', 'IRONING', 'OUT_FOR_DELIVERY'].includes(o.status)).length;
  }, [filteredOrders]);

  const cancelledOrdersCount = useMemo(() => {
    return filteredOrders.filter(o => o.status === 'CANCELLED').length;
  }, [filteredOrders]);

  const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0;

  // ─── Payment Mode Breakdown ────────────────────────────────────────────────
  const cashRevenue = useMemo(() => {
    return filteredOrders
      .filter(o => o.paymentMode === 'COD')
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  }, [filteredOrders]);

  const onlineRevenue = useMemo(() => {
    return filteredOrders
      .filter(o => o.paymentMode === 'UPI' || o.paymentMode === 'CARD' || o.paymentMode === 'ONLINE')
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  }, [filteredOrders]);

  const cashOrdersCount = filteredOrders.filter(o => o.paymentMode === 'COD').length;
  const onlineOrdersCount = filteredOrders.filter(o => ['UPI', 'CARD', 'ONLINE'].includes(o.paymentMode)).length;

  // ─── Revenue & Order Trend Buckets (Graph Data) ────────────────────────────
  const trendGraphData = useMemo(() => {
    if (filteredOrders.length === 0) return [];

    const isHourly = timeRange === 'today' || timeRange === 'yesterday';

    if (isHourly) {
      const hoursMap = {};
      for (let h = 0; h < 24; h += 2) {
        const label = `${String(h).padStart(2, '0')}:00`;
        hoursMap[label] = { label, revenue: 0, orders: 0 };
      }
      filteredOrders.forEach(o => {
        const d = new Date(o.createdAt || Date.now());
        const h = Math.floor(d.getHours() / 2) * 2;
        const label = `${String(h).padStart(2, '0')}:00`;
        if (hoursMap[label]) {
          hoursMap[label].revenue += (o.totalAmount || 0);
          hoursMap[label].orders += 1;
        }
      });
      return Object.values(hoursMap);
    } else {
      // Daily Buckets
      const daysMap = {};
      filteredOrders.forEach(o => {
        const d = new Date(o.createdAt || Date.now());
        const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }).toUpperCase();
        if (!daysMap[key]) {
          daysMap[key] = { label: key, dateObj: d, revenue: 0, orders: 0 };
        }
        daysMap[key].revenue += (o.totalAmount || 0);
        daysMap[key].orders += 1;
      });

      return Object.values(daysMap)
        .sort((a, b) => a.dateObj - b.dateObj)
        .slice(-14); // Clean 14-day timeline window
    }
  }, [filteredOrders, timeRange]);

  const maxBucketRevenue = useMemo(() => {
    return Math.max(...trendGraphData.map(b => b.revenue), 1);
  }, [trendGraphData]);

  // Compute Y-Axis Grid Marks (5 intervals)
  const yAxisTicks = useMemo(() => {
    const step = maxBucketRevenue / 4;
    return [
      maxBucketRevenue,
      maxBucketRevenue * 0.75,
      maxBucketRevenue * 0.5,
      maxBucketRevenue * 0.25,
      0
    ];
  }, [maxBucketRevenue]);

  // Category / Wash Items Popularity
  const categoryStats = useMemo(() => {
    const stats = {};
    filteredOrders.forEach(o => {
      (o.items || []).forEach(it => {
        const catName = it.categoryName || it.name.split(' ')[0] || 'Wash Item';
        if (!stats[catName]) stats[catName] = { name: catName, count: 0, revenue: 0 };
        stats[catName].count += (it.quantity || 1);
        stats[catName].revenue += (it.price * (it.quantity || 1));
      });
    });
    return Object.values(stats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders]);

  const maxCatRevenue = Math.max(...categoryStats.map(c => c.revenue), 1);

  // Top Customers Leaderboard
  const topCustomers = useMemo(() => {
    const stats = {};
    filteredOrders.forEach(o => {
      const customer = users.find(u => u._id === o.customerId);
      const name = customer?.name || o.customerName || 'Unknown Customer';
      if (!stats[o.customerId]) stats[o.customerId] = { id: o.customerId, name, orders: 0, amount: 0 };
      stats[o.customerId].orders += 1;
      stats[o.customerId].amount += (o.totalAmount || 0);
    });
    return Object.values(stats)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredOrders, users]);

  // Helper function to format numbers cleanly (e.g. ₹7.6k)
  const formatCompactNumber = (num) => {
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
    return `₹${num.toFixed(0)}`;
  };

  return (
    <div className="space-y-8 font-outfit selection:bg-black selection:text-[#B0FF49]">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black text-black uppercase lilita-one-regular">Analytics Dashboard</h1>
            <span className="bg-[#B0FF49] border-2 border-black font-black text-xs uppercase px-3 py-1 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <Zap size={14} fill="black" /> Live Pulse
            </span>
          </div>
          <p className="font-bold text-gray-500 mt-1">
            Real-time business reports for <span className="text-black font-black underline">{currentShop ? currentShop.name : 'All Shop Branches'}</span>
          </p>
        </div>

        {/* Date & Time Range Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 border-2 border-black rounded-xl overflow-x-auto max-w-full scrollbar-none">
            <Filter size={16} className="text-black ml-1 mr-1 shrink-0" />
            
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'this_month', label: 'This Month' },
              { id: 'all', label: 'All Time' },
              { id: 'custom', label: 'Custom' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTimeRange(btn.id)}
                className={`shrink-0 px-3 py-1.5 font-black text-xs uppercase transition-all rounded-lg border border-black whitespace-nowrap ${
                  timeRange === btn.id
                    ? 'bg-[#B0FF49] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Pickers (Backend SQL Query is executed when custom is active) */}
      {timeRange === 'custom' && (
        <div className="bg-[#0D8DE3]/10 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#0D8DE3]" />
              <span className="font-black text-xs uppercase">Backend Aggregated Custom Filter:</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase">From:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-white border-2 border-black p-2 rounded-xl text-xs font-bold outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase">To:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-white border-2 border-black p-2 rounded-xl text-xs font-bold outline-none shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              />
            </div>
            {(customStartDate || customEndDate) && (
              <button
                onClick={() => { setCustomStartDate(''); setCustomEndDate(''); }}
                className="text-xs font-black uppercase bg-red-100 hover:bg-red-500 hover:text-white border-2 border-black px-3 py-1.5 rounded-xl transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                Reset
              </button>
            )}
          </div>
          {loadingApi && (
            <span className="text-xs font-black text-[#0D8DE3] bg-white border border-black px-3 py-1 rounded-lg animate-pulse flex items-center gap-1.5">
              <Zap size={14} className="text-[#0D8DE3]" /> Executing Backend Query...
            </span>
          )}
        </div>
      )}

      {/* Bento Grid KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Sales Revenue */}
        <div className="bg-[#B0FF49] border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-black uppercase text-xs tracking-wider text-black">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-black text-[#B0FF49] flex items-center justify-center border border-black">
              <TrendingUp size={18} strokeWidth={3} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-black text-black tracking-tight mb-1">
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h2>
            <span className="font-bold text-xs bg-white text-black px-2.5 py-1 border-2 border-black rounded-lg inline-block uppercase">
              {totalOrdersCount} Total Orders
            </span>
          </div>
        </div>

        {/* Card 2: Average Order Value */}
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-black uppercase text-xs tracking-wider text-gray-700">Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-[#0D8DE3] text-white flex items-center justify-center border border-black">
              <BarChart2 size={18} strokeWidth={3} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-black text-black tracking-tight mb-1">
              ₹{avgOrderValue.toFixed(0)}
            </h2>
            <span className="font-bold text-xs bg-gray-100 text-gray-700 px-2.5 py-1 border-2 border-black rounded-lg inline-block uppercase">
              Per Order Average
            </span>
          </div>
        </div>

        {/* Card 3: Order Status Breakdown */}
        <div className="bg-[#0D8DE3] text-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-black uppercase text-xs tracking-wider text-white">Active Queue</span>
            <div className="w-8 h-8 rounded-lg bg-black text-[#B0FF49] flex items-center justify-center border border-black">
              <Layers size={18} strokeWidth={3} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-black text-white tracking-tight mb-1">
              {pendingOrdersCount}
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs bg-black text-[#B0FF49] px-2.5 py-1 border-2 border-black rounded-lg uppercase">
                {deliveredOrdersCount} Delivered
              </span>
              {cancelledOrdersCount > 0 && (
                <span className="font-bold text-xs bg-red-500 text-white px-2.5 py-1 border-2 border-black rounded-lg uppercase">
                  {cancelledOrdersCount} Cancelled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Active Delivery Fleet */}
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-black uppercase text-xs tracking-wider text-gray-700">Active Delivery Fleet</span>
            <div className="w-8 h-8 rounded-lg bg-[#B0FF49] text-black flex items-center justify-center border border-black">
              <Users size={18} strokeWidth={3} />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-black text-black tracking-tight mb-1">
              {deliveryBoys.length}
            </h2>
            <span className="font-bold text-xs bg-gray-100 text-gray-700 px-2.5 py-1 border-2 border-black rounded-lg inline-block uppercase">
              Agents Assigned
            </span>
          </div>
        </div>
      </div>

      {/* ─── STATE-OF-THE-ART GRAPHICAL REVENUE TREND CHART ─────────────────── */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#0D8DE3] text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <BarChart2 size={24} strokeWidth={3} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-black lilita-one-regular tracking-wide">
                Revenue & Sales Trajectory
              </h3>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase mt-1">
              High-precision performance visualization for selected range
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-black uppercase bg-[#B0FF49] border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <span className="w-3 h-3 rounded-full bg-black inline-block"></span> Total Sales Revenue (₹)
            </span>
          </div>
        </div>

        {trendGraphData.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center bg-gray-50 border-4 border-black rounded-2xl p-8">
            <BarChart2 size={48} className="text-gray-400 mb-3" />
            <p className="font-black text-gray-500 uppercase text-base">No order activity recorded in this date range</p>
            <p className="text-xs text-gray-400 font-bold mt-1">Try selecting 'All Time' or a broader date filter.</p>
          </div>
        ) : (
          <div className="bg-gray-50 border-4 border-black rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative">
            
            {/* Chart Area Grid Container */}
            <div className="relative pl-12 pr-4 pt-10 pb-16 h-80 flex flex-col justify-between">
              
              {/* Y-Axis Grid Lines & Price Labels */}
              <div className="absolute inset-0 pl-12 pr-4 pt-10 pb-16 flex flex-col justify-between pointer-events-none">
                {yAxisTicks.map((val, idx) => (
                  <div key={idx} className="flex items-center w-full">
                    <span className="absolute left-0 text-[10px] font-black text-gray-500 uppercase w-10 text-right pr-2">
                      {formatCompactNumber(val)}
                    </span>
                    <div className="w-full border-b-2 border-dashed border-gray-300"></div>
                  </div>
                ))}
              </div>

              {/* Bars Row */}
              <div className="relative z-10 h-full flex items-end justify-between gap-2 sm:gap-3">
                {trendGraphData.map((bucket, idx) => {
                  const heightPercent = maxBucketRevenue > 0 ? (bucket.revenue / maxBucketRevenue) * 100 : 0;
                  const isHovered = hoveredBarIndex === idx;
                  const isPeak = bucket.revenue === maxBucketRevenue && maxBucketRevenue > 0;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {/* Direct Value Badge on top of bar */}
                      {bucket.revenue > 0 && (
                        <div className={`mb-1.5 px-1.5 py-0.5 border border-black rounded text-[10px] font-black uppercase shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110 ${
                          isPeak ? 'bg-black text-[#B0FF49]' : 'bg-white text-black'
                        }`}>
                          {formatCompactNumber(bucket.revenue)}
                        </div>
                      )}

                      {/* Hover Tooltip Popup */}
                      {isHovered && (
                        <div className="absolute -top-16 z-30 bg-black text-[#B0FF49] border-2 border-black p-2 rounded-xl text-center shadow-[4px_4px_0px_rgba(0,0,0,1)] whitespace-nowrap animate-fade-in-up">
                          <p className="text-[10px] font-black uppercase text-white">{bucket.label}</p>
                          <p className="text-sm font-black lilita-one-regular">₹{bucket.revenue.toLocaleString('en-IN')}</p>
                          <p className="text-[9px] font-bold text-gray-300 uppercase">{bucket.orders} Order{bucket.orders > 1 ? 's' : ''}</p>
                        </div>
                      )}

                      {/* Dual-Tone Gradient Bar Fill */}
                      <div
                        style={{
                          height: `${Math.max(heightPercent, 5)}%`,
                          background: isHovered
                            ? 'linear-gradient(to top, #0D8DE3, #38BDF8)'
                            : isPeak
                            ? 'linear-gradient(to top, #90E114, #B0FF49)'
                            : 'linear-gradient(to top, #A3E635, #BEF264)'
                        }}
                        className="w-full max-w-[42px] rounded-t-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all transform group-hover:-translate-y-1"
                      />

                      {/* X-Axis Date Pill Container (Prevents clipping & overlapping) */}
                      <div className="absolute -bottom-12 w-full flex justify-center">
                        <span className={`text-[10px] font-black uppercase border border-black px-2 py-0.5 rounded-md whitespace-nowrap shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                          isHovered ? 'bg-black text-[#B0FF49]' : 'bg-white text-black'
                        }`}>
                          {bucket.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ─── PAYMENT BREAKDOWN & CATEGORY POPULARITY SECTION ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Payment Collection Breakdown */}
        <div className="lg:col-span-6 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
              <div className="flex items-center gap-2">
                <CreditCard size={22} className="text-[#0D8DE3]" strokeWidth={3} />
                <h3 className="text-2xl font-black uppercase text-black lilita-one-regular">Payment Collection</h3>
              </div>
              <span className="text-xs font-black uppercase bg-[#B0FF49] border-2 border-black px-2.5 py-1 rounded-lg">Channel Share</span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Cash Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-black uppercase mb-1.5">
                  <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-black" /> Offline Cash (COD)</span>
                  <span className="text-[#0D8DE3]">₹{cashRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-5 bg-gray-100 border-2 border-black rounded-xl overflow-hidden flex shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div
                    style={{ width: `${totalRevenue > 0 ? (cashRevenue / totalRevenue) * 100 : 0}%` }}
                    className="h-full bg-[#B0FF49] border-r-2 border-black transition-all"
                  />
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1.5">
                  {cashOrdersCount} Order{cashOrdersCount > 1 ? 's' : ''} ({totalOrdersCount > 0 ? ((cashOrdersCount / totalOrdersCount) * 100).toFixed(0) : 0}%)
                </p>
              </div>

              {/* Online Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-black uppercase mb-1.5">
                  <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-[#0D8DE3]" /> Online Payment (UPI / Card)</span>
                  <span className="text-[#0D8DE3]">₹{onlineRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-5 bg-gray-100 border-2 border-black rounded-xl overflow-hidden flex shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div
                    style={{ width: `${totalRevenue > 0 ? (onlineRevenue / totalRevenue) * 100 : 0}%` }}
                    className="h-full bg-[#0D8DE3] border-r-2 border-black transition-all"
                  />
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1.5">
                  {onlineOrdersCount} Order{onlineOrdersCount > 1 ? 's' : ''} ({totalOrdersCount > 0 ? ((onlineOrdersCount / totalOrdersCount) * 100).toFixed(0) : 0}%)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#B0FF49]/20 border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] mt-4">
            <p className="text-xs font-black uppercase text-black">Net Filtered Collections</p>
            <p className="text-3xl font-black text-black lilita-one-regular mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[10px] font-bold text-gray-600 uppercase mt-0.5">Total collected revenue across active range</p>
          </div>
        </div>

        {/* Wash Category Popularity Chart */}
        <div className="lg:col-span-6 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black pb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={22} className="text-[#0D8DE3]" strokeWidth={3} />
              <h3 className="text-2xl font-black uppercase text-black lilita-one-regular">Popular Wash Services</h3>
            </div>
            <span className="text-xs font-black uppercase bg-[#B0FF49] border-2 border-black px-2.5 py-1 rounded-lg">Top Services</span>
          </div>

          {categoryStats.length === 0 ? (
            <div className="p-8 text-center font-bold text-gray-500 uppercase">No wash service data available.</div>
          ) : (
            <div className="space-y-4 pt-2">
              {categoryStats.map((cat, idx) => {
                const widthPercent = (cat.revenue / maxCatRevenue) * 100;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-black uppercase">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-black text-[#B0FF49] rounded-md border border-black flex items-center justify-center text-[10px]">#{idx + 1}</span>
                        {cat.name}
                      </span>
                      <span className="text-black">₹{cat.revenue.toLocaleString('en-IN')} ({cat.count} items)</span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 border-2 border-black rounded-xl overflow-hidden flex shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      <div
                        style={{ width: `${Math.max(widthPercent, 5)}%` }}
                        className="h-full bg-[#B0FF49] border-r-2 border-black transition-all"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ─── TOP CUSTOMERS LEADERBOARD ───────────────────────────────────────── */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b-4 border-black pb-4">
          <div className="flex items-center gap-2">
            <Trophy size={24} className="text-yellow-500" strokeWidth={3} />
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-black lilita-one-regular">Top Customers Leaderboard</h3>
          </div>
          <span className="text-xs font-black uppercase bg-gray-100 border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">Ranked by Volume</span>
        </div>

        <div className="divide-y-2 divide-black">
          {topCustomers.length === 0 ? (
            <div className="p-8 text-center font-bold text-gray-500 uppercase">No customer activity in selected date range.</div>
          ) : (
            topCustomers.map((cust, i) => (
              <div key={i} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-[#B0FF49] border-2 border-black rounded-full flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  {cust.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-lg truncate uppercase text-black">{cust.name}</h4>
                  <p className="text-xs font-bold text-gray-500">{cust.orders} Order{cust.orders > 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-black text-[#0D8DE3] text-xl">₹{cust.amount.toLocaleString('en-IN')}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Spent in Range</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
