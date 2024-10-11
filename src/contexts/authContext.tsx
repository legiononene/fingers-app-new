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
  setLoginToken: (token: string,role:string) => void;
  logOut: () => void;
  token: string;
  isLogin: boolean;
}
const AuthCtx = createContext<AuthProps>({
  logOut() {},
  setLoginToken(token,role) {},
  token: "",
  isLogin: false,
});
export const useAuth = () => {
  return useContext(AuthCtx);
};
export const AuthProvider = (props: React.PropsWithChildren) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const _token = localStorage.getItem("token");
    const _role = localStorage.getItem("role")
    if (!_token || !_role) {
      router.push("/auth");
    }
    if (_token && _role ) {
      setLoginToken(_token,_role);
    }
  }, []);
  const setLoginToken = (token: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role",role)
    setIsLogin(true);
    setToken(token);
    setRole(role)
  };
  const logOut = () => {
    localStorage.clear();
    setIsLogin(false);
    router.push("/auth");
  };
  const value = useMemo(
    () => ({ setLoginToken, logOut, token, isLogin }),
    [token,role]
  );
  return <AuthCtx.Provider value={value}>{props.children}</AuthCtx.Provider>;
};
