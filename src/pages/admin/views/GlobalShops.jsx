import React, { useState, useEffect } from 'react';
import { Building2, Plus, Store, Trash2, IndianRupee, Users, ShoppingBag, ArrowRight, ExternalLink, Settings, X, Smartphone, Download } from 'lucide-react';
import SuperAdminShopDetail from './SuperAdminShopDetail';

export default function GlobalShops({ 
  shops = [], 
  orders = [], 
  users = [],
  createShop, 
  updateShop,
  deleteShop, 
  setCurrentTenantId, 
  setActiveTab 
}) {
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);
  const [newShopForm, setNewShopForm] = useState({
    name: '',
    branchLocation: '',
    adminEmail: '',
    upiId: '',
    bankName: '',
    accountNo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // App Links State for Super Admin Overview
  const [appLinksForm, setAppLinksForm] = useState({
    androidAppUrl: shops[0]?.androidAppUrl || '',
    iosAppUrl: shops[0]?.iosAppUrl || ''
  });
  const [isSavingAppLinks, setIsSavingAppLinks] = useState(false);

  useEffect(() => {
    if (shops && shops.length > 0) {
      setAppLinksForm({
        androidAppUrl: shops[0].androidAppUrl || '',
        iosAppUrl: shops[0].iosAppUrl || ''
      });
    }
  }, [shops]);

  const handleSaveAppLinks = async () => {
    if (!shops || shops.length === 0) return alert('No shop branch found');
    if (!updateShop) return alert('Update function not available');
    setIsSavingAppLinks(true);
    try {
      await Promise.all(
        shops.map(s => updateShop(s._id, {
          androidAppUrl: appLinksForm.androidAppUrl ? appLinksForm.androidAppUrl.trim() : '',
          iosAppUrl: appLinksForm.iosAppUrl ? appLinksForm.iosAppUrl.trim() : ''
        }))
      );
      alert('Platform Mobile App Download Links updated successfully across all branches!');
    } catch (err) {
      console.error('Failed to save app links:', err);
      alert(err.response?.data?.error || err.message || 'Failed to save app links');
    } finally {
      setIsSavingAppLinks(false);
    }
  };

  // Overall Global Aggregates
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalCustomers = users.filter(u => u.role === 'Customer').length;
  const totalBranches = shops.reduce((sum, s) => sum + (s.branches?.length || 1), 0);
  const totalActiveOrders = orders.filter(o => !['DELIVERED'].includes(o.status)).length;

  const handleCreateShop = async (e) => {
    e.preventDefault();
    const { name, branchLocation, adminEmail, upiId, bankName, accountNo } = newShopForm;
    if (!name || !branchLocation || !adminEmail) {
      return alert('Shop Name, Location, and Admin Email are required');
    }

    setIsSubmitting(true);
    try {
      await createShop(name, [branchLocation], upiId, bankName, accountNo, adminEmail);
      setIsAddShopModalOpen(false);
      setNewShopForm({ name: '', branchLocation: '', adminEmail: '', upiId: '', bankName: '', accountNo: '' });
      alert(`New branch "${name}" created successfully!`);
    } catch (err) {
      alert(err?.message || 'Failed to create shop branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteShop = async (shopId, shopName) => {
    if (window.confirm(`Are you sure you want to permanently delete "${shopName}"? This action cannot be undone.`)) {
      try {
        await deleteShop(shopId);
        if (selectedShopId === shopId) setSelectedShopId(null);
      } catch (err) {
        alert('Failed to delete shop');
      }
    }
  };

  if (selectedShopId) {
    return (
      <SuperAdminShopDetail 
        shopId={selectedShopId} 
        onBack={() => setSelectedShopId(null)}
        onOpenCatalog={() => {
          setActiveTab('catalog');
        }}
        onOpenOrders={() => {
          setActiveTab('orders');
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-black uppercase">Super Admin Overview</h1>
          <p className="font-bold text-gray-500 mt-1">Multi-branch enterprise monitoring & control center.</p>
        </div>
        <button 
          onClick={() => setIsAddShopModalOpen(true)}
          className="bg-black text-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] px-6 py-3 font-black uppercase text-xs sm:text-sm flex items-center gap-2 hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18}/> Add New Branch
        </button>
      </div>

      {/* Global Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Gross Revenue */}
        <div className="bg-[#B0FF49] border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black uppercase text-xs tracking-wider text-gray-800">Gross Revenue</span>
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">₹</div>
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black mb-1">
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h2>
            <span className="font-bold text-xs bg-white px-2 py-0.5 border border-black inline-block">Across all branches</span>
          </div>
        </div>

        {/* Total Branches */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black uppercase text-xs tracking-wider text-gray-600">Total Branches</span>
            <Building2 size={20} className="text-[#0D8DE3]" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black mb-1">{shops.length}</h2>
            <span className="font-bold text-xs text-gray-500">{totalBranches} active service points</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black uppercase text-xs tracking-wider text-gray-600">Total Customers</span>
            <Users size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black mb-1">{totalCustomers.toLocaleString('en-IN')}</h2>
            <span className="font-bold text-xs text-gray-500">Registered platform users</span>
          </div>
        </div>

        {/* Active In-Progress Orders */}
        <div className="bg-[#0D8DE3] text-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black uppercase text-xs tracking-wider text-blue-100">Live Active Orders</span>
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black mb-1">{totalActiveOrders}</h2>
            <span className="font-bold text-xs bg-black text-white px-2 py-0.5 border border-black inline-block">Pending & in wash</span>
          </div>
        </div>
      </div>

      {/* Branches Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b-4 border-black pb-3">
          <h2 className="text-2xl font-black uppercase flex items-center gap-2">
            <Building2 size={24} /> Laundry Branches ({shops.length})
          </h2>
          <span className="text-xs font-bold text-gray-500">Click on any branch to inspect & manage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map(shop => {
            const shortId = shop._id.includes('_') ? shop._id.split('_').pop().toUpperCase() : shop._id.slice(-6).toUpperCase();
            const branchOrders = orders.filter(o => o.shopId === shop._id);
            const branchRev = branchOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            return (
              <div 
                key={shop._id}
                onClick={() => setSelectedShopId(shop._id)}
                className="bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-gray-100 border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      ID: {shortId}
                    </span>
                    <span className={`px-2 py-0.5 border-2 border-black rounded text-[10px] font-black uppercase ${
                      shop.isOpen !== false ? 'bg-[#B0FF49] text-black' : 'bg-red-400 text-white'
                    }`}>
                      {shop.isOpen !== false ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-black group-hover:text-[#0D8DE3] transition-colors">
                    {shop.name}
                  </h3>
                  
                  {shop.branches?.[0] && (
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-1">
                      <Store size={14} className="text-black shrink-0" />
                      {shop.branches[0]}
                    </p>
                  )}
                </div>

                {/* Branch Stats summary */}
                <div className="bg-gray-50 border-2 border-black p-3 rounded-xl">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase">Orders</span>
                      <span className="font-black text-sm text-black">{branchOrders.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase">Revenue</span>
                      <span className="font-black text-sm text-[#0D8DE3]">₹{branchRev.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t-2 border-black flex justify-between items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedShopId(shop._id)}
                    className="flex-1 bg-black text-white border-2 border-black py-2 font-black uppercase text-xs hover:bg-gray-800 transition-all flex justify-center items-center gap-1"
                  >
                    Manage <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTenantId(shop._id);
                      setActiveTab('dashboard');
                    }}
                    className="bg-[#B0FF49] text-black border-2 border-black px-3 py-2 font-black uppercase text-xs hover:bg-[#9de83a] transition-all"
                    title="Switch shop context"
                  >
                    Context
                  </button>
                  <button 
                    onClick={() => handleDeleteShop(shop._id, shop.name)}
                    className="p-2 border-2 border-transparent hover:border-black hover:bg-red-500 hover:text-white rounded transition-all text-red-500"
                    title="Delete branch"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Super Admin App Download Links Control Center (Placed Below Laundry Branches) */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 rounded-2xl space-y-4 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-4 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0D8DE3] text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <Smartphone size={24} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-black lilita-one-regular tracking-wide">
                Platform Mobile App Download Links
              </h3>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Super Admin Configuration: Control Android APK Direct Download & iOS Links across the platform
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveAppLinks}
            disabled={isSavingAppLinks}
            className="bg-[#B0FF49] hover:bg-[#9de83a] text-black border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] px-5 py-2.5 font-black uppercase text-xs sm:text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Smartphone size={16} /> {isSavingAppLinks ? 'Saving Links...' : 'Save App Download Links'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Android APK Link */}
          <div>
            <label className="block text-xs font-black uppercase mb-1.5 text-black">
              Android APK / Google Drive Direct Link
            </label>
            <input
              type="text"
              placeholder="https://drive.google.com/file/d/.../view or direct .apk link"
              value={appLinksForm.androidAppUrl}
              onChange={(e) => setAppLinksForm({ ...appLinksForm, androidAppUrl: e.target.value })}
              className="w-full bg-gray-50 border-2 border-black p-3 font-mono text-xs font-bold outline-none focus:bg-[#B0FF49]/10 rounded-xl"
            />
            <p className="text-[10px] font-bold text-gray-500 mt-1.5 uppercase">
              💡 Tip: Paste any Google Drive link here. The website converts it to a direct download link automatically.
            </p>
          </div>

          {/* iOS App Store Link */}
          <div>
            <label className="block text-xs font-black uppercase mb-1.5 text-black">
              iOS App Store / TestFlight Link (Optional)
            </label>
            <input
              type="text"
              placeholder="https://apps.apple.com/app/id..."
              value={appLinksForm.iosAppUrl}
              onChange={(e) => setAppLinksForm({ ...appLinksForm, iosAppUrl: e.target.value })}
              className="w-full bg-gray-50 border-2 border-black p-3 font-mono text-xs font-bold outline-none focus:bg-[#B0FF49]/10 rounded-xl"
            />
            <p className="text-[10px] font-bold text-gray-500 mt-1.5 uppercase">
              🍏 Leave blank to show the "iOS App Coming Soon!" interactive modal on website.
            </p>
          </div>
        </div>
      </div>

      {/* ─── ADD NEW BRANCH MODAL ───────────────────────────────────── */}
      {isAddShopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-[#B0FF49]">
              <h2 className="text-xl font-black uppercase flex items-center gap-2">
                <Building2 size={22} /> Add New Laundry Branch
              </h2>
              <button 
                onClick={() => setIsAddShopModalOpen(false)} 
                className="p-1 hover:bg-black hover:text-white rounded border-2 border-transparent hover:border-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateShop} className="p-6 space-y-4">
              <div>
                <label className="block font-black text-xs uppercase mb-1">Shop / Branch Name *</label>
                <input 
                  type="text" 
                  value={newShopForm.name} 
                  onChange={(e) => setNewShopForm({ ...newShopForm, name: e.target.value })}
                  placeholder="e.g. WOW Laundry (Civil Lines)" 
                  required
                  className="w-full border-2 border-black p-3 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">Location / Address *</label>
                <input 
                  type="text" 
                  value={newShopForm.branchLocation} 
                  onChange={(e) => setNewShopForm({ ...newShopForm, branchLocation: e.target.value })}
                  placeholder="e.g. Civil Lines, Near City Centre" 
                  required
                  className="w-full border-2 border-black p-3 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">Shop Admin Email * (Instant OTP Bypass)</label>
                <input 
                  type="email" 
                  value={newShopForm.adminEmail} 
                  onChange={(e) => setNewShopForm({ ...newShopForm, adminEmail: e.target.value })}
                  placeholder="e.g. admin.civillines@wow.com" 
                  required
                  className="w-full border-2 border-black p-3 font-bold bg-white"
                />
                <p className="text-[11px] font-bold text-gray-500 mt-1">This email can log in instantly with OTP bypass.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-xs uppercase mb-1">UPI ID (Optional)</label>
                  <input 
                    type="text" 
                    value={newShopForm.upiId} 
                    onChange={(e) => setNewShopForm({ ...newShopForm, upiId: e.target.value })}
                    placeholder="shop@upi" 
                    className="w-full border-2 border-black p-3 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-black text-xs uppercase mb-1">Bank Name (Optional)</label>
                  <input 
                    type="text" 
                    value={newShopForm.bankName} 
                    onChange={(e) => setNewShopForm({ ...newShopForm, bankName: e.target.value })}
                    placeholder="HDFC Bank" 
                    className="w-full border-2 border-black p-3 font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">Account Number (Optional)</label>
                <input 
                  type="text" 
                  value={newShopForm.accountNo} 
                  onChange={(e) => setNewShopForm({ ...newShopForm, accountNo: e.target.value })}
                  placeholder="50100012345678" 
                  className="w-full border-2 border-black p-3 font-bold bg-white"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsAddShopModalOpen(false)}
                  className="flex-1 bg-gray-100 border-2 border-black py-3 font-black uppercase text-xs hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#B0FF49] border-2 border-black py-3 font-black uppercase text-xs shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> {isSubmitting ? 'Creating...' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
