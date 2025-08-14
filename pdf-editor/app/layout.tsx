import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Professional PDF Editor - Edit PDFs Online",
  description: "A comprehensive, industrial-standard PDF editor similar to PDFEscape. Edit, annotate, fill forms, sign documents, and more.",
  keywords: "PDF editor, PDF viewer, edit PDF, annotate PDF, fill PDF forms, sign PDF, PDFEscape alternative",
  authors: [{ name: "PDF Editor Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
