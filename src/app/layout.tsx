import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

import { VisitaModalProvider } from "@/context/VisitaModalContext";
import { VisitaTecnicaModal } from "@/components/modal/VisitaTecnicaModal";
import { RouteScrollManager } from "@/components/RouteScrollManager";
import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "SoldeRío | Paneles Solares y Energía Rentable para el Sur de Chile",
  description: "Energía solar de alto rendimiento para hogares y empresas. Baja tu cuenta de luz y asegura tu independencia energética en Osorno, Valdivia y el sur.",
  icons: {
    icon: [
      { url: "/icon-solderio.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon-solderio.svg",
    apple: "/icon-solderio.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <GoogleTagManager gtmId="GTM-KWXTX2Z8" />
      <body
        className={`${satoshi.variable} font-sans antialiased text-[#1F1F1F] min-h-full flex flex-col`}
      >
        <RouteScrollManager />
        <VisitaModalProvider>
          {children}
          <VisitaTecnicaModal />
        </VisitaModalProvider>
        <Analytics />
      </body>
    </html>
  );
}
