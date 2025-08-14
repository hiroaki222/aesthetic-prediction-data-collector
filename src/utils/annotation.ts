"use server";
import { createClient } from "./supabase/server";
import { AnnotationTask, AnnotationTasks, UserTasks } from "@/types/annotation";

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

  /*  const reload = await makeUserAnnotationTasks(uuid);
  if (reload) {
    return fetchUserTasks(uuid);
  } */

  if (data.length === 0) {
    const reload = await makeUserAnnotationTasks(uuid);
    if (reload) {
      return fetchUserTasks(uuid);
    }
  }

  return data;
}

export async function fetchTasks(setNum: number): Promise<AnnotationTasks[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("annotation-tasks")
    .select("*")
    .eq("identifier", setNum);

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  let newSetNum = setNum + 1;
  if (newSetNum >= 6) {
    newSetNum = 0;
  }

  const { error: updateError } = await supabase
    .from("set")
    .update({ all: newSetNum })
    .eq("id", 1)
    .select();

  if (updateError) {
    console.error("Error updating set:", updateError);
    return [];
  }
  return data;
}

export async function makeUserAnnotationTasks(uuid: string): Promise<boolean> {
  const fetchSetNum = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("set").select("*");
    if (error) {
      console.error("Error fetching set:", error);
      return false;
    }
    return data[0]["all"];
  };

  const setNum = await fetchSetNum();
  const tasks = await fetchTasks(setNum);

  for (const task of tasks) {
    task.data.urls = task.data.urls.sort(() => Math.random() - 0.5);

    const divideInto = Math.floor(task.data.urls.length / 6);
    let order: number = 0.1;
    switch (task.data.genre) {
      case "アート作品":
        order += 1;
        break;
      case "ファッション":
        order += 2;
        break;
      case "映像":
        order += 3;
        break;
    }
    for (let i = 0; i < task.data.urls.length; i += divideInto) {
      const endIndex = Math.min(i + divideInto);
      const urlsChunk = task.data.urls.slice(i, endIndex);
      const resultChunk = task.data.result.slice(i, endIndex);

      const data: AnnotationTask = {
        title: task.data.title,
        description: task.data.description,
        tag: task.data.tag,
        genre: task.data.genre,
        urls: urlsChunk,
        result: resultChunk,
      };
      order = Math.floor(order * 100) / 100;
      const insertTask = {
        uuid: uuid,
        master_task_id: task.task_id,
        task_id: crypto.randomUUID(),
        data: data,
        step: 0,
        order: order,
      };

      const supabase = await createClient();
      const { error } = await supabase
        .from("user-annotation-data")
        .insert(insertTask)
        .select();

      if (error) {
        console.error("Error inserting user annotation task:", error);
        return false;
      }

      order += 0.1;
    }
  }

  return true;
}
