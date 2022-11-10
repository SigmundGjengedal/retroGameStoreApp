export interface ISaleItem {
  id: number;
  title: string;
  images: string[];
  platform: string;
  price:string;
  user_created: {
    first_name: string;
  };
}

export interface ISingleItemResponse {
  sale_posts_by_id: ISaleItem;
}

export interface ISaleItemsResponse {
  sale_items: ISaleItem[];
}

export interface INewSaleItem {
  title: string;
  description: string;
  hashtags: string[];
  images: string[];
  platform:string;
  price:string;
  condition:string;
  city:string;
}

