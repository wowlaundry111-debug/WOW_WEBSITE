import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, FileText, CheckCircle2, Droplets, Sparkles, Truck, Gift, User, Store, Copy, Check, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Navbar from '../../components/Navbar';
import { resolveVectorImage } from '../../utils/vectorGallery';

import imgNormal from '../../assets/normal.png';
import imgDryClean from '../../assets/dryClean.png';
import imgEasyWash from '../../assets/easyWash.png';
import imgBedding from '../../assets/bedding.png';

import imgLeather from '../../assets/leather.png';
import imgSuits from '../../assets/suits.png';
import imgBlanket from '../../assets/blanket.png';

const getCategoryStyle = (name) => {
  if (!name) return { img: imgNormal, bg: 'bg-white', color: 'text-black', badge: 'Care+' };
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('blanket') || lowerName.includes('rajai') || lowerName.includes('rajaai') || lowerName.includes('quilt')) {
    return { img: imgBlanket, bg: 'bg-white', color: 'text-black', badge: 'Warm Care' };
  }
  if (lowerName.includes('formal') || lowerName.includes('interview') || lowerName.includes('suit')) {
    return { img: imgSuits, bg: 'bg-white', color: 'text-black', badge: 'Eco Safe' };
  }
  if (lowerName.includes('bedding') || lowerName.includes('bedsheet') || lowerName.includes('curtain') || lowerName.includes('home') || lowerName.includes('linen')) {
    return { img: imgBedding, bg: 'bg-white', color: 'text-black', badge: 'Express' };
  }
  if (lowerName.includes('winter') || lowerName.includes('coat') || lowerName.includes('leather') || lowerName.includes('jacket')) {
    return { img: imgLeather, bg: 'bg-[#061E38]', color: 'text-black', badge: 'Save ₹99' };
  }
  if (lowerName.includes('dryclean') || lowerName.includes('premium')) {
    return { img: imgDryClean, bg: 'bg-white', color: 'text-black', badge: 'Sanitized' };
  }
  if (lowerName.includes('everyday') || lowerName.includes('normal') || lowerName.includes('men') || lowerName.includes('women') || lowerName.includes('student') || lowerName.includes('wash') || lowerName.includes('daily')) {
    return { img: imgEasyWash, bg: 'bg-white', color: 'text-black', badge: '50% OFF' };
  }
  
  return { img: imgNormal, bg: 'bg-white', color: 'text-black', badge: 'Care+' };
};

