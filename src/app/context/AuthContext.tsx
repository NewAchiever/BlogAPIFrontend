import { createContext, useEffect, useContext, useState, type ReactNode, } from "react";
import { type User } from "@/features/users";
import { fetchAPI } from "@/utils/fetchAPI";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  isAuthLoading: boolean | null;
  callAPI: (
        url: string,
        options?: RequestInit
    ) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(() => {
    const savedUser = localStorage.getItem('user_session');
    return savedUser ? true : false;
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean | null>(true);
  const callAPI = (
    url: string,
    options: RequestInit = {},
    err: string = "",
  ) => {
    return fetchAPI(url, options, err, setIsLoggedIn, setIsAuthLoading);
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        setIsAuthLoading,
        isAuthLoading,
        callAPI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
