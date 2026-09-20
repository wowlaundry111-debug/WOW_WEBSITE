/**
 * Order utility functions for the admin dashboard and order management views.
 */

/**
 * Checks whether an order is an on-branch / counter walk-in order.
 *
 * @param {Object} order - Order document/object
 * @param {Array} users - List of tenant/system users
 * @returns {boolean} True if the order was placed at a branch counter
 */
export const isBranchOrderCheck = (order, users = []) => {
  if (!order) return false;
  if (order.isWalkIn) return true;

  const customer = (users || []).find((u) => u._id === order.customerId);
  const isStaffAccount =
    customer?.role === 'ShopAdmin' ||
    customer?.role === 'SuperAdmin' ||
    customer?.role === 'Operator' ||
    (customer?.email || '').toLowerCase().includes('wowlaundry') ||
    (customer?.name || '').toLowerCase().includes('wow laundry');

  if (isStaffAccount) return true;

  const combinedText = `${order.adminNotes || ''} ${order.customerAddress || ''} ${order.pickupAddress || ''} ${order.deliveryAddress || ''}`.toLowerCase();

  return (
    combinedText.includes('branch') ||
    combinedText.includes('walk-in') ||
    combinedText.includes('in-store') ||
    combinedText.includes('counter') ||
    combinedText.includes('drop-off')
  );
};
