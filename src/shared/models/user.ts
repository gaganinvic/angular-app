export interface IUser {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUsers {
  users: [IUser]
}

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

export const typesModel = [
  {
    name: "All",
    id: "all"
  },
  {
    name: "Draft",
    id: "draft"
  }
]

export const widthsModel = [
  {
    name: "Original",
    id: "all"
  },
  {
    name: "200",
    id: "200"
  },
  {
    name: "300",
    id: "300"
  },
  {
    name: "400",
    id: "400"
  }
]

export const userModel = 
{
  email: "all@all.com",
  username: "All",
  firstName: "All",
  lastName: "All",
  middleName: "All",
  gender: "female"    
}

export const sortParams = [
  {
    name: "Publishing Date",
    id: "createdAt"
  },
  {
    name: "Type",
    id: "status"
  }
]

export const sortsValueParams = [
  {
    name: "Ascending",
    id: "asc"
  },
  {
    name: "Descending",
    id: "desc"
  }
]