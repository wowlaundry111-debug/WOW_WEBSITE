import React, { useState } from 'react';
import { Edit2, Package, Trash2, Plus, X, Check, Image as ImageIcon, Search, ChevronRight, Layers, Tag } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

// Preset Vector Images from Assets
import bagImg from '../../../assets/bag.png';
import beddingImg from '../../../assets/bedding.png';
import blanketImg from '../../../assets/blanket.png';
import curtainsImg from '../../../assets/curtains.png';
import dryCleanImg from '../../../assets/dryClean.png';
import easyWashImg from '../../../assets/easyWash.png';
import leatherImg from '../../../assets/leather.png';
import normalImg from '../../../assets/normal.png';
import rugsImg from '../../../assets/rugs.png';
import shoesImg from '../../../assets/shoes.png';
import suitsImg from '../../../assets/suits.png';
import weddingDressImg from '../../../assets/wedding_dress.png';

import { CLOUDINARY_VECTOR_MAP, resolveVectorImage } from '../../../utils/vectorGallery';

export const PRESET_VECTOR_IMAGES = [
  { id: 'tshirt', label: 'T-Shirt', src: 'https://res.cloudinary.com/ddzre9tcd/image/upload/v1787838054/wow_laundry_vectors/v3_tshirt.png' },
  { id: 'jeans', label: 'Denim Jeans', src: 'https://res.cloudinary.com/ddzre9tcd/image/upload/v1787838056/wow_laundry_vectors/v3_jeans.png' },
  { id: 'formal_shirt', label: 'Formal Shirt', src: 'https://res.cloudinary.com/ddzre9tcd/image/upload/v1787838060/wow_laundry_vectors/v3_formal_shirt.png' },
  { id: 'easyWash', label: 'Wash & Fold', src: CLOUDINARY_VECTOR_MAP.easyWash || easyWashImg },
  { id: 'normal', label: 'Everyday Wear', src: CLOUDINARY_VECTOR_MAP.normal || normalImg },
  { id: 'suits', label: 'Suits & Blazers', src: CLOUDINARY_VECTOR_MAP.suits || suitsImg },
  { id: 'wedding_dress', label: 'Wedding Dress', src: CLOUDINARY_VECTOR_MAP.wedding_dress || weddingDressImg },
  { id: 'dryClean', label: 'Dry Clean', src: CLOUDINARY_VECTOR_MAP.dryClean || dryCleanImg },
  { id: 'leather', label: 'Leather Wear', src: CLOUDINARY_VECTOR_MAP.leather || leatherImg },
  { id: 'curtains', label: 'Curtains & Drapes', src: CLOUDINARY_VECTOR_MAP.curtains || curtainsImg },
  { id: 'bedding', label: 'Bedding & Linen', src: CLOUDINARY_VECTOR_MAP.bedding || beddingImg },
  { id: 'rugs', label: 'Rugs & Carpets', src: CLOUDINARY_VECTOR_MAP.rugs || rugsImg },
  { id: 'blanket', label: 'Blankets', src: CLOUDINARY_VECTOR_MAP.blanket || blanketImg },
  { id: 'shoes', label: 'Shoes', src: CLOUDINARY_VECTOR_MAP.shoes || shoesImg },
  { id: 'bag', label: 'Bags', src: CLOUDINARY_VECTOR_MAP.bag || bagImg },
];

