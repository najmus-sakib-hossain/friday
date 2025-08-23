"use client"

import { LocaleProvider } from "@/components/common/locale-provider";
import { Toaster as DefaultToaster, Toaster as NewYorkToaster } from "@/components/ui/toaster"
import { SubCategorySidebarProvider } from "@/components/layout/sidebar/subcategory-sidebar"
import { CategorySidebarProvider } from "@/components/layout/sidebar/category-sidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LeftSidebar } from "@/components/layout/sidebar/left-sidebar"
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster as NewYorkSonner } from "@/components/ui/sonner"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeSync } from "@/providers/theme-sync";
import { SiteHeader } from "@/components/layout/header/site-header"
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Main } from "@/providers/main"
import { Provider as JotaiProvider } from "jotai"
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import * as React from "react"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContainerWrapper } from "@/components/common/container-and-section-wrapper";
import {
  CustomizerSidebar,
  CustomizerSidebarToggle,
} from "@/components/customizer/customizer-sidebar";
import { ChatProvider } from "./chat-provider";

const SIDEBAR_WIDTH = "21rem";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <LocaleProvider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <JotaiProvider>
              <TooltipProvider>
                <SidebarProvider
                  defaultOpen={false}
                >
                  <CustomizerSidebar />
                  <CategorySidebarProvider>
                    <SubCategorySidebarProvider>
                      <div
                        vaul-drawer-wrapper=""
                        className="relative h-screen w-full overflow-hidden"
                      >
                        <SiteHeader />
                        <Main>
                          {/* <Suspense>
                            {children}
                            <ThemeSync />
                          </Suspense> */}
                          <ChatProvider>
                            <Suspense>
                              {children}
                              <ThemeSync />
                            </Suspense>
                          </ChatProvider>
                        </Main>
                        <NewYorkToaster />
                        <DefaultToaster />
                        <NewYorkSonner />
                      </div>
                    </SubCategorySidebarProvider>
                  </CategorySidebarProvider>
                </SidebarProvider>
              </TooltipProvider>
            </JotaiProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </LocaleProvider>
  )
}
