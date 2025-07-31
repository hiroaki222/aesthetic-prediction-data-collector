export async function fetchAnnotation(taskId: string) {
  console.log(`Fetching annotation for task ID: ${taskId}`);
  const data = {
    "1": {
      imageUrl: "https://picsum.photos/300/200?random=1",
    },
    "2": {
      imageUrl: "https://picsum.photos/300/200?random=2",
    },
    "3": {
      imageUrl: "https://picsum.photos/300/200?random=3",
    },
    "4": {
      imageUrl: "https://picsum.photos/300/200?random=4",
    },
    "5": {
      imageUrl: "https://picsum.photos/300/200?random=5",
    },
    "6": {
      imageUrl: "https://picsum.photos/300/200?random=6",
    },
    "7": {
      imageUrl: "https://picsum.photos/300/200?random=7",
    },
    "8": {
      imageUrl: "https://picsum.photos/300/200?random=8",
    },
    "9": {
      imageUrl: "https://picsum.photos/300/200?random=9",
    },
    "10": {
      imageUrl: "https://picsum.photos/300/200?random=10",
    },
    "11": {
      imageUrl: "https://picsum.photos/300/200?random=11",
    },
    "12": {
      imageUrl: "https://picsum.photos/300/200?random=12",
    },
    "13": {
      imageUrl: "https://picsum.photos/300/200?random=13",
    },
    "14": {
      imageUrl: "https://picsum.photos/300/200?random=14",
    },
    "15": {
      imageUrl: "https://picsum.photos/300/200?random=15",
    },
    "16": {
      imageUrl: "https://picsum.photos/300/200?random=16",
    },
  };

  return data;
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
