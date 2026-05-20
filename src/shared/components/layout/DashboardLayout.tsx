"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Activity } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "../ui/button";

export interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

export interface NavGroup {
  category: string;
  items: NavItem[];
}

interface DashboardLayoutProps {
  children: ReactNode;
  navGroups: NavGroup[];
  title: string;
}

export function DashboardLayout({ children, navGroups, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { logout, role } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
          <Activity className="size-6 text-primary mr-2" />
          <span className="font-display font-bold text-lg tracking-tight">Metavix</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {group.category}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className={`mr-3 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-4 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <h1 className="text-xl font-display font-semibold text-foreground hidden sm:block">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium leading-none mb-1">
                {role === 'PATIENT' ? 'Sarah Jenkins' : 'Dr. Thorne'}
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                {role === 'PATIENT' ? 'Paciente' : 'Cardiólogo'}
              </span>
            </div>
            <div className="size-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {role === 'PATIENT' ? 'SJ' : 'AT'}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="size-4 mr-2" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <h1 className="text-2xl font-display font-bold text-foreground mb-6 sm:hidden">
              {title}
            </h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
