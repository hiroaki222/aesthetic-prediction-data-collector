import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import readline from "readline";
import { put } from "@vercel/blob";
import inquirer from "inquirer";
import { unlink } from "fs/promises";
import { AnnotationTask } from "@/types/annotationTaskData";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function insertTask(id: string, task: AnnotationTask) {
  const { error } = await supabase
    .from("annotation-tasks")
    .insert([{ task_id: id, data: task }])
    .select();

  if (error) {
    console.error("Error inserting task:", error);
  }
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

  insertTask(taskId, {
    title: title,
    description: description,
    tag: tag,
    urls: urls,
  });

  await deleteFiles(await listFiles());

  return;
};

makeTask();
