export interface UserTasks {
  id: number;
  create_at: string;
  uuid: string;
  task_id: string;
  data: AnnotationTask;
  step: number;
  identifier: number;
  order: number;
}

export interface AnnotationTasks {
  id: number;
  task_id: string;
  data: AnnotationTask;
}

export interface AnnotationTask {
  title: string;
  description: string;
  tag: string;
  genre: "アート作品" | "ファッション" | "映像" | "unknown";
  urls: string[];
  result: number[][];
}
