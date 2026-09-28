// Global Environment Configuration & Validation Layer

export interface AppEnv {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  WHATSAPP_API_URL?: string;
  WHATSAPP_API_TOKEN?: string;
  APP_BASE_URL: string;
  NODE_ENV: "development" | "production" | "test";
}

export function getAppEnv(): AppEnv {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SMTP_HOST: process.env.SMTP_HOST || "smtp.sendgrid.net",
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v21.0",
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
    APP_BASE_URL:
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_BASE_URL ||
      "http://localhost:3000",
    NODE_ENV: (process.env.NODE_ENV as any) || "development",
  };
}

export const env = getAppEnv();
