// WOW Laundry Global Zustand Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Shop, User, Category, Item, Order, Offer, OrderStatus, PaymentStatus, PaymentMode, Role, OrderItem, CartItem } from '../types';
import api, { setAuthToken, uploadImageToCloudinary, swrGet, invalidateCache } from '../services/api';

interface AppState {
  // Auth Contexts
  currentRole: Role;
  currentTenantId: string;
  currentUser: User | null;

  // Global Collections
  shops: Shop[];
  users: User[];
  categories: Category[];
  items: Item[];
  offers: Offer[];
  orders: Order[];

  // Pagination state for orders
  orderTotal: number;
  orderPage: number;

  // TTL timestamps for cache invalidation (epoch ms, 0 = never fetched)
  catalogLastFetched: number;
  shopsLastFetched: number;
  offersLastFetched: number;

  // Loading states per operation (not a single global flag)
  isLoading: boolean;
  isCatalogLoading: boolean;
  isOrdersLoading: boolean;
  error: string | null;

  // Customer Cart System
  cart: CartItem[];
  activeCoupon: Offer | null;
  deliveryInstructions: string;

  setCurrentRole: (role: Role) => void;
  setCurrentTenantId: (shopId: string) => void;
  setCurrentUser: (user: User | null) => void;
  autoSelectUserForRole: (role: Role, shopId?: string) => Promise<void>;

  // Async Data Fetching
  initializeAppData: (force?: boolean) => Promise<void>;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; message: string }>;
  sendLoginOtp: (identifier: string, password?: string) => Promise<{ success: boolean; requiresOtp?: boolean; notRegistered?: boolean; message: string }>;
  verifyLoginOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, phone: string, email: string, password?: string) => Promise<{ success: boolean; requiresOtp?: boolean; message: string }>;
  fetchCatalog: (overrideShopId?: string) => Promise<void>;
  fetchOrders: (page?: number) => Promise<void>;
  fetchUsers: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;

  // Actions - Customer Operations
  addToCart: (item: Item, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  placeOrder: (deliveryAddress: string, pickupTime?: string, washPreferences?: { name: string, price: number }[]) => Promise<{ success: boolean; orderId: string; message: string }>;
  cancelOrder: (orderId: string, reason?: string) => Promise<{ success: boolean; message?: string }>;

  // Actions - Shop Admin Operations
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentMode?: PaymentMode, paymentStatus?: PaymentStatus) => Promise<void>;
  updateOrderAdminDetails: (orderId: string, updates: { totalAmount?: number, adminNotes?: string }) => Promise<void>;
  assignDeliveryBoy: (orderId: string, deliveryBoyId: string) => Promise<void>;
  addCategory: (name: string, image?: string, overrideShopId?: string, parentCategoryId?: string, singleItemSelection?: boolean) => Promise<void>;
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addCatalogItem: (categoryId: string, name: string, description: string, price: number, unit: 'KG' | 'ITEM', image?: string, isBucket?: boolean) => Promise<void>;
  updateCatalogItem: (itemId: string, updates: Partial<Item>) => Promise<void>;
  updateCatalogItemPrice: (itemId: string, price: number, unit: 'KG' | 'ITEM') => Promise<void>;
  deleteCatalogItem: (itemId: string) => Promise<void>;
  addOffer: (offer: Omit<Offer, '_id' | 'shopId'>) => Promise<void>;
  addBranch: (branchName: string) => Promise<void>;
  removeBranch: (branchName: string) => Promise<void>;

  // Actions - Delivery Boy Operations
  verifyOrderItems: (orderId: string, itemsCount: Record<string, number>) => Promise<void>;
  recordPayment: (orderId: string, paymentMode: PaymentMode) => Promise<void>;
  updateKgWeight: (orderId: string, items: { itemId: string; kgWeight: number }[], markPickedUp?: boolean) => Promise<void>;

  // Actions - Super Admin Operations
  createShop: (name: string, branches: string[], upiId: string, bankName: string, accountNo: string, adminEmail: string) => Promise<void>;
  updateShop: (shopId: string, data: Partial<Shop>) => Promise<void>;
  deleteShop: (shopId: string) => Promise<void>;
  addDeliveryBoy: (email: string, targetShopId?: string, name?: string, phone?: string) => Promise<any>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserSuspension: (userId: string) => Promise<void>;

  // Storage Management
  storageStatus: { totalOrders: number; isNearLimit: boolean } | null;
  checkStorageStatus: () => Promise<void>;
  archiveDeliveredOrders: () => Promise<{ success: boolean; archivedCount?: number; message?: string }>;
}

