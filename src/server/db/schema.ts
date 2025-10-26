import { InferSelectModel, relations, sql } from "drizzle-orm";
import { index, pgTableCreator, unique } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `fastbreakai_dash_${name}`);

export const event = createTable("events", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  event: d.text().notNull(),
  description: d.text().notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

// export const user = createTable("users", (d) => ({
//   id: d.uuid().defaultRandom().primaryKey(),
//   clerkUserId: d.varchar({ length: 255 }).notNull().unique(),
//   role: d.varchar({ length: 20 }).default("user").notNull(),
//   createdAt: d
//     .timestamp({ withTimezone: true })
//     .default(sql`CURRENT_TIMESTAMP`)
//     .notNull(),
// }));

// export const question = createTable(
//   "questions",
//   (d) => {
//     return {
//       id: d.uuid().defaultRandom().primaryKey(),
//       questionNumber: d.integer().notNull(),
//       prompt: d.text().notNull(),
//       explanation: d.text(),
//       expectedNumAnswers: d.integer().notNull().default(1),
//       language: d.text().notNull().default("en"),
//       createdAt: d
//         .timestamp({ withTimezone: true })
//         .default(sql`CURRENT_TIMESTAMP`)
//         .notNull(),
//       updatedAt: d
//         .timestamp({ withTimezone: true })
//         .default(sql`CURRENT_TIMESTAMP`)
//         .notNull(),
//     };
//   },
//   (table) => [unique("ques_lan_idx").on(table.language, table.questionNumber)]
// );

// export const answer = createTable(
//   "answers",
//   (d) => {
//     return {
//       id: d.uuid().defaultRandom().primaryKey(),
//       questionId: d
//         .uuid()
//         .notNull()
//         .references(() => question.id, { onDelete: "cascade" }),
//       text: d.text().notNull(),
//       isCorrect: d.boolean().notNull().default(false),
//       language: d.text().notNull().default("en"),
//     };
//   },
//   (table) => [index("ans_qt_id_idx").on(table.questionId)]
// );

// export const questionRelations = relations(question, ({ many }) => ({
//   answers: many(answer),
// }));

// export const answerRelations = relations(answer, ({ one }) => ({
//   question: one(question, {
//     fields: [answer.questionId],
//     references: [question.id],
//   }),
// }));

// export const tag = createTable("tags", (d) => {
//   return {
//     id: d.uuid().defaultRandom().primaryKey(),
//     name: d.text().notNull().unique(),
//     description: d.text(),
//     language: d.text().notNull().default("en"),
//     createdAt: d
//       .timestamp({ withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//   };
// });

// export const question_tag = createTable("question_tags", (d) => {
//   return {
//     id: d.uuid().defaultRandom().primaryKey(),
//     questionId: d
//       .uuid()
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     tagId: d
//       .uuid()
//       .notNull()
//       .references(() => tag.id, { onDelete: "cascade" }),
//   };
// });

// export const relatedQuestion = createTable("related_questions", (d) => {
//   return {
//     id: d.uuid().defaultRandom().primaryKey(),
//     questionId: d
//       .uuid()
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     relationshipType: d.text("relationship_type"),
//   };
// });

// export const question_answer = createTable(
//   "question_answers",
//   (d) => {
//     return {
//       id: d.uuid().defaultRandom().primaryKey(),
//       questionId: d
//         .uuid()
//         .notNull()
//         .references(() => question.id, { onDelete: "cascade" }),
//       answerId: d
//         .uuid()
//         .notNull()
//         .references(() => answer.id, { onDelete: "cascade" }),
//       userId: d
//         .uuid()
//         .notNull()
//         .references(() => user.id, { onDelete: "cascade" }),
//       createdAt: d
//         .timestamp({ withTimezone: true })
//         .default(sql`CURRENT_TIMESTAMP`)
//         .notNull(),
//     };
//   },
//   (table) => [
//     unique("qt_ans_unique_idx").on(
//       table.questionId,
//       table.answerId,
//       table.userId
//     ),
//   ]
// );

// export const resource = createTable("resources", (d) => {
//   return {
//     id: d.uuid().defaultRandom().primaryKey(),
//     title: d.varchar({ length: 255 }).notNull(),
//     url: d.text().notNull(),
//     tagId: d.uuid().references(() => tag.id, { onDelete: "set null" }),
//     questionId: d
//       .uuid()
//       .references(() => question.id, { onDelete: "set null" }),
//     language: d.text().notNull().default("en"),
//     createdAt: d
//       .timestamp({ withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//   };
// });

// export type QuestionRow = InferSelectModel<typeof question>;
// export type AnswerRow = InferSelectModel<typeof answer>;
