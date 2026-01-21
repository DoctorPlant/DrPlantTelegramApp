import { z } from "zod";

// const hexColor = z.string().regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/).optional();

export const QuizOptionSchema = z.object({
    text: z.string(),
    next: z.string(),
    tags: z.array(z.string()).optional(),
});

export const QuizQuestionNodeSchema = z.object({
    type: z.literal("question"),
    text: z.string(),
    options: z.array(QuizOptionSchema),
});

export const QuizResultNodeSchema = z.object({
    type: z.literal("result"),
    title: z.string(),
    diagnosis: z.string(),
    actions: z.array(z.string()),
    fertilizer: z.string(),
});

export const QuizNodeSchema = z.union([QuizQuestionNodeSchema, QuizResultNodeSchema]);

export const QuizTreeSchema = z.object({
    id: z.string(),
    title: z.string(),
    start: z.string(),
    nodes: z.record(z.string().min(1), QuizNodeSchema),
});

export type QuizTree = z.infer<typeof QuizTreeSchema>;
