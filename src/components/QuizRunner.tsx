import { useMemo, useState } from "react";
import { Button, List, Section, Placeholder, Headline, FixedLayout, Text } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";

import type { QuizTree } from "@/quiz/schema";
import { createInitialState, getNode, type QuizState } from "@/quiz/engine";

import { useAsset } from "@/utils/assets";

import './QuizRunner.css';

function AssetImage({ src, alt, className, style }: { src?: string, alt?: string, className?: string, style?: React.CSSProperties }) {
    const resolved = useAsset(src);
    if (!src) return null;
    return <img src={resolved} alt={alt} className={className} style={style} />;
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


    if (node.type === "result") {
        return (
            <div className="quiz-runner">
                <div className="quiz-runner__result-header">
                    <FixedLayout vertical="top" style={{ background: 'var(--tg-theme-bg-color, #fff)', borderBottom: '1px solid var(--tg-theme-secondary-bg-color, #efefef)', padding: '12px 16px', zIndex: 10 }}>
                        <Headline weight="2" style={{ textAlign: 'center' }}>
                            {tree.title}
                        </Headline>
                    </FixedLayout>

                    <div className="quiz-runner__content" style={{ paddingTop: '56px' }}>
                        <Placeholder style={{ padding: '0 0 4px' }}>
                            <div className="quiz-runner__question-text" style={{ padding: '8px 24px 2px' }}>
                                <Headline weight="2">
                                    {node.title}
                                </Headline>
                            </div>
                            {node.image && (
                                <div className="quiz-runner__result-image-container">
                                    <AssetImage 
                                        src={node.image} 
                                        alt={node.title} 
                                        className="quiz-runner__result-image"
                                    />
                                </div>
                            )}
                            <Text style={{ 
                                color: 'var(--tg-theme-hint-color)', 
                                display: 'block', 
                                textAlign: 'center',
                                padding: '4px 32px 0',
                                fontSize: '13px',
                                lineHeight: '1.2'
                            }}>
                                {node.diagnosis}
                            </Text>
                        </Placeholder>
                    </div>
                </div>

                <div className="quiz-runner__footer">
                    <div className="quiz-runner__options-container">
                        <List>
                            {node.actions.length > 0 && (
                                <Section>
                                    <div style={{ padding: '8px 16px 8px' }}>
                                        <Headline weight="2" style={{ marginBottom: '4px', color: 'var(--tg-theme-hint-color)', fontSize: '12px', textTransform: 'uppercase' }}>
                                            Рекомендации
                                        </Headline>
                                        <Text style={{ color: 'var(--tg-theme-text-color)', display: 'block', fontSize: '14px' }}>
                                            {node.actions.join(", ")}
                                        </Text>
                                    </div>
                                </Section>
                            )}
                            {node.products && node.products.length > 0 && (
                                <Section>
                                    <div style={{ padding: '8px 16px 8px' }}>
                                        <Headline weight="2" style={{ marginBottom: '8px', color: 'var(--tg-theme-hint-color)', fontSize: '12px', textTransform: 'uppercase' }}>
                                            Рекомендованные товары
                                        </Headline>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {node.products.map((product, pIdx) => (
                                                <div key={pIdx} style={{ 
                                                    display: 'flex', 
                                                    gap: '12px', 
                                                    background: 'var(--tg-theme-secondary-bg-color)', 
                                                    padding: '8px', 
                                                    borderRadius: '12px' 
                                                }}>
                                                    <AssetImage 
                                                        src={product.image} 
                                                        alt={product.name} 
                                                        style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} 
                                                    />
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        <Text weight="2" style={{ display: 'block', fontSize: '14px' }}>{product.name}</Text>
                                                        <Text style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color)', display: 'block', lineHeight: '1.2' }}>
                                                            {product.description}
                                                        </Text>
                                                        <div style={{ display: 'flex', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                                                            {product.links.map((link, lIdx) => (
                                                                <Button 
                                                                    key={lIdx} 
                                                                    size="s" 
                                                                    mode="bezeled"
                                                                    onClick={() => window.open(link.url, '_blank')}
                                                                    style={{ height: '28px', padding: '0 8px' }}
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
                    <div className="quiz-runner__result-buttons">
                        <Button 
                            size="l"
                            mode="gray"
                            stretched 
                            onClick={(e) => goBack(e)}
                        >
                            Назад
                        </Button>
                        <Button 
                            size="l"
                            stretched 
                            onClick={() => navigate('/')}
                        >
                            На главную
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
                <Placeholder style={{ padding: '0 0 16px' }}>
                    <div className="quiz-runner__question-text" style={{ padding: '20px 24px 12px' }}>
                        <Headline weight="2">
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
                                                    <AssetImage 
                                                        src={opt.image} 
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
                            mode="gray"
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
