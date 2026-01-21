import type { QuizTree } from "./schema";

export type QuizNodeId = string;

export type QuizState = {
    currentId: QuizNodeId;
    history: QuizNodeId[]; // чтобы сделать "назад"
    tags: string[];
};

export function createInitialState(tree: QuizTree): QuizState {
    return {
        currentId: tree.start,
        history: [],
        tags: [],
    };
}

export function getNode(tree: QuizTree, id: QuizNodeId) {
    const node = tree.nodes[id];
    if (!node) throw new Error(`Node not found: ${id}`);
    return node;
}
