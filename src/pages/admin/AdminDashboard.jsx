import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import Navbar from '../../components/Navbar';
import { 
  Settings, Users, Grid, List, Activity, Package, Edit, Trash2, X, 
  Printer, Phone, MessageCircle, MapPin, Clock, CreditCard, Truck, 
  ChevronRight, Download, Building2, Store, LogOut, CheckCircle, Plus,
  Globe, ArrowLeft
} from 'lucide-react';
import ShopDashboard from './views/ShopDashboard';
import OrderBoard from './views/OrderBoard';
import CatalogManager from './views/CatalogManager';
import GlobalShops from './views/GlobalShops';
import GlobalUsers from './views/GlobalUsers';
import ShopSettings from './views/ShopSettings';

const FILTERS = [
  { key: 'new',      label: 'New Orders',      statuses: ['PLACED', 'ACCEPTED'] },
  { key: 'washing',  label: 'In Wash Cycle',   statuses: ['PICKED_UP', 'WASHING', 'IRONING'] },
  { key: 'delivery', label: 'Out for Delivery', statuses: ['PICKUP_ASSIGNED', 'OUT_FOR_DELIVERY'] },
  { key: 'history',  label: 'History',         statuses: ['DELIVERED'] },
];

const SERVICE_LABEL_FOR_CATEGORY = (catName) => {
  if (catName?.toLowerCase().includes('dry')) return { label: 'Premium Dry Clean', icon: '✦', bg: 'bg-purple-100', color: 'text-purple-600' };
  if (catName?.toLowerCase().includes('bed')) return { label: 'Linen & Bedding', icon: '✦', bg: 'bg-teal-100', color: 'text-teal-600' };
  return { label: 'Standard Wash & Fold', icon: '✦', bg: 'bg-blue-100', color: 'text-blue-600' };
};

