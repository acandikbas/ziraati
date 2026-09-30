export interface Subcategory {
  id: number;
  name: string;
  slug: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  subcategories: Subcategory[] | null;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  /** null = stok takibi yapılmıyor (satışa açık kabul edilir) */
  stock: number | null;
  subcategory_id: number;
  subcategories: {
    name: string;
    slug: string | null;
    category_id: number;
    categories: { name: string; slug: string | null } | null;
  } | null;
}
