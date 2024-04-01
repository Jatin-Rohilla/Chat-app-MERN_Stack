import React, { ReactNode, useEffect } from "react";
import { useAppSelector } from "./providers";
import { useRouter } from "next/navigation";

interface AuthProp {
  children: ReactNode;
}

const PrivateRoute: React.FC<AuthProp> = ({ children }) => {
  const isAuth = useAppSelector((store) => store.auth.isAuth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth, router]);

  return isAuth ? <>{children}</> : null;
};

export default PrivateRoute;