// // In-flight deduplication guards
let catalogFetchInFlight: { promise: Promise<void>; shopId: string } | null = null;
let initAppDataInFlight: Promise<void> | null = null;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial States
      currentRole: 'Customer',
      currentTenantId: '',
      currentUser: null,

      shops: [],
      users: [],
      categories: [],
      items: [],
      offers: [],
      orders: [],
      orderTotal: 0,
      orderPage: 1,

      catalogLastFetched: 0,
      shopsLastFetched: 0,
      offersLastFetched: 0,

      isLoading: false,
      isCatalogLoading: false,
      isOrdersLoading: false,
      error: null,
      storageStatus: null,

      cart: [],
      activeCoupon: null,
      deliveryInstructions: '',

      // Environment Switch Actions
      setCurrentRole: (role) => {
        set({ currentRole: role });
        get().autoSelectUserForRole(role, get().currentTenantId);
      },

      setCurrentTenantId: (shopId) => {
        set({ 
          currentTenantId: shopId,
          cart: [], 
          activeCoupon: null,
          isCatalogLoading: true,
        });
        if (shopId) {
          get().fetchCatalog(shopId);
          get().fetchOrders(1);
          get().fetchUsers();
        } else {
          // Global view (SuperAdmin)
          get().fetchOrders(1);
          get().fetchUsers();
        }
      },

      setCurrentUser: (user) => {
        if (user) {
          const effectiveShop = user.role === 'SuperAdmin' ? '' : (user.shopId || get().currentTenantId || '');
          set({
            currentUser: user,
            currentRole: user.role,
            currentTenantId: effectiveShop,
          });
          if (effectiveShop) {
            get().fetchCatalog(effectiveShop);
          }
          get().fetchOrders(1);
          get().fetchUsers();
        } else {
          // Logout — clear user-specific state so next login sees a clean slate
          setAuthToken(null);
          set({
            currentUser: null,
            currentRole: 'Customer',
            currentTenantId: '',
            users: [],
            categories: [],
            items: [],
            orders: [],
            cart: [],
            activeCoupon: null,
            catalogLastFetched: 0,
            orderTotal: 0,
            orderPage: 1,
          });
          // Ensure public shops and offers remain available
          get().initializeAppData();
        }
      },


      autoSelectUserForRole: async (role, shopId) => {
        const targetShopId = shopId || get().currentTenantId;
        if (role === 'SuperAdmin') {
          const superUser = get().users.find(u => u.role === 'SuperAdmin') || null;
          if (superUser) {
            await get().login(superUser.email || 'superadmin@wow.com', '1234');
          } else {
            set({ currentUser: null, currentTenantId: '' });
          }
          return;
        }
        const matchingUser = get().users.find(u => u.role === role && u.shopId === targetShopId);
        if (matchingUser) {
          await get().login(matchingUser.email || 'customer.lawgate@wow.com', '1234');
        } else {
          set({ currentUser: null });
        }
        get().fetchCatalog();
        if (['SuperAdmin', 'ShopAdmin'].includes(role)) {
          get().fetchUsers();
        }
      },

      // App initialization — lean startup: shops + offers only, no all-users dump
      initializeAppData: async (force = false) => {
        if (!force && initAppDataInFlight) {
          return initAppDataInFlight;
        }

        const runInit = async () => {
          const GLOBAL_TTL = 5 * 60_000; // 5 minutes
          const now = Date.now();
          const { shopsLastFetched, offersLastFetched, shops } = get();

          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
          if (!token && get().currentUser) {
            set({ currentUser: null });
          }

          // Skip re-fetch if shops/offers data is still fresh and we already have data
          const isShopsFresh = !force && shops.length > 0 && (now - shopsLastFetched) < GLOBAL_TTL;
          const isOffersFresh = !force && (now - offersLastFetched) < GLOBAL_TTL;

          if (isShopsFresh && isOffersFresh) {
            if (token && get().currentUser) {
              const promises: Promise<any>[] = [get().fetchCatalog(), get().fetchOrders()];
              if (['SuperAdmin', 'ShopAdmin'].includes(get().currentUser!.role)) {
                promises.push(get().fetchUsers());
              }
              await Promise.all(promises);
            }
            return;
          }

          set({ isLoading: true, error: null });
          try {
            // Use swrGet for shops + offers — serves stale data INSTANTLY on repeat visits
            // while refreshing in background. Eliminates loading spinner on every app open.
            const SHOPS_SWR_TTL = 60_000;  // serve cache for 60s, refresh in background
            const OFFERS_SWR_TTL = 60_000;

            const shopId = get().currentTenantId;
            const offersUrl = shopId ? `/catalog/offers?shopId=${shopId}` : '/catalog/offers';

            const [shopsData, offersData] = await Promise.all([
              swrGet('/catalog/shops', SHOPS_SWR_TTL),
              swrGet(offersUrl, OFFERS_SWR_TTL),
            ]);

            set({
              shops: shopsData,
              offers: offersData,
              shopsLastFetched: Date.now(),
              offersLastFetched: Date.now(),
              isLoading: false,
            });

            // If logged in with active token, fetch their specific data
            if (token && get().currentUser) {
              const promises: Promise<any>[] = [get().fetchCatalog(), get().fetchOrders()];
              if (['SuperAdmin', 'ShopAdmin'].includes(get().currentUser!.role)) {
                promises.push(get().fetchUsers());
              }
              await Promise.all(promises);
            }
          } catch (err: any) {
            set({ error: err.message || 'Failed to load app data', isLoading: false });
          }
        };

        initAppDataInFlight = runInit().finally(() => {
          initAppDataInFlight = null;
        });

        return initAppDataInFlight;
      },

      sendLoginOtp: async (identifier, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/send-otp', {
            identifier,
            email: identifier,
            password,
          });

          // Staff or direct login bypass: JWT returned immediately
          if (response.data.directLogin && response.data.token) {
            const { user, token } = response.data;
            setAuthToken(token);
            set({
              currentUser: user,
              currentRole: user.role,
              currentTenantId: user.role === 'SuperAdmin' ? '' : (user.shopId || get().currentTenantId),
              shopsLastFetched: 0,
              offersLastFetched: 0,
              isLoading: false,
            });
            await get().initializeAppData();
            return { success: true, requiresOtp: false, message: 'Logged in successfully' };
          }

          set({ isLoading: false });
          return {
            success: true,
            requiresOtp: true,
            message: response.data.message || 'Verification code sent to your email',
          };
        } catch (err: any) {
          const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to send verification code';
          const notRegistered = err.response?.status === 404 || err.response?.data?.notRegistered === true;
          set({ isLoading: false, error: msg });
          return { success: false, notRegistered, message: msg };
        }
      },

      verifyLoginOtp: async (email, otp) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/login', {
            identifier: email,
            email,
            otp,
          });
          const { user, token } = response.data;

          if (token) setAuthToken(token);

          set({
            currentUser: user,
            currentRole: user.role,
            currentTenantId: user.role === 'SuperAdmin' ? '' : (user.shopId || get().currentTenantId),
            shopsLastFetched: 0,
            offersLastFetched: 0,
            isLoading: false,
          });

          await get().initializeAppData();
          return { success: true, message: 'Authenticated successfully' };
        } catch (err: any) {
          const msg = err.response?.data?.error || 'Invalid verification code';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      login: async (identifier, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/login', {
            identifier,
            email: identifier,
            password,
          });
          const { user, token } = response.data;

          if (token) setAuthToken(token);

          set({
            currentUser: user,
            currentRole: user.role,
            currentTenantId: user.role === 'SuperAdmin' ? '' : (user.shopId || get().currentTenantId),
            shopsLastFetched: 0,
            offersLastFetched: 0,
            isLoading: false,
          });

          await get().initializeAppData();
          return { success: true, message: 'Logged in successfully' };
        } catch (err: any) {
          const msg = err.response?.data?.error || 'Login failed';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      updateProfile: async (updates) => {
        try {
          const { currentUser } = get();
          if (!currentUser) throw new Error('Not logged in');

          let finalUpdates = { ...updates };
          if (finalUpdates.image) {
            finalUpdates.image = await uploadImageToCloudinary(finalUpdates.image);
          }

          const { data } = await api.put('/auth/users/me', finalUpdates);
          set({ currentUser: data });
          return { success: true, message: 'Profile updated' };
        } catch (error: any) {
          return { success: false, message: error.response?.data?.error || 'Failed to update profile' };
        }
      },

      register: async (name, phone, email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/register', { name, phone, email, password });
          set({ isLoading: false });

          // Step 1 complete: OTP sent to email — caller shows OTP input
          if (response.data.requiresOtp) {
            return { success: true, requiresOtp: true, message: response.data.message };
          }

          // Legacy path: account created directly (no OTP step)
          const { user, token } = response.data;
          if (token && user) {
            setAuthToken(token);
            set({
              currentUser: user,
              currentRole: user.role,
              currentTenantId: user.role === 'SuperAdmin' ? '' : (user.shopId || get().currentTenantId),
              shopsLastFetched: 0,
              offersLastFetched: 0,
            });
            await get().initializeAppData();
          }
          return { success: true, message: response.data.message || 'Registered successfully!' };
        } catch (err: any) {
          const msg = err.response?.data?.error || 'Registration failed';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      verifyOtp: async (email, otp) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/verify-otp', { email, otp });
          const { user, token } = response.data;

          if (token) setAuthToken(token);

          set({
            currentUser: user,
            currentRole: user.role,
            currentTenantId: user.role === 'SuperAdmin' ? '' : (user.shopId || get().currentTenantId),
            shopsLastFetched: 0,
            offersLastFetched: 0,
            isLoading: false,
          });

          await get().initializeAppData();
          return { success: true, message: 'Account verified and created!' };
        } catch (err: any) {
          const msg = err.response?.data?.error || 'OTP verification failed';
          set({ isLoading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      // Catalog fetch with deduplication + TTL cache
      fetchCatalog: async (overrideShopId?: string) => {
        let shopId = overrideShopId || get().currentTenantId || get().currentUser?.shopId;
        if (!shopId && get().shops.length > 0) {
          shopId = get().shops[0]._id;
        }
        if (!shopId) return;

        const shopIdStr = String(shopId);
        const CATALOG_TTL = 60_000;
        const hasFreshData = !overrideShopId &&
          (Date.now() - get().catalogLastFetched) < CATALOG_TTL &&
          get().categories.some(c => String(c.shopId) === shopIdStr);

        if (hasFreshData) {
          set({ isCatalogLoading: false });
          return;
        }

        if (catalogFetchInFlight && catalogFetchInFlight.shopId === shopIdStr) {
          return catalogFetchInFlight.promise;
        }

        const fetchPromise = (async () => {
          const hasData = get().categories.some(c => String(c.shopId) === shopIdStr);
          if (!hasData) {
            set({ isCatalogLoading: true, error: null });
          }
          try {
            // Use swrGet combined endpoint — 1 round-trip, serves cached response instantly while revalidating
            const data = await swrGet<{ categories?: any[]; items?: any[] }>(`/catalog/shops/${shopIdStr}/catalog`, CATALOG_TTL);
            set({
              categories: data?.categories || [],
              items: data?.items || [],
              catalogLastFetched: Date.now(),
              isCatalogLoading: false,
            });
          } catch (err: any) {
            set({ error: err.message || 'Failed to load catalog', isCatalogLoading: false });
          }
        })().finally(() => {
          if (catalogFetchInFlight && catalogFetchInFlight.shopId === shopIdStr) {
            catalogFetchInFlight = null;
          }
        });

        catalogFetchInFlight = { promise: fetchPromise, shopId: shopIdStr };
        return fetchPromise;
      },

      // Paginated orders fetch with strict shop partitioning
      fetchOrders: async (page = 1) => {
        set({ isOrdersLoading: true, error: null });
        try {
          const shopId = get().currentTenantId || get().currentUser?.shopId;
          const url = shopId ? `/orders?page=${page}&limit=50&shopId=${shopId}` : `/orders?page=${page}&limit=50`;
          const res = await api.get(url);
          const { orders, total } = res.data;

          const mergeUniqueOrders = (base: Order[], fresh: Order[]) => {
            const map = new Map<string, Order>();
            (fresh || []).forEach(o => { if (o && o._id) map.set(o._id, o); });
            (base || []).forEach(o => { if (o && o._id && !map.has(o._id)) map.set(o._id, o); });
            return Array.from(map.values()).sort((a, b) => 
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
          };

          if (page === 1) {
            // First page — replace and deduplicate
            set({ orders: mergeUniqueOrders([], orders), orderTotal: total, orderPage: 1, isOrdersLoading: false });
          } else {
            // Subsequent pages — deduplicate and append
            set(state => ({
              orders: mergeUniqueOrders(state.orders, orders),
              orderTotal: total,
              orderPage: page,
              isOrdersLoading: false,
            }));
          }
        } catch (err: any) {
          set({ error: err.message || 'Failed to load orders', isOrdersLoading: false });
        }
      },

      fetchUsers: async () => {
        const role = get().currentUser?.role;
        // Only admin roles are permitted to fetch all users
        if (!['SuperAdmin', 'ShopAdmin', 'Admin'].includes(role || '')) return;
        try {
          const shopId = get().currentTenantId || get().currentUser?.shopId;
          const url = shopId ? `/auth/users?limit=100&shopId=${shopId}` : '/auth/users?limit=100';
          const res = await api.get(url);
          if (Array.isArray(res.data?.users)) {
            set({ users: res.data.users });
          }
        } catch (err) {
          console.error('Failed to fetch users', err);
        }
      },

      checkStorageStatus: async () => {
        try {
          const res = await api.get('/orders/storage-status');
          set({ storageStatus: res.data });
        } catch (err) {
          console.error('Failed to check storage status', err);
        }
      },

      archiveDeliveredOrders: async () => {
        set({ isLoading: true });
        try {
          const res = await api.delete('/orders/archive');
          // Refresh first page of orders after archiving
          await get().fetchOrders(1);
          await get().checkStorageStatus();
          set({ isLoading: false });
          return { success: true, archivedCount: res.data.archivedCount };
        } catch (err: any) {
          set({ isLoading: false });
          return { success: false, message: err.message || 'Failed to archive' };
        }
      },

      // ── Cart Management ──────────────────────────────────────────────────────
      addToCart: (item, quantity) => {
        const { cart } = get();
        const existingIndex = cart.findIndex(c => c.itemId === item._id);
        const isKg = Boolean(item.pricePerKg && item.pricePerKg > 0) || 
          item.unit === 'KG' || 
          (typeof item.name === 'string' && (item.name.toLowerCase().includes('per kg') || item.name.toLowerCase().includes('/ kg')));
        const resolvedPrice = isKg ? 0 : (item.pricePerItem ?? item.price ?? 0);
        const resolvedUnit = isKg ? 'KG' : 'ITEM';

        const { categories } = get();
        const cat = categories.find(c => String(c._id) === String(item.categoryId));
        const parentCat = cat?.parentCategoryId ? categories.find(c => String(c._id) === String(cat.parentCategoryId)) : null;
        const isSingleMode = Boolean(cat?.singleItemSelection || parentCat?.singleItemSelection);

        if (isSingleMode) {
          if (quantity <= 0) {
            get().removeFromCart(item._id);
            return;
          }

          // In 1-Click Single Item Mode:
          // Remove any other item from this category/sub-category so the new item cleanly replaces it in 1 click
          const cleanedCart = cart.filter(c => {
            const otherItem = get().items.find(i => String(i._id) === String(c.itemId));
            if (!otherItem) return true;
            const otherCat = categories.find(catItem => String(catItem._id) === String(otherItem.categoryId));
            const isSameSubCat = String(otherItem.categoryId) === String(item.categoryId);
            const isSameParentCat = parentCat && otherCat && String(otherCat.parentCategoryId) === String(parentCat._id);
            return !(isSameSubCat || (parentCat?.singleItemSelection && isSameParentCat));
          });

          let categoryName = item.categoryName || '';
          let subCategoryName = item.subCategoryName || '';
          if (cat && !categoryName) {
            if (cat.parentCategoryId) {
              const parentCat = categories.find(c => c._id === cat.parentCategoryId);
              categoryName = parentCat?.name || '';
              subCategoryName = cat.name;
            } else {
              categoryName = cat.name;
            }
          }

          set({
            cart: [...cleanedCart, {
              itemId: item._id,
              name: item.name,
              quantity: 1, // Single item mode always adds 1 qty in 1-click
              price: resolvedPrice,
              pricePerKg: item.pricePerKg,
              unit: resolvedUnit,
              image: item.image,
              categoryName,
              subCategoryName,
              isBucket: Boolean(item.isBucket),
            }]
          });
          return;
        }

        if (existingIndex >= 0) {
          const newCart = [...cart];
          const nextQty = newCart[existingIndex].quantity + quantity;
          if (nextQty <= 0) {
            get().removeFromCart(item._id);
          } else {
            newCart[existingIndex] = {
              ...newCart[existingIndex],
              quantity: nextQty,
            };
            set({ cart: newCart });
          }
        } else if (quantity > 0) {
          let categoryName = item.categoryName || '';
          let subCategoryName = item.subCategoryName || '';
          if (cat && !categoryName) {
            if (cat.parentCategoryId) {
              const parentCat = categories.find(c => c._id === cat.parentCategoryId);
              categoryName = parentCat?.name || '';
              subCategoryName = cat.name;
            } else {
              categoryName = cat.name;
            }
          }
          set({
            cart: [...cart, {
              itemId: item._id,
              name: item.name,
              quantity,
              price: resolvedPrice,
              pricePerKg: item.pricePerKg,
              unit: resolvedUnit,
              image: item.image,
              categoryName,
              subCategoryName,
              isBucket: Boolean(item.isBucket),
            }]
          });
        }
      },

      removeFromCart: (itemId) => {
        const nextCart = get().cart.filter(c => c.itemId !== itemId);
        const { activeCoupon } = get();
        let updatedCoupon = activeCoupon;
        if (activeCoupon) {
          const isKgItemCheck = (c: any) => 
            c.unit === 'KG' || 
            (typeof c.name === 'string' && (c.name.toLowerCase().includes('per kg') || c.name.toLowerCase().includes('/ kg'))) || 
            Boolean(c.pricePerKg && c.pricePerKg > 0);
          const subtotal = nextCart.filter(c => !isKgItemCheck(c)).reduce((sum, c) => sum + (c.price || 0) * c.quantity, 0);
          if (subtotal < activeCoupon.minOrderValue) {
            updatedCoupon = null;
          }
        }
        set({ cart: nextCart, activeCoupon: updatedCoupon });
      },

      updateCartQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }
        const nextCart = get().cart.map(c => c.itemId === itemId ? { ...c, quantity } : c);
        const { activeCoupon } = get();
        let updatedCoupon = activeCoupon;
        if (activeCoupon) {
          const isKgItemCheck = (c: any) => 
            c.unit === 'KG' || 
            (typeof c.name === 'string' && (c.name.toLowerCase().includes('per kg') || c.name.toLowerCase().includes('/ kg'))) || 
            Boolean(c.pricePerKg && c.pricePerKg > 0);
          const subtotal = nextCart.filter(c => !isKgItemCheck(c)).reduce((sum, c) => sum + (c.price || 0) * c.quantity, 0);
          if (subtotal < activeCoupon.minOrderValue) {
            updatedCoupon = null;
          }
        }
        set({ cart: nextCart, activeCoupon: updatedCoupon });
      },

      clearCart: () => set({ cart: [], activeCoupon: null, deliveryInstructions: '' }),

      applyCoupon: (code) => {
        const { offers, cart, currentTenantId, shops } = get();
        const cleanCode = (code || '').trim().toUpperCase();
        const shop = shops.find(s => s._id === currentTenantId);

        // First check shop's custom promoCode if configured and active
        let coupon: Offer | null = null;
        if (shop?.promoCode && shop.promoCode.isActive !== false && shop.promoCode.code.toUpperCase() === cleanCode) {
          coupon = {
            _id: `promo_${shop._id}`,
            shopId: shop._id,
            code: shop.promoCode.code.toUpperCase(),
            discountPercent: shop.promoCode.discountPercent,
            maxDiscount: shop.promoCode.maxDiscount,
            minOrderValue: shop.promoCode.minOrderValue,
            description: shop.promoCode.description || '',
            isActive: true,
          };
        } else {
          coupon = offers.find(o => o.code.toUpperCase() === cleanCode && o.shopId === currentTenantId && o.isActive !== false) || null;
        }

        if (!coupon) return { success: false, message: 'Invalid coupon code for this shop' };

        const isKgItemCheck = (c: any) => 
          c.unit === 'KG' || 
          (typeof c.name === 'string' && (c.name.toLowerCase().includes('per kg') || c.name.toLowerCase().includes('/ kg'))) || 
          Boolean(c.pricePerKg && c.pricePerKg > 0);

        const subtotal = cart.filter(c => !isKgItemCheck(c)).reduce((sum, c) => sum + (c.price || 0) * c.quantity, 0);
        if (subtotal < coupon.minOrderValue) {
          return { success: false, message: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` };
        }
        set({ activeCoupon: coupon });
        const discountVal = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscount);
        return { success: true, message: `Coupon applied: ₹${discountVal} off!` };
      },

      removeCoupon: () => set({ activeCoupon: null }),

      placeOrder: async (deliveryAddress, pickupTime, washPreferences) => {
        const { cart, activeCoupon, currentUser, currentTenantId } = get();
        if (!currentUser) return { success: false, orderId: '', message: 'You must be logged in' };
        if (cart.length === 0) return { success: false, orderId: '', message: 'Your cart is empty' };
        if (!deliveryAddress) return { success: false, orderId: '', message: 'Delivery address is required' };

        set({ isLoading: true, error: null });

        const isKgItemCheck = (c: any) => 
          c.unit === 'KG' || 
          (typeof c.name === 'string' && (c.name.toLowerCase().includes('per kg') || c.name.toLowerCase().includes('/ kg'))) || 
          Boolean(c.pricePerKg && c.pricePerKg > 0);

        const perItemSubtotal = cart
          .filter(c => !isKgItemCheck(c))
          .reduce((sum, c) => sum + (c.price || 0) * c.quantity, 0);

        let discount = 0;
        if (activeCoupon) {
          discount = Math.min((perItemSubtotal * activeCoupon.discountPercent) / 100, activeCoupon.maxDiscount);
        }

        const orderItems: OrderItem[] = cart.map(c => {
          const isKg = isKgItemCheck(c);
          return {
            itemId: c.itemId,
            name: c.name,
            quantity: c.quantity,
            unit: isKg ? 'KG' : 'ITEM',
            // KG items are priced at 0 — delivery agent will weigh and update later
            price: isKg ? 0 : (c.price || 0),
            categoryName: c.categoryName,
            subCategoryName: c.subCategoryName,
            isBucket: c.isBucket,
          };
        });

        try {
          const shop = get().shops.find(s => s._id === currentTenantId);
          const taxPercent = shop?.taxPercent || 0;
          const deliveryFeeAmt = (shop?.deliveryFee !== undefined && shop?.deliveryFee !== null) ? Number(shop.deliveryFee) : 0;
          const tax = (perItemSubtotal * taxPercent) / 100;
          const washPrefsCost = washPreferences?.reduce((s, w) => s + w.price, 0) || 0;
          const finalTotal = perItemSubtotal - discount + tax + deliveryFeeAmt + washPrefsCost;


          const res = await api.post('/orders', {
            shopId: currentTenantId,
            items: orderItems,
            washPreferences,
            totalAmount: finalTotal,
            discountAmount: discount,
            couponCode: activeCoupon?.code || undefined,
            taxAmount: tax,
            deliveryFee: deliveryFeeAmt,
            pickupAddress: deliveryAddress,
            deliveryAddress,
            pickupTime,
            customerPhone: currentUser?.phone || undefined,
            customerName: currentUser?.name || undefined,
          });
          const newOrder = res.data;
          invalidateCache('/orders');

          set(state => {
            const exists = state.orders.some(o => o._id === newOrder._id);
            return {
              orders: exists ? state.orders : [newOrder, ...state.orders],
              cart: [],
              activeCoupon: null,
              deliveryInstructions: '',
              isLoading: false,
            };
          });

          return { success: true, orderId: newOrder._id, message: 'Order placed successfully!' };
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Failed to place order' });
          return { success: false, orderId: '', message: 'Failed to place order' };
        }
      },

      cancelOrder: async (orderId: string, reason?: string) => {
        try {
          const res = await api.patch(`/orders/${orderId}/cancel`, { reason });
          if (res.data) {
            invalidateCache('/orders');
            set(state => ({
              orders: state.orders.map(o => o._id === orderId ? res.data : o)
            }));
            return { success: true, message: 'Order cancelled successfully' };
          }
          return { success: false, message: 'Failed to cancel order' };
        } catch (err: any) {
          const msg = err?.response?.data?.error || err.message || 'Failed to cancel order';
          return { success: false, message: msg };
        }
      },

      // ── Admin Actions ────────────────────────────────────────────────────────
      updateOrderStatus: async (orderId, status, paymentMode, paymentStatus) => {
        try {
          const payload: any = { status };
          if (paymentMode) payload.paymentMode = paymentMode;
          if (paymentStatus) payload.paymentStatus = paymentStatus;

          await api.patch(`/orders/${orderId}/status`, payload);
          // Surgical local update — no full re-fetch
          set(state => ({
            orders: state.orders.map(o =>
              o._id === orderId
                ? { ...o, status, ...(paymentMode && { paymentMode }), ...(paymentStatus && { paymentStatus }) }
                : o
            ),
          }));
        } catch (err) {
          console.error('Failed to update order status', err);
        }
      },

      updateOrderAdminDetails: async (orderId, updates) => {
        try {
          const res = await api.patch(`/orders/${orderId}/admin-details`, updates);
          set(state => ({
            orders: state.orders.map(o => o._id === orderId ? res.data : o),
          }));
        } catch (err) {
          console.error('Failed to update order admin details', err);
        }
      },

      assignDeliveryBoy: async (orderId, deliveryBoyId) => {
        const deliveryBoy = get().users.find(u => u._id === deliveryBoyId);
        const boyName = deliveryBoy?.name || 'Delivery Staff';
        try {
          const res = await api.patch(`/orders/${orderId}/assign`, {
            deliveryBoyId,
            deliveryBoyName: boyName,
          });
          set(state => ({
            orders: state.orders.map(o => o._id === orderId ? res.data : o),
          }));
          return res.data;
        } catch (err) {
          console.error('Failed to assign delivery boy', err);
          throw err;
        }
      },

      addCategory: async (name, image, overrideShopId, parentCategoryId, singleItemSelection) => {
        const shopId = overrideShopId || get().currentTenantId || get().currentUser?.shopId || get().shops[0]?._id;
        if (!shopId) throw new Error('No shop context — select a shop branch before adding categories.');
        try {
          let finalImage = image;
          if (image && (image.startsWith('data:') || (image as any) instanceof File)) {
            finalImage = await uploadImageToCloudinary(image);
          }
          const res = await api.post('/catalog/categories', { 
            shopId, 
            name, 
            image: finalImage, 
            parentCategoryId: parentCategoryId || null,
            singleItemSelection
          });
          if (res.data) {
            set(state => ({
              categories: state.categories.some(c => c._id === res.data._id) ? state.categories : [...state.categories, res.data]
            }));
            invalidateCache('/catalog');
            // Invalidate cache and refetch catalog to keep hierarchy in sync
            await get().fetchCatalog(shopId);
          }
          return res.data;
        } catch (err) {
          console.error('Failed to add category', err);
          throw err;
        }
      },

      updateCategory: async (categoryId, updates) => {
        const prevCategories = get().categories;
        const shopId = get().currentTenantId || get().currentUser?.shopId || get().shops[0]?._id;
        try {
          let finalUpdates = { ...updates };
          if (finalUpdates.image && (finalUpdates.image.startsWith('data:') || (finalUpdates.image as any) instanceof File)) {
            finalUpdates.image = await uploadImageToCloudinary(finalUpdates.image);
          }
          // Optimistic update first
          set(state => ({
            categories: state.categories.map(c => c._id === categoryId ? { ...c, ...finalUpdates } : c),
          }));
          const res = await api.patch(`/catalog/categories/${categoryId}`, finalUpdates);
          if (res.data) {
            set(state => ({
              categories: state.categories.map(c => c._id === categoryId ? res.data : c),
            }));
            invalidateCache('/catalog');
            if (shopId) {
              await get().fetchCatalog(shopId);
            }
          }
          return res.data;
        } catch (err) {
          set({ categories: prevCategories });
          console.error('Failed to update category', err);
          throw err;
        }
      },

      deleteCategory: async (categoryId) => {
        const prevCategories = get().categories;
        const prevItems = get().items;
        const shopId = get().currentTenantId || get().currentUser?.shopId || get().shops[0]?._id;
        // Optimistic update: remove category and any child sub-categories plus their items
        const subCatIds = prevCategories
          .filter(c => String(c.parentCategoryId) === String(categoryId))
          .map(c => String(c._id));
        set(state => ({
          categories: state.categories.filter(c => String(c._id) !== String(categoryId) && String(c.parentCategoryId) !== String(categoryId)),
          items: state.items.filter(i => String(i.categoryId) !== String(categoryId) && !subCatIds.includes(String(i.categoryId))),
          catalogLastFetched: 0,
        }));
        invalidateCache('/catalog');
        try {
          await api.delete(`/catalog/categories/${categoryId}`);
          if (shopId) {
            await get().fetchCatalog(shopId);
          }
        } catch (err) {
          set({ categories: prevCategories, items: prevItems });
          console.error('Failed to delete category', err);
          throw err;
        }
      },

      addCatalogItem: async (categoryId, name, description, price, unit, image, isBucket) => {
        const { categories, currentTenantId, currentUser, shops } = get();
        const cat = categories.find(c => String(c._id) === String(categoryId));
        const shopId = cat ? cat.shopId : (currentTenantId || currentUser?.shopId || shops[0]?._id);
        if (!shopId) throw new Error('No shop context — select a shop branch before adding items.');
        try {
          let finalImage = image;
          if (image && (image.startsWith('data:') || (image as any) instanceof File)) {
            finalImage = await uploadImageToCloudinary(image);
          }
          const res = await api.post('/catalog/items', {
            shopId,
            categoryId,
            name,
            description,
            image: finalImage,
            isBucket: !!isBucket,
            ...(unit === 'KG' ? { pricePerKg: price } : { pricePerItem: price }),
          });
          if (res.data) {
            set(state => ({
              items: state.items.some(i => String(i._id) === String(res.data._id)) ? state.items : [...state.items, res.data],
              catalogLastFetched: 0,
            }));
            invalidateCache('/catalog');
            if (shopId) {
              await get().fetchCatalog(shopId);
            }
          }
          return res.data;
        } catch (err) {
          console.error('Failed to add item', err);
          throw err;
        }
      },

      updateCatalogItem: async (itemId, updates) => {
        const prevItems = get().items;
        const shopId = get().currentTenantId || get().currentUser?.shopId || get().shops[0]?._id;
        try {
          let finalUpdates = { ...updates };
          if (finalUpdates.image && (finalUpdates.image.startsWith('data:') || (finalUpdates.image as any) instanceof File)) {
            finalUpdates.image = await uploadImageToCloudinary(finalUpdates.image);
          }
          // Optimistic update
          set(state => ({
            items: state.items.map(item => String(item._id) === String(itemId) ? { ...item, ...finalUpdates } : item),
            catalogLastFetched: 0,
          }));
          const res = await api.patch(`/catalog/items/${itemId}`, finalUpdates);
          if (res.data) {
            set(state => ({
              items: state.items.map(item => String(item._id) === String(itemId) ? res.data : item),
            }));
            invalidateCache('/catalog');
            if (shopId) {
              await get().fetchCatalog(shopId);
            }
          }
          return res.data;
        } catch (err) {
          set({ items: prevItems });
          console.error('Failed to update item', err);
          throw err;
        }
      },

      updateCatalogItemPrice: async (itemId, price, unit) => {
        const updates: Record<string, number | undefined> = {
          pricePerKg: unit === 'KG' ? price : undefined,
          pricePerItem: unit === 'ITEM' ? price : undefined,
        };
        const shopId = get().currentTenantId || get().currentUser?.shopId || get().shops[0]?._id;
        set(state => ({
          items: state.items.map(item =>
            String(item._id) === String(itemId)
              ? { ...item, pricePerKg: updates.pricePerKg as any, pricePerItem: updates.pricePerItem as any }
              : item
          ),
          catalogLastFetched: 0,
        }));
        try {
          await api.patch(`/catalog/items/${itemId}`, updates);
          if (shopId) {
            await get().fetchCatalog(shopId);
          }
        } catch (err) {
          console.error('Failed to update price', err);
        }
      },

      deleteCatalogItem: async (itemId) => {
        const prevItems = get().items;
        const shopId = get().currentTenantId || get().currentUser?.shopId || get().shops[0]?._id;
        set(state => ({
          items: state.items.filter(item => String(item._id) !== String(itemId)),
          catalogLastFetched: 0,
        }));
        invalidateCache('/catalog');
        try {
          await api.delete(`/catalog/items/${itemId}`);
          if (shopId) {
            await get().fetchCatalog(shopId);
          }
        } catch (err) {
          set({ items: prevItems });
          console.error('Failed to delete item', err);
          throw err;
        }
      },

      // addOffer — now persists to backend
      addOffer: async (offerData) => {
        const { currentTenantId } = get();
        try {
          invalidateCache('/catalog/offers');
          await api.post('/catalog/offers', {
            shopId: currentTenantId,
            ...offerData,
          });
        } catch (err: any) {
          console.error('Failed to add offer:', err);
          throw err;
        }
      },

      addBranch: async (branchName) => {
        const { shops, currentTenantId } = get();
        const shop = shops.find(s => s._id === currentTenantId);
        if (!shop) return;
        try {
          const updatedBranches = [...shop.branches, branchName];
          const res = await api.patch(`/catalog/shops/${currentTenantId}`, { branches: updatedBranches });
          // Surgical update — no full initializeAppData
          set(state => ({
            shops: state.shops.map(s => s._id === currentTenantId ? res.data : s),
          }));
        } catch (err: any) {
          console.error('Failed to add branch:', err);
          throw err;
        }
      },

      removeBranch: async (branchName) => {
        const { shops, currentTenantId } = get();
        const shop = shops.find(s => s._id === currentTenantId);
        if (!shop) return;
        try {
          const updatedBranches = shop.branches.filter(b => b !== branchName);
          const res = await api.patch(`/catalog/shops/${currentTenantId}`, { branches: updatedBranches });
          set(state => ({
            shops: state.shops.map(s => s._id === currentTenantId ? res.data : s),
          }));
        } catch (err: any) {
          console.error('Failed to remove branch:', err);
          throw err;
        }
      },

      // ── Delivery Actions ─────────────────────────────────────────────────────
      verifyOrderItems: async (orderId, itemsCount) => {
        try {
          const order = get().orders.find(o => o._id === orderId);
          if (!order) return;
          const updatedItems = order.items.map(it => {
            const qty = (it.itemId && itemsCount[it.itemId] !== undefined)
              ? itemsCount[it.itemId]
              : ((it as any)._id && itemsCount[(it as any)._id] !== undefined)
              ? itemsCount[(it as any)._id]
              : it.quantity;
            return {
              ...it,
              quantity: Math.max(0, Number(qty ?? 0)),
            };
          });
          const res = await api.patch(`/orders/${orderId}/verify`, { items: updatedItems });
          if (res.data) {
            set(state => ({
              orders: state.orders.map(o => o._id === orderId ? res.data : o),
            }));
          }
        } catch (err) {
          console.error('Failed to verify items:', err);
        }
      },

      // recordPayment — now persists to backend via dedicated endpoint
      recordPayment: async (orderId, paymentMode) => {
        try {
          const res = await api.patch(`/orders/${orderId}/payment`, { paymentMode });
          set(state => ({
            orders: state.orders.map(o => o._id === orderId ? res.data : o),
          }));
        } catch (err) {
          console.error('Failed to record payment:', err);
        }
      },

      // updateKgWeight — delivery agent submits weights for KG items; backend recalculates total and can mark picked up
      updateKgWeight: async (orderId, items, markPickedUp = false) => {
        try {
          const res = await api.patch(`/orders/${orderId}/kg-weight`, { items, markPickedUp });
          if (res.data) {
            set(state => ({
              orders: state.orders.map(o => o._id === orderId ? res.data : o),
            }));
          }
        } catch (err) {
          console.error('Failed to update KG weights:', err);
          throw err;
        }
      },

      // ── Super Admin Actions ──────────────────────────────────────────────────
      createShop: async (name, branches, upiId, bankName, accountNo, adminEmail) => {
        let newShop!: Shop;
        try {
          const shopRes = await api.post('/catalog/shops', {
            name,
            branches,
            paymentInfo: { upiId, bankName, accountNo, qrValue: `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR` },
          });
          newShop = shopRes.data as Shop;
          // Surgical: add new shop to local state
          set(state => ({ shops: [...state.shops, newShop] }));
        } catch (err: any) {
          console.error('Failed to create shop:', err);
          throw new Error('Failed to create shop: ' + (err.response?.data?.error || err.message));
        }

        try {
          const adminRes = await api.post('/auth/users', {
            name: `${name} Manager`,
            email: adminEmail,
            role: 'ShopAdmin',
            shopId: newShop._id,
            address: branches[0] || 'Main Branch Office',
          });
          // Surgical: add new admin user to local state
          set(state => ({ users: [...state.users, adminRes.data] }));
        } catch (err: any) {
          console.error('Failed to create shop admin:', err);
          throw new Error('Shop created but admin account failed: ' + (err.response?.data?.error || err.message));
        }
      },

      deleteShop: async (shopId) => {
        try {
          await api.delete(`/catalog/shops/${shopId}`);
          // Surgical local update
          set(state => ({
            shops: state.shops.filter(s => s._id !== shopId),
            currentTenantId: state.currentTenantId === shopId ? '' : state.currentTenantId,
          }));
        } catch (err: any) {
          console.error('Failed to delete shop:', err);
          throw err;
        }
      },

      updateShop: async (shopId, data) => {
        try {
          const res = await api.patch(`/catalog/shops/${shopId}`, data);
          // Surgical update
          set(state => ({
            shops: state.shops.map(s => s._id === shopId ? res.data : s),
            shopsLastFetched: Date.now(),
          }));
        } catch (err: any) {
          console.error('Failed to update shop:', err);
          throw err;
        }
      },

      addDeliveryBoy: async (email, targetShopId, name, phone) => {
        const shopId = targetShopId || get().currentTenantId || (get().currentUser?.shopId);
        if (!shopId) {
          throw new Error('Please select a shop branch first.');
        }
        try {
          const derivedName = name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Delivery Staff';
          const res = await api.post('/auth/users', {
            name: derivedName,
            email: email.trim().toLowerCase(),
            phone: phone || undefined,
            role: 'Delivery',
            shopId,
            address: 'Shop Branch',
          });
          // Surgical: add/update user in local state
          set(state => {
            const exists = state.users.some(u => u._id === res.data._id || u.email.toLowerCase() === res.data.email.toLowerCase());
            return {
              users: exists
                ? state.users.map(u => (u._id === res.data._id || u.email.toLowerCase() === res.data.email.toLowerCase()) ? res.data : u)
                : [...state.users, res.data]
            };
          });
          // Background sync
          get().fetchUsers();
          return res.data;
        } catch (err: any) {
          console.error('Failed to add delivery boy:', err);
          throw err;
        }
      },

      updateUser: async (userId, data) => {
        try {
          const res = await api.patch(`/auth/users/${userId}`, data);
          // Surgical update
          set(state => ({
            users: state.users.map(u => u._id === userId ? res.data : u),
          }));
        } catch (err: any) {
          console.error('Failed to update user:', err);
          throw err;
        }
      },

      deleteUser: async (userId) => {
        try {
          await api.delete(`/auth/users/${userId}`);
          // Surgical removal
          set(state => ({ users: state.users.filter(u => u._id !== userId) }));
        } catch (err: any) {
          console.error('Failed to delete user:', err);
          throw err;
        }
      },

      // toggleUserSuspension — now persists isActive flag to backend
      toggleUserSuspension: async (userId) => {
        const user = get().users.find(u => u._id === userId);
        if (!user) return;
        const isActive = !user.isActive;
        try {
          const res = await api.patch(`/auth/users/${userId}`, { isActive });
          set(state => ({
            users: state.users.map(u => u._id === userId ? res.data : u),
          }));
        } catch (err: any) {
          console.error('Failed to toggle user suspension:', err);
          throw err;
        }
      },
    }),
    {
      name: 'wow-laundry-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentRole: state.currentRole,
        currentTenantId: state.currentTenantId,
      }),
    }
  )
);
