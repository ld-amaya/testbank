CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "is_teacher" boolean NOT NULL
);

CREATE TABLE "topics" (
  "id" SERIAL PRIMARY KEY,
  "topic" TEXT NOT NULL
);

CREATE TABLE "questions" (
  "id" SERIAL PRIMARY KEY,
  "topic_id" INTEGER
    REFERENCES topics ON DELETE CASCADE,
  "question" TEXT NOT NULL,
  "images" TEXT,
  "a" TEXT NOT NULL,
  "b" TEXT NOT NULL,
  "c" TEXT NOT NULL,
  "d" TEXT NOT NULL,
  "answer" TEXT NOT NULL
);

CREATE TABLE "testsummary" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL
    REFERENCES users ON DELETE CASCADE,
  "start" DATE,
  "end" DATE,
  "score" int,
  "is_done" boolean NOT NULL
);

CREATE TABLE "test" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL
   REFERENCES users ON DELETE CASCADE,
  "testsummary_id" INTEGER NOT NULL
    REFERENCES testsummary ON DELETE CASCADE,
  "question_id" INTEGER NOT NULL
    REFERENCES questions ON DELETE CASCADE,
  "num" INTEGER NOT NULL,
  "a" TEXT NOT NULL,
  "b" TEXT NOT NULL,
  "c" TEXT NOT NULL,
  "d" TEXT NOT NULL,
  "answer" TEXT,
  "is_correct" boolean NOT NULL,
  "done" boolean NOT NULL
);
