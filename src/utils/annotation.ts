"use server";
import { AnnotationData } from "@/components/annotation.input";
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
  annotationResult: AnnotationData[],
  annotationTargets: UserTasks,
  step: number,
  uuid: string
) {
  annotationTargets.step = step;
  const supabase = await createClient();
  const { error } = await supabase
    .from("user-annotation-data")
    .update(annotationTargets)
    .match({ task_id: taskId, uuid: uuid })
    .select();
  if (error) {
    console.error("Error saving annotation:", error);
  }
  console.log(step);
  return;
}
