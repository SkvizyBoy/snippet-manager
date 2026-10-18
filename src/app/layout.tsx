import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Инициализируем шрифты
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Обновили метаданные под наш проект
export const metadata: Metadata = {
  title: "Snippet Manager",
  description: "Менеджер шаблонов кода будущего",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 🔥 Применяем переменные шрифтов к body, чтобы убрать ошибку и улучшить типографику */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}

          {/* Контейнер для красивых уведомлений */}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: { background: '#18181b', border: '1px solid #27272a', color: '#fff' }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
