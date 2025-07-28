import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useVerifyAuth() {
  const [is_verified, set_is_verified] = useState(false);
  const [is_loading, set_is_loading] = useState(true);
  const router = useRouter();

  const check_auth = () => {
    const token = sessionStorage.getItem("auth_token");
    console.log("Token actual:", token);

    const is_logged_in = !!token; // true si hay token, false si no

    set_is_verified(is_logged_in);
    set_is_loading(false);

    if (!is_logged_in && router.pathname.startsWith("/dashboard")) {
      router.push("/admin");
    }
  };

  useEffect(() => {
    check_auth();

    const interval = setInterval(() => {
      check_auth();
    }, 100); // chequea cada 1 segundo

    return () => clearInterval(interval);
  }, []);

  return { is_verified, is_loading };
}
