export interface ICampSpot {
  id: number;
  title: string;
  description: string;
  hashtags: string[];
  images: string[];
  user_created: {
    first_name: string;
  };
}

export interface ICampSpotResponse {
  camp_spots_by_id: ICampSpot;
}

export interface ICampSpotsResponse {
  camp_spots: ICampSpot[];
}

export interface INewCampSpot {
  title: string;
  description: string;
  hashtags: string[];
  image: string;
}
