import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import readline from "readline";
import { put } from "@vercel/blob";
import inquirer from "inquirer";
import { unlink } from "fs/promises";
import { AnnotationTask } from "@/types/annotation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function insertTask(id: string, task: AnnotationTask, index: number) {
  let genre: number;
  switch (task.genre) {
    case "アート作品":
      genre = 0;
      break;
    case "ファッション":
      genre = 1;
      break;
    case "映像":
      genre = 2;
      break;
    default:
      genre = -1;
  }

  const identifier = String(genre) + "-" + index;

  /* const { error } = await supabase
    .from("annotation-tasks")
    .insert([{ task_id: id, data: task, identifier: identifier }])
    .select();

  if (error) {
    console.error("Error inserting task:", error);
  } */
  console.log({ task_id: id, data: task, identifier: identifier });
  console.log(task.urls.length);
}

async function listFiles(): Promise<string[]> {
  const tmpDir = path.resolve(__dirname, ".", "tmp");
  const entries = await fs.readdir(tmpDir);
  return entries;
}

async function uploadFile(
  filePaths: string[],
  taskId: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];
  for (const filePath of filePaths) {
    const fileBuffer = await fs.readFile(
      path.resolve(__dirname, ".", "tmp", filePath)
    );

    const blob = await put(
      taskId + "/" + String(randomUUID()) + path.extname(filePath),
      fileBuffer,
      {
        access: "public",
      }
    );
    uploadedUrls.push(blob.url);
  }
  return uploadedUrls;
}

async function deleteFiles(filePaths: string[]): Promise<void> {
  for (const filePath of filePaths) {
    const fullPath = path.resolve(__dirname, ".", "tmp", filePath);
    try {
      await unlink(fullPath);
    } catch (error) {
      console.error(`Error deleting file ${fullPath}:`, error);
    }
  }
}

const divideTask = async (task: AnnotationTask): Promise<AnnotationTask[]> => {
  let divideInto = 0;
  switch (task.genre) {
    case "アート作品":
      divideInto = 210;
      break;
    case "ファッション":
      divideInto = 210;
      break;
    case "映像":
      divideInto = 235;
      break;
    default:
      divideInto = 0;
  }
  if (divideInto <= 0) {
    return [task];
  }

  const dividedTasks: AnnotationTask[] = [];
  const totalItems = task.urls.length;

  for (let i = 0; i < totalItems; i += divideInto) {
    const endIndex = Math.min(i + divideInto, totalItems);
    const urlsChunk = task.urls.slice(i, endIndex);
    const resultChunk = task.result.slice(i, endIndex);

    const dividedTask: AnnotationTask = {
      title: task.title,
      description: task.description,
      tag: task.tag,
      urls: urlsChunk,
      genre: task.genre,
      result: resultChunk,
    };

    dividedTasks.push(dividedTask);
  }

  return dividedTasks;
};

const makeTask = async () => {
  const dataType = await inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: "データセットの種類",
      choices: ["画像", "動画", "音声"],
    },
  ]);

  let tag: string;
  switch (dataType.selection) {
    case "画像":
      tag = "Img";
      break;
    case "動画":
      tag = "video";
      break;
    case "音声":
      tag = "audio";
      break;
    default:
      tag = "unknown";
      break;
  }

  const genreInput = await inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: "ジャンルを選択",
      choices: ["アート作品", "ファッション", "映像"],
    },
  ]);

  let genre: AnnotationTask["genre"];
  switch (genreInput.selection) {
    case "アート作品":
      genre = "アート作品";
      break;
    case "ファッション":
      genre = "ファッション";
      break;
    case "映像":
      genre = "映像";
      break;
    default:
      genre = "unknown";
      break;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const title: string = await new Promise((resolve) => {
    rl.question("データセットのタイトル: ", (answer) => resolve(answer.trim()));
  });

  const description: string = await new Promise((resolve) => {
    rl.question("説明: ", (answer) => resolve(answer.trim()));
  });

  rl.close();

  const taskId = randomUUID();
  const urls: string[] = await uploadFile(await listFiles(), taskId);

  const result: AnnotationTask["result"] = [];
  for (let i = 0; i < urls.length; i++) {
    const tmp: number[] = Array(9).fill(3);
    tmp.push(4);
    result.push(tmp);
  }

  const originalTask: AnnotationTask = {
    title: title,
    description: description,
    tag: tag,
    urls: urls,
    genre: genre,
    result: result,
  };

  const dividedTasks = await divideTask(originalTask);

  for (let i = 0; i < dividedTasks.length; i++) {
    const taskId = randomUUID();
    await insertTask(taskId, dividedTasks[i], i);
  }

  await deleteFiles(await listFiles());
  return;
};

makeTask();
