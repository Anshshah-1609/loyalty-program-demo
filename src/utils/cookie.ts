import cookies from "js-cookie";

export const setUserIdCookie = (userId: string) => {
  cookies.set("userId", userId, { expires: 1 });
};

export const getUserIdCookie = () => {
  return cookies.get("userId");
};

export const setTokenCookie = (token: string) => {
  cookies.set("atk", token, { expires: 1 });
};

export const getTokenCookie = () => {
  return cookies.get("atk");
};
