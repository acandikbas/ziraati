export interface Category {
  id: number | string;
  name: string;
  slug: string | null;
  description: string | null;
  subcategories: { id: number | string; name: string; slug: string | null }[] | null;
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock: number | null;
  subcategory_id: number | string | null;
  subcategories?: {
    name: string;
    category_id: number | string;
    categories: { name: string } | null;
  } | null;
}
