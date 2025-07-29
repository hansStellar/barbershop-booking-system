import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useVerifyAuth() {
  // Variables
  const [is_verified, set_is_verified] = useState(false);
  const [is_loading, set_is_loading] = useState(true);
  const router = useRouter();

  // Functions

  // 1 - Function to check if the client is logged in
  const check_auth = () => {
    const token = sessionStorage.getItem("auth_token");
    const is_logged_in = !!token;

    set_is_verified(is_logged_in);
    set_is_loading(false);

    if (!is_logged_in && router.pathname.startsWith("/dashboard")) {
      return router.push("/admin");
    }

    if (is_logged_in && router.pathname.startsWith("/admin")) {
      return router.push("/dashboard");
    }
  };

  // Hooks
  useEffect(() => {
    // Check if client is logged in
    check_auth();

    // Check every second if there's anything in the session storage
    const interval = setInterval(() => {
      check_auth();
    }, 100);

    return () => clearInterval(interval); // Remember that when unmounting, the return runs, so when unmounting the application, it will clear the invertal for stopping the auth checking
  }, []);

  return { is_verified, is_loading };
}
