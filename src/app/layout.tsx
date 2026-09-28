import type { Metadata } from "next";
import { Inter, Poppins, Manrope } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GQT CSR Automation Platform | Global Quest Technologies",
  description:
    "Enterprise CSR Recruitment, College CRM, Examination, HR Automation & Placement Management Platform for Global Quest Technologies.",
  icons: {
    icon: "/images/gqt-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans bg-[#F7FAFC] dark:bg-[#070D1E] text-[#0F172A] dark:text-[#F8FAFC] antialiased selection:bg-[#005BBB] selection:text-white">
        <GlobalProviders>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="light"
            toastOptions={{
              style: {
                borderRadius: "16px",
                fontFamily: "var(--font-inter), sans-serif",
                border: "1px solid #E5E7EB",
                boxShadow: "0 10px 30px -5px rgba(0, 91, 187, 0.1)",
              },
            }}
          />
        </GlobalProviders>
      </body>
    </html>
  );
}
