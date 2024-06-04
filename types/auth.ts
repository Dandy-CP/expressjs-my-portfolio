export interface authResponseType {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface authRegisterBodyType {
  name: string;
  email: string;
  password: string;
}

export interface authLoginBodyType {
  email: string;
  password: string;
}

export interface changePasswordBodyType {
  oldPassword: string;
  newPassword: string;
}

export interface refreshTokenBodyType {
  refreshToken: string;
}

export interface decodeTypeJWT {
  id: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export type User = {
  id: string;
  name: string;
  accessToken: string;
  refreshToken: string;
};
