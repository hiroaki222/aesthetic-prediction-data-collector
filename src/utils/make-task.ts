import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import readline from "readline";

export interface AnnotationTask {
  id: string;
  title: string;
  description: string;
  path: string;
}

async function loadAnnotationTasks(): Promise<AnnotationTask[]> {
  const filePath = path.resolve(__dirname, "../../data/annotation-tasks.json");
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as AnnotationTask[];
}

async function listFiles(): Promise<string[]> {
  const tmpDir = path.resolve(__dirname, ".", "tmp");
  const entries = await fs.readdir(tmpDir);
  return entries;
}

const makeTask = async () => {
  const tasks = await loadAnnotationTasks();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const putDir: string = await new Promise((resolve) => {
    rl.question("データセットを置くディレクトリ: public/tasks/", (answer) =>
      resolve(answer.trim())
    );
  });

  const title: string = await new Promise((resolve) => {
    rl.question("データセットのタイトル: ", (answer) => resolve(answer.trim()));
  });

  const description: string = await new Promise((resolve) => {
    rl.question(": ", (answer) => resolve(answer.trim()));
  });

  rl.close();

  tasks.push({
    id: randomUUID(),
    title: title,
    description: description,
    path: path.join("public/tasks", putDir, `${tasks.length + 1}/`),
  });

  await fs.writeFile(
    path.resolve(__dirname, "../../data/annotation-tasks.json"),
    JSON.stringify(tasks, null, 2),
    "utf8"
  );
};

makeTask();
