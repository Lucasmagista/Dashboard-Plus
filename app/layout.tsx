import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./sidebar-improvements.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CSSOptimizer } from "@/components/css-optimizer"
import { Toaster } from "@/components/ui/toaster"
import { cookies } from "next/headers"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Disable automatic preload to control it manually
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "Inaugura Lar - Dashboard Plus",
  description: "Dashboard Plus é uma solução completa de CRM e gestão empresarial, desenvolvida pela Inaugura Lar, que integra funcionalidades avançadas para otimizar a gestão de negócios.",
  generator: 'v0.dev - Inaugura Lar',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      {/* Head elements are now handled by the Metadata API in Next.js App Router */}
      <body className={`${inter.className} antialiased`}>
        <CSSOptimizer />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/service-worker.js');
              });
            }
          `
        }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider defaultOpen={defaultOpen}>
            <div className="flex min-h-screen w-full bg-background">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full min-h-screen">
                {children}
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