export default function CatalogManager({ categories = [], items = [], shops = [], currentTenantId = '', setCurrentTenantId, isSuperAdmin = false }) {
  const { 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addCatalogItem, 
    updateCatalogItem, 
    deleteCatalogItem,
    fetchCatalog
  } = useAppStore();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Category Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');

  // Item Modal State
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemUnit, setItemUnit] = useState('KG');
  const [itemCatId, setItemCatId] = useState('');
  const [itemImage, setItemImage] = useState('');

  // Open Category Add Modal
  const openAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatImage(PRESET_VECTOR_IMAGES[0].src);
    setErrorMsg('');
    setCatModalOpen(true);
  };

  // Open Category Edit Modal
  const openEditCategory = (cat, e) => {
    e?.stopPropagation();
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatImage(cat.image || PRESET_VECTOR_IMAGES[0].src);
    setErrorMsg('');
    setCatModalOpen(true);
  };

  // Handle Category Save
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, { name: catName.trim(), image: catImage });
      } else {
        await addCategory(catName.trim(), catImage);
      }
      setCatModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Category Delete
  const handleDeleteCategory = async (cat, e) => {
    e?.stopPropagation();
    const count = items.filter(i => i.categoryId === cat._id).length;
    const confirmMsg = count > 0 
      ? `Delete "${cat.name}"? This will also remove ${count} service item(s) in this category.`
      : `Are you sure you want to delete "${cat.name}"?`;
    
    if (window.confirm(confirmMsg)) {
      setLoading(true);
      try {
        await deleteCategory(cat._id);
        if (selectedCategoryId === cat._id) setSelectedCategoryId(null);
      } catch (err) {
        alert(err.message || 'Failed to delete category.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Open Item Add Modal
  const openAddItem = () => {
    setEditingItem(null);
    setItemName('');
    setItemDesc('');
    setItemPrice('');
    setItemUnit('KG');
    setItemCatId(selectedCategoryId || (categories[0]?._id || ''));
    setItemImage(PRESET_VECTOR_IMAGES[0].src);
    setErrorMsg('');
    setItemModalOpen(true);
  };

  // Open Item Edit Modal
  const openEditItem = (item, e) => {
    e?.stopPropagation();
    setEditingItem(item);
    setItemName(item.name);
    setItemDesc(item.description || '');
    setItemPrice(String(item.pricePerKg || item.pricePerItem || ''));
    setItemUnit(item.pricePerKg !== undefined ? 'KG' : 'ITEM');
    setItemCatId(item.categoryId || (categories[0]?._id || ''));
    setItemImage(item.image || PRESET_VECTOR_IMAGES[0].src);
    setErrorMsg('');
    setItemModalOpen(true);
  };

  // Handle Item Save
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice || isNaN(Number(itemPrice))) {
      setErrorMsg('Valid item name and price are required.');
      return;
    }
    const targetCatId = itemCatId || selectedCategoryId || categories[0]?._id;
    if (!targetCatId) {
      setErrorMsg('Please select or create a category first.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const priceNum = parseFloat(itemPrice);
    try {
      if (editingItem) {
        await updateCatalogItem(editingItem._id, {
          name: itemName.trim(),
          description: itemDesc.trim(),
          image: itemImage,
          categoryId: targetCatId,
          pricePerKg: itemUnit === 'KG' ? priceNum : undefined,
          pricePerItem: itemUnit === 'ITEM' ? priceNum : undefined,
        });
      } else {
        await addCatalogItem(targetCatId, itemName.trim(), itemDesc.trim(), priceNum, itemUnit, itemImage);
      }
      setItemModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save item.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Item Delete
  const handleDeleteItem = async (item, e) => {
    e?.stopPropagation();
    if (window.confirm(`Are you sure you want to delete service "${item.name}"?`)) {
      setLoading(true);
      try {
        await deleteCatalogItem(item._id);
      } catch (err) {
        alert(err.message || 'Failed to delete item.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filtered Items
  const filteredItems = items.filter(item => {
    const matchesCat = !selectedCategoryId || item.categoryId === selectedCategoryId;
    const matchesSearch = !searchQuery || 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
            <Layers className="text-[#0D8DE3]" /> Catalog Management
          </h2>
          <p className="font-bold text-gray-600 text-sm mt-1">
            Organize laundry categories, configure prices per Kg/Item, and assign vector icons.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={openAddCategory}
            className="bg-[#B0FF49] text-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] px-4 py-2 font-black uppercase text-xs sm:text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
          >
            <Plus size={16} /> Add Category
          </button>
          <button
            onClick={openAddItem}
            className="bg-[#0D8DE3] text-white border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] px-4 py-2 font-black uppercase text-xs sm:text-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
          >
            <Plus size={16} /> New Service Item
          </button>
        </div>
      </div>

      {/* SuperAdmin Branch Switcher */}
      {isSuperAdmin && shops.length > 0 && (
        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <span className="block font-black text-xs uppercase text-gray-500 mb-2">
            Select Laundry Branch to Manage Menu:
          </span>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {shops.map(s => {
              const isActive = (currentTenantId || shops[0]?._id) === s._id;
              return (
                <button
                  key={s._id}
                  onClick={() => {
                    if (setCurrentTenantId) setCurrentTenantId(s._id);
                    fetchCatalog(s._id);
                  }}
                  className={`px-4 py-2 border-2 border-black font-black uppercase text-xs whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-[#0D8DE3] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Categories on Left, Items on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex justify-between items-center bg-[#B0FF49] border-4 border-black p-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <span className="font-black uppercase text-sm">Categories ({categories.length})</span>
            <button 
              onClick={openAddCategory}
              className="p-1 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
              title="Add Category"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {/* "All Items" Filter Button */}
            <div 
              onClick={() => setSelectedCategoryId(null)}
              className={`p-3 border-2 border-black font-black uppercase text-sm flex items-center justify-between cursor-pointer transition-all ${
                selectedCategoryId === null 
                  ? 'bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                  : 'bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Tag size={16} /> All Services
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black border ${
                selectedCategoryId === null ? 'bg-[#B0FF49] text-black border-black' : 'bg-gray-100 text-black border-black'
              }`}>
                {items.length}
              </span>
            </div>

            {/* Category Cards */}
            {categories.map(cat => {
              const catItemCount = items.filter(i => i.categoryId === cat._id).length;
              const isSelected = selectedCategoryId === cat._id;
              return (
                <div 
                  key={cat._id}
                  onClick={() => setSelectedCategoryId(cat._id)}
                  className={`p-3 border-2 border-black flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#0D8DE3] text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                      : 'bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-9 h-9 bg-white border-2 border-black flex shrink-0 items-center justify-center p-1 rounded overflow-hidden">
                      <img 
                        src={resolveVectorImage(cat.image, cat.name)} 
                        alt={cat.name} 
                        className="w-full h-full object-contain" 
                        onError={(e) => { e.currentTarget.src = resolveVectorImage('', cat.name); }} 
                      />
                    </div>
                    <div className="truncate">
                      <p className="font-black text-sm uppercase truncate">{cat.name}</p>
                      <p className={`text-[11px] font-bold ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                        {catItemCount} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={(e) => openEditCategory(cat, e)}
                      className={`p-1.5 border border-black rounded transition-colors ${
                        isSelected ? 'bg-white text-black hover:bg-[#B0FF49]' : 'bg-gray-100 hover:bg-[#B0FF49]'
                      }`}
                      title="Edit Category"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteCategory(cat, e)}
                      className="p-1.5 bg-red-100 hover:bg-red-500 hover:text-white text-red-700 border border-black rounded transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {categories.length === 0 && (
              <div className="bg-white border-2 border-dashed border-black p-6 text-center">
                <p className="font-bold text-gray-500 text-sm">No categories yet.</p>
                <button
                  onClick={openAddCategory}
                  className="mt-3 bg-[#B0FF49] border-2 border-black px-3 py-1 font-black uppercase text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  + Add First
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Service Items Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-3 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search services by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border-2 border-black font-bold text-sm outline-none focus:bg-yellow-50"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-black uppercase">
              <span>Showing: {filteredItems.length} items</span>
              <button
                onClick={openAddItem}
                className="bg-[#0D8DE3] text-white border-2 border-black px-3 py-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] transition-all flex items-center gap-1"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => {
                const parentCat = categories.find(c => c._id === item.categoryId);
                const price = item.pricePerKg !== undefined ? item.pricePerKg : item.pricePerItem;
                const unitLabel = item.pricePerKg !== undefined ? '/kg' : '/item';

                return (
                  <div 
                    key={item._id}
                    className="bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-4 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <div className="flex gap-3.5 items-start">
                      <div className="w-16 h-16 bg-gray-50 border-2 border-black flex shrink-0 items-center justify-center p-2 rounded-lg overflow-hidden">
                        <img 
                          src={resolveVectorImage(item.image, item.name)} 
                          alt={item.name} 
                          className="w-full h-full object-contain" 
                          onError={(e) => { e.currentTarget.src = resolveVectorImage('', item.name); }} 
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#B0FF49] border border-black px-2 py-0.5 text-[10px] font-black uppercase rounded">
                            {parentCat?.name || 'Service'}
                          </span>
                        </div>
                        <h4 className="font-black text-base uppercase mt-1 truncate">{item.name}</h4>
                        {item.description && (
                          <p className="text-xs font-bold text-gray-500 line-clamp-2 mt-0.5">{item.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t-2 border-dashed border-black flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-gray-500 uppercase">Price: </span>
                        <span className="text-lg font-black text-[#0D8DE3]">₹{price}</span>
                        <span className="text-xs font-bold text-gray-600 uppercase"> {unitLabel}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => openEditItem(item, e)}
                          className="px-3 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] font-black text-xs uppercase hover:bg-[#B0FF49] transition-all flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(item, e)}
                          className="px-2.5 py-1.5 bg-red-100 hover:bg-red-500 hover:text-white text-red-700 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] font-black text-xs transition-all"
                          title="Delete Service"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border-4 border-black p-12 text-center shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <Package size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="font-black text-lg uppercase">No Services Found</h3>
              <p className="font-bold text-gray-500 text-sm mt-1">
                {searchQuery ? 'Try changing your search keyword.' : 'Add your first laundry item or service.'}
              </p>
              <button
                onClick={openAddItem}
                className="mt-4 bg-[#0D8DE3] text-white border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] px-6 py-2.5 font-black uppercase text-sm hover:translate-y-[1px] transition-all inline-flex items-center gap-2"
              >
                <Plus size={16} /> Create Service Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── CATEGORY MODAL (Add / Edit) ─────────────────────────── */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-[#B0FF49]">
              <h3 className="font-black text-lg uppercase flex items-center gap-2">
                <Layers size={18} /> {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button 
                onClick={() => setCatModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white rounded border-2 border-transparent hover:border-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block font-black text-xs uppercase mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Premium Dry Clean, Wash & Fold"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full p-3 border-2 border-black font-bold text-sm outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
              </div>

              {/* Vector Image Selector */}
              <div>
                <label className="block font-black text-xs uppercase mb-2">Select Vector Illustration Icon</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-2.5 border-2 border-black bg-gray-50">
                  {PRESET_VECTOR_IMAGES.map(img => {
                    const isPicked = catImage === img.src || catImage === img.id || (catImage && img.id && catImage.includes(img.id));
                    return (
                      <button
                        type="button"
                        key={img.id}
                        onClick={() => setCatImage(img.id)}
                        className={`p-2 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                          isPicked 
                            ? 'bg-[#B0FF49] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] -translate-y-0.5 font-black text-black' 
                            : 'bg-white border-gray-300 hover:border-black hover:bg-gray-100 text-black'
                        }`}
                      >
                        <img src={img.src} alt={img.label} className="w-12 h-12 object-contain" />
                        <span className="text-[10px] font-black uppercase mt-1.5 text-center truncate w-full">{img.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">Image URL / Custom Link</label>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/... or vector_key"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full p-2.5 border-2 border-black font-bold text-xs outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="flex-1 bg-gray-100 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-xs hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#B0FF49] text-black border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-xs hover:translate-y-[1px] transition-all flex justify-center items-center gap-1.5"
                >
                  {loading ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ITEM MODAL (Add / Edit) ─────────────────────────────── */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-[#0D8DE3] text-white">
              <h3 className="font-black text-lg uppercase flex items-center gap-2">
                <Package size={18} /> {editingItem ? 'Edit Service Item' : 'New Service Item'}
              </h3>
              <button 
                onClick={() => setItemModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white rounded border-2 border-transparent hover:border-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block font-black text-xs uppercase mb-1">Target Category *</label>
                <select
                  value={itemCatId}
                  onChange={(e) => setItemCatId(e.target.value)}
                  className="w-full p-2.5 border-2 border-black font-bold text-sm bg-white outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">Service / Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Silk Saree Dry Clean, Jeans Wash & Iron"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2.5 border-2 border-black font-bold text-sm outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Steam ironed and hanger packed"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full p-2.5 border-2 border-black font-bold text-sm outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-xs uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="99"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full p-2.5 border-2 border-black font-bold text-sm outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div>
                  <label className="block font-black text-xs uppercase mb-1">Unit Type *</label>
                  <select
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className="w-full p-2.5 border-2 border-black font-bold text-sm bg-white outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  >
                    <option value="KG">Per KG (₹/kg)</option>
                    <option value="ITEM">Per Item (₹/pc)</option>
                  </select>
                </div>
              </div>

              {/* Vector Image Selector */}
              <div>
                <label className="block font-black text-xs uppercase mb-1.5">Choose Vector Illustration Icon</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-2.5 border-2 border-black bg-gray-50">
                  {PRESET_VECTOR_IMAGES.map(img => {
                    const isPicked = itemImage === img.src || itemImage === img.id || (itemImage && img.id && itemImage.includes(img.id));
                    return (
                      <button
                        type="button"
                        key={img.id}
                        onClick={() => setItemImage(img.id)}
                        className={`p-2 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                          isPicked 
                            ? 'bg-[#0D8DE3] text-white border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] -translate-y-0.5 font-black' 
                            : 'bg-white border-gray-300 hover:border-black hover:bg-gray-100 text-black'
                        }`}
                      >
                        <img src={img.src} alt={img.label} className="w-12 h-12 object-contain" />
                        <span className="text-[10px] font-black uppercase mt-1.5 text-center truncate w-full">{img.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-black text-xs uppercase mb-1">Image URL / Custom Cloudinary Link</label>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/... or vector_key"
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  className="w-full p-2.5 border-2 border-black font-bold text-xs outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="flex-1 bg-gray-100 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-xs hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0D8DE3] text-white border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] py-3 font-black uppercase text-xs hover:translate-y-[1px] transition-all flex justify-center items-center gap-1.5"
                >
                  {loading ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
