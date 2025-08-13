import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import readline from "readline";
import { put } from "@vercel/blob";
import inquirer from "inquirer";
import { unlink } from "fs/promises";
import { AnnotationTask } from "@/types/annotation";
import { createClient } from "@supabase/supabase-js";
import * as cliProgress from "cli-progress";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function insertTask(
  id: string,
  task: AnnotationTask,
  index: number,
  taskId: string
) {
  const identifier = String(index);

  const { error } = await supabase
    .from("annotation-tasks")
    .insert([
      {
        task_id: id,
        data: task,
        identifier: identifier,
        genre: task.genre,
        master_task_id: taskId,
      },
    ])
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

  const progressBar = new cliProgress.SingleBar({
    format: "File upload |{bar}| {percentage}% | {value}/{total} files",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(filePaths.length, 0);

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
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

    const { error } = await supabase
      .from("url_filename")
      .insert([{ task_id: taskId, url: blob.url, filename: filePaths[i] }])
      .select();

    if (error) {
      console.error("Error inserting URL:", error);
    }

    uploadedUrls.push(blob.url);

    progressBar.update(i + 1);
  }

  progressBar.stop();
  console.log("\nFiles was uploaded.");

  return uploadedUrls;
}

async function deleteFiles(filePaths: string[]): Promise<void> {
  if (filePaths.length === 0) return;

  const progressBar = new cliProgress.SingleBar({
    format: "Files delete |{bar}| {percentage}% | {value}/{total} files",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(filePaths.length, 0);

  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const fullPath = path.resolve(__dirname, ".", "tmp", filePath);
    try {
      await unlink(fullPath);
    } catch (error) {
      console.error(`Error deleting file ${fullPath}:`, error);
    }

    progressBar.update(i + 1);
  }

  progressBar.stop();
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

    // 再検査用の12サンプルを非復元抽出でランダムに選択
    const chunkSize = urlsChunk.length;
    const sampleCount = Math.min(12, chunkSize); // チャンクサイズが12未満の場合は全て選択

    // ランダムなインデックスを非復元抽出で選択
    const availableIndices = Array.from({ length: chunkSize }, (_, idx) => idx);
    const selectedIndices: number[] = [];

    for (let j = 0; j < sampleCount; j++) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      selectedIndices.push(availableIndices[randomIndex]);
      availableIndices.splice(randomIndex, 1);
    }

    // 選択されたサンプルを複製
    const duplicateUrls = selectedIndices.map((idx) => urlsChunk[idx]);
    const duplicateResults = selectedIndices.map((idx) => resultChunk[idx]);

    // 複製したサンプルをランダムな位置に挿入
    const finalUrls = [...urlsChunk];
    const finalResults = [...resultChunk];

    for (let j = 0; j < duplicateUrls.length; j++) {
      const randomPosition = Math.floor(Math.random() * (finalUrls.length + 1));
      finalUrls.splice(randomPosition, 0, duplicateUrls[j]);
      finalResults.splice(randomPosition, 0, duplicateResults[j]);
    }

    const dividedTask: AnnotationTask = {
      title: task.title,
      description: task.description,
      tag: task.tag,
      urls: finalUrls,
      genre: task.genre,
      result: finalResults,
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
    tmp.push(0);
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

  const insertProgressBar = new cliProgress.SingleBar({
    format: "Insert task |{bar}| {percentage}% | {value}/{total} tasks",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  insertProgressBar.start(dividedTasks.length, 0);

  for (let i = 0; i < dividedTasks.length; i++) {
    await insertTask(randomUUID(), dividedTasks[i], i, taskId);

    // プロセスバーを更新
    insertProgressBar.update(i + 1);
  }

  insertProgressBar.stop();
  console.log("\nTasks were inserted successfully.");

  await deleteFiles(await listFiles());
  return;
};

makeTask();
