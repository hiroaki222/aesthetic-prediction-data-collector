import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import readline from "readline";
import { rename } from "fs/promises";

export interface AnnotationTask {
  id: string;
  title: string;
  description: string;
  path: string;
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
    rl.question("説明: ", (answer) => resolve(answer.trim()));
  });

  rl.close();

  const taskPath = path.join("public/tasks", putDir, `${tasks.length + 1}/`);

  tasks.push({
    id: randomUUID(),
    title: title,
    description: description,
    path: taskPath,
  });

  await fs.writeFile(
    path.resolve(__dirname, "../../../data/annotation-tasks.json"),
    JSON.stringify(tasks, null, 2),
    "utf8"
  );

  await fs.mkdir(path.resolve(__dirname, "../../../", taskPath), {
    recursive: true,
  });
  return taskPath;
};

const exportData = async (sourceDir: string) => {
  const files = await listFiles();
  let fileNumber = 0;
  for (const file of files) {
    try {
      const ext = path.extname(file);
      rename(
        path.join(path.resolve(__dirname, ".", "tmp"), file),
        path.join(
          path.resolve(__dirname, "../../../", sourceDir),
          `${fileNumber}${ext}`
        )
      );

      fileNumber++;
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
      break;
    }
  }
};

const dir = await makeTask();
exportData(dir);
