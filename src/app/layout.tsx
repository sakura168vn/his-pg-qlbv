import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from '@/contexts/LoadingContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tâm Anh Hospital",
  description: "Chương Trình Đầu Tiên",
  icons: {
    icon: "/icons/favicon.ico", // Favicon chính
    shortcut: "/icons/favicon.ico", // Dành cho trình duyệt hỗ trợ shortcut icon    
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}