import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import readline from "readline";
import { put } from "@vercel/blob";
import inquirer from "inquirer";

export interface AnnotationTask {
  id: string;
  title: string;
  description: string;
  tag: string;
  urls: string[];
}

async function loadAnnotationTasks(): Promise<AnnotationTask[]> {
  const filePath = path.resolve(
    __dirname,
    "../../../data/annotation-tasks.json"
  );
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as AnnotationTask[];
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

const makeTask = async () => {
  const tasks = await loadAnnotationTasks();

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

  tasks.push({
    id: taskId,
    title: title,
    description: description,
    tag: tag,
    urls: urls,
  });

  await fs.writeFile(
    path.resolve(__dirname, "../../../data/annotation-tasks.json"),
    JSON.stringify(tasks, null, 2),
    "utf8"
  );

  return;
};

makeTask();
