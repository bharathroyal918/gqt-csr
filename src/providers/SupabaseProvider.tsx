"use client";

import React, { createContext, useContext, useMemo } from "react";
import { supabase, isSupabaseConfigured } from "@/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

interface SupabaseContextType {
  supabase: SupabaseClient;
  isConfigured: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase,
  isConfigured: false,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(
    () => ({
      supabase,
      isConfigured: isSupabaseConfigured,
    }),
    []
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
