import cookies from "js-cookie";

export const setTokenCookie = (token: string) => {
  cookies.set("atk", token, { expires: 1 });
};

export const getTokenCookie = () => {
  return cookies.get("atk");
};
