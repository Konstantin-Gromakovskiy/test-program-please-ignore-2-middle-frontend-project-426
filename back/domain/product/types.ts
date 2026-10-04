export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
};

export type ProductsFilter = {
  categorySlug?: string | undefined;
  limit: number;
  offset: number;
};

export type ProductsPage = {
  items: Product[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};
