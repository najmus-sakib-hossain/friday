"use client";
import { useLocaleStore } from "@/trash/locale";
import { i18n } from "@/lib/i18n/i18n-config";
import { cn, lt } from "@/lib/utils";
import { FileSliders, LanguagesIcon, LetterText, Menu, PaintBucket, Palette, PanelLeftDashed, SlidersHorizontal, SwatchBook, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorTokens } from "@/components/customizer/color-tokens";
import { ComingSoon } from "@/components/customizer/coming-soon";
import {
  AllPresetsControl,
  ControlSection,
  RadiusSliderControl,
  ShadowsControl,
  SurfaceShadesControl,
} from "@/components/customizer/customizer-controls";
import { Typography } from "@/components/customizer/typography";
import {
  Info,
  PanelRight,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TeamSwitcher } from "@/components/layout/sidebar/team-switcher"
import { Banner } from "@/components/layout/banner"
import { Check } from "lucide-react";
import { useState } from "react";
import { NavDesktopActions, NavMobileActions } from "../layout/header/nav-actions";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { History } from "@/components/layout/sidebar/history";
import { languageNames } from "@/constants/language-names";

export function CustomizerSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { locale, setLocale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);
  const { open, toggleSidebar, openMobile, state } = useSidebar();
  const currentLanguageName = languageNames[locale] || locale.toUpperCase();

  return (
    <Sidebar collapsible="icon" className="overflow-hidden" {...props}>
      <Tabs
        defaultValue="languages"
        className="flex flex-1 flex-col gap-0 overflow-hidden"
      >
        <SidebarHeader>
          <TeamSwitcher />
          <NavDesktopActions />
        </SidebarHeader>

        {state === "expanded" && (<>
          <div className="mx-auto mb-0.5 h-auto w-[90%] border-t border-dashed" />
        </>)}

        <SidebarContent className="@container relative my-0 max-h-svh pt-2 pb-0 group-data-[collapsible=icon]:invisible [&>button]:hidden">
          <ScrollArea className="flex flex-col overflow-hidden w-full">
             <TabsContent
               value="sidebar"
               className="mx-1 mb-2 flex flex-col space-y-4"
             >
               {state === "expanded" && (<>
                 <History />
               </>)}
             </TabsContent>
 
             <TabsContent
               value="languages"
               className="mx-2.5 mb-2 gap-4"
             >
               <Command className="bg-background border">
                 <CommandInput className="!h-14" placeholder={lt("search-languages", "Search Languages")} />
 
                <CommandList className="flex-1 min-h-[80vh] lg:min-h-[52.5vh]">
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {i18n.locales.map((lang) => (
                      <CommandItem
                        key={lang}
                        value={`${lang} ${languageNames[lang] || lang}`}
                        onSelect={() => setLocale(lang)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            locale === lang ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <span>{languageNames[lang].charAt(0).toUpperCase() + languageNames[lang].slice(1) || ""}</span>
                          <span className="text-xs text-muted-foreground">
                            {lang.toUpperCase()}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
               </Command>
             </TabsContent>
 
             <TabsContent
               value="palette"
               className="mx-2.5 mb-2 flex flex-col space-y-4"
             >
               <section className="flex-1 space-y-1.5 max-sm:w-full max-sm:max-w-full">
                 {/* <ActionButtons /> */}
                 <Label className="flex items-center gap-1 pb-2">
                   <PaintBucket className="size-4" /> Theme presets
                 </Label>
                 <AllPresetsControl />
               </section>
               <ColorTokens />
             </TabsContent>
 
             <TabsContent value="tokens" className="mx-2.5 mb-2">
               <section className="space-y-1.5">
                 <Label className="flex items-center gap-1 pb-2">
                   <SlidersHorizontal className="size-4" /> Other tokens
                 </Label>
 
                 <ControlSection title="Surface" expanded className="p-0">
                   <SurfaceShadesControl className="bg-transparent" />
                   <div className="text-muted-foreground mb-3 truncate px-3 text-xs">
                     For background, card, popover, muted, accent...
                   </div>
                 </ControlSection>
 
                 <ControlSection title="Radius" expanded>
                   <RadiusSliderControl />
                 </ControlSection>
 
                 <ControlSection title="Shadows">
                   <ShadowsControl />
                 </ControlSection>
 
                 <ControlSection title="Spacing">
                   <ComingSoon />
                 </ControlSection>
 
               </section>
             </TabsContent>
 
             <TabsContent value="typography" className="mx-2.5 mb-2">
               <Typography />
             </TabsContent>
          </ScrollArea>
         </SidebarContent>
 
        <SidebarFooter className="px-2">
          {state === "expanded" ? (
            <>
              {/* <Banner title={lt("info-title", "Info")} message={lt("info-description", "Friday is still in beta so it can make mistakes.")} /> */}
              <TabsList className="w-full p-1">
                <TabsTrigger value="sidebar">
                  <PanelLeftDashed />
                </TabsTrigger>
                <TabsTrigger value="languages">
                  <LanguagesIcon />
                </TabsTrigger>
                <TabsTrigger value="palette">
                  <SwatchBook />
                </TabsTrigger>
                <TabsTrigger value="tokens">
                  <FileSliders />
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <LetterText />
                </TabsTrigger>
              </TabsList>
            </>
          ) : (
            <>
              <div className="inline md:hidden">
                <TabsList className="w-full p-1">
                  <TabsTrigger value="sidebar">
                    <PanelLeftDashed />
                  </TabsTrigger>
                  <TabsTrigger value="languages">
                    <LanguagesIcon />
                  </TabsTrigger>
                  <TabsTrigger value="palette">
                    <SwatchBook />
                  </TabsTrigger>
                  <TabsTrigger value="tokens">
                    <FileSliders />
                  </TabsTrigger>
                  <TabsTrigger value="typography">
                    <LetterText />
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="md:flex flex-col gap-2 hidden">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => {
                          toggleSidebar()
                        }}
                        className="hover:border flex min-h-8 min-w-8 hover:bg-accent hover:text-accent-foreground dark:border/10 dark:hover:bg-card items-center justify-center rounded-md"
                      >
                        <PanelRight className="size-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Expand Sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="hover:border hover:bg-accent hover:text-accent-foreground dark:border/10 dark:hover:bg-card flex min-h-8 min-w-8 items-center justify-center rounded-md">
                        <Info className="size-[18.5px]" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Friday is still in beta so it can make mistakes.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          )}
        </SidebarFooter>
      </Tabs>
      <SidebarRail />
    </Sidebar>
  );
}

export function CustomizerSidebarToggle({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, toggleSidebar, openMobile } = useSidebar();
  return (
    <>
      <Button
        size={"sm"}
        variant="outline"
        className="size-8 md:hidden"
        onClick={toggleSidebar}

      >
        <Menu className="size-4" />
      </Button>
    </>
  );
}
