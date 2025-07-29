import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// auth.js
export async function admin_login(email, password) {
  return fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })
    .then(async (res) => {
      const data = await res.json();
      sessionStorage.setItem("auth_token", data.token);
    })
    .catch((err) => {
      console.log("Login failed");
    });
}

export function admin_logout() {
  sessionStorage.removeItem("auth_token");
}

export default function useVerifyAuth() {
  // Variables
  const [is_verified, set_is_verified] = useState(false);
  const [is_loading, set_is_loading] = useState(true);
  const router = useRouter();

  // Functions

  // 1 - Function to check if the client is logged in
  const check_auth = () => {
    const token = sessionStorage.getItem("auth_token");
    const is_logged_in = !!token; // If there's any value in the session storage them will return true

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
