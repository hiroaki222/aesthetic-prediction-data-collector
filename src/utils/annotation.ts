"use server";
import { createClient } from "./supabase/server";
import { AnnotationTasks, UserTasks } from "@/types/annotation";

export async function fetchAnnotation(taskId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user-annotation-data")
    .select("*")
    .eq("task_id", taskId);

  if (error) {
    console.error("Error fetching annotations:", error);
    return [];
  }

  return data[0];
}

export async function saveAnnotation(
  taskId: string,
  annotationResult: number[][],
  annotationTargets: UserTasks,
  step: number,
  uuid: string
) {
  const supabase = await createClient();
  if (!annotationResult) {
    return;
  }

  annotationTargets.data.result = annotationResult;

  const { error } = await supabase
    .from("user-annotation-data")
    .update({ data: annotationTargets.data, step: step })
    .match({ task_id: taskId, uuid: uuid })
    .select();
  if (error) {
    console.error(error);
  }
  return;
}

export async function fetchUserTasks(uuid: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user-annotation-data")
    .select("*")
    .eq("uuid", uuid);

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  const reload = await makeUserAnnotationTasks(uuid, data);
  if (reload) {
    return fetchUserTasks(uuid);
  }

  return data;
}

export async function fetchTasks() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("annotation-tasks").select("*");

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return data;
}

export async function makeUserAnnotationTasks(
  uuid: string,
  userTasks: UserTasks[]
): Promise<boolean> {
  const annotationTasks: AnnotationTasks[] = await fetchTasks();

  const userTaskIds = new Set(userTasks.map((task) => task.task_id));
  const deficiencyAnnotationTasks = annotationTasks.filter(
    (task) => !userTaskIds.has(task.task_id)
  );
  if (deficiencyAnnotationTasks.length === 0) {
    return false;
  }

  const insertTasks = [];
  for (const task of deficiencyAnnotationTasks) {
    insertTasks.push({
      uuid: uuid,
      task_id: task.task_id,
      data: task.data,
      step: 0,
    });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("user-annotation-data")
    .insert(insertTasks)
    .select();

  if (error) {
    console.error("Error inserting user annotation tasks:", error);
    return false;
  }
  return false;
}
