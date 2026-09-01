import React, { useState } from 'react';
import { ArrowLeft, Save, Trash2, User, Truck, Store, Phone, Mail, Building2, ShoppingBag, DollarSign, Calendar, Clock } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export default function SuperAdminShopDetail({ shopId, onBack, onOpenCatalog, onOpenOrders }) {
  const { shops, users, orders, updateShop, deleteUser, addDeliveryBoy, setCurrentTenantId } = useAppStore();
  const shop = shops.find(s => s._id === shopId);

  const [activeTab, setActiveTab] = useState('details');

  // Edit Shop Profile State
  const [shopName, setShopName] = useState(shop?.name || '');
  const [branchStr, setBranchStr] = useState(shop?.branches?.join(', ') || '');
  const [upiId, setUpiId] = useState(shop?.paymentInfo?.upiId || '');
  const [bankName, setBankName] = useState(shop?.paymentInfo?.bankName || '');
  const [accountNo, setAccountNo] = useState(shop?.paymentInfo?.accountNo || '');
  const [isOpen, setIsOpen] = useState(shop?.isOpen ?? true);
  const [isSaving, setIsSaving] = useState(false);

  // Add Delivery Staff Form State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  if (!shop) {
    return (
      <div className="p-8 bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
        <p className="font-bold text-gray-500 mb-4">Shop branch not found or deleted.</p>
        <button onClick={onBack} className="bg-black text-white px-6 py-2 font-black uppercase text-sm">
          Return to Branches
        </button>
      </div>
    );
  }

  const shopOrders = orders.filter(o => o.shopId === shopId);
  const shopStaff = users.filter(u => u.shopId === shopId && ['ShopAdmin', 'Delivery'].includes(u.role));
  
  // Customers who placed orders at this branch
  const customerIds = new Set(shopOrders.map(o => o.customerId));
  const shopCustomers = users.filter(u => customerIds.has(u._id));

  const totalRevenue = shopOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = shopOrders.filter(o => !['DELIVERED'].includes(o.status)).length;
  const completedOrders = shopOrders.filter(o => o.status === 'DELIVERED').length;

  const handleSaveShop = async () => {
    setIsSaving(true);
    try {
      await updateShop(shopId, {
        name: shopName,
        branches: branchStr.split(',').map(s => s.trim()).filter(Boolean),
        isOpen,
        paymentInfo: {
          upiId,
          bankName,
          accountNo,
          qrValue: upiId ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(shopName)}&cu=INR` : ''
        }
      });
      alert('Shop details saved successfully!');
    } catch (err) {
      alert(err?.message || 'Failed to update shop');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!staffEmail || !staffEmail.includes('@')) return alert('Valid email address is required');
    setIsAddingStaff(true);
    try {
      await addDeliveryBoy(staffEmail, shopId, staffName, staffPhone);
      setStaffEmail('');
      setStaffName('');
      setStaffPhone('');
      setShowAddStaffModal(false);
      alert('Staff member assigned to this branch successfully!');
    } catch (err) {
      alert(err?.response?.data?.error || err?.message || 'Failed to add staff');
    } finally {
      setIsAddingStaff(false);
    }
  };

  const handleDeleteStaff = async (userId, name) => {
    if (window.confirm(`Remove staff member ${name} from this shop branch?`)) {
      try {
        await deleteUser(userId);
      } catch (err) {
        alert('Failed to remove staff member');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-gray-100 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black uppercase">{shop.name}</h1>
              <span className={`px-3 py-1 border-2 border-black font-black text-xs uppercase ${shop.isOpen ? 'bg-[#B0FF49]' : 'bg-red-200'}`}>
                {shop.isOpen ? 'Active' : 'Closed'}
              </span>
            </div>
            <p className="font-bold text-gray-500 text-sm mt-1">Branch ID: <span className="text-black font-black">{shop._id}</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setCurrentTenantId(shopId);
              if (onOpenOrders) onOpenOrders();
            }}
            className="bg-[#0D8DE3] text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] px-4 py-2 font-black uppercase text-xs hover:-translate-y-0.5 transition-transform flex items-center gap-1.5"
          >
            <ShoppingBag size={16} /> View Orders ({shopOrders.length})
          </button>
          <button
            onClick={() => {
              setCurrentTenantId(shopId);
              if (onOpenCatalog) onOpenCatalog();
            }}
            className="bg-[#B0FF49] text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] px-4 py-2 font-black uppercase text-xs hover:-translate-y-0.5 transition-transform flex items-center gap-1.5"
          >
            <Store size={16} /> Edit Catalog
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-4 border-black pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'details', label: 'Shop Details & Payments' },
          { id: 'staff', label: `Staff & Fleet (${shopStaff.length})` },
          { id: 'customers', label: `Customers (${shopCustomers.length})` },
          { id: 'orders', label: `Performance (${shopOrders.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 border-2 border-black font-black uppercase text-xs whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1' 
                : 'bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: DETAILS ────────────────────────────────────────── */}
      {activeTab === 'details' && (
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-6">
          <h2 className="text-xl font-black uppercase border-b-2 border-black pb-2">Edit Branch Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-black text-xs uppercase mb-2">Shop / Branch Name</label>
              <input 
                type="text" 
                value={shopName} 
                onChange={(e) => setShopName(e.target.value)} 
                className="w-full border-2 border-black p-3 font-bold bg-white"
              />
            </div>
            <div>
              <label className="block font-black text-xs uppercase mb-2">Service Areas / Branches (Comma Separated)</label>
              <input 
                type="text" 
                value={branchStr} 
                onChange={(e) => setBranchStr(e.target.value)} 
                className="w-full border-2 border-black p-3 font-bold bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t-2 border-dashed border-gray-300">
            <div>
              <label className="block font-black text-xs uppercase mb-2">UPI ID</label>
              <input 
                type="text" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)} 
                placeholder="e.g. laundry@upi"
                className="w-full border-2 border-black p-3 font-bold bg-white"
              />
            </div>
            <div>
              <label className="block font-black text-xs uppercase mb-2">Bank Name</label>
              <input 
                type="text" 
                value={bankName} 
                onChange={(e) => setBankName(e.target.value)} 
                placeholder="e.g. HDFC Bank"
                className="w-full border-2 border-black p-3 font-bold bg-white"
              />
            </div>
            <div>
              <label className="block font-black text-xs uppercase mb-2">Account Number</label>
              <input 
                type="text" 
                value={accountNo} 
                onChange={(e) => setAccountNo(e.target.value)} 
                placeholder="e.g. 501002345678"
                className="w-full border-2 border-black p-3 font-bold bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-dashed border-gray-300 flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isOpen} 
                onChange={(e) => setIsOpen(e.target.checked)} 
                className="w-6 h-6 border-2 border-black accent-black cursor-pointer"
              />
              <span className="font-black text-sm uppercase">Accepting Orders (Shop Open)</span>
            </label>
          </div>

          <div className="pt-4 border-t-2 border-black flex justify-end">
            <button
              onClick={handleSaveShop}
              disabled={isSaving}
              className="bg-[#B0FF49] hover:bg-[#9de83a] text-black border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] px-8 py-3 font-black uppercase text-sm hover:translate-y-[1px] transition-all flex items-center gap-2"
            >
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save Branch Details'}
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 2: STAFF & FLEET ─────────────────────────────────── */}
      {activeTab === 'staff' && (
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex justify-between items-center border-b-2 border-black pb-4">
            <div>
              <h2 className="text-xl font-black uppercase">Staff & Fleet Assigned to this Branch</h2>
              <p className="font-bold text-gray-500 text-xs mt-1">Shop Admins and Delivery Personnel allocated to {shop.name}.</p>
            </div>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="bg-black text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] px-4 py-2 font-black uppercase text-xs hover:bg-gray-800 transition-all flex items-center gap-1.5"
            >
              <Truck size={16} /> Add Delivery Staff
            </button>
          </div>

          {shopStaff.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border-2 border-black">
              <p className="font-bold text-gray-500">No staff members currently assigned to this branch.</p>
              <button 
                onClick={() => setShowAddStaffModal(true)}
                className="mt-3 bg-[#B0FF49] text-black border-2 border-black px-4 py-2 font-black uppercase text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                Add First Staff Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopStaff.map(u => (
                <div key={u._id} className="bg-white border-2 border-black p-4 rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 border-2 border-black rounded-full flex items-center justify-center font-black ${
                      u.role === 'ShopAdmin' ? 'bg-[#0D8DE3] text-white' : 'bg-[#B0FF49] text-black'
                    }`}>
                      {u.role === 'ShopAdmin' ? <Store size={18} /> : <Truck size={18} />}
                    </div>
                    <div>
                      <h4 className="font-black text-base flex items-center gap-2">
                        {u.name}
                        <span className="text-[10px] px-2 py-0.5 border border-black rounded-full uppercase bg-gray-100 font-bold">
                          {u.role}
                        </span>
                      </h4>
                      <p className="font-bold text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {u.email}
                      </p>
                      {u.phone && (
                        <p className="font-bold text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone size={12} /> {u.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteStaff(u._id, u.name)}
                    className="p-2 border-2 border-transparent hover:border-black hover:bg-red-500 hover:text-white rounded transition-colors text-red-500"
                    title="Remove Staff"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: CUSTOMERS ─────────────────────────────────────── */}
      {activeTab === 'customers' && (
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="border-b-2 border-black pb-4">
            <h2 className="text-xl font-black uppercase">Customers of {shop.name}</h2>
            <p className="font-bold text-gray-500 text-xs mt-1">Users who placed one or more orders at this specific laundry branch.</p>
          </div>

          {shopCustomers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border-2 border-black">
              <p className="font-bold text-gray-500">No customers recorded for this branch yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopCustomers.map(cust => {
                const custOrdersCount = shopOrders.filter(o => o.customerId === cust._id).length;
                const custSpent = shopOrders.filter(o => o.customerId === cust._id).reduce((s, o) => s + (o.totalAmount || 0), 0);
                return (
                  <div key={cust._id} className="bg-white border-2 border-black p-4 rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-300 border-2 border-black rounded-full flex items-center justify-center font-black">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-base truncate">{cust.name}</h4>
                        <p className="font-bold text-xs text-gray-500 truncate">{cust.email}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between text-xs font-bold text-gray-700">
                      <span>{custOrdersCount} Orders</span>
                      <span className="text-[#0D8DE3] font-black">₹{custSpent.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: PERFORMANCE & ORDERS ─────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="border-b-2 border-black pb-4">
            <h2 className="text-xl font-black uppercase">Branch Metrics & Orders Breakdown</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#B0FF49] border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <span className="block font-black text-xs uppercase text-gray-700">Gross Revenue</span>
              <span className="text-2xl font-black text-black">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 bg-[#0D8DE3] text-white border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <span className="block font-black text-xs uppercase text-blue-100">Total Orders</span>
              <span className="text-2xl font-black">{shopOrders.length}</span>
            </div>
            <div className="p-4 bg-yellow-100 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <span className="block font-black text-xs uppercase text-yellow-800">Pending Orders</span>
              <span className="text-2xl font-black text-yellow-900">{pendingOrders}</span>
            </div>
            <div className="p-4 bg-green-100 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <span className="block font-black text-xs uppercase text-green-800">Completed Orders</span>
              <span className="text-2xl font-black text-green-900">{completedOrders}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <p className="font-bold text-gray-500 text-sm">Want to view or assign live orders for {shop.name}?</p>
            <button
              onClick={() => {
                setCurrentTenantId(shopId);
                if (onOpenOrders) onOpenOrders();
              }}
              className="bg-black text-white border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] px-5 py-2.5 font-black uppercase text-xs hover:bg-gray-800 transition-all"
            >
              Open Order Console
            </button>
          </div>
        </div>
      )}

      {/* ─── ADD STAFF MODAL ──────────────────────────────────────── */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-[#B0FF49]">
              <h2 className="text-lg font-black uppercase">Add Delivery Staff for {shop.name}</h2>
              <button onClick={() => setShowAddStaffModal(false)} className="p-1 hover:bg-black hover:text-white rounded">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block font-black text-xs uppercase mb-1">Staff Name</label>
                <input 
                  type="text" 
                  value={staffName} 
                  onChange={(e) => setStaffName(e.target.value)} 
                  placeholder="e.g. John Doe"
                  className="w-full border-2 border-black p-2.5 font-bold"
                />
              </div>
              <div>
                <label className="block font-black text-xs uppercase mb-1">Email (Instant Login / Bypass)</label>
                <input 
                  type="email" 
                  value={staffEmail} 
                  onChange={(e) => setStaffEmail(e.target.value)} 
                  placeholder="e.g. john@wow.com"
                  required
                  className="w-full border-2 border-black p-2.5 font-bold"
                />
              </div>
              <div>
                <label className="block font-black text-xs uppercase mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={staffPhone} 
                  onChange={(e) => setStaffPhone(e.target.value)} 
                  placeholder="e.g. 9876543210"
                  className="w-full border-2 border-black p-2.5 font-bold"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 bg-gray-100 border-2 border-black py-2.5 font-black uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingStaff}
                  className="flex-1 bg-[#B0FF49] border-2 border-black py-2.5 font-black uppercase text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[1px]"
                >
                  {isAddingStaff ? 'Adding...' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
