# データセットの作り方

## 0. 環境構築

1. [bun](https://bun.sh/)をインストール．
2. プロジェクトルートに移動
3. ターミナルで`bun install`を実行して依存関係をインストール．

## 1. データの配置

`src/utils/make-task/tmp`ディレクトリにアノテーション対象のデータを置く．ファイル名は適当で良い．
例:

```
.
├── make-dataset.ts
├── README.md
└── tmp
    ├── 594-1920x1080.jpg
    └── 63-1920x1080.jpg

```

## 2. タスクの作成

ターミナルで実行．
プロンプトに従って必要な情報を入力する．

```bash
$ bun run src/utils/make-task/make-dataset
? データセットの種類 (Use arrow keys)
❯ 画像
  動画
  音声
データセットを置くディレクトリ: public/tasks/images
データセットのタイトル: title
説明: description
```

ディレクトリ名は`images`や`photos`など，揺れにくい名前を命名．
