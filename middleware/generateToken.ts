import jwt from "jsonwebtoken";
import { authResponseType } from "@/types/auth";

const generateToken = (authResponse: authResponseType) => {
  const accessToken = jwt.sign(
    { id: authResponse.id, name: authResponse.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { id: authResponse.id, name: authResponse.name },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export default generateToken;
