'use client'
import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminUsers } from "@/components/admin-users"

export default function Admin() {
  const [activeItem, setActiveItem] = useState("dashboard")

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <AdminDashboard />
      case "users":
        return <AdminUsers />
      case "users ":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">研究データ</h1>
            <p className="text-muted-foreground">研究データ管理機能は開発中です。</p>
          </div>
        )
      case "contact":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">メッセージ</h1>
            <p className="text-muted-foreground">メッセージ管理機能は開発中です。</p>
          </div>
        )
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}