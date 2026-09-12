import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowLeft, Trash2, Plus, Minus, MapPin, CheckCircle2, Receipt, AlertTriangle, Sparkles, Check, Home, Briefcase, Scale } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, clearCart, placeOrder, activeCoupon, applyCoupon, removeCoupon, shops, currentTenantId, currentUser } = useAppStore();
  
  const shop = shops.find(s => s._id === currentTenantId);
  const isClosed = shop?.isOpen === false;

  // Structured Precise Delivery Address (Food App Style)
  const [addrTag, setAddrTag] = useState('Home');
  const [flatNo, setFlatNo] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');

  React.useEffect(() => {
    if (currentUser?.address) {
      const raw = currentUser.address;
      if (raw.includes('(Work)')) setAddrTag('Work');
      else if (raw.includes('(Other)')) setAddrTag('Other');
      else setAddrTag('Home');

      const clean = raw.replace(/\((Home|Work|Other)\)/, '').trim();
      const parts = clean.split(',').map((p) => p.trim());
      if (parts.length >= 3) {
        setFlatNo(parts[0].replace(/^(Flat|House|Flat\/House|House\/Flat)\s*:?/i, '').trim());
        setArea(parts[1] || '');
        setCity(parts[2] || '');
      } else {
        setArea(clean);
      }
    }
  }, [currentUser]);

  const computeFormattedAddress = () => {
    const parts = [
      flatNo.trim() ? (flatNo.trim().toLowerCase().startsWith('flat') || flatNo.trim().toLowerCase().startsWith('house') ? flatNo.trim() : `Flat/House: ${flatNo.trim()}`) : '',
      area.trim() ? area.trim() : '',
      city.trim() ? city.trim() : '',
    ].filter(Boolean);

    if (parts.length === 0) return '';
    return `${parts.join(', ')} (${addrTag})`;
  };

  const [pickupTime, setPickupTime] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [selectedWashPrefs, setSelectedWashPrefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultWashPrefs = [
    { id: 'extra_softener', name: 'Extra Fabric Softener', description: 'Delicate lavender scent & plush softness', price: 20, enabled: true },
    { id: 'anti_bacterial', name: 'Anti-Bacterial Sanitization', description: 'Deep hygiene rinse eliminating 99.9% germs', price: 30, enabled: true },
    { id: 'stain_booster', name: 'Stain Remover Booster', description: 'Spot treatment for tough grease & collar marks', price: 40, enabled: true }
  ];

  const availableWashPrefs = (shop?.washPreferences && shop.washPreferences.length > 0 ? shop.washPreferences : defaultWashPrefs).filter(p => p.enabled !== false);

  const toggleWashPref = (pref) => {
    if (selectedWashPrefs.some(p => p.name === pref.name)) {
      setSelectedWashPrefs(selectedWashPrefs.filter(p => p.name !== pref.name));
    } else {
      setSelectedWashPrefs([...selectedWashPrefs, { id: pref.id, name: pref.name, price: pref.price }]);
    }
  };

  const isKgItem = (c) => {
    if (!c) return false;
    if (c.unit === 'KG' || c.unit === 'kg') return true;
    if (typeof c.name === 'string' && (c.name.toLowerCase().includes('per kg') || c.name.toLowerCase().includes('/ kg') || c.name.toLowerCase().includes('per-kg'))) return true;
    if (c.pricePerKg && c.pricePerKg > 0) return true;
    return false;
  };

  const hasKgItems = cart.some(isKgItem);
  const perItemSubtotal = cart.filter(c => !isKgItem(c)).reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const subtotal = perItemSubtotal;
  
  const taxPercent = shop?.taxPercent || 5;
  const deliveryFee = hasKgItems ? (shop?.deliveryFee || 50) : (subtotal > 500 ? 0 : (shop?.deliveryFee || 50));
  const tax = (subtotal * taxPercent) / 100;
  const discount = activeCoupon ? Math.min((subtotal * activeCoupon.discountPercent) / 100, activeCoupon.maxDiscount) : 0;
  const washPrefsCost = selectedWashPrefs.reduce((sum, p) => sum + p.price, 0);
  const total = subtotal - discount + tax + deliveryFee + washPrefsCost;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const handlePlaceOrder = async () => {
    if (isClosed) {
      setError('This branch is currently closed and not accepting orders.');
      return;
    }
    const finalAddress = computeFormattedAddress();
    if (!finalAddress.trim()) {
      setError('Please provide your delivery address.');
      return;
    }
    const minOrderValue = shop?.minOrderValue || 0;
    if (!hasKgItems && subtotal < minOrderValue) {
      setError(`Minimum order value is ₹${minOrderValue}. Please add more items.`);
      return;
    }

    setLoading(true);
    setError('');
    
    const res = await placeOrder(finalAddress, pickupTime, selectedWashPrefs);
    
    setLoading(false);

    if (res.success) {
      navigate('/order-history', { state: { successMsg: res.message } });
    } else {
      setError(res.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D8DE3] flex flex-col items-center justify-center p-4 font-outfit">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#9AE600] border-2 border-black rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] text-black">
          <Trash2 size={40} strokeWidth={3} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-black mb-3 lilita-one-regular uppercase tracking-widest text-center">Your cart is empty</h2>
        <p className="text-black mb-8 text-center max-w-sm font-black text-sm sm:text-base bg-white p-3 sm:p-4 border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase">
          Looks like you haven't added any items to your cart yet.
        </p>
        <button 
          onClick={() => navigate('/order')}
          className="bg-black text-[#0D8DE3] font-black py-3 sm:py-4 px-8 sm:px-10 rounded-xl text-base sm:text-xl uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#9AE600] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28 sm:pb-36 font-outfit selection:bg-black selection:text-[#9AE600]">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-[#0D8DE3] border-b-2 border-black shadow-[0_3px_0_rgba(0,0,0,1)]">
        <div className="max-w-4xl mx-auto px-3.5 py-2.5 sm:px-4 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/order')}
              className="w-9 h-9 sm:w-11 sm:h-11 bg-white border-2 border-black rounded-full flex items-center justify-center text-black hover:bg-black hover:text-[#0D8DE3] shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
            >
              <ArrowLeft size={20} strokeWidth={3.5} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white lilita-one-regular uppercase tracking-wider drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              Checkout
            </h1>
          </div>
          <button 
            onClick={clearCart} 
            className="bg-white hover:bg-gray-100 text-black font-black text-xs uppercase tracking-wider px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        <div className="md:col-span-7 space-y-4 sm:space-y-6">
          
          {isClosed && (
            <div className="bg-[#0D8DE3] border-2 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center border-2 border-black shrink-0">
                  <AlertTriangle size={20} strokeWidth={2.5} className="text-black" />
                </div>
                <h3 className="font-black text-black text-xl uppercase lilita-one-regular">Branch Closed</h3>
              </div>
              <p className="text-black font-extrabold uppercase bg-white p-2.5 border-2 border-black rounded-xl text-xs sm:text-sm">
                This branch ("{shop?.name || 'WOW Express'}") is temporarily closed. You cannot place new orders until this branch re-opens.
              </p>
            </div>
          )}

          {/* Delivery Details */}
          <div className="bg-[#9AE600] rounded-2xl sm:rounded-3xl border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-3.5 bg-black text-[#9AE600] py-1.5 px-3 rounded-lg border-2 border-black shadow-[-2px_2px_0px_white] inline-flex">
              <MapPin size={18} strokeWidth={3} />
              <h2 className="font-black text-sm sm:text-base uppercase lilita-one-regular tracking-wider">Delivery Address</h2>
            </div>
            
            <div className="space-y-3">
              {/* Address Tag Selector */}
              <div>
                <label className="block text-[11px] font-black text-black mb-1 uppercase tracking-wider">
                  Save Address As
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { tag: 'Home', label: 'Home', icon: Home },
                    { tag: 'Work', label: 'Work', icon: Briefcase },
                    { tag: 'Other', label: 'Other', icon: MapPin }
                  ].map(t => {
                    const IconComponent = t.icon;
                    const isSelected = addrTag === t.tag;
                    return (
                      <button
                        key={t.tag}
                        type="button"
                        onClick={() => setAddrTag(t.tag)}
                        className={`py-1.5 px-2 rounded-xl border-2 border-black font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-black text-[#9AE600] shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-black hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent size={13} strokeWidth={2.5} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 1: Flat / House No */}
              <div>
                <label className="block text-[11px] font-black text-black mb-1 uppercase tracking-wider">
                  House / Flat / Building
                </label>
                <input 
                  type="text"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  placeholder="e.g. Flat 402, Palm Heights"
                  className="w-full bg-white border-2 border-black rounded-xl p-2.5 text-black font-extrabold focus:outline-none text-xs sm:text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
              </div>

              {/* Field 2: Area & Street */}
              <div>
                <label className="block text-[11px] font-black text-black mb-1 uppercase tracking-wider">
                  Area, Street & City
                </label>
                <input 
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Lawgate, Hostel Block 1"
                  className="w-full bg-white border-2 border-black rounded-xl p-2.5 text-black font-extrabold focus:outline-none text-xs sm:text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
              </div>

              {/* Pickup Slot */}
              <div>
                <label className="block text-[11px] font-black text-black mb-1 uppercase tracking-wider">
                  Pickup Time Slot
                </label>
                <input 
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="e.g. Today 4:00 PM - 6:00 PM, Tomorrow Morning"
                  className="w-full bg-white border-2 border-black rounded-xl p-2.5 text-black font-extrabold focus:outline-none text-xs sm:text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>
          </div>

          {/* Wash Add-ons & Preferences */}
          {availableWashPrefs.length > 0 && (
            <div className="bg-[#0D8DE3]/10 rounded-2xl sm:rounded-3xl border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#0D8DE3]" strokeWidth={3} />
                  <h2 className="font-black text-black text-base sm:text-lg uppercase lilita-one-regular tracking-wide">Wash Add-ons</h2>
                </div>
                <span className="text-[10px] font-black uppercase bg-[#0D8DE3] text-white px-2 py-0.5 rounded-full border border-black">Optional</span>
              </div>

              <div className="space-y-2">
                {availableWashPrefs.map((pref) => {
                  const isSelected = selectedWashPrefs.some(p => p.name === pref.name);
                  return (
                    <button
                      type="button"
                      key={pref.id || pref.name}
                      onClick={() => toggleWashPref(pref)}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-xl border-2 border-black flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#9AE600] shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                          : 'bg-white hover:bg-gray-50 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className={`w-5 h-5 rounded-md border-2 border-black shrink-0 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-black text-[#9AE600]' : 'bg-white'
                        }`}>
                          {isSelected && <Check size={14} strokeWidth={4} />}
                        </div>
                        <div className="truncate">
                          <h4 className="font-black text-xs uppercase text-black truncate">{pref.name}</h4>
                          {pref.description && (
                            <p className="text-[10px] font-bold text-gray-600 truncate">{pref.description}</p>
                          )}
                        </div>
                      </div>

                      <span className="font-black text-xs uppercase bg-white px-2 py-0.5 rounded-lg border-2 border-black text-black shrink-0">
                        +₹{pref.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="p-3.5 sm:p-4 border-b-2 border-black bg-[#9AE600] flex justify-between items-center">
              <h2 className="font-black text-black text-lg sm:text-xl uppercase lilita-one-regular tracking-wide">Item Summary</h2>
              <span className="bg-black text-[#9AE600] text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black tracking-wider uppercase">{cart.length} ITEMS</span>
            </div>
            <div className="divide-y-2 divide-gray-200">
              {cart.map((item) => {
                const isKg = isKgItem(item);
                return (
                  <div key={item.itemId} className="p-3 sm:p-3.5 flex gap-3 items-center hover:bg-gray-50 transition-colors">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0D8DE3] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-xl sm:text-2xl font-black lilita-one-regular">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className="font-black text-black text-sm uppercase tracking-wide truncate">{item.name}</h3>
                      {(item.categoryName || item.subCategoryName) && (
                        <p className="text-[10px] font-black uppercase text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300 mt-0.5 inline-block truncate max-w-full">
                          {item.categoryName}{item.subCategoryName ? ` › ${item.subCategoryName}` : ''}
                        </p>
                      )}
                      {isKg ? (
                        <div className="flex items-center gap-1 text-[10px] font-black text-[#0D8DE3] uppercase mt-0.5">
                          <Scale size={11} strokeWidth={2.5} /> Weighed at pickup
                        </div>
                      ) : (
                        <p className="text-xs text-gray-700 font-extrabold mt-0.5">₹{item.price} / {item.unit || 'Item'}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {isKg ? (
                        <span className="font-black text-[10px] text-white bg-[#0D8DE3] px-2 py-0.5 border-2 border-black rounded-md uppercase tracking-wider">Pending</span>
                      ) : (
                        <span className="font-black text-black text-sm sm:text-base bg-[#9AE600] px-2 py-0.5 border-2 border-black rounded-lg">₹{(item.price || 0) * item.quantity}</span>
                      )}
                      <div className="flex items-center bg-[#0D8DE3] border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <button onClick={() => updateCartQuantity(item.itemId, item.quantity - 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-black hover:bg-black hover:text-[#0D8DE3] transition-colors border-r-2 border-black">
                          <Minus size={14} strokeWidth={3.5} />
                        </button>
                        <span className="w-7 sm:w-8 text-center font-black text-black text-xs sm:text-sm bg-white h-7 sm:h-8 flex items-center justify-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.itemId, item.quantity + 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-black hover:bg-black hover:text-[#0D8DE3] transition-colors border-l-2 border-black">
                          <Plus size={14} strokeWidth={3.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:col-span-5 space-y-4 sm:space-y-6">
          {/* Coupon Code */}
          <div className="bg-[#0D8DE3] rounded-2xl sm:rounded-3xl border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-black mb-3 text-sm sm:text-base uppercase lilita-one-regular tracking-wide bg-white inline-block px-2.5 py-0.5 border-2 border-black rounded-lg shadow-[-2px_2px_0px_rgba(0,0,0,1)]">
              Apply Promo Code
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2 relative mt-1">
              <input 
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="ENTER CODE"
                className="flex-1 bg-white border-2 border-black rounded-xl px-3 py-2.5 text-black font-black uppercase tracking-wider text-xs sm:text-sm focus:outline-none focus:bg-[#9AE600] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              />
              <button type="submit" className="bg-black text-[#0D8DE3] px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition-colors border-2 border-black">
                APPLY
              </button>
            </form>
            {couponMsg.text && (
              <p className={`mt-2 text-xs font-black bg-white inline-block px-2.5 py-0.5 rounded-md border border-black uppercase ${couponMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {couponMsg.text}
              </p>
            )}
            {activeCoupon && (
              <div className="mt-3 flex items-center justify-between bg-[#9AE600] border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} strokeWidth={3} className="text-black" />
                  <span className="text-xs font-black text-black uppercase tracking-wider">{activeCoupon.code} Applied!</span>
                </div>
                <button type="button" onClick={removeCoupon} className="text-[10px] text-white bg-black px-2 py-1 rounded-md border border-black font-black uppercase tracking-wider hover:bg-red-600">Remove</button>
              </div>
            )}
          </div>

          {/* Bill Details */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-black">
              <div className="bg-black text-[#0D8DE3] p-1.5 rounded-lg border-2 border-black">
                <Receipt size={18} strokeWidth={3} />
              </div>
              <h2 className="font-black text-black text-lg sm:text-xl uppercase lilita-one-regular tracking-wide">Bill Details</h2>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const perItemSubtotal = cart.filter(c => !isKgItem(c)).reduce((s, c) => s + (c.price || 0) * c.quantity, 0);
                const kgItems = cart.filter(isKgItem);
                const hasKgItems = kgItems.length > 0;
                return (
                  <>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-extrabold text-gray-700 uppercase tracking-wide">Item Total</span>
                      <span className="font-black text-black">
                        {perItemSubtotal > 0 ? `₹${perItemSubtotal.toFixed(2)}` : (hasKgItems ? 'Pending Weighing' : '₹0.00')}
                      </span>
                    </div>
                    {hasKgItems && (
                      <div className="flex justify-between text-xs sm:text-sm bg-blue-50 border-2 border-[#0D8DE3] rounded-lg p-2">
                        <span className="font-extrabold text-[#0D8DE3] uppercase tracking-wide flex items-center gap-1">
                          <Scale size={13} /> KG Items ({kgItems.length})
                        </span>
                        <span className="font-black text-[#0D8DE3] text-[10px] sm:text-xs uppercase tracking-wider">Weighed at pickup</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-extrabold text-gray-700 uppercase tracking-wide">Taxes &amp; Charges ({taxPercent}%)</span>
                      <span className="font-black text-black">₹{tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-extrabold text-gray-700 uppercase tracking-wide">Delivery Fee</span>
                      <span className="font-black text-black bg-[#9AE600] px-2 py-0.5 rounded-md border border-black">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    {washPrefsCost > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-extrabold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                          <Sparkles size={13} className="text-[#0D8DE3]" /> Wash Add-ons ({selectedWashPrefs.length})
                        </span>
                        <span className="font-black text-black">+₹{washPrefsCost.toFixed(2)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-black text-[#0D8DE3] uppercase tracking-wide bg-black px-1.5 py-0.5 rounded-md">Promo</span>
                        <span className="font-black text-black">-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-3 mt-2 border-t-2 border-black border-dashed">
                      {hasKgItems ? (
                        <div className="bg-[#9AE600] p-3 sm:p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-black text-black text-sm sm:text-base uppercase tracking-wider">Grand Total</span>
                              <p className="text-[10px] font-black text-gray-800 uppercase tracking-wider mt-0.5">
                                Final price locked upon pickup weighing
                              </p>
                            </div>
                            <span className="font-black text-xs sm:text-sm text-black bg-white px-2 py-1 rounded-lg border-2 border-black uppercase shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                              Pending Calculation
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center bg-[#9AE600] p-3 sm:p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          <span className="font-black text-black text-base sm:text-lg uppercase tracking-wider">Grand Total</span>
                          <span className="font-black text-xl sm:text-2xl text-black bg-white px-2.5 py-0.5 rounded-lg border-2 border-black">₹{total.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Compact Floating Checkout Dock */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D8DE3] border-t-2 sm:border-t-4 border-black px-3.5 py-2 sm:px-6 sm:py-3.5 z-50 shadow-[0_-4px_0_rgba(0,0,0,1)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="bg-white py-1 px-3 sm:py-2 sm:px-4 border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0">
            <p className="text-[10px] font-black text-black uppercase tracking-wider bg-[#9AE600] px-1.5 py-0.5 rounded border border-black inline-block">
              {hasKgItems ? 'Pay After Pickup Weighing' : 'Pay via UPI / Cash'}
            </p>
            {hasKgItems ? (
              <p className="font-black text-sm sm:text-lg text-black lilita-one-regular uppercase tracking-wider mt-0.5">
                Pending Weighing
              </p>
            ) : (
              <p className="font-black text-xl sm:text-2xl text-black lilita-one-regular mt-0.5">₹{total.toFixed(2)}</p>
            )}
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={loading || isClosed || (!hasKgItems && subtotal < (shop?.minOrderValue || 0))}
            className="flex-1 max-w-xs bg-[#9AE600] hover:bg-[#86d000] disabled:bg-gray-300 disabled:shadow-none text-black font-black py-3 sm:py-3.5 px-4 sm:px-8 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all text-sm sm:text-lg uppercase tracking-wider"
          >
            {loading ? 'Processing...' : isClosed ? 'Shop Closed' : 'Place Order'}
            {!loading && !isClosed && <CheckCircle2 size={20} strokeWidth={3} />}
          </button>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mt-2">
             <p className="text-white font-black text-center bg-red-600 py-1.5 px-3 border-2 border-black rounded-lg uppercase tracking-wider text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]">{error}</p>
          </div>
        )}
        {subtotal < (shop?.minOrderValue || 0) && !error && (
          <div className="max-w-4xl mx-auto mt-2">
             <p className="text-black font-black text-center bg-[#9AE600] py-1.5 px-3 border-2 border-black rounded-lg uppercase tracking-wider text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]">
               Minimum order value is ₹{shop?.minOrderValue}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