const stripeColor = (s) => {
  if (['PLACED', 'ACCEPTED'].includes(s)) return 'bg-red-500';
  if (['PICKUP_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(s)) return 'bg-[#0D8DE3]';
  if (['PICKED_UP', 'WASHING', 'IRONING'].includes(s)) return 'bg-[#9AE600]';
  if (s === 'DELIVERED') return 'bg-green-500';
  return 'bg-gray-400';
};

export default function AdminDashboard() {
  const { 
    currentUser, shops, currentTenantId, setCurrentTenantId, fetchOrders, fetchUsers, fetchCatalog,
    orders, categories, items, users,
    createShop, updateShop, deleteShop, deleteUser, addDeliveryBoy
  } = useAppStore();
  
  const navigate = useNavigate();
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';
  
  // Default tab based on role and context
  const [activeTab, setActiveTab] = useState(
    isSuperAdmin && !currentTenantId ? 'shops' : (isSuperAdmin ? 'shops' : 'dashboard')
  );

  useEffect(() => {
    if (isSuperAdmin && !currentTenantId) {
      setActiveTab('shops');
    }
  }, [isSuperAdmin, currentTenantId]);

  const [activeFilter, setActiveFilter] = useState('new');
  
  // Settings Form State
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [settingsForm, setSettingsForm] = useState({
    upiId: '', bankName: '', accountNo: '', minOrderValue: 0, taxPercent: 0, deliveryFee: 0, contactNumber: '', instructions: ''
  });
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [isAddingDelivery, setIsAddingDelivery] = useState(false);

  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'ShopAdmin' && currentUser.role !== 'SuperAdmin')) {
      navigate('/login');
      return;
    }
    
    // Initial fetch of data
    fetchOrders(1);
    fetchUsers();
    fetchCatalog();
  }, [currentUser, navigate]);

  const activeShopId = currentTenantId || currentUser?.shopId || (!isSuperAdmin && shops.length > 0 ? shops[0]._id : '');
  const currentShop = shops.find(s => s._id === activeShopId) || null;

  // Sync shop state when currentShop changes
  useEffect(() => {
    if (currentShop) {
      setIsShopOpen(currentShop.isOpen ?? true);
      const defaultPromos = [
        { id: '1', badge: 'PROMO', title: '50% OFF', subtitle: 'Winter Wear Deep Dryclean', type: 'promo' },
        { id: '2', badge: 'EXPRESS', title: 'DOORSTEP PICKUP', subtitle: 'Fast scheduled pickup & delivery', type: 'express' }
      ];
      const defaultWashPrefs = [
        { id: 'extra_softener', name: 'Extra Fabric Softener', description: 'Delicate lavender scent & plush softness', price: 20, enabled: true },
        { id: 'anti_bacterial', name: 'Anti-Bacterial Sanitization', description: 'Deep hygiene rinse eliminating 99.9% germs', price: 30, enabled: true },
        { id: 'eco_organic', name: 'Eco Organic Detergent', description: 'Hypoallergenic wash for sensitive skin', price: 25, enabled: false },
        { id: 'stain_booster', name: 'Stain Remover Booster', description: 'Spot treatment for tough grease & collar marks', price: 40, enabled: true }
      ];
      setSettingsForm({
        upiId: currentShop.paymentInfo?.upiId || '',
        bankName: currentShop.paymentInfo?.bankName || '',
        accountNo: currentShop.paymentInfo?.accountNo || '',
        minOrderValue: currentShop.minOrderValue || 0,
        taxPercent: currentShop.taxPercent || 0,
        deliveryFee: currentShop.deliveryFee || 0,
        contactNumber: currentShop.contactNumber || '',
        instructions: currentShop.instructions || '',
        androidAppUrl: currentShop.androidAppUrl || '',
        iosAppUrl: currentShop.iosAppUrl || '',
        promoBanners: (currentShop.promoBanners && currentShop.promoBanners.length >= 2) 
          ? currentShop.promoBanners 
          : defaultPromos,
        washPreferences: (currentShop.washPreferences && currentShop.washPreferences.length > 0)
          ? currentShop.washPreferences.map(p => ({ ...p, enabled: p.enabled !== false }))
          : defaultWashPrefs
      });
    }
  }, [currentShop]);

  const tenantOrders = activeShopId 
    ? orders.filter(o => o.shopId === activeShopId) 
    : orders;

  const deliveryBoys = users.filter(u => 
    u.role === 'Delivery' && (
      !activeShopId || 
      !u.shopId || 
      u.shopId === activeShopId
    )
  );

  // Full order lifecycle filters for all admins
  const displayFilters = FILTERS;

  const handleSaveSettings = async () => {
    if (!currentShop) return;
    try {
      await updateShop(currentShop._id, {
        paymentInfo: {
          upiId: settingsForm.upiId ? settingsForm.upiId.trim() : undefined,
          bankName: settingsForm.bankName ? settingsForm.bankName.trim() : undefined,
          accountNo: settingsForm.accountNo ? settingsForm.accountNo.trim() : undefined,
          qrValue: settingsForm.upiId ? `upi://pay?pa=${settingsForm.upiId.trim()}&pn=${encodeURIComponent(currentShop.name)}&cu=INR` : ''
        },
        minOrderValue: Number(settingsForm.minOrderValue || 0),
        taxPercent: Number(settingsForm.taxPercent || 0),
        deliveryFee: Number(settingsForm.deliveryFee || 0),
        contactNumber: settingsForm.contactNumber,
        instructions: settingsForm.instructions,
        androidAppUrl: settingsForm.androidAppUrl ? settingsForm.androidAppUrl.trim() : '',
        iosAppUrl: settingsForm.iosAppUrl ? settingsForm.iosAppUrl.trim() : '',
        promoBanners: settingsForm.promoBanners,
        washPreferences: settingsForm.washPreferences,
        isOpen: isShopOpen
      });
      alert('Configuration saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert(err.response?.data?.error || err.message || 'Failed to save configuration.');
    }
  };

  const handleAddDeliveryBoy = async () => {
    if (!deliveryEmail || !deliveryEmail.includes('@')) return alert('Valid email address is required');
    const targetShop = currentShop?._id || currentTenantId || currentUser?.shopId;
    if (!targetShop) {
      return alert('Please select a shop branch from the admin panel before adding delivery staff.');
    }
    
    setIsAddingDelivery(true);
    try {
      await addDeliveryBoy(deliveryEmail, targetShop, deliveryName, deliveryPhone);
      setDeliveryEmail('');
      setDeliveryName('');
      setDeliveryPhone('');
      alert('Delivery staff added successfully!');
    } catch (err) {
      alert(err?.response?.data?.error || err?.message || 'Failed to add delivery staff');
    } finally {
      setIsAddingDelivery(false);
    }
  };

  // Compute navigation tabs based on user role and whether in global or branch context
  const getNavTabs = () => {
    if (isSuperAdmin) {
      if (!currentTenantId) {
        // Global Overview Tabs
        return [
          { id: 'shops', icon: Globe, label: 'Global Overview' },
          { id: 'orders', icon: List, label: 'All Orders' },
          { id: 'catalog', icon: Grid, label: 'Catalog Manager' },
          { id: 'users', icon: Users, label: 'All Users & Fleet' }
        ];
      } else {
        // Branch Context Tabs
        return [
          { id: 'dashboard', icon: Activity, label: 'Branch Dashboard' },
          { id: 'orders', icon: List, label: 'Branch Orders' },
          { id: 'catalog', icon: Grid, label: 'Branch Catalog' },
          { id: 'settings', icon: Settings, label: 'Branch Settings' }
        ];
      }
    } else {
      // Shop Admin Tabs
      return [
        { id: 'dashboard', icon: Activity, label: 'Dashboard' },
        { id: 'orders', icon: List, label: 'Order Board' },
        { id: 'catalog', icon: Grid, label: 'Catalog' },
        { id: 'settings', icon: Settings, label: 'Shop Settings' }
      ];
    }
  };

  const navTabs = getNavTabs();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-3">
          
          {/* Shop Context Card */}
          <div className="p-4 bg-[#9AE600] border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-black/70 mb-1">
              {isSuperAdmin ? 'Super Admin Context' : 'Branch Console'}
            </h2>
            
            {isSuperAdmin ? (
              <div className="space-y-2">
                <select 
                  className="w-full bg-white border-2 border-black font-black text-xs sm:text-sm p-2 outline-none cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  value={currentTenantId || ''}
                  onChange={(e) => {
                    const nextShopId = e.target.value;
                    setCurrentTenantId(nextShopId);
                    if (nextShopId) {
                      setActiveTab('dashboard');
                    } else {
                      setActiveTab('shops');
                    }
                  }}
                >
                  <option value="">Global Overview (All Shops)</option>
                  {shops.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>

                {currentTenantId && (
                  <button
                    onClick={() => {
                      setCurrentTenantId('');
                      setActiveTab('shops');
                    }}
                    className="w-full bg-black text-white py-1.5 px-2 font-black uppercase text-[11px] flex items-center justify-center gap-1 hover:bg-gray-800 transition-colors"
                  >
                    <ArrowLeft size={12} /> Return to Global
                  </button>
                )}
              </div>
            ) : (
              <p className="font-black text-lg truncate text-black">
                {currentShop ? currentShop.name : 'My Laundry Shop'}
              </p>
            )}
          </div>
          
          {/* Navigation Links (Horizontal scroll on mobile, vertical stack on desktop) */}
          <nav className="flex flex-row md:flex-col overflow-x-auto pb-2 md:pb-0 gap-2 md:gap-2.5 scrollbar-none">
            {navTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 py-2.5 md:px-4 md:py-3 font-black uppercase text-xs sm:text-sm border-2 border-black transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#0D8DE3] text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] md:translate-x-1' 
                    : 'bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden min-w-0">

          {activeTab === 'dashboard' && (
            <ShopDashboard 
              tenantOrders={tenantOrders} 
              deliveryBoys={deliveryBoys} 
              users={users} 
              currentShop={currentShop} 
            />
          )}

          {activeTab === 'orders' && (
            <OrderBoard 
              tenantOrders={tenantOrders} 
              displayFilters={displayFilters} 
              counts={{
                new: tenantOrders.filter(o => ['PLACED', 'ACCEPTED'].includes(o.status)).length,
                washing: tenantOrders.filter(o => ['PICKED_UP', 'WASHING', 'IRONING'].includes(o.status)).length,
                delivery: tenantOrders.filter(o => ['PICKUP_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(o.status)).length,
                history: tenantOrders.filter(o => ['DELIVERED'].includes(o.status)).length
              }} 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              users={users} 
              shops={shops}
              isSuperAdmin={isSuperAdmin}
              deliveryBoys={deliveryBoys}
              SERVICE_LABEL_FOR_CATEGORY={SERVICE_LABEL_FOR_CATEGORY}
              stripeColor={stripeColor}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogManager 
              categories={categories} 
              items={items} 
              shops={shops}
              currentTenantId={currentTenantId}
              setCurrentTenantId={setCurrentTenantId}
              isSuperAdmin={isSuperAdmin}
            />
          )}

          {activeTab === 'shops' && isSuperAdmin && (
            <GlobalShops 
              shops={shops} 
              orders={orders}
              users={users}
              createShop={createShop} 
              updateShop={updateShop}
              deleteShop={deleteShop} 
              setCurrentTenantId={setCurrentTenantId} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'users' && isSuperAdmin && (
            <GlobalUsers 
              users={users} 
              deleteUser={deleteUser} 
            />
          )}

          {activeTab === 'settings' && (
            <ShopSettings 
              currentShop={currentShop} 
              settingsForm={settingsForm} 
              setSettingsForm={setSettingsForm} 
              isShopOpen={isShopOpen} 
              setIsShopOpen={setIsShopOpen} 
              handleSaveSettings={handleSaveSettings} 
              deliveryEmail={deliveryEmail} 
              setDeliveryEmail={setDeliveryEmail} 
              deliveryName={deliveryName}
              setDeliveryName={setDeliveryName}
              deliveryPhone={deliveryPhone}
              setDeliveryPhone={setDeliveryPhone}
              isAddingDelivery={isAddingDelivery}
              handleAddDeliveryBoy={handleAddDeliveryBoy} 
              deliveryBoys={deliveryBoys}
              deleteUser={deleteUser}
              isSuperAdmin={isSuperAdmin}
            />
          )}

        </main>
      </div>
    </div>
  );
}
