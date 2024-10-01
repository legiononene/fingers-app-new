"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthProps {
  setLoginToken: (token: string) => void;
  logOut: () => void;
  token: string;
  isLogin: boolean;
}
const AuthCtx = createContext<AuthProps>({
  logOut() {},
  setLoginToken(token) {},
  token: "",
  isLogin: false,
});
export const useAuth = () => {
  return useContext(AuthCtx);
};
export const AuthProvider = (props: React.PropsWithChildren) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const _token = localStorage.getItem("token");
    if (!_token) {
      router.push("/auth");
    }
    if (_token) {
      setLoginToken(_token);
    }
  }, []);
  const setLoginToken = (token: string) => {
    localStorage.setItem("token", token);
    setIsLogin(true);
    setToken(token);
  };
  const logOut = () => {
    localStorage.clear();
    setIsLogin(false);
    router.push("/auth");
  };
  const value = useMemo(
    () => ({ setLoginToken, logOut, token, isLogin }),
    [token]
  );
  return <AuthCtx.Provider value={value}>{props.children}</AuthCtx.Provider>;
};
