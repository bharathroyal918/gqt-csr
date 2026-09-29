"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/supabase/client";
import { UserRole, UserProfile } from "@/types";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithRole: (role: UserRole, email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>("csr_manager");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize role and user from cookies or active session on client mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let detectedRole: UserRole = "csr_manager";

        // Read active role from cookie or pathname
        const isStudentPath = typeof window !== "undefined" && window.location.pathname.startsWith("/student");
        if (isStudentPath) {
          detectedRole = "student";
        } else if (typeof document !== "undefined") {
          const matchRole = document.cookie.match(/gqt_active_role=([^;]+)/);
          if (matchRole && matchRole[1]) {
            detectedRole = decodeURIComponent(matchRole[1]) as UserRole;
          }
        }

        if (isSupabaseConfigured) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            setUser(session.user);
            const userRole = isStudentPath ? "student" : ((session.user.user_metadata?.role as UserRole) || detectedRole);
            setRole(userRole);

            // Fetch profile
            const dbProfile = await userService.getProfile(session.user.id);
            if (dbProfile) {
              setProfile(dbProfile);
            }
          } else {
            setRole(detectedRole);
          }
        } else {
          setRole(detectedRole);
        }
      } catch (err) {
        console.warn("Auth initialization warning:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    if (isSupabaseConfigured) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const isStudentPath = typeof window !== "undefined" && window.location.pathname.startsWith("/student");
          const userRole = isStudentPath ? "student" : ((session.user.user_metadata?.role as UserRole) || role);
          setRole(userRole);
          document.cookie = `gqt_active_role=${encodeURIComponent(userRole)}; path=/; max-age=604800; SameSite=Lax`;
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const loginWithRole = useCallback(
    async (targetRole: UserRole, email: string, password?: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured) {
          await authService.signInWithEmail(email, password);
        }

        setRole(targetRole);

        // Set secure cookies for middleware
        if (typeof document !== "undefined") {
          document.cookie = `gqt_active_role=${encodeURIComponent(targetRole)}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `gqt_auth_user=${encodeURIComponent(email)}; path=/; max-age=604800; SameSite=Lax`;
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("gqt_role", targetRole);
          localStorage.setItem("gqt_user_email", email);
        }

        setUser({ email, role: targetRole });
        setProfile({
          id: "usr-" + Date.now(),
          email,
          fullName: email.split("@")[0].replace(".", " ").toUpperCase(),
          role: targetRole,
          status: "active",
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return true;
      } catch (err) {
        console.error("Login with role failed:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await authService.signOut({ everywhere: true });
    setUser(null);
    setProfile(null);
    if (typeof document !== "undefined") {
      document.cookie = "gqt_active_role=; path=/; max-age=0";
      document.cookie = "gqt_auth_user=; path=/; max-age=0";
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("gqt_role");
      localStorage.removeItem("gqt_user_email");
      localStorage.removeItem("gqt_user_name");
      localStorage.removeItem("gqt_user_id");
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (isSupabaseConfigured) {
      await authService.refreshSession();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isLoading,
        isAuthenticated: Boolean(user || (typeof document !== "undefined" && document.cookie.includes("gqt_active_role"))),
        loginWithRole,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
