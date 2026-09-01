import bagImg from '../assets/bag.png';
import beddingImg from '../assets/bedding.png';
import blanketImg from '../assets/blanket.png';
import curtainsImg from '../assets/curtains.png';
import dryCleanImg from '../assets/dryClean.png';
import easyWashImg from '../assets/easyWash.png';
import leatherImg from '../assets/leather.png';
import normalImg from '../assets/normal.png';
import rugsImg from '../assets/rugs.png';
import shoesImg from '../assets/shoes.png';
import suitsImg from '../assets/suits.png';
import weddingDressImg from '../assets/wedding_dress.png';

export interface VectorItem {
  id: string;
  name: string;
  category: string;
  url: string;
}

export const CLOUDINARY_VECTOR_MAP: Record<string, string> = {
  easyWash: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836196/wow_laundry_vectors/vector_easyWash.png",
  normal: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836197/wow_laundry_vectors/vector_normal.png",
  suits: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836199/wow_laundry_vectors/vector_suits.png",
  wedding_dress: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836201/wow_laundry_vectors/vector_wedding_dress.png",
  dryClean: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836202/wow_laundry_vectors/vector_dryClean.png",
  leather: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836206/wow_laundry_vectors/vector_leather.png",
  curtains: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836246/wow_laundry_vectors/vector_curtains.png",
  bedding: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836284/wow_laundry_vectors/vector_bedding.png",
  rugs: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836291/wow_laundry_vectors/vector_rugs.png",
  blanket: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836295/wow_laundry_vectors/vector_blanket.png",
  shoes: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836303/wow_laundry_vectors/vector_shoes.png",
  bag: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836309/wow_laundry_vectors/vector_bag.png",
  tshirt: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836834/wow_laundry_vectors/v3_tshirt.jpg",
  jeans: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836854/wow_laundry_vectors/v3_jeans.jpg",
  formal_shirt: "https://res.cloudinary.com/ddzre9tcd/image/upload/v1787836875/wow_laundry_vectors/v3_formal_shirt.jpg"
};

export const LOCAL_VECTOR_ASSETS: Record<string, string> = {
  easyWash: easyWashImg,
  normal: normalImg,
  suits: suitsImg,
  wedding_dress: weddingDressImg,
  dryClean: dryCleanImg,
  leather: leatherImg,
  curtains: curtainsImg,
  bedding: beddingImg,
  rugs: rugsImg,
  blanket: blanketImg,
  shoes: shoesImg,
  bag: bagImg,

  tshirt: normalImg,
  jeans: normalImg,
  hoodie: normalImg,
  formal_shirt: suitsImg,
  winter_parka: leatherImg,
  cocktail_dress: weddingDressImg,
  kurta: suitsImg,
  saree: weddingDressImg,
  trousers: normalImg,
  shorts: normalImg,
  leather_jacket: leatherImg,
  suit_blazer: suitsImg,
  backpack: bagImg,
  bedding_set: beddingImg,
  dryclean_coat: dryCleanImg,
  wedding_gown: weddingDressImg,
  sweater: normalImg,
  laundry_wash: easyWashImg,
};

