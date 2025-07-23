'use client'
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/task-card"
import { fetchTasks } from "@/utils/supabase/actions";
import { Footer } from "@/components/footer";

interface Task {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("all")

  const fetchTaskData = async (): Promise<Task[]> => {
    const data = await fetchTasks();
    return data
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTaskData();
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
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No tasks found in this category</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} {...task} onStart={handleStartTask} />
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