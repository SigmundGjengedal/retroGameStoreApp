export interface ISaleItem {
  id: number;
  title: string;
  description: string;
  hashtags: string[];
  images: string[];
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
}
