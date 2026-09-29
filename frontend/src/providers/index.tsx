"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { SupabaseProvider } from "./SupabaseProvider";
import { AuthProvider } from "./AuthProvider";
import { NotificationProvider } from "./NotificationProvider";
import { AppProvider } from "@/context/AppContext";

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <SupabaseProvider>
          <AuthProvider>
            <AppProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </AppProvider>
          </AuthProvider>
        </SupabaseProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

export * from "./ThemeProvider";
export * from "./ReactQueryProvider";
export * from "./SupabaseProvider";
export * from "./AuthProvider";
export * from "./NotificationProvider";
