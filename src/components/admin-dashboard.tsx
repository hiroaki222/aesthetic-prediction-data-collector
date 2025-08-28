import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  Database,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react"
import { getCumulativeUserComparison } from "@/utils/admin"
import { useEffect, useState } from "react"

export function AdminDashboard() {
  const [yesterdayData, setYesterdayData] = useState<{ change: string; upDown: "up" | "down"; todayCount: number }>({ change: "0", upDown: "down", todayCount: 0 })

  useEffect(() => {
    getCumulativeUserComparison().then(data => setYesterdayData(data))
  }, [])

  const stats = [
    {
      title: "総ユーザー数",
      value: yesterdayData?.todayCount + '人' || 0,
      change: yesterdayData?.change + '%' || "0%",
      trend: yesterdayData?.upDown || "up",
      icon: Users,
      color: "text-blue-600",
    }, {
      title: "アノテーションデータ",
      value: "456",
      change: "-2%",
      trend: "down",
      icon: Database,
      color: "text-purple-600",
    },
    {
      title: "終了者数",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "user",
      message: "新しいユーザーが登録しました(サンプル)",
      time: "2分前",
      status: "success",
    },
    {
      id: 2,
      type: "research",
      message: "研究データが更新されました(サンプル)",
      time: "15分前",
      status: "info",
    },
    {
      id: 3,
      type: "system",
      message: "システムメンテナンスが完了しました(サンプル)",
      time: "1時間前",
      status: "success",
    },
    {
      id: 4,
      type: "alert",
      message: "セキュリティアラートが発生しました(サンプル)",
      time: "2時間前",
      status: "warning",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                <span className="ml-1">先週比</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>最近の活動</CardTitle>
            <CardDescription>システムの最新の活動状況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${activity.status === "success"
                      ? "bg-green-500"
                      : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                      }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              すべての活動を見る
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>よく使用される管理機能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Users className="h-6 w-6" />
                <span className="text-sm">ユーザー追加</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <FileText className="h-6 w-6" />
                <span className="text-sm">コンテンツ作成</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Database className="h-6 w-6" />
                <span className="text-sm">データエクスポート</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">レポート生成</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