export const VECTOR_GALLERY: VectorItem[] = [
  { id: "easyWash", name: "Wash & Fold", category: "Everyday Wear", url: CLOUDINARY_VECTOR_MAP.easyWash },
  { id: "normal", name: "Everyday Wear", category: "Everyday Wear", url: CLOUDINARY_VECTOR_MAP.normal },
  { id: "tshirt", name: "T-Shirt", category: "Everyday Wear", url: CLOUDINARY_VECTOR_MAP.tshirt },
  { id: "jeans", name: "Denim Jeans", category: "Everyday Wear", url: CLOUDINARY_VECTOR_MAP.jeans },
  { id: "formal_shirt", name: "Formal Shirt", category: "Formals", url: CLOUDINARY_VECTOR_MAP.formal_shirt },
  { id: "suits", name: "Suits & Blazers", category: "Formals", url: CLOUDINARY_VECTOR_MAP.suits },
  { id: "wedding_dress", name: "Wedding Dress", category: "Drycleaning", url: CLOUDINARY_VECTOR_MAP.wedding_dress },
  { id: "dryClean", name: "Dry Clean", category: "Drycleaning", url: CLOUDINARY_VECTOR_MAP.dryClean },
  { id: "leather", name: "Leather Wear", category: "Winter Wear", url: CLOUDINARY_VECTOR_MAP.leather },
  { id: "curtains", name: "Curtains & Drapes", category: "Home & Bedding", url: CLOUDINARY_VECTOR_MAP.curtains },
  { id: "bedding", name: "Bedding & Linen", category: "Home & Bedding", url: CLOUDINARY_VECTOR_MAP.bedding },
  { id: "rugs", name: "Rugs & Carpets", category: "Home & Bedding", url: CLOUDINARY_VECTOR_MAP.rugs },
  { id: "blanket", name: "Blankets", category: "Home & Bedding", url: CLOUDINARY_VECTOR_MAP.blanket },
  { id: "shoes", name: "Shoes", category: "Footwear", url: CLOUDINARY_VECTOR_MAP.shoes },
  { id: "bag", name: "Bags", category: "Accessories", url: CLOUDINARY_VECTOR_MAP.bag },
];

export const getVectorUrlById = (id: string): string => {
  if (!id) return VECTOR_GALLERY[0].url;
  const key = id.trim();
  if (CLOUDINARY_VECTOR_MAP[key]) return CLOUDINARY_VECTOR_MAP[key];
  if (LOCAL_VECTOR_ASSETS[key]) return LOCAL_VECTOR_ASSETS[key];
  const found = VECTOR_GALLERY.find((v) => v.id === key);
  return found ? found.url : VECTOR_GALLERY[0].url;
};

export const getVectorUrlByName = (name: string): string => {
  const n = (name || '').toLowerCase().trim();
  if (n.includes('suit') || n.includes('formal') || n.includes('blazer')) return CLOUDINARY_VECTOR_MAP.suits;
  if (n.includes('wedding') || n.includes('dress') || n.includes('gown')) return CLOUDINARY_VECTOR_MAP.wedding_dress;
  if (n.includes('dry') || n.includes('coat')) return CLOUDINARY_VECTOR_MAP.dryClean;
  if (n.includes('leather')) return CLOUDINARY_VECTOR_MAP.leather;
  if (n.includes('curtain') || n.includes('drape')) return CLOUDINARY_VECTOR_MAP.curtains;
  if (n.includes('bed') || n.includes('sheet') || n.includes('linen')) return CLOUDINARY_VECTOR_MAP.bedding;
  if (n.includes('rug') || n.includes('carpet')) return CLOUDINARY_VECTOR_MAP.rugs;
  if (n.includes('blanket') || n.includes('quilt')) return CLOUDINARY_VECTOR_MAP.blanket;
  if (n.includes('shoe') || n.includes('sneaker')) return CLOUDINARY_VECTOR_MAP.shoes;
  if (n.includes('bag') || n.includes('backpack')) return CLOUDINARY_VECTOR_MAP.bag;
  if (n.includes('wash') || n.includes('fold')) return CLOUDINARY_VECTOR_MAP.easyWash;
  return CLOUDINARY_VECTOR_MAP.normal;
};

export const resolveVectorImage = (imgSrc?: string, fallbackName?: string): string => {
  if (!imgSrc) return getVectorUrlByName(fallbackName || '');
  
  const trimmed = imgSrc.trim();

  // 1. Check direct key match to Cloudinary vector map
  if (CLOUDINARY_VECTOR_MAP[trimmed]) {
    return CLOUDINARY_VECTOR_MAP[trimmed];
  }

  // 2. Check direct key match to Local vector assets
  if (LOCAL_VECTOR_ASSETS[trimmed]) {
    return LOCAL_VECTOR_ASSETS[trimmed];
  }

  // 3. Check if valid HTTP/HTTPS/data URI URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // 4. Match Cloudinary substring or filename to key
  for (const [key, cldUrl] of Object.entries(CLOUDINARY_VECTOR_MAP)) {
    if (trimmed.includes(key)) return cldUrl;
  }

  return getVectorUrlByName(fallbackName || '');
};
