import React from 'react';
import { Plus, Truck, Trash2, Sparkles, Smartphone } from 'lucide-react';

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
  deliveryBoys,
  deleteUser,
  isSuperAdmin = false
}) {
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
          </div>

          <button onClick={handleSaveSettings} className="w-full bg-black text-white py-4 font-black uppercase tracking-wider hover:bg-gray-800 transition-colors mt-4">
            Save Configuration
          </button>
        </div>
      </div>

      {/* Fleet Management Form */}
      <div className="bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 rounded-xl h-fit">
        <h2 className="text-2xl font-black uppercase mb-2">Add Delivery Personnel</h2>
        <p className="font-bold text-gray-500 mb-6">
          Add delivery staff to <span className="text-black font-black underline">{currentShop?.name || 'this branch'}</span>. They can log in using their email and OTP.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-black uppercase mb-2">Agent Name (Optional)</label>
            <input 
              type="text" 
              value={deliveryName || ''}
              onChange={e => setDeliveryName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#0D8DE3]/10" 
            />
          </div>

          <div>
            <label className="block text-sm font-black uppercase mb-2">Agent Phone Number (Optional)</label>
            <input 
              type="tel" 
              value={deliveryPhone || ''}
              onChange={e => setDeliveryPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#0D8DE3]/10" 
            />
          </div>

          <div>
            <label className="block text-sm font-black uppercase mb-2">Agent Email Address *</label>
            <input 
              type="email" 
              value={deliveryEmail}
              onChange={e => setDeliveryEmail(e.target.value)}
              placeholder="delivery.name@example.com"
              className="w-full bg-gray-50 border-2 border-black p-3 font-bold outline-none focus:bg-[#0D8DE3]/10" 
            />
          </div>
          
          <button 
            onClick={handleAddDeliveryBoy} 
            disabled={isAddingDelivery}
            className={`w-full bg-[#0D8DE3] text-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] py-4 font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${isAddingDelivery ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]'}`}
          >
            <Plus size={20}/> {isAddingDelivery ? 'Adding Staff...' : 'Add Delivery Staff'}
          </button>
        </div>

        {/* Current Staff List */}
        <div className="mt-8 border-t-2 border-black pt-6">
          <h3 className="font-black text-lg uppercase mb-4">Current Staff ({deliveryBoys?.length || 0})</h3>
          
          {(!deliveryBoys || deliveryBoys.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-6 bg-gray-50 border-2 border-dashed border-gray-300">
              <Truck size={32} className="text-gray-400 mb-2" />
              <p className="font-bold text-gray-500 text-center">No Delivery Staff</p>
              <p className="text-sm font-bold text-gray-400 text-center">Add staff members to assign deliveries.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliveryBoys.map(staff => (
                <div key={staff._id} className="flex justify-between items-center p-3 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 border-2 border-black flex items-center justify-center">
                      <Truck size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase">{staff.name}</p>
                      <p className="font-bold text-xs text-gray-500">{staff.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { if(window.confirm(`Remove ${staff.name}?`)) deleteUser(staff._id) }} 
                    className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors border-2 border-transparent hover:border-red-500 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
