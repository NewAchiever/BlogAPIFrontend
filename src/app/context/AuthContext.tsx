import { createContext, useEffect, useContext, useState, type ReactNode, } from "react";
import { type User } from "@/features/users";
import { fetchAPI } from "@/utils/fetchAPI";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);

  const callAPI = (
    url: string,
    options: RequestInit = {},
    err: string = "",
  ) => {
    return fetchAPI(url, options, err, setIsLoggedIn);
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        callAPI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
