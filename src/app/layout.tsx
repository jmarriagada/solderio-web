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

export const metadata: Metadata = {
  title: "SoldeRío | Soberanía Energética",
  description: "Energía inteligente, ingeniería confiable en el sur de Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${satoshi.variable} font-sans antialiased text-[#1F1F1F] min-h-full flex flex-col`}
      >
        <VisitaModalProvider>
          {children}
          <VisitaTecnicaModal />
        </VisitaModalProvider>
      </body>
    </html>
  );
}
