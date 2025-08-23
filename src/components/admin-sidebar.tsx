"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  Settings,
  Mail,
  ChevronLeft,
  ChevronRight,
  Home,
  Database,
} from "lucide-react"

interface AdminSidebarProps {
  activeItem: string
  onItemClick: (item: string) => void
}

const menuItems = [
  { id: "dashboard", label: "ダッシュボード", icon: BarChart3 },
  { id: "annotationData", label: "アノテーションデータ", icon: Database },
  { id: "users", label: "ユーザ管理", icon: Users, badge: "24" },
  { id: "contact", label: "コンタクト", icon: Mail, badge: "3" },
  { id: "settings", label: "設定", icon: Settings },
]

export function AdminSidebar({ activeItem, onItemClick }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn("bg-muted/40 border-r transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Admin Panel</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8 p-0", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="p-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                collapsed && "justify-center px-2",
                activeItem === item.id && "bg-primary/10 text-primary hover:bg-primary/20",
              )}
              onClick={() => onItemClick(item.id)}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </div>
      </nav>
      <div className="absolute bottom-4 left-2">
        <Button variant="ghost" size="sm" asChild className="">
          <a href="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            {!collapsed && "ダッシュボードに戻る"}
          </a>
        </Button>
      </div>
    </div>
  )
}
