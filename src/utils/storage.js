const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    if (decoded.exp) {
      return decoded.exp * 1000 < Date.now();
    }
    return false;
  } catch {
    return true;
  }
};

export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("salon-admin-token", token);
    localStorage.setItem("realState-token", token);
    document.cookie = `salon-admin-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `realState-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
};

export const saveRefreshToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("salon-refresh-token", token);
    localStorage.setItem("realState-refresh-token", token);
  }
};

export const saveUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("salon-user", JSON.stringify(user));
    localStorage.setItem("realState-user", JSON.stringify(user));
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("salon-admin-token") ||
      localStorage.getItem("realState-token") ||
      getCookie("salon-admin-token") ||
      getCookie("realState-token")
    );
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("salon-refresh-token") || localStorage.getItem("realState-refresh-token");
  }
  return null;
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("salon-user") || localStorage.getItem("realState-user");
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
  return null;
};

export const removeStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("salon-admin-token");
    localStorage.removeItem("realState-token");
    localStorage.removeItem("salon-refresh-token");
    localStorage.removeItem("realState-refresh-token");
    localStorage.removeItem("salon-user");
    localStorage.removeItem("realState-user");
    localStorage.removeItem("role");

    document.cookie = "salon-admin-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "salon-role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "realState-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "salon-refresh-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    fetch("/api/auth/logout", { method: "POST" }).catch(() => { });
  }
};