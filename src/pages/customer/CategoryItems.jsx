import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Minus, ArrowLeft, ChevronDown, Inbox } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { resolveVectorImage, getVectorUrlByName } from '../../utils/vectorGallery';

import imgNormal from '../../assets/normal.png';
import imgDryClean from '../../assets/dryClean.png';
import imgEasyWash from '../../assets/easyWash.png';
import imgBedding from '../../assets/bedding.png';

import imgLeather from '../../assets/leather.png';
import imgSuits from '../../assets/suits.png';

const getCategoryStyle = (name) => {
  if (!name) return { img: imgNormal, bg: 'bg-white', color: 'text-black', badge: 'Care+' };
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('formal') || lowerName.includes('interview') || lowerName.includes('suit')) {
    return { img: imgSuits, bg: 'bg-white', color: 'text-black', badge: 'Eco Safe' };
  }
  if (lowerName.includes('bedding') || lowerName.includes('bedsheet') || lowerName.includes('curtain') || lowerName.includes('home') || lowerName.includes('linen')) {
    return { img: imgBedding, bg: 'bg-white', color: 'text-black', badge: 'Express' };
  }
  if (lowerName.includes('winter') || lowerName.includes('coat') || lowerName.includes('leather') || lowerName.includes('jacket')) {
    return { img: imgLeather, bg: 'bg-white', color: 'text-black', badge: 'Save ₹99' };
  }
  if (lowerName.includes('dryclean') || lowerName.includes('premium')) {
    return { img: imgDryClean, bg: 'bg-white', color: 'text-black', badge: 'Sanitized' };
  }
  if (lowerName.includes('everyday') || lowerName.includes('normal') || lowerName.includes('men') || lowerName.includes('women') || lowerName.includes('student') || lowerName.includes('wash') || lowerName.includes('daily')) {
    return { img: imgEasyWash, bg: 'bg-white', color: 'text-black', badge: '50% OFF' };
  }
  
  return { img: imgNormal, bg: 'bg-white', color: 'text-black', badge: 'Care+' };
};


import bucketImg from '../../assets/final-bucket-cropped.png';