const ORDER_STEPS = [
  { key: 'PLACED', label: 'Placed', icon: FileText },
  { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
  { key: 'WASHING', label: 'Wash', icon: Droplets },
  { key: 'IRONING', label: 'Press', icon: Sparkles },
  { key: 'OUT_FOR_DELIVERY', label: 'Out', icon: Truck },
  { key: 'DELIVERED', label: 'Done', icon: Gift }
];

export default function CustomerHome() {
  const { categories, items, currentTenantId, setCurrentTenantId, cart, currentUser, orders, shops, isCatalogLoading, fetchCatalog, fetchOrders } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const currentShop = shops.find((s) => String(s._id) === String(currentTenantId)) || shops[0];
  const effectiveShopId = currentTenantId || currentShop?._id;

  React.useEffect(() => {
    if (effectiveShopId) {
      fetchCatalog(String(effectiveShopId));
    } else {
      fetchCatalog();
    }
    if (fetchOrders) {
      fetchOrders();
    }
  }, [effectiveShopId, fetchCatalog, fetchOrders]);

  const promo1 = currentShop?.promoBanners?.[0] || { badge: 'PROMO', title: '50% OFF', subtitle: 'Winter Wear Deep Dryclean' };
  const promo2 = currentShop?.promoBanners?.[1] || { badge: 'EXPRESS', title: 'EXPRESS DOORSTEP', subtitle: 'Fast doorstep pickup & delivery' };
  
  const [copiedCode, setCopiedCode] = useState(false);
  const activePromoCode = (currentShop?.promoCode && currentShop.promoCode.isActive !== false && currentShop.promoCode.code)
    ? currentShop.promoCode
    : null;

  const activeOrder = orders.find((o) => o.customerId === currentUser?._id && o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const activeStepIndex = React.useMemo(() => {
    if (!activeOrder) return -1;
    const st = activeOrder.status;
    if (st === 'PLACED') return 0;
    if (['ACCEPTED', 'PICKUP_ASSIGNED', 'PICKED_UP'].includes(st)) return 1;
    if (st === 'WASHING') return 2;
    if (st === 'IRONING') return 3;
    if (st === 'OUT_FOR_DELIVERY') return 4;
    if (st === 'DELIVERED') return 5;
    return -1;
  }, [activeOrder]);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const hasLoadedShopCats = categories.some((c) => !effectiveShopId || String(c.shopId) === String(effectiveShopId));
  const isCatLoading = isCatalogLoading || (!hasLoadedShopCats && categories.length === 0);

  const tenantCats = categories.filter((c) => {
    if (effectiveShopId && String(c.shopId) !== String(effectiveShopId)) return false;
    if (c.parentCategoryId) return false; // Show only top-level categories on root home grid
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const subCatIds = (c.subCategories?.length ? c.subCategories : categories.filter(sub => String(sub.parentCategoryId) === String(c._id))).map(s => String(s._id));
    return items.some(item => (String(item.categoryId) === String(c._id) || subCatIds.includes(String(item.categoryId))) && item.name.toLowerCase().includes(query));
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col pb-24 font-outfit selection:bg-black selection:text-white">
      <Navbar />
      
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#9AE600] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {currentUser?.name ? (
                <span className="text-black font-extrabold text-xl lilita-one-regular">{currentUser.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User size={24} strokeWidth={2.5} className="text-black" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-black uppercase tracking-wider">{getGreeting()}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black lilita-one-regular tracking-wide">
                {currentUser?.name || 'Guest'}
              </h1>
            </div>
          </div>

          {shops.length > 0 && (
            <div className="flex items-center gap-2 bg-white border-2 border-black rounded-xl px-3 py-2 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <Store size={18} strokeWidth={2.5} className="text-[#0D8DE3]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Branch</span>
                <select
                  value={currentTenantId || currentShop?._id || ''}
                  onChange={(e) => setCurrentTenantId(e.target.value)}
                  className="bg-transparent font-extrabold text-xs uppercase tracking-wider text-black cursor-pointer focus:outline-none"
                >
                  {shops.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center bg-white border-2 border-black rounded-xl px-4 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-10 transition-all focus-within:translate-x-1 focus-within:translate-y-1 focus-within:shadow-none animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Search size={24} strokeWidth={3} className="text-black shrink-0" />
          <input
            type="text"
            placeholder="Search clothes, dry cleaning, pressing..."
            className="w-full bg-transparent border-none outline-none ml-3 text-black font-bold placeholder-gray-500 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Active Order Widget (Neo-brutalist) */}
        {activeOrder && activeStepIndex !== -1 && (
          <div className="bg-[#0D8DE3] border-2 border-black rounded-2xl p-6 mb-10 shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-black animate-pulse"></div>
                <h3 className="font-extrabold text-black text-xl lilita-one-regular tracking-wide">Live Tracking</h3>
              </div>
              <span className="text-sm font-bold text-white bg-black px-4 py-2 rounded-lg border-2 border-black">
                #{activeOrder._id.slice(-6).toUpperCase()}
              </span>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-6 left-0 w-full h-2 bg-gray-200 border-y-2 border-black -z-0"></div>
                <div 
                  className="absolute top-6 left-0 h-2 bg-[#9AE600] border-y-2 border-black -z-0 transition-all duration-500"
                  style={{ width: `${Math.max(0, (activeStepIndex / (ORDER_STEPS.length - 1)) * 100)}%` }}
                ></div>

                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= activeStepIndex;
                  const isActive = idx === activeStepIndex;
                  const StepIcon = step.icon;
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center z-10 w-12">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-black transition-all duration-300 ${
                        isActive ? 'bg-[#0D8DE3] scale-125 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black' : 
                        isCompleted ? 'bg-[#9AE600] text-black' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <StepIcon size={20} strokeWidth={2.5} />
                      </div>
                      <span className={`text-xs font-black mt-3 text-center uppercase tracking-tight ${
                        isActive ? 'text-black scale-110' : 'text-gray-700'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Link to={`/order-history`} className="mt-6 block text-center text-lg font-black text-black hover:underline underline-offset-4 decoration-4">
              View Order Details &rarr;
            </Link>
          </div>
        )}

        {/* Promo Banners */}
        <div className="flex gap-6 overflow-x-auto pb-6 mb-6 snap-x no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {activePromoCode ? (
            <div className="snap-start shrink-0 w-[290px] sm:w-[330px] bg-[#9AE600] border-2 border-black rounded-2xl p-5 shadow-[6px_6px_0px_rgba(0,0,0,1)] text-black relative overflow-hidden flex flex-col justify-between transform transition-transform hover:-translate-y-1">
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-black text-[#9AE600] px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase inline-block">
                    PROMO CODE
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(activePromoCode.code);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }
                    }}
                    className="flex items-center gap-1 bg-white border border-black px-2 py-0.5 rounded text-[10px] font-black uppercase hover:bg-black hover:text-white transition-colors shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    {copiedCode ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    {copiedCode ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
                <h2 className="text-3xl font-black italic lilita-one-regular leading-none">
                  {activePromoCode.discountPercent}% OFF
                </h2>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="bg-white border-2 border-black px-2 py-0.5 rounded-lg font-black text-xs uppercase tracking-wider text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                    USE CODE: {activePromoCode.code}
                  </span>
                </div>
                <p className="font-extrabold mt-2 text-[11px] uppercase text-black/80">
                  {activePromoCode.description || `Min Order ₹${activePromoCode.minOrderValue} • Max Discount ₹${activePromoCode.maxDiscount}`}
                </p>
              </div>
              <div className="absolute right-3 bottom-3 w-14 h-14 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] opacity-90 pointer-events-none">
                <Sparkles size={28} strokeWidth={2.5} className="text-black" />
              </div>
            </div>
          ) : (
            <div className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-[#9AE600] border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] text-black relative overflow-hidden flex items-center justify-between transform transition-transform hover:-translate-y-1">
              <div className="relative z-10 pr-2">
                <span className="bg-black text-[#9AE600] px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase mb-2 inline-block">{promo1.badge || 'PROMO'}</span>
                <h2 className="text-3xl font-black italic lilita-one-regular">{promo1.title}</h2>
                <p className="font-extrabold mt-1 text-xs uppercase">{promo1.subtitle}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <Sparkles size={32} strokeWidth={2.5} className="text-black" />
              </div>
            </div>
          )}
          
          <div className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-[#0D8DE3] border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden flex items-center justify-between transform transition-transform hover:-translate-y-1">
            <div className="relative z-10 pr-2">
              <span className="bg-white text-black border-2 border-black px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase mb-2 inline-block">{promo2.badge || 'FREE'}</span>
              <h2 className="text-3xl font-black italic lilita-one-regular leading-tight">{promo2.title}</h2>
              <p className="font-extrabold mt-1 text-xs uppercase text-white">{promo2.subtitle}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#9AE600] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black">
              <Truck size={32} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-6 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div>
            <h2 className="text-3xl font-black text-black lilita-one-regular tracking-wide uppercase">Start Washing</h2>
            <p className="text-sm font-extrabold text-gray-600 mt-1 uppercase tracking-widest">
              {isCatLoading ? `Loading ${currentShop?.name || 'Shop'} Services...` : 'Pick a category'}
            </p>
          </div>
          {isCatLoading && (
            <div className="flex items-center gap-2 bg-[#9AE600] border-2 border-black px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <Loader2 size={16} strokeWidth={3} className="text-black animate-spin" />
              <span className="text-xs font-black uppercase tracking-wider text-black">Updating</span>
            </div>
          )}
        </div>

        {/* Animated Loading Skeleton Grid */}
        {isCatLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div 
                key={n} 
                className="bg-white border-2 border-black rounded-2xl p-5 flex flex-col justify-between shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden animate-pulse"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-6 w-20 bg-gray-200 rounded-lg border-2 border-black animate-pulse" />
                </div>
                <div className="w-full flex flex-col items-center justify-center my-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Droplets className="w-8 h-8 sm:w-10 sm:h-10 text-[#0D8DE3] opacity-60 animate-bounce" />
                  </div>
                </div>
                <div className="mt-auto border-t-4 border-black pt-3">
                  <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6">
            {tenantCats.map((cat, idx) => {
              const style = getCategoryStyle(cat.name);
              const catImg = resolveVectorImage(cat.image, cat.name) || style.img;
              
              return (
                <Link 
                  key={cat._id}
                  to={`/order/${cat._id}`}
                  className={`${style.bg} border-2 border-black rounded-2xl p-5 flex flex-col justify-between shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group animate-fade-in-up opacity-0 active:translate-y-1 active:translate-x-1 active:shadow-none`}
                  style={{ animationDelay: `${500 + idx * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1.5 rounded-lg bg-black text-white border-2 border-black transform -rotate-3 group-hover:rotate-0 transition-transform`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest`}>
                        {style.badge}
                      </span>
                    </div>
                  </div>

                  <div className="w-full flex justify-center mb-6">
                    <img 
                      src={catImg} 
                      alt={cat.name} 
                      onError={(e) => { e.currentTarget.src = style.img; }}
                      className="w-24 h-24 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  
                  <div className="mt-auto border-t-4 border-black pt-3">
                    <h3 className={`font-extrabold ${style.color} leading-tight text-lg sm:text-xl uppercase tracking-wide`}>{cat.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        
        {!isCatLoading && tenantCats.length === 0 && (
          <div className="text-center py-16 bg-gray-100 rounded-3xl border-4 border-dashed border-black">
            <p className="text-black font-black text-xl uppercase tracking-wider">No categories found.</p>
          </div>
        )}
      </div>

      {/* Floating Cart (Neo-brutalist) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none flex justify-center animate-bounce-soft">
          <Link 
            to="/cart" 
            className="w-full max-w-3xl bg-black text-white p-5 rounded-2xl border-2 border-black shadow-[6px_6px_0px_#9AE600] flex items-center justify-between pointer-events-auto transition-all hover:bg-gray-900 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#9AE600]"
          >
            <div>
              <p className="text-xs font-black text-[#9AE600] tracking-widest uppercase">
                {cart.length} ITEM{cart.length > 1 ? 'S' : ''} ADDED
              </p>
              {(() => {
                const isKgCheck = (c) => c.unit === 'KG' || Boolean(c.pricePerKg && c.pricePerKg > 0) || (typeof c.name === 'string' && (c.name.toLowerCase().includes('per kg') || c.name.toLowerCase().includes('/ kg')));
                const hasKg = cart.some(isKgCheck);
                const perItemTotal = cart.filter(c => !isKgCheck(c)).reduce((s, c) => s + (c.price || 0) * c.quantity, 0);
                return hasKg ? (
                  <p className="text-lg sm:text-xl font-black mt-1 lilita-one-regular text-[#9AE600] tracking-wider uppercase">
                    {perItemTotal > 0 ? `₹${perItemTotal} + KG Pending` : 'Pending Weighing'}
                  </p>
                ) : (
                  <p className="text-2xl font-black mt-1 lilita-one-regular tracking-wider">₹{cartTotal}</p>
                );
              })()}

            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-lg uppercase tracking-wide">Checkout</span>
              <div className="w-10 h-10 bg-[#9AE600] border-2 border-black rounded-full flex items-center justify-center">
                <ChevronDown size={24} strokeWidth={4} className="text-black -rotate-90" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
