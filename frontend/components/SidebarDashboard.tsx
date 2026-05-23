"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import useAuth from "@/hooks/useAuth"
import { authKey } from "@/keys/auth.key"
import authService from "@/services/auth.service"
import {
  staffMenuItems,
  staffSettingsItems,
  coachMenuItems,
  coachSettingsItems,
} from "@/constants/sidebarList"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isLoading } = useAuth()

  const role = (user as any)?.role // "pengurus" or "pelatih"

  const menuItems = isLoading
    ? []
    : role === "pelatih"
    ? coachMenuItems
    : role === "pengurus"
    ? staffMenuItems
    : []

  const settingsItems = isLoading
    ? []
    : role === "pelatih"
    ? coachSettingsItems
    : role === "pengurus"
    ? staffSettingsItems
    : []

  const name = isLoading
    ? "Memuat..."
    : (user as any)?.name || (user as any)?.username || "User TSC"

  const email = isLoading
    ? "..."
    : (user as any)?.email || `${name.toLowerCase().replace(/\s+/g, "")}@tsc.id`

  const initials = isLoading
    ? "..."
    : name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "US"

  const handleLogout = async () => {
    try {
      await authService.logout()
      queryClient.setQueryData(authKey.me(), null)
      router.push("/login")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Sidebar className="border-r border-border/40 bg-background">
      {/* ── Header ── */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* Logo mark */}
          <div className="relative flex-shrink-0">
            {/* Soft ambient glow behind logo */}
            <div className="absolute inset-0 rounded-xl bg-violet-500/20 blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 h-10 w-10 rounded-xl overflow-hidden ring-1 ring-border/50 shadow-sm">
              <Image
                src="/logo.jpeg"
                alt="TSC Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>

          {/* Brand name */}
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-[15px] font-semibold tracking-tight">
              <span className="text-violet-500">Trisula</span>
              {" "}
              <span className="text-emerald-500">Sport Club</span>
            </span>
            <span className="text-[11px] text-muted-foreground font-normal tracking-wide">
              Portal Akademik
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-border/40" />

      {/* ── Content ── */}
      <SidebarContent className="px-2 py-3">

        {/* Main menu */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-9 rounded-lg px-3 gap-3 text-[13.5px] font-normal transition-all duration-150",
                        "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                        isActive && [
                          "bg-violet-50 dark:bg-violet-950/40",
                          "text-violet-700 dark:text-violet-300",
                          "hover:bg-violet-50 dark:hover:bg-violet-950/40",
                          "hover:text-violet-700 dark:hover:text-violet-300",
                          "font-medium",
                        ]
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "h-[17px] w-[17px] flex-shrink-0 transition-colors",
                            isActive
                              ? "text-violet-600 dark:text-violet-400"
                              : "text-muted-foreground/70"
                          )}
                        />
                        <span>{item.title}</span>

                        {/* Active indicator dot */}
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {settingsItems.length > 0 && (
          <>
            <SidebarSeparator className="my-3 bg-border/40" />

            {/* Settings group */}
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
                Sistem
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {settingsItems.map((item) => {
                    const isActive = pathname === item.href
                    const isLogout = item.href === "/logout"

                    if (isLogout) {
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            onClick={handleLogout}
                            tooltip={item.title}
                            className={cn(
                              "h-9 rounded-lg px-3 gap-3 text-[13.5px] font-normal transition-all duration-150 cursor-pointer",
                              "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                            )}
                          >
                            <item.icon className="h-[17px] w-[17px] flex-shrink-0 text-red-600 dark:text-red-400" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    }

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className={cn(
                            "h-9 rounded-lg px-3 gap-3 text-[13.5px] font-normal transition-all duration-150",
                            "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                            isActive && [
                              "bg-violet-50 dark:bg-violet-950/40",
                              "text-violet-700 dark:text-violet-300",
                              "hover:bg-violet-50 dark:hover:bg-violet-950/40",
                              "hover:text-violet-700 dark:hover:text-violet-300",
                              "font-medium",
                            ]
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "h-[17px] w-[17px] flex-shrink-0 transition-colors",
                                isActive
                                  ? "text-violet-600 dark:text-violet-400"
                                  : "text-muted-foreground/70"
                              )}
                            />
                            <span>{item.title}</span>

                            {isActive && (
                              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="px-2 pb-3 pt-2 border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    "h-auto w-full rounded-xl px-3 py-2.5",
                    "hover:bg-accent/60 transition-colors duration-150",
                    "data-[state=open]:bg-accent/60"
                  )}
                >
                  <div className="flex items-center gap-3 w-full min-w-0">
                    {/* Avatar */}
                    <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-violet-500/20">
                      <AvatarImage src="/images/avatar.jpg" alt="User" />
                      <AvatarFallback className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* User info */}
                    <div className="flex flex-col items-start text-left min-w-0 flex-1">
                      <span className="text-[13px] font-medium text-foreground leading-none mb-0.5">
                        {name}
                      </span>
                      <span className="text-[11px] text-muted-foreground leading-none truncate w-full">
                        {email}
                      </span>
                    </div>

                    {/* Chevron */}
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="top"
                sideOffset={8}
                className="w-56 rounded-xl border border-border/50 bg-popover shadow-lg shadow-black/5 p-1"
              >
                {/* User header inside dropdown */}
                <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
                  <Avatar className="h-7 w-7 ring-1 ring-border">
                    <AvatarImage src="/images/avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-[10px] font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-medium text-foreground leading-none mb-0.5">
                      {name}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-none truncate">
                      {email}
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-border/40 my-1" />

                <DropdownMenuItem className="rounded-lg px-2 py-2 text-[13px] cursor-pointer gap-2.5 focus:bg-accent/60">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Profil Saya</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border/40 my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg px-2 py-2 text-[13px] cursor-pointer gap-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}