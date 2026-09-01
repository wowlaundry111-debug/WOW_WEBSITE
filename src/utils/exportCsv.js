/**
 * WOW Laundry - Excel / CSV Report Exporter
 * Formats orders with rich columns and triggers immediate browser download.
 */

export const generateCsvString = (orders = [], users = [], shops = []) => {
  const headers = [
    'Order ID',
    'Date',
    'Time',
    'Branch / Shop',
    'Customer Name',
    'Customer Phone',
    'Status',
    'Payment Status',
    'Payment Mode',
    'Total Amount (INR)',
    'Delivery Fee',
    'Discount Amount',
    'Items Summary',
    'Pickup Address',
    'Delivery Address',
    'Assigned Delivery Agent',
    'Admin Notes'
  ];

  const rows = orders.map(order => {
    const d = order.createdAt ? new Date(order.createdAt) : new Date();
    const dateStr = d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const customer = users.find(u => u._id === order.customerId);
    const customerName = customer?.name || order.customerName || 'Unknown';
    const customerPhone = customer?.phone || order.customerPhone || 'N/A';

    const shop = shops.find(s => s._id === order.shopId);
    const shopName = shop?.name || order.shopId || 'Main Branch';

    const itemsSummary = (order.items || [])
      .map(i => `${i.name} (x${i.quantity})`)
      .join('; ');

    const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

    return [
      order._id || 'N/A',
      dateStr,
      timeStr,
      escapeCsv(shopName),
      escapeCsv(customerName),
      escapeCsv(customerPhone),
      order.status || 'PLACED',
      order.paymentStatus || 'PENDING',
      order.paymentMode || 'N/A',
      (order.totalAmount || 0).toString(),
      (order.deliveryFee || 0).toString(),
      (order.discountAmount || 0).toString(),
      escapeCsv(itemsSummary),
      escapeCsv(order.pickupAddress || ''),
      escapeCsv(order.deliveryAddress || ''),
      escapeCsv(order.deliveryBoyName || 'Unassigned'),
      escapeCsv(order.adminNotes || '')
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
};

export const downloadOrdersReport = ({ orders = [], timeframe = 'All Time', users = [], shops = [] }) => {
  try {
    const csvContent = generateCsvString(orders, users, shops);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const sanitizedTimeframe = timeframe.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `WOW_Laundry_Report_${sanitizedTimeframe}_${new Date().toISOString().slice(0, 10)}.csv`;

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to export Excel/CSV report:', err);
    alert('Failed to generate report.');
    return false;
  }
};
