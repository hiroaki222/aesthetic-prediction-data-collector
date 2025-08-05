"use server";
import { createClient } from "./supabase/server";
import { UserTasks } from "@/types/annotation";

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
