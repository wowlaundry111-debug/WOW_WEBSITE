import { useEffect } from 'react';
import { socket, connectSocket, disconnectSocket } from '../services/socket';
import { useAppStore } from '../store/useAppStore';
import { useNotificationStore } from '../store/useNotificationStore';

export default function SocketManager() {
  const currentUser = useAppStore((state) => state.currentUser);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (currentUser) {
      connectSocket();

      // ── Order Events ─────────────────────────────────────────────────────────────
      const onOrderCreated = (order) => {
        if (
          currentUser.role === 'SuperAdmin' ||
          (currentUser.role === 'ShopAdmin' && currentUser.shopId === order.shopId) ||
          (currentUser.role === 'Customer' && currentUser._id === order.customerId)
        ) {
          useAppStore.setState((state) => ({
            orders: state.orders.some((o) => o._id === order._id) ? state.orders : [order, ...state.orders]
          }));
          if (currentUser.role !== 'Customer') {
            addNotification('info', 'New Order', `Order placed by ${order.customerName || 'Customer'}`);
          }
        }
      };

      const onOrderUpdated = (order) => {
        if (
          currentUser.role === 'SuperAdmin' ||
          (currentUser.role === 'ShopAdmin' && currentUser.shopId === order.shopId) ||
          (currentUser.role === 'Customer' && currentUser._id === order.customerId) ||
          (currentUser.role === 'Delivery' && currentUser._id === order.deliveryBoyId)
        ) {
          useAppStore.setState((state) => ({
            orders: state.orders.map((o) => (o._id === order._id ? order : o))
          }));

          if (currentUser.role === 'Customer') {
            addNotification('success', 'Order Update', `Order is now: ${order.status.replace(/_/g, ' ')}`);
          }
        }
      };

      // ── Shop Events ──────────────────────────────────────────────────────────────
      const onShopCreated = (shop) => {
        useAppStore.setState((state) => ({
          shops: state.shops.some((s) => s._id === shop._id) ? state.shops : [...state.shops, shop]
        }));
      };

      const onShopUpdated = (shop) => {
        useAppStore.setState((state) => ({
          shops: state.shops.map((s) => (s._id === shop._id ? shop : s))
        }));
      };

      const onShopDeleted = ({ shopId }) => {
        useAppStore.setState((state) => ({
          shops: state.shops.filter((s) => s._id !== shopId)
        }));
      };

      // ── Category Events ──────────────────────────────────────────────────────────
      const onCategoryCreated = (category) => {
        useAppStore.setState((state) => ({
          categories: state.categories.some((c) => c._id === category._id) ? state.categories : [...state.categories, category]
        }));
      };

      const onCategoryUpdated = (category) => {
        useAppStore.setState((state) => ({
          categories: state.categories.map((c) => (c._id === category._id ? category : c))
        }));
      };

      const onCategoryDeleted = ({ categoryId }) => {
        useAppStore.setState((state) => ({
          categories: state.categories.filter((c) => c._id !== categoryId)
        }));
      };

      // ── Item Events ──────────────────────────────────────────────────────────────
      const onItemCreated = (item) => {
        useAppStore.setState((state) => ({
          items: state.items.some((i) => i._id === item._id) ? state.items : [...state.items, item]
        }));
      };

      const onItemUpdated = (item) => {
        useAppStore.setState((state) => ({
          items: state.items.map((i) => (i._id === item._id ? item : i))
        }));
      };

      const onItemDeleted = ({ itemId }) => {
        useAppStore.setState((state) => ({
          items: state.items.filter((i) => i._id !== itemId)
        }));
      };

      // ── Offer Events ─────────────────────────────────────────────────────────────
      const onOfferCreated = (offer) => {
        useAppStore.setState((state) => ({
          offers: state.offers.some((o) => o._id === offer._id) ? state.offers : [...state.offers, offer]
        }));
      };

      const onOfferUpdated = (offer) => {
        useAppStore.setState((state) => ({
          offers: state.offers.map((o) => (o._id === offer._id ? offer : o))
        }));
      };

      const onOfferDeleted = ({ offerId }) => {
        useAppStore.setState((state) => ({
          offers: state.offers.filter((o) => o._id !== offerId)
        }));
      };

      // ── User Events ──────────────────────────────────────────────────────────────
      const onUserCreated = (user) => {
        useAppStore.setState((state) => ({
          users: state.users.some((u) => u._id === user._id) ? state.users : [...state.users, user]
        }));
      };

      const onUserUpdated = (user) => {
        useAppStore.setState((state) => ({
          users: state.users.map((u) => (u._id === user._id ? user : u))
        }));
      };

      const onUserDeleted = ({ userId }) => {
        useAppStore.setState((state) => ({
          users: state.users.filter((u) => u._id !== userId)
        }));
      };

      // Register listeners
      socket.on('order_created', onOrderCreated);
      socket.on('order_updated', onOrderUpdated);
      socket.on('shop_created', onShopCreated);
      socket.on('shop_updated', onShopUpdated);
      socket.on('shop_deleted', onShopDeleted);
      socket.on('category_created', onCategoryCreated);
      socket.on('category_updated', onCategoryUpdated);
      socket.on('category_deleted', onCategoryDeleted);
      socket.on('item_created', onItemCreated);
      socket.on('item_updated', onItemUpdated);
      socket.on('item_deleted', onItemDeleted);
      socket.on('offer_created', onOfferCreated);
      socket.on('offer_updated', onOfferUpdated);
      socket.on('offer_deleted', onOfferDeleted);
      socket.on('user_created', onUserCreated);
      socket.on('user_updated', onUserUpdated);
      socket.on('user_deleted', onUserDeleted);

      return () => {
        socket.off('order_created', onOrderCreated);
        socket.off('order_updated', onOrderUpdated);
        socket.off('shop_created', onShopCreated);
        socket.off('shop_updated', onShopUpdated);
        socket.off('shop_deleted', onShopDeleted);
        socket.off('category_created', onCategoryCreated);
        socket.off('category_updated', onCategoryUpdated);
        socket.off('category_deleted', onCategoryDeleted);
        socket.off('item_created', onItemCreated);
        socket.off('item_updated', onItemUpdated);
        socket.off('item_deleted', onItemDeleted);
        socket.off('offer_created', onOfferCreated);
        socket.off('offer_updated', onOfferUpdated);
        socket.off('offer_deleted', onOfferDeleted);
        socket.off('user_created', onUserCreated);
        socket.off('user_updated', onUserUpdated);
        socket.off('user_deleted', onUserDeleted);
      };
    } else {
      disconnectSocket();
    }
  }, [currentUser, addNotification]);

  return null;
}
