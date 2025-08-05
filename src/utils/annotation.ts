"use server";
import { createClient } from "./supabase/server";

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

export async function processAnnotation(taskData: object) {
  console.log(`Task Data: ${JSON.stringify(taskData)}`);

  return {
    success: true,
  };
}

export async function saveAnnotation(taskData: object) {
  console.log(taskData);
  return;
}
