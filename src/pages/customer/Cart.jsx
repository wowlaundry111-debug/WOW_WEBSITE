import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowLeft, Trash2, Plus, Minus, MapPin, CheckCircle2, Receipt, AlertTriangle, Sparkles, Check, Home, Briefcase } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, clearCart, placeOrder, activeCoupon, applyCoupon, removeCoupon, shops, currentTenantId, currentUser } = useAppStore();
  
  const shop = shops.find(s => s._id === currentTenantId);
  const isClosed = shop?.isOpen === false;

  // Structured Precise Delivery Address (Food App Style)
  const [addrTag, setAddrTag] = useState('Home');
  const [flatNo, setFlatNo] = useState('');
  const [building, setBuilding] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

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
      building.trim() ? building.trim() : '',
      area.trim() ? area.trim() : '',
      landmark.trim() ? (landmark.trim().toLowerCase().startsWith('near') ? landmark.trim() : `Near: ${landmark.trim()}`) : '',
      city.trim() ? city.trim() : '',
      pincode.trim() ? `${pincode.trim()}` : '',
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

  const hasKgItems = cart.some(c => c.unit === 'KG');
  const perItemSubtotal = cart.filter(c => c.unit !== 'KG').reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    // Only enforce minimum order check if there are no KG items (since KG items are weighed later)
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
        <div className="w-32 h-32 bg-[#B0FF49] border-2 border-black rounded-full flex items-center justify-center mb-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] text-black">
          <Trash2 size={48} strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black text-black mb-4 lilita-one-regular uppercase tracking-widest text-center">Your cart is empty</h2>
        <p className="text-black mb-10 text-center max-w-sm font-black text-lg bg-white p-4 border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase">
          Looks like you haven't added any items to your cart yet.
        </p>
        <button 
          onClick={() => navigate('/order')}
          className="bg-black text-[#0D8DE3] font-black py-4 px-10 rounded-xl text-xl uppercase tracking-widest border-2 border-black shadow-[6px_6px_0px_#B0FF49] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] pb-40 font-outfit selection:bg-black selection:text-[#B0FF49]">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-[#0D8DE3] border-b-2 border-black shadow-[0_4px_0_rgba(0,0,0,1)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/order')}
              className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center text-black hover:bg-black hover:text-[#0D8DE3] shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              <ArrowLeft size={24} strokeWidth={4} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-black lilita-one-regular uppercase tracking-widest">Checkout</h1>
            </div>
          </div>
          <button onClick={clearCart} className="bg-[#0D8DE3] text-black font-black text-sm uppercase tracking-widest px-4 py-2 rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
            Clear All
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-8">
          
          {isClosed && (
            <div className="bg-[#0D8DE3] border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center border-2 border-black">
                  <AlertTriangle size={24} strokeWidth={2.5} className="text-black" />
                </div>
                <h3 className="font-black text-black text-2xl uppercase lilita-one-regular">Branch Closed</h3>
              </div>
              <p className="text-black font-extrabold uppercase bg-white p-3 border-2 border-black rounded-xl">
                This branch ("{shop?.name || 'WOW Express'}") is temporarily closed. You cannot place new orders until this branch re-opens.
              </p>
            </div>
          )}

          {/* Delivery Details */}
          <div className="bg-[#B0FF49] rounded-3xl border-2 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6 bg-black text-[#B0FF49] py-2 px-4 rounded-xl border-2 border-black shadow-[-4px_4px_0px_white] inline-flex -ml-2">
              <MapPin size={24} strokeWidth={3} />
              <h2 className="font-black text-xl uppercase lilita-one-regular tracking-widest">Delivery Address</h2>
            </div>
            
            <div className="space-y-4">
              {/* Address Tag Selector */}
              <div>
                <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wider">
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
                        className={`py-2 px-3 rounded-xl border-2 border-black font-black text-sm transition-all flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-black text-[#B0FF49] shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-black hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent size={15} strokeWidth={2.5} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 1: Flat / House No */}
              <div>
                <label className="block text-xs font-black text-black mb-1 uppercase tracking-wider">
                  House / Flat / Building
                </label>
                <input 
                  type="text"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  placeholder="e.g. Flat 402, Palm Heights"
                  className="w-full bg-white border-2 border-black rounded-xl p-3 text-black font-extrabold focus:outline-none focus:bg-white text-sm shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                />
              </div>

              {/* Field 2: Area & Street */}
              <div>
                <label className="block text-xs font-black text-black mb-1 uppercase tracking-wider">
                  Area, Street & City
                </label>
                <input 
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. 100ft Road, Near Metro, Indiranagar"
                  className="w-full bg-white border-2 border-black rounded-xl p-3 text-black font-extrabold focus:outline-none focus:bg-white text-sm shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                />
              </div>

              {/* Pickup Slot */}
              <div className="pt-2">
                <label className="block text-xs font-black text-black mb-1 uppercase tracking-wider">
                  Pickup Time Slot
                </label>
                <input 
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="e.g. Today 4:00 PM - 6:00 PM, Tomorrow Morning"
                  className="w-full bg-white border-2 border-black rounded-xl p-3 text-black font-extrabold focus:outline-none focus:bg-white text-sm shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>
          </div>

          {/* Wash Add-ons & Preferences */}
          {availableWashPrefs.length > 0 && (
            <div className="bg-[#0D8DE3]/10 rounded-3xl border-2 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={22} className="text-[#0D8DE3]" strokeWidth={3} />
                  <h2 className="font-black text-black text-xl uppercase lilita-one-regular tracking-wide">Wash Add-ons & Preferences</h2>
                </div>
                <span className="text-xs font-black uppercase bg-[#0D8DE3] text-white px-2.5 py-1 rounded-full border border-black">Optional</span>
              </div>
              <p className="text-xs font-bold text-gray-600 mb-4 uppercase">Customize your wash care with premium shop add-ons:</p>

              <div className="space-y-3">
                {availableWashPrefs.map((pref) => {
                  const isSelected = selectedWashPrefs.some(p => p.name === pref.name);
                  return (
                    <button
                      type="button"
                      key={pref.id || pref.name}
                      onClick={() => toggleWashPref(pref)}
                      className={`w-full text-left p-4 rounded-2xl border-2 border-black flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#B0FF49] shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                          : 'bg-white hover:bg-gray-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg border-2 border-black flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-black text-[#B0FF49]' : 'bg-white'
                        }`}>
                          {isSelected && <Check size={16} strokeWidth={4} />}
                        </div>
                        <div>
                          <h4 className="font-black text-sm uppercase text-black">{pref.name}</h4>
                          {pref.description && (
                            <p className="text-xs font-bold text-gray-600 mt-0.5">{pref.description}</p>
                          )}
                        </div>
                      </div>

                      <span className="font-black text-xs uppercase bg-white px-2.5 py-1 rounded-lg border-2 border-black text-black shrink-0 ml-2">
                        +₹{pref.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="bg-white rounded-3xl border-2 border-black overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="p-6 border-b-2 border-black bg-[#B0FF49] flex justify-between items-center">
              <h2 className="font-black text-black text-2xl uppercase lilita-one-regular tracking-widest">Item Summary</h2>
              <span className="bg-black text-[#B0FF49] text-sm font-black px-3 py-1.5 rounded-lg border-2 border-black tracking-widest uppercase">{cart.length} ITEMS</span>
            </div>
            <div className="divide-y-4 divide-black p-2">
              {cart.map((item) => (
                <div key={item.itemId} className="p-4 flex gap-4 items-center group hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-20 bg-[#0D8DE3] rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-black text-3xl font-black lilita-one-regular">{item.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 pl-2">
                    <h3 className="font-black text-black text-lg uppercase tracking-wide line-clamp-1">{item.name}</h3>
                    {item.unit === 'KG' ? (
                      <p className="text-xs font-black text-[#0D8DE3] uppercase tracking-widest mt-1 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg inline-block">🏋️ Weighed at delivery</p>
                    ) : (
                      <p className="text-sm text-gray-700 font-extrabold mt-1">₹{item.price} / {item.unit}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    {item.unit === 'KG' ? (
                      <span className="font-black text-xs text-white bg-[#0D8DE3] px-2 py-1 border-2 border-black rounded-lg uppercase tracking-wider">Pending</span>
                    ) : (
                      <span className="font-black text-black text-xl bg-[#B0FF49] px-2 py-0.5 border-2 border-black rounded-lg">₹{item.price * item.quantity}</span>
                    )}
                    <div className="flex items-center bg-[#0D8DE3] border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
                      <button onClick={() => updateCartQuantity(item.itemId, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-black hover:bg-black hover:text-[#0D8DE3] transition-colors border-r-4 border-black">
                        <Minus size={20} strokeWidth={5} />
                      </button>
                      <span className="w-10 text-center font-black text-black text-lg bg-white h-10 flex items-center justify-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.itemId, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-black hover:bg-black hover:text-[#0D8DE3] transition-colors border-l-4 border-black">
                        <Plus size={20} strokeWidth={5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-5 space-y-8">
          {/* Coupon Code */}
          <div className="bg-[#0D8DE3] rounded-3xl border-2 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="font-black text-black mb-4 text-lg uppercase lilita-one-regular tracking-widest bg-white inline-block px-3 py-1 border-2 border-black rounded-xl shadow-[-4px_4px_0px_rgba(0,0,0,1)] -rotate-2">Apply Promo Code</h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2 relative mt-2">
              <input 
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="ENTER CODE"
                className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-4 text-black font-black uppercase tracking-widest focus:outline-none focus:bg-[#B0FF49] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-black text-[#0D8DE3] px-6 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
                APPLY
              </button>
            </form>
            {couponMsg.text && (
              <p className={`mt-4 text-sm font-black bg-white inline-block px-3 py-1 rounded-lg border-2 border-black uppercase ${couponMsg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {couponMsg.text}
              </p>
            )}
            {activeCoupon && (
              <div className="mt-4 flex items-center justify-between bg-[#B0FF49] border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[#B0FF49]">
                    <CheckCircle2 size={20} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-black text-black uppercase tracking-widest">{activeCoupon.code} Applied!</span>
                </div>
                <button type="button" onClick={removeCoupon} className="text-xs text-white bg-black px-3 py-1.5 rounded-lg border-2 border-black font-black uppercase tracking-widest hover:bg-red-600">Remove</button>
              </div>
            )}
          </div>

          {/* Bill Details */}
          <div className="bg-white rounded-3xl border-2 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-black">
              <div className="bg-black text-[#0D8DE3] p-2 rounded-xl border-2 border-black">
                <Receipt size={24} strokeWidth={3} />
              </div>
              <h2 className="font-black text-black text-2xl uppercase lilita-one-regular tracking-widest">Bill Details</h2>
            </div>
            
            <div className="space-y-5">
              {(() => {
                const perItemSubtotal = cart.filter(c => c.unit !== 'KG').reduce((s, c) => s + c.price * c.quantity, 0);
                const kgItems = cart.filter(c => c.unit === 'KG');
                const hasKgItems = kgItems.length > 0;
                return (
                  <>
                    <div className="flex justify-between text-base">
                      <span className="font-extrabold text-gray-700 uppercase tracking-wide">Item Total</span>
                      <span className="font-black text-black">₹{perItemSubtotal.toFixed(2)}</span>
                    </div>
                    {hasKgItems && (
                      <div className="flex justify-between text-base bg-blue-50 border-2 border-[#0D8DE3] rounded-xl p-3">
                        <span className="font-extrabold text-[#0D8DE3] uppercase tracking-wide flex items-center gap-1.5">🏋️ KG Items ({kgItems.length})</span>
                        <span className="font-black text-[#0D8DE3] text-xs uppercase tracking-widest">Weighed at delivery</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base">
                      <span className="font-extrabold text-gray-700 uppercase tracking-wide">Taxes &amp; Charges ({taxPercent}%)</span>
                      <span className="font-black text-black">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="font-extrabold text-gray-700 uppercase tracking-wide">Delivery Fee</span>
                      <span className="font-black text-black bg-[#B0FF49] px-2 py-0.5 rounded-md border-2 border-black">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    {washPrefsCost > 0 && (
                      <div className="flex justify-between text-base">
                        <span className="font-extrabold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                          <Sparkles size={16} className="text-[#0D8DE3]" /> Wash Add-ons ({selectedWashPrefs.length})
                        </span>
                        <span className="font-black text-black">+₹{washPrefsCost.toFixed(2)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-base">
                        <span className="font-black text-[#0D8DE3] uppercase tracking-wide bg-black px-2 py-0.5 rounded-md">Promo Applied</span>
                        <span className="font-black text-black">-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-6 mt-4 border-t-4 border-black border-dashed">
                      {hasKgItems ? (
                        <div className="bg-[#B0FF49] p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-black text-black text-lg sm:text-xl uppercase tracking-widest">Grand Total</span>
                              <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mt-0.5">
                                Final price calculated upon delivery weighing
                              </p>
                            </div>
                            <span className="font-black text-base sm:text-lg text-black bg-white px-3 py-1.5 rounded-xl border-2 border-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                              Pending Calculation
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center bg-[#B0FF49] p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-1">
                          <span className="font-black text-black text-xl uppercase tracking-widest">Grand Total</span>
                          <span className="font-black text-3xl text-black bg-white px-3 py-1 rounded-xl border-2 border-black">₹{total.toFixed(2)}</span>
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

      {/* Floating Checkout Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D8DE3] border-t-4 border-black p-4 z-50 shadow-[0_-8px_0_rgba(0,0,0,1)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="bg-white p-3 border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-black text-black uppercase tracking-widest mb-1 bg-[#B0FF49] inline-block px-2 border-2 border-black rounded">
              {hasKgItems ? 'Pay After Weighing' : 'Pay via UPI / Cash'}
            </p>
            {hasKgItems ? (
              <p className="font-black text-xl sm:text-2xl text-black lilita-one-regular uppercase tracking-wider">
                Pending Calculation
              </p>
            ) : (
              <p className="font-black text-3xl text-black lilita-one-regular">₹{total.toFixed(2)}</p>
            )}
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={loading || isClosed || (!hasKgItems && subtotal < (shop?.minOrderValue || 0))}
            className="bg-[#0D8DE3] hover:bg-blue-600 disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-black py-5 px-8 sm:px-12 rounded-2xl border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-center gap-3 active:translate-y-2 active:translate-x-2 active:shadow-none transition-all text-xl uppercase tracking-widest"
          >
            {loading ? 'Processing...' : isClosed ? 'Shop Closed' : 'Place Order'}
            {!loading && !isClosed && <CheckCircle2 size={28} strokeWidth={4} />}
          </button>
        </div>

        
        {error && (
          <div className="max-w-4xl mx-auto mt-4">
             <p className="text-white font-black text-center bg-red-600 p-3 border-2 border-black rounded-xl uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)]">{error}</p>
          </div>
        )}
        {subtotal < (shop?.minOrderValue || 0) && !error && (
          <div className="max-w-4xl mx-auto mt-4">
             <p className="text-black font-black text-center bg-[#B0FF49] p-3 border-2 border-black rounded-xl uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)]">
               Minimum order value is ₹{shop?.minOrderValue}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
