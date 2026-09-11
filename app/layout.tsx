import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProvedorUsuario } from "@/data/contexts/ContextoUsuario";
import { ProvedorCarrinho } from "@/data/contexts/ContextoCarrinho";
import { Me } from "@/data/services/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meu E-commerce",
  description: "E-commerce protótipo usando Next.js e Tailwind CSS",
};

export default async function LayoutRaiz({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const usuario = await Me();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ProvedorUsuario usuario={usuario}>
          <ProvedorCarrinho>{children}</ProvedorCarrinho>
        </ProvedorUsuario>
      </body>
    </html>
  );
}
