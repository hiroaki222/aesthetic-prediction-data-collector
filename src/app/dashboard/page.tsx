'use client'
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/task-card"

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
    return sampleTasks;
  }

  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetchTaskData();
      setTasks(data);
    }
    loadTasks();
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
                <Button>Create New Task</Button>
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
    </div>
  )
}


const sampleTasks = [
  {
    id: "1",
    title: "Complete Project Setup",
    description:
      "Set up the initial project structure, configure development environment, and establish coding standards for the team.",
    image: "https://picsum.photos/300/200",
    progress: 0,
  },
  {
    id: "2",
    title: "Design System Implementation",
    description:
      "Create and implement a comprehensive design system including components, colors, typography, and spacing guidelines.",
    image: "https://picsum.photos/300/200?random=2",
    progress: 65,
  },
  {
    id: "3",
    title: "User Authentication Flow",
    description:
      "Implement secure user authentication including login, signup, password reset, and email verification features.",
    image: "https://picsum.photos/300/200?random=3",
    progress: 100,
  },
  {
    id: "4",
    title: "Database Schema Design",
    description:
      "Design and implement the database schema with proper relationships, indexes, and data validation rules.",
    image: "https://picsum.photos/300/200?random=4",
    progress: 0,
  },
  {
    id: "5",
    title: "API Development",
    description:
      "Build RESTful APIs with proper error handling, authentication, and documentation for frontend integration.",
    image: "https://picsum.photos/300/200?random=5",
    progress: 30,
  },
  {
    id: "6",
    title: "Mobile App Testing",
    description:
      "Comprehensive testing of mobile application across different devices and operating systems to ensure quality.",
    image: "https://picsum.photos/300/200?random=6",
    progress: 0,
  },
]