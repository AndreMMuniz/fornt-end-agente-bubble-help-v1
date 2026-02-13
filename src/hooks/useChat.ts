'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSettings } from '@/hooks/useSettings';
import { Message, sendMessage as apiSendMessage, markSolution as apiMarkSolution } from '@/lib/api';

const generateId = () => Math.random().toString(36).substring(2, 11);

export type Conversation = {
    id: string;
    threadId: string;
    title: string;
    messages: Message[];
    createdAt: number;
};

export function useChat() {
    const { data: session } = useSession();
    const { settings } = useSettings();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Use the authenticated user's ID from the session
    const userId = session?.user?.id || '';

    // Create initial conversation on mount
    useEffect(() => {
        const initialId = generateId();
        const initial: Conversation = {
            id: initialId,
            threadId: generateId(),
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
        };
        setConversations([initial]);
        setActiveConversationId(initialId);
    }, []);

    // Get the currently active conversation
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const messages = activeConversation?.messages ?? [];

    // Check if the conversation is solved
    const isChatLocked = messages.some(m => m.isSolution);

    // Generate a short title from the first user message
    const generateTitle = (content: string): string => {
        const cleaned = content.replace(/\n/g, ' ').trim();
        if (cleaned.length <= 35) return cleaned;
        return cleaned.substring(0, 35) + '…';
    };

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || !activeConversationId || !userId) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };

        // Update the active conversation with the new user message
        setConversations(prev => prev.map(conv => {
            if (conv.id !== activeConversationId) return conv;

            const isFirstMessage = conv.messages.length === 0;
            return {
                ...conv,
                title: isFirstMessage ? generateTitle(content) : conv.title,
                messages: [...conv.messages, userMessage],
            };
        }));

        setIsLoading(true);

        const currentConv = conversations.find(c => c.id === activeConversationId);
        const threadId = currentConv?.threadId || '';

        try {
            const response = await apiSendMessage(content, threadId, userId, settings.language);
            setConversations(prev => prev.map(conv => {
                if (conv.id !== activeConversationId) return conv;
                return { ...conv, messages: [...conv.messages, response] };
            }));
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: generateId(),
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro ao se comunicar com o agente. Verifique se o backend está rodando.',
                timestamp: Date.now(),
            };
            setConversations(prev => prev.map(conv => {
                if (conv.id !== activeConversationId) return conv;
                return { ...conv, messages: [...conv.messages, errorMessage] };
            }));
        } finally {
            setIsLoading(false);
        }
    }, [activeConversationId, userId, conversations]);

    const newChat = useCallback(() => {
        const newId = generateId();
        const conv: Conversation = {
            id: newId,
            threadId: generateId(),
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
        };
        setConversations(prev => [conv, ...prev]);
        setActiveConversationId(newId);
    }, []);

    const switchConversation = useCallback((conversationId: string) => {
        if (isLoading) return; // Don't switch while loading
        setActiveConversationId(conversationId);
    }, [isLoading]);

    const deleteConversation = useCallback((conversationId: string) => {
        setConversations(prev => {
            const filtered = prev.filter(c => c.id !== conversationId);
            // If we deleted the active one, switch to first available or create new
            if (conversationId === activeConversationId) {
                if (filtered.length > 0) {
                    setActiveConversationId(filtered[0].id);
                } else {
                    const newId = generateId();
                    const conv: Conversation = {
                        id: newId,
                        threadId: generateId(),
                        title: 'New Chat',
                        messages: [],
                        createdAt: Date.now(),
                    };
                    setActiveConversationId(newId);
                    return [conv];
                }
            }
            return filtered;
        });
    }, [activeConversationId]);

    const markAsSolution = useCallback(async (messageId: string) => {
        if (!activeConversation) return;

        const currentMessages = activeConversation.messages;
        const answerIndex = currentMessages.findIndex(m => m.id === messageId);
        if (answerIndex === -1) return;

        const answer = currentMessages[answerIndex].content;

        // Find the closest user message before this assistant message
        let question = '';
        for (let i = answerIndex - 1; i >= 0; i--) {
            if (currentMessages[i].role === 'user') {
                question = currentMessages[i].content;
                break;
            }
        }

        try {
            await apiMarkSolution(activeConversation.threadId, question, answer);

            // Update local state to mark message as solution
            setConversations(prev => prev.map(conv => {
                if (conv.id !== activeConversationId) return conv;
                return {
                    ...conv,
                    messages: conv.messages.map(m =>
                        m.id === messageId ? { ...m, isSolution: true } : m
                    )
                };
            }));

            console.log('Marked as solution:', messageId);
        } catch (error) {
            console.error('Error marking solution:', error);
        }
    }, [activeConversationId, activeConversation]);

    return {
        messages,
        conversations,
        activeConversationId,
        activeConversation,
        isLoading,
        sendMessage,
        newChat,
        switchConversation,
        deleteConversation,
        markAsSolution,
        isChatLocked,
    };
}
