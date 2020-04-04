export interface IUserPhoto {
  username: string;
  imageType: string;
  imageSize: number;
  imageName: string;
  captions?: string;
  tags?: [string];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPhotos {
  photos: [IUserPhoto]
}