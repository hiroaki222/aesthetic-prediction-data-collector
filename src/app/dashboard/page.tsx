'use client'
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/task-card"
import { fetchUserTasks, fetchUser } from "@/utils/supabase/actions";
import { Footer } from "@/components/footer";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { UserTasks } from "@/types/annotation";

interface Tasks {
  id: string;
  title: string;
  description: string;
  image: string;
  progress?: number;
}

export default function Dashboard() {
  const t = useTranslations('dashboard')
  const [tasks, setTasks] = useState<Tasks[]>([])
  const [activeTab, setActiveTab] = useState("all")

  const fetchTasks = async () => {
    const userData = await fetchUser();
    const uuid = userData?.id
    if (!uuid) {
      redirect(`/error/401`);
    }

    const userTasks: UserTasks[] = await fetchUserTasks(uuid)

    return userTasks.map((task: UserTasks) => ({
      id: task.task_id,
      title: task.data.title,
      description: task.data.description,
      image: task.data.urls[0],
      progress: task.step
    }))

  }


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTasks();
      setTasks(data);
    }
    fetchData();
  }, [])

  const handleStartTask = (taskId: string) => {
    console.log("Starting task:", taskId)
  }

  const getStatusFromProgress = (progress: number) => {
    if (progress === 100) return "completed"
    if (progress > 0) return "in-progress"
    return "not-started"
  }

  const filterTasks = (status?: string) => {
    if (!status || status === "all") return tasks
    return tasks.filter((task) => getStatusFromProgress(task.progress) === status)
  }

  const filteredTasks = filterTasks(activeTab)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
            <TabsTrigger value="not-started">{t('tabs.not-started')}</TabsTrigger>
            <TabsTrigger value="in-progress">{t('tabs.in-progress')}</TabsTrigger>
            <TabsTrigger value="completed">{t('tabs.completed')}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t('empty-state.message')}</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task, index) => (
                  <TaskCard key={task.id} {...task} onStart={handleStartTask} priority={index < 3} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}