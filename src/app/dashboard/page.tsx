'use client'
import { Header } from "@/components/header";
import { useEffect, useState, useMemo } from "react";
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
  const globalOrderedTasks = useMemo(() => {
    const genreSeq = ["アート作品", "ファッション", "映像"] as const;
    const grouped = Object.fromEntries(
      genreSeq.map(g => [g, tasks.filter(t => t.genre === g).sort((a, b) => a.order - b.order)])
    ) as Record<typeof genreSeq[number], Task[]>;
    const maxLen = Math.max(...Object.values(grouped).map(arr => arr.length));
    const ordered: Task[] = [];
    for (let i = 0; i < maxLen; i++) {
      genreSeq.forEach(g => { if (grouped[g][i]) ordered.push(grouped[g][i]) });
    }
    return ordered;
  }, [tasks]);
  const nextTaskId = useMemo(() => {
    const idx = globalOrderedTasks.findIndex((task, i) => {
      if (task.progress === 100) return false;
      if (i === 0) return true;
      return globalOrderedTasks.slice(0, i).every(prev => prev.progress === 100);
    });
    return idx >= 0 ? globalOrderedTasks[idx].id : undefined;
  }, [globalOrderedTasks]);

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
    if (tabIcons[2] >= 1) {
      setActiveTab("not-started");
    } else if (tabIcons[3] >= 1) {
      setActiveTab("in-progress");
    }
  }, [tabIcons])

  useEffect(() => {
    setTabIcons(new Array(5).fill(0));
    for (const task of tasks) {
      let status: string;
      if (task.progress === 100) status = "completed";
      else if (task.progress > 0) status = "in-progress";
      else if (task.id === nextTaskId) status = "not-started";
      else status = "locked";
      switch (status) {
        case "locked":
          setTabIcons(prev => { const arr = [...prev]; arr[0]++; return arr });
          break;
        case "not-started":
          setTabIcons(prev => { const arr = [...prev]; arr[2]++; return arr });
          break;
        case "in-progress":
          setTabIcons(prev => { const arr = [...prev]; arr[3]++; return arr });
          break;
        case "completed":
          setTabIcons(prev => { const arr = [...prev]; arr[4]++; return arr });
          break;
      }
      setTabIcons(prev => { const arr = [...prev]; arr[1]++; return arr });
    }
  }, [tasks, nextTaskId]);

  const handleStartTask = (taskId: string) => {
    router.push(`/annotation/?taskId=${taskId}`);
  }

  const filterTasks = (status?: string) => {
    const list = !status || status === "all" ? globalOrderedTasks : globalOrderedTasks.filter(task => {
      if (task.progress === 100) return status === "completed";
      if (task.progress > 0) return status === "in-progress";
      if (task.id === nextTaskId) return status === "not-started";
      return status === "locked";
    });
    return list;
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
                        // ステータス判定をインライン化
                        const status = task.progress === 100
                          ? "completed"
                          : task.progress > 0
                            ? "in-progress"
                            : task.id === nextTaskId
                              ? "not-started"
                              : "locked";
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
                            isLocked={status === "locked"}
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