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


export default function CategoryItems() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { items, categories, cart, addToCart } = useAppStore();

  const category = categories.find(c => c._id === categoryId);
  const categoryItems = items.filter(i => i.categoryId === categoryId);

  const getQuantity = (itemId) => {
    return cart.find(c => c.itemId === itemId)?.quantity || 0;
  };

  const handleAddToCart = (item, diff) => {
    addToCart(item, diff);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const catStyle = category ? getCategoryStyle(category.name) : null;

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-outfit">
        <div className="text-black font-black flex flex-col items-center">
          <p className="text-2xl uppercase">Category not found.</p>
          <button onClick={() => navigate('/order')} className="mt-6 px-6 py-3 bg-[#B0FF49] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 font-outfit selection:bg-black selection:text-white">
      <Navbar />
      
      {/* Header Sticky (Neo-brutalist) */}
      <div className={`sticky top-0 z-40 ${catStyle.bg} border-b-2 border-black transition-colors`}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-6 relative overflow-hidden">
          {/* Faint watermark of category image in background */}
          <img src={catStyle.img} alt="" className="absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-32 opacity-20 object-contain pointer-events-none" />
          
          <button 
            onClick={() => navigate('/order')}
            className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none relative z-10"
          >
            <ArrowLeft size={24} strokeWidth={4} />
          </button>
          <div className="relative z-10">
            <h1 className={`text-2xl sm:text-3xl font-black ${catStyle.color} lilita-one-regular tracking-wide uppercase`}>{category.name}</h1>
            <p className="text-xs font-black text-black bg-white inline-block px-2 py-1 mt-1 border-2 border-black rounded-md tracking-widest uppercase">{categoryItems.length} ITEMS</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
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
              const price = item.pricePerKg || item.pricePerItem || 0;
              const unit = item.pricePerKg ? 'KG' : 'Item';

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
                      <div className="bg-[#B0FF49] px-3 py-1 border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-2">
                        <span className="font-black text-black text-xl">₹{price}</span>
                        <span className="text-xs font-black text-black ml-1 uppercase">/ {unit}</span>
                      </div>
                      
                      <div>
                        {qty > 0 ? (
                          <div className="flex items-center bg-[#B0FF49] border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
                            <button onClick={() => handleAddToCart(item, -1)} className="w-10 h-10 flex items-center justify-center text-black hover:bg-black hover:text-[#B0FF49] transition-colors border-r-4 border-black">
                              <Minus size={20} strokeWidth={5} />
                            </button>
                            <span className="w-10 text-center font-black text-black text-lg bg-white h-10 flex items-center justify-center">{qty}</span>
                            <button onClick={() => handleAddToCart(item, 1)} className="w-10 h-10 flex items-center justify-center text-black hover:bg-black hover:text-[#B0FF49] transition-colors border-l-4 border-black">
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

      {/* Floating Cart (Neo-brutalist) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none animate-bounce-soft">
          <Link 
            to="/cart" 
            className="w-full max-w-3xl bg-[#B0FF49] text-black p-5 rounded-2xl border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-between pointer-events-auto transition-all active:translate-y-2 active:translate-x-2 active:shadow-none"
          >
            <div>
              <p className="text-xs font-black text-black tracking-widest uppercase bg-white border-2 border-black inline-block px-2 py-0.5 rounded">
                {cart.length} ITEM{cart.length > 1 ? 'S' : ''} ADDED
              </p>
              <p className="text-2xl font-black mt-2 lilita-one-regular">₹{cartTotal}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-lg uppercase tracking-widest">Basket</span>
              <div className="w-12 h-12 bg-black text-[#B0FF49] border-2 border-black rounded-full flex items-center justify-center">
                <ChevronDown size={28} strokeWidth={4} className="-rotate-90" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
