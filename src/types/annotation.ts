export interface UserTasks {
  id: number;
  create_at: string;
  uuid: string;
  task_id: string;
  data: {
    title: string;
    description: string;
    tag: string;
    urls: string[];
    result: number[][];
  };
  step: number;
}

export interface AnnotationTasks {
  id: number;
  task_id: string;
  data: object;
}

export interface AnnotationTask {
  title: string;
  description: string;
  tag: string;
  urls: string[];
  result: number[][];
}