export default function CategoryItems() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { items, categories, cart, addToCart, fetchCatalog, isCatalogLoading } = useAppStore();

  React.useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const category = categories.find(c => String(c._id) === String(categoryId));
  const parentCategory = category?.parentCategoryId ? categories.find(c => String(c._id) === String(category.parentCategoryId)) : null;
  const subCategories = (category?.subCategories && category.subCategories.length > 0)
    ? category.subCategories
    : categories.filter(c => String(c.parentCategoryId) === String(categoryId));

  const [selectedSubCatId, setSelectedSubCatId] = React.useState('ALL');

  React.useEffect(() => {
    setSelectedSubCatId('ALL');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [categoryId]);

  const getQuantity = (itemId) => {
    return cart.find(c => c.itemId === itemId)?.quantity || 0;
  };

  const handleAddToCart = (item, diff) => {
    addToCart(item, diff);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const catStyle = category ? getCategoryStyle(category.name) : null;

  if (!category) {
    if (isCatalogLoading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center font-outfit">
          <p className="text-xl font-black uppercase text-black animate-pulse">Loading catalog...</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-outfit">
        <div className="text-black font-black flex flex-col items-center">
          <p className="text-2xl uppercase">Category not found.</p>
          <button onClick={() => navigate('/order')} className="mt-6 px-6 py-3 bg-[#9AE600] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">Go Back</button>
        </div>
      </div>
    );
  }

  const subCategoryIds = subCategories.map(s => String(s._id));
  const activeSubCategory = subCategories.find(s => String(s._id) === String(selectedSubCatId));

  const categoryItems = items.filter(i => {
    if (selectedSubCatId === 'ALL') {
      return String(i.categoryId) === String(categoryId) || subCategoryIds.includes(String(i.categoryId));
    }
    return String(i.categoryId) === String(selectedSubCatId);
  });

  return (
    <div className="min-h-screen bg-white pb-32 font-outfit selection:bg-black selection:text-white">
      <Navbar />
      
      {/* Header Sticky (Neo-brutalist) */}
      <div className={`sticky top-0 z-40 ${catStyle.bg} border-b-2 border-black transition-colors`}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-6 relative overflow-hidden">
          {/* Faint watermark of category image in background */}
          <img src={catStyle.img} alt="" className="absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-32 opacity-20 object-contain pointer-events-none" />
          
          <button 
            onClick={() => {
              if (selectedSubCatId !== 'ALL' && subCategories.length > 0) {
                setSelectedSubCatId('ALL');
              } else {
                navigate('/order');
              }
            }}
            className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none relative z-10"
            title="Go Back"
          >
            <ArrowLeft size={24} strokeWidth={4} />
          </button>
          <div className="relative z-10">
            {parentCategory && (
              <div className="flex items-center gap-1 text-xs font-black uppercase text-gray-700 mb-0.5">
                <Link to={`/order/${parentCategory._id}`} className="hover:underline">{parentCategory.name}</Link>
                <span>›</span>
              </div>
            )}
            <h1 className={`text-2xl sm:text-3xl font-black ${catStyle.color} lilita-one-regular tracking-wide uppercase`}>{category.name}</h1>
            <p className="text-xs font-black text-black bg-white inline-block px-2.5 py-1 mt-1 border-2 border-black rounded-md tracking-widest uppercase">
              {subCategories.length > 0 && selectedSubCatId === 'ALL'
                ? `${subCategories.length} ${subCategories.length === 1 ? 'WASH PREFERENCE' : 'WASH PREFERENCES'}`
                : `${categoryItems.length} ${categoryItems.length === 1 ? 'ITEM' : 'ITEMS'}`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* If this category has subcategories and ALL is active, display the sub-categories as Category Cards */}
        {subCategories.length > 0 && selectedSubCatId === 'ALL' ? (
          <div className="space-y-6">
            <div className="border-b-4 border-black pb-4 flex flex-wrap justify-between items-end gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#16A34A] bg-emerald-50 border-2 border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_rgba(0,0,0,1)] inline-block mb-2">
                  WASH PREFERENCE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide lilita-one-regular text-black">
                  Select a Wash Preference
                </h2>
                <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase mt-1">
                  Choose a wash preference to view available buckets and clothing items
                </p>
              </div>
              <span className="text-xs font-black bg-[#9AE600] border-2 border-black px-3 py-1 rounded-lg uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                {subCategories.length} {subCategories.length === 1 ? 'Option' : 'Options'} Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
              {subCategories.map((sub) => {
                const style = getCategoryStyle(sub.name);
                const subItems = items.filter(i => String(i.categoryId) === String(sub._id));
                const vectorSrc = resolveVectorImage(sub.image, sub.name) || style.img;
                
                return (
                  <div
                    key={sub._id}
                    onClick={() => {
                      setSelectedSubCatId(sub._id);
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className={`${style.bg} border-4 border-black rounded-2xl p-6 flex flex-col justify-between shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer group active:translate-y-0.5`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1.5 rounded-lg bg-black text-white border-2 border-black transform -rotate-2 group-hover:rotate-0 transition-transform">
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {style.badge}
                        </span>
                      </div>
                    </div>

                    <div className="w-full flex justify-center my-4 py-2">
                      <img 
                        src={vectorSrc} 
                        alt={sub.name} 
                        onError={(e) => { e.currentTarget.src = style.img; }}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>

                    <div className="mt-auto border-t-4 border-black pt-4">
                      <h3 className="font-extrabold text-black leading-tight text-xl sm:text-2xl uppercase tracking-wide lilita-one-regular">
                        {sub.name}
                      </h3>
                      <div className="flex items-center justify-between mt-3 pt-1">
                        <span className="text-xs font-bold text-gray-600 uppercase">
                          {subItems.length} {subItems.length === 1 ? 'Item' : 'Items'}
                        </span>
                        <span className="text-xs font-black uppercase text-black bg-[#9AE600] border-2 border-black px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-[#9AE600] transition-colors flex items-center gap-1">
                          Select & Proceed →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Active Sub-Category Header Banner */}
            {subCategories.length > 0 && selectedSubCatId !== 'ALL' && (
              <div className="bg-white border-4 border-black p-4 sm:p-5 rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-1">
                    <span>{category.name}</span>
                    <span>›</span>
                    <span className="text-[#0D8DE3] font-black">{activeSubCategory?.name}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-black lilita-one-regular">
                    {activeSubCategory?.name}
                  </h2>
                  <p className="text-xs font-bold text-gray-600 uppercase mt-0.5">
                    Select your clothes or laundry bucket below to proceed
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSubCatId('ALL')}
                  className="bg-[#9AE600] hover:bg-black hover:text-[#9AE600] text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black uppercase shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-colors flex items-center gap-1.5"
                >
                  ← Change Preference
                </button>
              </div>
            )}

            {categoryItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center border-4 border-dashed border-black rounded-3xl m-4 bg-gray-50">
                <Inbox size={64} strokeWidth={2} className="text-black mb-6" />
                <h3 className="text-2xl font-black text-black lilita-one-regular uppercase tracking-wide">No items found</h3>
                <p className="text-black font-bold mt-2 uppercase">There are no items in this category yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {categoryItems.map((item, idx) => {
                  const qty = getQuantity(item._id);
                  const isKg = Boolean(item.pricePerKg && item.pricePerKg > 0) || 
                    item.unit === 'KG' || 
                    (typeof item.name === 'string' && (item.name.toLowerCase().includes('per kg') || item.name.toLowerCase().includes('/ kg') || item.name.toLowerCase().includes('per-kg')));
                  const isBucket = Boolean(item.isBucket);

              // ── BUCKET ITEM CARD ───────────────────────────────────────────
              if (isBucket) {
                return (
                  <div 
                    key={item._id}
                    onClick={() => handleAddToCart(item, 1)}
                    className="bg-white rounded-2xl p-4 sm:p-6 border-3 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white via-green-50/50 to-lime-50"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center bg-white rounded-xl border-2 border-black p-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
                        <img src={bucketImg} alt="Laundry Bucket" className="w-full h-full object-contain filter drop-shadow-md" />
                        <span className="absolute -top-2 -right-2 bg-[#9AE600] text-black font-black text-[9px] px-2 py-0.5 border-2 border-black rounded-md uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          Tap to Add
                        </span>
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                          <h3 className="font-black text-black text-lg sm:text-xl uppercase tracking-wide">{item.name}</h3>
                          <span className="bg-[#0D8DE3] text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg border-2 border-black uppercase tracking-wider">
                            Bucket (Per KG)
                          </span>
                        </div>

                        <p className="text-xs font-bold text-gray-600 mt-1 uppercase">
                          {item.description || 'Add clothes to your laundry bucket. Final weight calculated at delivery.'}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                          <div className="bg-[#9AE600] px-3.5 py-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                            <span className="text-xs font-black uppercase text-black">Count:</span>
                            <span className="text-lg font-black text-black lilita-one-regular">{qty} Clothes</span>
                          </div>

                          {qty > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item, -1);
                              }}
                              className="w-9 h-9 bg-white hover:bg-gray-100 text-black border-2 border-black rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                              title="Decrease"
                            >
                              <Minus size={16} strokeWidth={4} />
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item, 1);
                            }}
                            className="px-4 py-2 bg-black text-[#9AE600] border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-[#9AE600] hover:text-black transition-colors"
                          >
                            + Tap To Add ({qty})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // ── REGULAR ITEM CARD ──────────────────────────────────────────

              return (
                <div 
                  key={item._id} 
                  className="bg-white rounded-2xl p-3.5 sm:p-5 border-2 border-black flex items-center gap-3 sm:gap-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-transform animate-fade-in-up opacity-0 group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-20 h-20 sm:w-28 sm:h-28 ${catStyle.bg} rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-300 p-2`}>
                    <img 
                      src={resolveVectorImage(item.image, item.name)} 
                      alt={item.name} 
                      onError={(e) => { e.currentTarget.src = getVectorUrlByName(item.name); }}
                      className="w-full h-full object-contain filter drop-shadow-md" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-black text-black text-lg sm:text-xl uppercase tracking-wide line-clamp-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-xs font-bold text-gray-700 line-clamp-2 mt-1 uppercase bg-gray-100 p-2 border-2 border-black rounded-lg">{item.description}</p>
                    )}
                    
                    <div className="flex items-end justify-between mt-4">
                      {isKg ? (
                        // Per-KG items: price is determined at delivery by weighing
                        <div className="flex flex-col gap-1">
                          <div className="bg-[#0D8DE3] px-3 py-1 border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-2">
                            <span className="font-black text-white text-sm uppercase tracking-wider">Per KG</span>
                          </div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Priced at delivery</span>
                        </div>
                      ) : (
                        <div className="bg-[#9AE600] px-3 py-1 border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-2">
                          <span className="font-black text-black text-xl">₹{item.pricePerItem || 0}</span>
                          <span className="text-xs font-black text-black ml-1 uppercase">/ Item</span>
                        </div>
                      )}

                      <div>
                        {qty > 0 ? (
                          <div className="flex items-center bg-[#9AE600] border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <button onClick={() => handleAddToCart(item, -1)} className="w-10 h-10 flex items-center justify-center text-black hover:bg-black hover:text-[#9AE600] transition-colors border-r-4 border-black">
                              <Minus size={20} strokeWidth={5} />
                            </button>
                            <span className="w-10 text-center font-black text-black text-lg bg-white h-10 flex items-center justify-center">{qty}</span>
                            <button onClick={() => handleAddToCart(item, 1)} className="w-10 h-10 flex items-center justify-center text-black hover:bg-black hover:text-[#9AE600] transition-colors border-l-4 border-black">
                              <Plus size={20} strokeWidth={5} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddToCart(item, 1)}
                            className="px-6 py-2.5 bg-black text-[#0D8DE3] font-black rounded-xl hover:bg-[#0D8DE3] hover:text-black border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-sm uppercase tracking-widest"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Cart (Neo-brutalist) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none animate-bounce-soft">
          <Link 
            to="/cart" 
            className="w-full max-w-3xl bg-[#9AE600] text-black p-5 rounded-2xl border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-between pointer-events-auto transition-all active:translate-y-2 active:translate-x-2 active:shadow-none"
          >
            <div>
              <p className="text-xs font-black text-black tracking-widest uppercase bg-white border-2 border-black inline-block px-2 py-0.5 rounded">
                {cart.length} ITEM{cart.length > 1 ? 'S' : ''} ADDED
              </p>
              {(() => {
                const isKgCheck = (c) => c.unit === 'KG' || Boolean(c.pricePerKg && c.pricePerKg > 0) || (typeof c.name === 'string' && (c.name.toLowerCase().includes('per kg') || c.name.toLowerCase().includes('/ kg')));
                const hasKg = cart.some(isKgCheck);
                const perItemTotal = cart.filter(c => !isKgCheck(c)).reduce((s, c) => s + (c.price || 0) * c.quantity, 0);
                return hasKg ? (
                  <p className="text-lg sm:text-xl font-black mt-2 lilita-one-regular uppercase tracking-wide">
                    {perItemTotal > 0 ? `₹${perItemTotal} + KG Pending` : 'Pending Weighing'}
                  </p>
                ) : (
                  <p className="text-2xl font-black mt-2 lilita-one-regular">₹{cartTotal}</p>
                );
              })()}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-black text-lg uppercase tracking-widest">Basket</span>
              <div className="w-12 h-12 bg-black text-[#9AE600] border-2 border-black rounded-full flex items-center justify-center">
                <ChevronDown size={28} strokeWidth={4} className="-rotate-90" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
