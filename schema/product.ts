export enum ProductCategory {
  LITERATURE = "literature",
  TECHNOLOGY = "technology",
  PLUSHIES = "plushies",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  pictureUrls: string[];
  stock: number;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}
