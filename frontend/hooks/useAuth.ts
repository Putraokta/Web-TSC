"use client"

import { useCallback, useEffect, useState } from "react";
import authService from "@/services/auth.service";
import { setAuthToken } from "@/lib/axioos";
import { getErrorMessage } from "@/lib/error";

type User = any;

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.getProfile();
      const data = res?.data || res;
      setUser(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
    } catch (err) {
      // ignore server logout errors but capture message
      setError(getErrorMessage(err));
    } finally {
      setAuthToken(null);
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const t = localStorage.getItem("accessToken");
        if (t) {
          setIsAuthenticated(true);
          loadProfile();
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
  }, [loadProfile]);

  return { user, loading, error, loadProfile, logout, isAuthenticated };
}
