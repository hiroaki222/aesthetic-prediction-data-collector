'use client'
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/task-card"
import { fetchUser } from "@/utils/supabase/actions";
import { Footer } from "@/components/footer";
import { useTranslations } from "next-intl";
import { redirect, useRouter } from "next/navigation";
import { UserTasks } from "@/types/annotation";
import { LoaderCircle, Lock } from 'lucide-react';
import { fetchUserTasks } from "@/utils/annotation";
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  order: number;
  tag?: "Img" | "audio" | "video";
  genre: "アート作品" | "ファッション" | "映像" | "unknown";
}

export default function Dashboard() {
  const t = useTranslations('dashboard')
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("not-started")
  const [isLoading, setIsLoading] = useState(true)
  const [tabIcons, setTabIcons] = useState<number[]>(new Array(5).fill(0))
  const router = useRouter();

  const fetchTasks = async () => {
    const uuid = await fetchUser('id');
    if (!uuid) {
      redirect(`/error/401`);
    }

    const userTasks: UserTasks[] = await fetchUserTasks(uuid)

    return userTasks.map((task: UserTasks) => ({
      id: task.task_id,
      title: task.data.title,
      description: task.data.description,
      image: task.data.urls[0],
      tag: task.data.tag as "Img" | "audio" | "video",
      genre: task.data.genre,
      progress: Math.floor((task.step / task.data.urls.length) * 100),
      order: task.order
    }))
  }


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTasks();
      setTasks(data);
      setIsLoading(false);
    }
    fetchData();
  }, [])

  useEffect(() => {
    // const completedTaskCount = tasks.filter(task => task.progress === 100).length

    setTabIcons(new Array(5).fill(0))

    for (let i = 0; i < tasks.length; i++) {
      const status = getStatusFromProgress(tasks[i], tasks)
      switch (status) {
        case "locked":
          setTabIcons((prev) => {
            const newIcons = [...prev];
            newIcons[0] += 1;
            return newIcons;
          });
          break;
        case "not-started":
          setTabIcons((prev) => {
            const newIcons = [...prev];
            newIcons[2] += 1;
            return newIcons;
          });
          break;
        case "in-progress":
          setTabIcons((prev) => {
            const newIcons = [...prev];
            newIcons[3] += 1;
            return newIcons;
          });
          break;
        case "completed":
          setTabIcons((prev) => {
            const newIcons = [...prev];
            newIcons[4] += 1;
            return newIcons;
          });
          break;
      }
      setTabIcons((prev) => {
        const newIcons = [...prev];
        newIcons[1] += 1;
        return newIcons;
      });
    }
  }, [tasks])

  const handleStartTask = (taskId: string) => {
    router.push(`/annotation/?taskId=${taskId}`);
  }

  const getStatusFromProgress = (task: Task, allTasks: Task[]) => {
    if (task.progress === 100) {
      return "completed"
    }
    if (task.progress > 0) {
      return "in-progress"
    }
    if (task.order === 0) {
      return "not-started"
    }
    const prevTask = allTasks.find(t => t.genre === task.genre && t.order === task.order - 1)
    if (prevTask && prevTask.progress === 100) {
      return "not-started"
    }
    return "locked"
  }

  const filterTasks = (status?: string) => {
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

    if (!status || status === "all") return sortedTasks

    return sortedTasks.filter((task) => getStatusFromProgress(task, sortedTasks) === status)
  }

  const filteredTasks = filterTasks(activeTab)
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="flex gap-5">
            <TabsTrigger
              value="locked"
              className={activeTab === "locked" ? "text-black font-bold relative" : "relative text-muted-foreground"}
            >
              <Lock />
              <Badge className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-xs w-4 h-4 flex items-center justify-center rounded-full ${activeTab === "locked" ? "" : "bg-muted-foreground text-background"}`}>
                {tabIcons[0]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className={activeTab === "all" ? "text-black font-bold relative" : "relative text-muted-foreground"}
            >
              {t('tabs.all')}
              <Badge className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-xs w-4 h-4 flex items-center justify-center rounded-full ${activeTab === "all" ? "" : "bg-muted-foreground text-background"}`}>
                {tabIcons[1]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="not-started"
              className={activeTab === "not-started" ? "text-black font-bold relative" : "relative text-muted-foreground"}
            >
              {t('tabs.not-started')}
              <Badge className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-xs w-4 h-4 flex items-center justify-center rounded-full ${activeTab === "not-started" ? "" : "bg-muted-foreground text-background"}`}>
                {tabIcons[2]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className={activeTab === "in-progress" ? "text-black font-bold relative" : "relative text-muted-foreground"}
            >
              {t('tabs.in-progress')}
              <Badge className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-xs w-4 h-4 flex items-center justify-center rounded-full ${activeTab === "in-progress" ? "" : "bg-muted-foreground text-background"}`}>
                {tabIcons[3]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={activeTab === "completed" ? "text-black font-bold relative" : "relative text-muted-foreground"}
            >
              {t('tabs.completed')}
              <Badge className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-xs w-4 h-4 flex items-center justify-center rounded-full ${activeTab === "completed" ? "" : "bg-muted-foreground text-background"}`}>
                {tabIcons[4]}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading
              ? (
                <a>
                  <LoaderCircle className="animate-spin h-6 w-6 text-muted-foreground mx-auto" />
                  <p className="text-center text-muted-foreground mt-2">{t('loading')}</p>
                </a>
              )
              : (
                <div>
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        {tabIcons[1] === 0 ? t('empty-state.reload-plz') : t('empty-state.message')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredTasks.map((task, index) => {
                        const taskStatus = getStatusFromProgress(task, tasks);
                        return (
                          <TaskCard
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            image={task.image}
                            progress={task.progress}
                            order={task.order}
                            tag={task.tag}
                            onStart={handleStartTask}
                            priority={index < 3}
                            isLocked={taskStatus === "locked"}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}