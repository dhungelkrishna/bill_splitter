import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
}

export const decodeJwt = (token: string): DecodedToken | null => {
  if (!token) {
    return null;
  }
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export default decodeJwt