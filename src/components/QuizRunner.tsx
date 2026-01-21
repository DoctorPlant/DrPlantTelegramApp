import { useMemo, useState } from "react";
import { Button, Cell, List, Section, Text } from "@telegram-apps/telegram-ui";

import type { QuizTree } from "@/quiz/schema";
import { createInitialState, getNode, type QuizState } from "@/quiz/engine";

export function QuizRunner({ tree }: { tree: QuizTree }) {
    const initial = useMemo(() => createInitialState(tree), [tree]);
    const [state, setState] = useState<QuizState>(initial);

    const node = getNode(tree, state.currentId);

    function goBack() {
        setState((prev) => {
            if (prev.history.length === 0) return prev;
            const newHistory = prev.history.slice(0, -1);
            const prevId = prev.history[prev.history.length - 1];
            return {
                ...prev,
                currentId: prevId,
                history: newHistory,
            };
        });
    }

    function restart() {
        setState(createInitialState(tree));
    }

    if (node.type === "result") {
        return (
            <List>
                <Section header={node.title} footer={node.diagnosis}>
                    {node.actions.map((a, i) => (
                        <Cell key={i}>{a}</Cell>
                    ))}
                </Section>

                <Section header="Удобрение">
                    <Cell>{node.fertilizer}</Cell>
                </Section>

                <Section>
                    <Cell>
                        <Button size="l" stretched onClick={restart}>
                            Пройти ещё раз
                        </Button>
                    </Cell>
                </Section>
            </List>
        );
    }

    // question
    return (
        <List>
            <Section header={tree.title}>
                <Cell>
                    <Text>{node.text}</Text>
                </Cell>
            </Section>

            <Section header="Варианты">
                {node.options.map((opt, idx) => (
                    <Cell
                        key={idx}
                        onClick={() => {
                            setState((prev) => ({
                                currentId: opt.next,
                                history: [...prev.history, prev.currentId],
                                tags: [...prev.tags, ...(opt.tags ?? [])],
                            }));
                        }}
                    >
                        {opt.text}
                    </Cell>
                ))}
            </Section>

            <Section>
                <Cell>
                    <Button size="l" stretched mode="filled" onClick={goBack} disabled={state.history.length === 0}>
                        Назад
                    </Button>
                </Cell>
            </Section>
        </List>
    );
}
