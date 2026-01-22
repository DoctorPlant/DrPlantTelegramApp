import { useMemo, useState } from "react";
import { Button, List, Section, Placeholder, Headline, FixedLayout, Text } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";

import type { QuizTree } from "@/quiz/schema";
import { createInitialState, getNode, type QuizState } from "@/quiz/engine";

import './QuizRunner.css';

// Helper to resolve asset paths with base URL
function resolveAsset(path: string | undefined) {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    const base = import.meta.env.BASE_URL;
    // Ensure base ends with / and path doesn't start with / for simple concatenation
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    const resolved = `${normalizedBase}${normalizedPath}`;
    return resolved;
}

export function QuizRunner({ tree }: { tree: QuizTree }) {
    const navigate = useNavigate();
    const initial = useMemo(() => createInitialState(tree), [tree]);
    const [state, setState] = useState<QuizState>(initial);

    const node = getNode(tree, state.currentId);

    function goBack(e?: React.MouseEvent) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setState((prev) => {
            if (prev.history.length === 0) {
                setTimeout(() => navigate('/'), 0);
                return prev;
            }
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
                        {node.image && (
                            <div className="quiz-runner__result-image" style={{ marginBottom: '16px', borderRadius: '16px', overflow: 'hidden', width: '200px', height: '200px', margin: '0 auto 16px' }}>
                                <img 
                                    src={resolveAsset(node.image)} 
                                    alt={node.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <Text style={{ 
                            color: 'var(--tg-theme-hint-color)', 
                            display: 'block', 
                            textAlign: 'center',
                            padding: '0 32px' 
                        }}>
                            {node.diagnosis}
                        </Text>
                    </Placeholder>
                </div>

                <div className="quiz-runner__footer">
                    <div className="quiz-runner__options-container">
                        <List>
                            {node.actions.length > 0 && (
                                <Section>
                                    <div style={{ padding: '16px 16px 16px' }}>
                                        <Headline weight="2" style={{ marginBottom: '8px', color: 'var(--tg-theme-hint-color)', fontSize: '14px', textTransform: 'uppercase' }}>
                                            Рекомендации
                                        </Headline>
                                        <Text style={{ color: 'var(--tg-theme-text-color)', display: 'block' }}>
                                            {node.actions.join(", ")}
                                        </Text>
                                    </div>
                                </Section>
                            )}
                            {node.products && node.products.length > 0 && (
                                <Section>
                                    <div style={{ padding: '16px 16px 16px' }}>
                                        <Headline weight="2" style={{ marginBottom: '12px', color: 'var(--tg-theme-hint-color)', fontSize: '14px', textTransform: 'uppercase' }}>
                                            Рекомендованные товары
                                        </Headline>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {node.products.map((product, pIdx) => (
                                                <div key={pIdx} style={{ 
                                                    display: 'flex', 
                                                    gap: '12px', 
                                                    background: 'var(--tg-theme-secondary-bg-color)', 
                                                    padding: '12px', 
                                                    borderRadius: '12px' 
                                                }}>
                                                    <img 
                                                        src={resolveAsset(product.image)} 
                                                        alt={product.name} 
                                                        style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} 
                                                    />
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <Text weight="2" style={{ display: 'block' }}>{product.name}</Text>
                                                        <Text style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', display: 'block' }}>
                                                            {product.description}
                                                        </Text>
                                                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                            {product.links.map((link, lIdx) => (
                                                                <Button 
                                                                    key={lIdx} 
                                                                    size="s" 
                                                                    mode="bezeled"
                                                                    onClick={() => window.open(link.url, '_blank')}
                                                                >
                                                                    {link.title}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Section>
                            )}
                        </List>
                    </div>
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
                <div className="quiz-runner__options-container">
                    <List>
                        <Section header="Выберите вариант">
                            <div className="quiz-runner__options">
                                {node.options.map((opt, idx) => {
                                    const hasImage = !!opt.image;
                                    return (
                                        <div
                                            key={idx}
                                            className={`quiz-runner__option ${hasImage ? "quiz-runner__option--with-image" : ""}`}
                                            onClick={() => {
                                                setState((prev) => ({
                                                    currentId: opt.next,
                                                    history: [...prev.history, prev.currentId],
                                                    tags: [...prev.tags, ...(opt.tags ?? [])],
                                                }));
                                            }}
                                        >
                                            {opt.image && (
                                                <div className="quiz-runner__option-image-container">
                                                    <img 
                                                        src={resolveAsset(opt.image)} 
                                                        alt="" 
                                                    />
                                                </div>
                                            )}
                                            <div className="quiz-runner__option-text">
                                                <Text weight="2">{opt.text}</Text>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Section>
                    </List>
                </div>

                <div className="quiz-runner__back-button">
                        <Button 
                            size="l" 
                            stretched 
                            onClick={(e) => goBack(e)} 
                        >
                            Назад
                        </Button>
                </div>
            </div>
        </div>
    );
}
