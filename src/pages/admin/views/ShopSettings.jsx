import React, { useState } from 'react';
import { Plus, Truck, Trash2, Sparkles, Smartphone, Clock, Tag, X, Shirt, ArrowRight } from 'lucide-react';

export default function ShopSettings({ 
  currentShop, 
  settingsForm, 
  setSettingsForm, 
  isShopOpen, 
  setIsShopOpen, 
  handleSaveSettings, 
  deliveryEmail, 
  setDeliveryEmail, 
  deliveryName,
  setDeliveryName,
  deliveryPhone,
  setDeliveryPhone,
  isAddingDelivery,
  handleAddDeliveryBoy,
  branchStaff = [],
  staffRole = 'Operator',
  setStaffRole,
  deleteUser
}) {
  const [newSlotInput, setNewSlotInput] = useState('');

  const handleAddSlot = (slot) => {
    const trimmed = (slot || '').trim();
    if (!trimmed) return;
    const current = settingsForm.pickupTimings || [];
    if (!current.includes(trimmed)) {
      setSettingsForm({ ...settingsForm, pickupTimings: [...current, trimmed] });
    }
    setNewSlotInput('');
  };

  const handleRemoveSlot = (index) => {
    const updated = (settingsForm.pickupTimings || []).filter((_, i) => i !== index);
    setSettingsForm({ ...settingsForm, pickupTimings: updated });
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Form */}
      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 rounded-xl">
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center justify-between">
          Shop Configuration
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500">{isShopOpen ? 'Accepting Orders' : 'Store Closed'}</span>
            <button 
              onClick={() => setIsShopOpen(!isShopOpen)}
              className={`w-12 h-6 rounded-full border-2 border-black flex items-center p-1 transition-colors ${isShopOpen ? 'bg-[#9AE600]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white border-2 border-black rounded-full transition-transform ${isShopOpen ? 'translate-x-5' : 'translate-x-0'}`}/>
            </button>
          </div>
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black uppercase mb-2">Min Order (₹)</label>
              <input 
                type="number" 
                value={settingsForm.minOrderValue}
                onChange={e => setSettingsForm({...settingsForm, minOrderValue: e.target.value})}
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#9AE600]/10" 
              />
            </div>
            <div>
              <label className="block text-sm font-black uppercase mb-2">Tax (%)</label>
              <input 
                type="number" 
                value={settingsForm.taxPercent}
                onChange={e => setSettingsForm({...settingsForm, taxPercent: e.target.value})}
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#9AE600]/10" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black uppercase mb-2">Delivery Fee (₹)</label>
              <input 
                type="number" 
                value={settingsForm.deliveryFee}
                onChange={e => setSettingsForm({...settingsForm, deliveryFee: e.target.value})}
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#9AE600]/10" 
              />
            </div>
            <div>
              <label className="block text-sm font-black uppercase mb-2">Contact Phone</label>
              <input 
                type="text" 
                value={settingsForm.contactNumber}
                onChange={e => setSettingsForm({...settingsForm, contactNumber: e.target.value})}
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#9AE600]/10" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black uppercase mb-2">Branch Email ID</label>
            <input 
              type="email" 
              value={settingsForm.email || ''}
              onChange={e => setSettingsForm({...settingsForm, email: e.target.value})}
              placeholder="branch@wowlaundry.com"
              className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#9AE600]/10" 
            />
          </div>

          {/* Payment Info */}
          <div>
            <label className="block text-sm font-black uppercase mb-2">Shop UPI ID</label>
            <input 
              type="text" 
              placeholder="e.g. rahul@okaxis"
              value={settingsForm.upiId}
              onChange={e => setSettingsForm({...settingsForm, upiId: e.target.value})}
              className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#9AE600]/10" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black uppercase mb-2">Bank Name</label>
              <input 
                type="text" 
                value={settingsForm.bankName}
                onChange={e => setSettingsForm({...settingsForm, bankName: e.target.value})}
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#9AE600]/10" 
              />
            </div>
            <div>
              <label className="block text-sm font-black uppercase mb-2">Account No</label>
              <input 
                type="text" 
                value={settingsForm.accountNo}
                onChange={e => setSettingsForm({...settingsForm, accountNo: e.target.value})}
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#9AE600]/10" 
              />
            </div>
          </div>



          {/* Promo Banners Customization */}
          <div className="border-t-2 border-black pt-4 mt-4 space-y-4">
            <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
              <Sparkles size={18} /> Home Promo Banners (Customer App)
            </h3>

            {/* Banner 1 */}
            <div className="bg-[#9AE600]/20 border-2 border-black p-4 rounded-xl space-y-3">
              <span className="text-xs font-black uppercase bg-[#9AE600] border border-black px-2 py-0.5 rounded">Lime Promo Card (Banner 1)</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Badge Tag</label>
                  <input 
                    type="text" 
                    value={settingsForm.promoBanners?.[0]?.badge || 'PROMO'}
                    onChange={e => {
                      const updated = [...(settingsForm.promoBanners || [])];
                      updated[0] = { ...updated[0], badge: e.target.value };
                      setSettingsForm({ ...settingsForm, promoBanners: updated });
                    }}
                    className="w-full bg-white border-2 border-black p-2 text-xs font-bold outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Main Title</label>
                  <input 
                    type="text" 
                    value={settingsForm.promoBanners?.[0]?.title || '50% OFF'}
                    onChange={e => {
                      const updated = [...(settingsForm.promoBanners || [])];
                      updated[0] = { ...updated[0], title: e.target.value };
                      setSettingsForm({ ...settingsForm, promoBanners: updated });
                    }}
                    className="w-full bg-white border-2 border-black p-2 text-xs font-bold outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Sub Title</label>
                <input 
                  type="text" 
                  value={settingsForm.promoBanners?.[0]?.subtitle || 'Winter Wear Deep Dryclean'}
                  onChange={e => {
                    const updated = [...(settingsForm.promoBanners || [])];
                    updated[0] = { ...updated[0], subtitle: e.target.value };
                    setSettingsForm({ ...settingsForm, promoBanners: updated });
                  }}
                  className="w-full bg-white border-2 border-black p-2 text-xs font-bold outline-none" 
                />
              </div>
            </div>

            {/* Banner 2 */}
            <div className="bg-[#0D8DE3]/10 border-2 border-black p-4 rounded-xl space-y-3">
              <span className="text-xs font-black uppercase bg-[#0D8DE3] text-white border border-black px-2 py-0.5 rounded">Blue Delivery Card (Banner 2)</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Badge Tag</label>
                  <input 
                    type="text" 
                    value={settingsForm.promoBanners?.[1]?.badge || 'EXPRESS'}
                    onChange={e => {
                      const updated = [...(settingsForm.promoBanners || [])];
                      updated[1] = { ...updated[1], badge: e.target.value };
                      setSettingsForm({ ...settingsForm, promoBanners: updated });
                    }}
                    className="w-full bg-white border-2 border-black p-2 text-xs font-bold outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Main Title</label>
                  <input 
                    type="text" 
                    value={settingsForm.promoBanners?.[1]?.title || 'EXPRESS DOORSTEP'}
                    onChange={e => {
                      const updated = [...(settingsForm.promoBanners || [])];
                      updated[1] = { ...updated[1], title: e.target.value };
                      setSettingsForm({ ...settingsForm, promoBanners: updated });
                    }}
                    className="w-full bg-white border-2 border-black p-2 text-xs font-bold outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Sub Title</label>
                <input 
                  type="text" 
                  value={settingsForm.promoBanners?.[1]?.subtitle || 'Fast scheduled pickup & delivery'}
                  onChange={e => {
                    const updated = [...(settingsForm.promoBanners || [])];
                    updated[1] = { ...updated[1], subtitle: e.target.value };
                    setSettingsForm({ ...settingsForm, promoBanners: updated });
                  }}
                  className="w-full bg-white border-2 border-black p-2 text-xs font-bold outline-none" 
                />
              </div>
            </div>

            {/* Wash Preferences & Add-ons Customization */}
            <div className="border-t-2 border-black pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                  <Sparkles size={18} className="text-[#0D8DE3]" /> Checkout Wash Add-ons & Preferences
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const current = settingsForm.washPreferences || [];
                    const newPref = {
                      id: `pref_${Date.now()}`,
                      name: 'New Wash Add-on',
                      description: 'Custom wash preference description',
                      price: 20,
                      enabled: true
                    };
                    setSettingsForm({ ...settingsForm, washPreferences: [...current, newPref] });
                  }}
                  className="bg-[#9AE600] border-2 border-black px-3 py-1 font-black uppercase text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center gap-1"
                >
                  <Plus size={14} /> Add Add-on
                </button>
              </div>

              <div className="space-y-3">
                {(settingsForm.washPreferences || []).map((pref, index) => (
                  <div key={pref.id || index} className="bg-white border-2 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(settingsForm.washPreferences || [])];
                            updated[index] = { ...updated[index], enabled: !updated[index].enabled };
                            setSettingsForm({ ...settingsForm, washPreferences: updated });
                          }}
                          className={`w-10 h-5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors ${
                            pref.enabled ? 'bg-[#9AE600]' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 bg-white border-2 border-black rounded-full transition-transform ${
                            pref.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                        <span className="text-xs font-black uppercase">{pref.enabled ? 'Enabled' : 'Disabled'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = (settingsForm.washPreferences || []).filter((_, idx) => idx !== index);
                          setSettingsForm({ ...settingsForm, washPreferences: updated });
                        }}
                        className="p-1 bg-red-100 hover:bg-red-500 hover:text-white text-red-700 border border-black rounded transition-colors"
                        title="Delete Wash Preference"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black uppercase mb-0.5">Preference Name</label>
                        <input
                          type="text"
                          value={pref.name}
                          onChange={(e) => {
                            const updated = [...(settingsForm.washPreferences || [])];
                            updated[index] = { ...updated[index], name: e.target.value };
                            setSettingsForm({ ...settingsForm, washPreferences: updated });
                          }}
                          className="w-full bg-gray-50 border border-black p-1.5 font-bold text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase mb-0.5">Price (₹)</label>
                        <input
                          type="number"
                          value={pref.price}
                          onChange={(e) => {
                            const updated = [...(settingsForm.washPreferences || [])];
                            updated[index] = { ...updated[index], price: Number(e.target.value) };
                            setSettingsForm({ ...settingsForm, washPreferences: updated });
                          }}
                          className="w-full bg-gray-50 border border-black p-1.5 font-bold text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase mb-0.5">Short Description</label>
                      <input
                        type="text"
                        value={pref.description || ''}
                        onChange={(e) => {
                          const updated = [...(settingsForm.washPreferences || [])];
                          updated[index] = { ...updated[index], description: e.target.value };
                          setSettingsForm({ ...settingsForm, washPreferences: updated });
                        }}
                        className="w-full bg-gray-50 border border-black p-1.5 font-bold text-xs outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop Promo Code & Discount */}
            <div className="border-t-2 border-black pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                  <Tag size={18} className="text-[#0D8DE3]" /> Shop Promo Code (Home Card & Checkout)
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const current = settingsForm.promoCode || { code: 'WOW50', discountPercent: 50, maxDiscount: 150, minOrderValue: 199, description: 'Flat 50% Off on Laundry', isActive: true };
                      setSettingsForm({
                        ...settingsForm,
                        promoCode: { ...current, isActive: current.isActive === false }
                      });
                    }}
                    className={`w-10 h-5 rounded-full border-2 border-black flex items-center p-0.5 transition-colors ${
                      settingsForm.promoCode?.isActive !== false ? 'bg-[#9AE600]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white border-2 border-black rounded-full transition-transform ${
                      settingsForm.promoCode?.isActive !== false ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                  <span className="text-xs font-black uppercase">
                    {settingsForm.promoCode?.isActive !== false ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>

              <div className="bg-[#9AE600]/15 border-2 border-black p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Coupon Code (e.g. WOW50)</label>
                    <input
                      type="text"
                      value={settingsForm.promoCode?.code || ''}
                      onChange={(e) => {
                        const current = settingsForm.promoCode || { discountPercent: 50, maxDiscount: 150, minOrderValue: 199, isActive: true };
                        setSettingsForm({
                          ...settingsForm,
                          promoCode: { ...current, code: e.target.value.toUpperCase() }
                        });
                      }}
                      placeholder="e.g. WOW50"
                      className="w-full bg-white border-2 border-black p-2 font-black text-sm uppercase outline-none focus:bg-[#9AE600]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={settingsForm.promoCode?.discountPercent ?? 50}
                      onChange={(e) => {
                        const current = settingsForm.promoCode || { code: 'WOW50', maxDiscount: 150, minOrderValue: 199, isActive: true };
                        setSettingsForm({
                          ...settingsForm,
                          promoCode: { ...current, discountPercent: Number(e.target.value) }
                        });
                      }}
                      className="w-full bg-white border-2 border-black p-2 font-black text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Max Discount (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.promoCode?.maxDiscount ?? 150}
                      onChange={(e) => {
                        const current = settingsForm.promoCode || { code: 'WOW50', discountPercent: 50, minOrderValue: 199, isActive: true };
                        setSettingsForm({
                          ...settingsForm,
                          promoCode: { ...current, maxDiscount: Number(e.target.value) }
                        });
                      }}
                      className="w-full bg-white border-2 border-black p-2 font-black text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.promoCode?.minOrderValue ?? 199}
                      onChange={(e) => {
                        const current = settingsForm.promoCode || { code: 'WOW50', discountPercent: 50, maxDiscount: 150, isActive: true };
                        setSettingsForm({
                          ...settingsForm,
                          promoCode: { ...current, minOrderValue: Number(e.target.value) }
                        });
                      }}
                      className="w-full bg-white border-2 border-black p-2 font-black text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-1">Promo Title / Description</label>
                  <input
                    type="text"
                    value={settingsForm.promoCode?.description || ''}
                    onChange={(e) => {
                      const current = settingsForm.promoCode || { code: 'WOW50', discountPercent: 50, maxDiscount: 150, minOrderValue: 199, isActive: true };
                      setSettingsForm({
                        ...settingsForm,
                        promoCode: { ...current, description: e.target.value }
                      });
                    }}
                    placeholder="e.g. Flat 50% Off on Laundry"
                    className="w-full bg-white border-2 border-black p-2 font-bold text-xs outline-none"
                  />
                </div>

                {/* Live Preview Badge */}
                <div className="p-2.5 bg-white border-2 border-black rounded-lg flex items-center justify-between gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500">Preview On Customer Main Screen:</p>
                    <p className="text-xs font-black text-black">
                      {settingsForm.promoCode?.discountPercent || 50}% OFF • USE CODE: <span className="text-[#0D8DE3] underline">{settingsForm.promoCode?.code || 'WOW50'}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-[#9AE600] border border-black px-2 py-0.5 rounded">
                    {settingsForm.promoCode?.isActive !== false ? 'LIVE' : 'PAUSED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Pickup Time Slots Configuration */}
            <div className="border-t-2 border-black pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                  <Clock size={18} className="text-[#0D8DE3]" /> Customer Pickup Time Slots
                </h3>
                <span className="text-xs font-bold text-gray-500">
                  {(settingsForm.pickupTimings || []).length} Slots Active
                </span>
              </div>

              <div className="bg-blue-50/60 border-2 border-black p-4 rounded-xl space-y-3">
                <p className="text-xs font-bold text-gray-600">
                  Customers select one of these scheduled slots when checking out orders for this branch.
                </p>

                {/* Active Slots Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(settingsForm.pickupTimings || []).map((slot, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-black px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs font-black"
                    >
                      <span>{slot}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(index)}
                        className="p-0.5 hover:bg-red-500 hover:text-white rounded transition-colors text-gray-600"
                        title="Remove Slot"
                      >
                        <X size={13} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Slot */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 11:00 AM"
                    value={newSlotInput}
                    onChange={(e) => setNewSlotInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSlot(newSlotInput);
                      }
                    }}
                    className="flex-1 bg-white border-2 border-black p-2 font-bold text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSlot(newSlotInput)}
                    className="bg-[#0D8DE3] text-white border-2 border-black px-3 py-2 font-black uppercase text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} /> Add Slot
                  </button>
                </div>

                {/* Quick Preset Buttons */}
                <div className="pt-2 border-t border-dashed border-gray-300">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1.5">Quick Add Presets:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '08:00 AM - 10:00 AM',
                      '10:00 AM - 12:00 PM',
                      '12:00 PM - 02:00 PM',
                      '02:00 PM - 04:00 PM',
                      '04:00 PM - 06:00 PM',
                      '06:00 PM - 08:00 PM',
                      '08:00 PM - 10:00 PM'
                    ].map((preset) => {
                      const exists = (settingsForm.pickupTimings || []).includes(preset);
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={exists}
                          onClick={() => handleAddSlot(preset)}
                          className={`text-[10px] font-extrabold px-2 py-1 rounded border border-black uppercase transition-all ${
                            exists
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                              : 'bg-white hover:bg-[#9AE600] text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                          }`}
                        >
                          + {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSaveSettings} className="w-full bg-black text-white py-4 font-black uppercase tracking-wider hover:bg-gray-800 transition-colors mt-4">
            Save Configuration
          </button>
        </div>
      </div>

      {/* Fleet & Operator Management Form */}
      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 rounded-xl h-fit space-y-6">
        <div>
          <h2 className="text-2xl font-black uppercase mb-1">
            {staffRole === 'Operator' ? 'Add Floor Operator' : 'Add Delivery Personnel'}
          </h2>
          <p className="font-bold text-gray-500 mb-4">
            {staffRole === 'Operator' ? (
              <>Add a floor operator to <span className="text-black font-black underline">{currentShop?.name || 'this branch'}</span>. They update wash & iron statuses in the Wash Console.</>
            ) : (
              <>Add delivery staff to <span className="text-black font-black underline">{currentShop?.name || 'this branch'}</span>. They can log in using their email and OTP to deliver orders.</>
            )}
          </p>

          {/* Role selector toggle */}
          {setStaffRole && (
            <div className="mb-4">
              <label className="block text-xs font-black uppercase mb-1.5 text-gray-700">Assign Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStaffRole('Operator')}
                  className={`py-2.5 px-3 border-2 border-black font-black text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                    staffRole === 'Operator'
                      ? 'bg-amber-300 text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Shirt size={16} /> Floor Operator
                </button>
                <button
                  type="button"
                  onClick={() => setStaffRole('Delivery')}
                  className={`py-2.5 px-3 border-2 border-black font-black text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                    staffRole === 'Delivery'
                      ? 'bg-[#0D8DE3] text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Truck size={16} /> Delivery Agent
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-black uppercase mb-1.5">Staff Name (Optional)</label>
              <input 
                type="text" 
                value={deliveryName || ''}
                onChange={e => setDeliveryName(e.target.value)}
                placeholder={staffRole === 'Operator' ? 'e.g. Ramesh Kumar' : 'e.g. Rahul Sharma'}
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#0D8DE3]/10" 
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-1.5">Phone Number (Optional)</label>
              <input 
                type="tel" 
                value={deliveryPhone || ''}
                onChange={e => setDeliveryPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#0D8DE3]/10" 
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-1.5">Staff Email Address *</label>
              <input 
                type="email" 
                value={deliveryEmail}
                onChange={e => setDeliveryEmail(e.target.value)}
                placeholder={staffRole === 'Operator' ? 'operator@example.com' : 'delivery.name@example.com'}
                className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#0D8DE3]/10" 
              />
            </div>
            
            <button 
              onClick={() => handleAddDeliveryBoy(staffRole)} 
              disabled={isAddingDelivery}
              className={`w-full text-black border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] py-4 font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                staffRole === 'Operator' ? 'bg-amber-300 hover:bg-amber-400' : 'bg-[#0D8DE3] text-white hover:bg-[#0D8DE3]/90'
              } ${isAddingDelivery ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]'}`}
            >
              <Plus size={20}/> {isAddingDelivery ? 'Adding Staff...' : (staffRole === 'Operator' ? 'Add Floor Operator' : 'Add Delivery Staff')}
            </button>
          </div>
        </div>

        {/* Current Staff List */}
        <div className="border-t-2 border-black pt-6">
          {(() => {
            const allStaff = (branchStaff && branchStaff.length > 0) ? branchStaff : (deliveryBoys || []);
            return (
              <>
                <h3 className="font-black text-lg uppercase mb-4">Current Branch Staff ({allStaff.length})</h3>
                
                {allStaff.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 bg-gray-50 border-2 border-dashed border-gray-300">
                    <Truck size={32} className="text-gray-400 mb-2" />
                    <p className="font-bold text-gray-500 text-center">No Staff Members Yet</p>
                    <p className="text-sm font-bold text-gray-400 text-center">Add operators or delivery agents above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allStaff.map(staff => {
                      const isOp = staff.role === 'Operator';
                      return (
                        <div key={staff._id} className="flex justify-between items-center p-3 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-white">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 border-2 border-black flex items-center justify-center ${
                              isOp ? 'bg-amber-300 text-black' : 'bg-orange-100 text-orange-600'
                            }`}>
                              {isOp ? <Shirt size={20} /> : <Truck size={20} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-black text-sm uppercase">{staff.name}</p>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 border border-black rounded-full ${
                                  isOp ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                                }`}>
                                  {isOp ? 'Floor Operator' : 'Delivery Agent'}
                                </span>
                              </div>
                              <p className="font-bold text-xs text-gray-500">{staff.email}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => { if(window.confirm(`Remove ${staff.name} (${isOp ? 'Operator' : 'Delivery'})?`)) deleteUser(staff._id) }} 
                            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors border-2 border-transparent hover:border-red-500 rounded"
                            title="Remove staff member"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
