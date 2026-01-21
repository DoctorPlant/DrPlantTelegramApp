import { useMemo, useState } from "react";
import { Button, List, Section, Placeholder, Headline, FixedLayout, Text } from "@telegram-apps/telegram-ui";

import type { QuizTree } from "@/quiz/schema";
import { createInitialState, getNode, type QuizState } from "@/quiz/engine";

import './QuizRunner.css';

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
            <div className="quiz-runner">
                <FixedLayout vertical="top" style={{ background: 'var(--tg-theme-bg-color, #fff)', borderBottom: '1px solid var(--tg-theme-secondary-bg-color, #efefef)', padding: '12px 16px', zIndex: 10 }}>
                    <Headline weight="2" style={{ textAlign: 'center' }}>
                        {tree.title}
                    </Headline>
                </FixedLayout>

                <div className="quiz-runner__content" style={{ paddingTop: '56px', display: 'block' }}>
                    <Placeholder>
                        <div className="quiz-runner__question-text">
                            <Headline weight="1">
                                {node.title}
                            </Headline>
                        </div>
                    </Placeholder>
                </div>

                <div className="quiz-runner__footer">
                    <List>
                        <Section>
                            <div style={{ padding: '0 16px 16px' }}>
                                <Text style={{ color: 'var(--tg-theme-hint-color)', display: 'block' }}>
                                    {node.diagnosis}
                                </Text>
                                {node.actions.length > 0 && (
                                    <Text style={{ marginTop: '8px', color: 'var(--tg-theme-text-color)', display: 'block' }}>
                                        {node.actions.join(", ")}
                                    </Text>
                                )}
                            </div>
                        </Section>
                        {node.fertilizer && (
                            <Section header="Рекомендация по удобрению">
                                <div style={{ padding: '0 16px 16px' }}>
                                    <Text style={{ color: 'var(--tg-theme-text-color)', display: 'block' }}>
                                        {node.fertilizer}
                                    </Text>
                                </div>
                            </Section>
                        )}
                    </List>
                    <div className="quiz-runner__back-button">
                        <Button size="l" stretched onClick={restart}>
                            Пройти ещё раз
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // question
    return (
        <div className="quiz-runner">
            <FixedLayout vertical="top" style={{ background: 'var(--tg-theme-bg-color, #fff)', borderBottom: '1px solid var(--tg-theme-secondary-bg-color, #efefef)', padding: '12px 16px', zIndex: 10 }}>
                <Headline weight="2" style={{ textAlign: 'center' }}>
                    {tree.title}
                </Headline>
            </FixedLayout>

            <div className="quiz-runner__content" style={{ paddingTop: '56px', display: 'block' }}>
                <Placeholder>
                    <div className="quiz-runner__question-text">
                        <Headline weight="1">
                            {node.text}
                        </Headline>
                    </div>
                </Placeholder>
            </div>

            <div className="quiz-runner__footer">
                <List>
                    <Section header="Выберите вариант">
                        <div className="quiz-runner__options">
                            {node.options.map((opt, idx) => (
                                <Button
                                    key={idx}
                                    mode="bezeled"
                                    size="l"
                                    stretched
                                    style={{ justifyContent: 'flex-start', textAlign: 'left', height: 'auto', padding: '12px' }}
                                    onClick={() => {
                                        setState((prev) => ({
                                            currentId: opt.next,
                                            history: [...prev.history, prev.currentId],
                                            tags: [...prev.tags, ...(opt.tags ?? [])],
                                        }));
                                    }}
                                >
                                    <span style={{ whiteSpace: 'normal' }}>{opt.text}</span>
                                </Button>
                            ))}
                        </div>
                    </Section>
                </List>

                <div className="quiz-runner__back-button">
                    <Button 
                        size="l" 
                        stretched 
                        onClick={goBack} 
                        disabled={state.history.length === 0}
                    >
                        Назад
                    </Button>
                </div>
            </div>
        </div>
    );
}
