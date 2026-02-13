import { Message } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
    message: Message;
    onMarkSolution?: (messageId: string) => void;
    userName?: string;
}

export default function ChatMessage({ message, onMarkSolution, userName }: ChatMessageProps) {
    const isAssistant = message.role === 'assistant';
    const isSolution = message.isSolution;

    return (
        <div className={`${styles.wrapper} ${isAssistant ? styles.assistantWrapper : styles.userWrapper}`}>
            <div className={styles.container}>
                {/* Avatar */}
                <div className={styles.avatarWrapper}>
                    <div className={`${styles.avatar} ${isAssistant ? styles.assistantAvatar : styles.userAvatar}`}>
                        {isAssistant ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                                <circle cx="12" cy="5" r="2"></circle>
                                <path d="M12 7v4"></path>
                                <line x1="8" y1="16" x2="8" y2="16"></line>
                                <line x1="16" y1="16" x2="16" y2="16"></line>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        )}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.roleName}>
                        {isAssistant ? 'Assistant' : (userName || 'You')}
                    </div>

                    {/* Highlighting wrapper if Solution */}
                    <div className={`${isSolution ? styles.solutionMessage : ''}`}>

                        {isSolution && (
                            <div className={styles.solutionBadge}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Solution
                            </div>
                        )}

                        <div className={`${styles.text} ${!isAssistant ? styles.userBubble : ''}`}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Actions: Show if Assistant. Hide if Solution. Show Prominent Button if not Solution. */}
                    {isAssistant && !isSolution && (
                        <div className={styles.actions}>
                            {/* Standard actions (Copy, etc.) - user requested to remove them, but maybe keep copy? 
                                User request: "remova os outros" (remove others).
                                So we remove the row of small icons and just show the big button. 
                                Or maybe keep copy as it's useful? 
                                User said "remove others", so I'll hide the standard action row entirely and show only the solution button.
                            */}

                            {onMarkSolution && (
                                <button
                                    className={styles.markSolutionBtn}
                                    onClick={() => onMarkSolution(message.id)}
                                    title="This solved my problem"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Mark as Solution
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
