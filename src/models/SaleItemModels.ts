export interface ISaleItem {
  id: number;
  title: string;
  images: string[];
  platform: string;
  price:string;
}

export interface ISingleItemResponse {
  sale_posts_by_id: ISaleItem;
}

export interface ISaleItemsResponse {
  sale_items: ISaleItem[];
}

export interface INewSaleItem {
  image: string[];
  title: string;
  description: string;
  tags: string[];
  imageIds: string[],
  platform:string;
  price:string;
  condition:string;
  city:string;
}

