/**
 * Helpers to identify and sort LPU branches first across the application.
 */

export const isLpuBranch = (shop) => {
  if (!shop) return false;
  const nameMatch = Boolean(shop.name && /lpu/i.test(shop.name));
  const idMatch = Boolean(shop._id && (/lpu/i.test(shop._id) || shop._id === 'shop_lawgate'));
  const branchMatch = Array.isArray(shop.branches) && shop.branches.some((b) => /lpu/i.test(b));
  const addressMatch = Boolean(shop.address && /lpu/i.test(shop.address));
  return nameMatch || idMatch || branchMatch || addressMatch;
};

export const sortShopsWithLpuFirst = (shops = []) => {
  if (!Array.isArray(shops)) return [];
  return [...shops].sort((a, b) => {
    const aIsLpu = isLpuBranch(a);
    const bIsLpu = isLpuBranch(b);
    if (aIsLpu && !bIsLpu) return -1;
    if (!aIsLpu && bIsLpu) return 1;
    return 0;
  });
};

export const sortBranchesWithLpuFirst = (branches = []) => {
  if (!Array.isArray(branches)) return [];
  return [...branches].sort((a, b) => {
    const aIsLpu = /lpu/i.test(a);
    const bIsLpu = /lpu/i.test(b);
    if (aIsLpu && !bIsLpu) return -1;
    if (!aIsLpu && bIsLpu) return 1;
    return 0;
  });
};
