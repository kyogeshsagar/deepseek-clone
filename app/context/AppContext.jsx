// "use client";
// import { useUser } from "@clerk/nextjs";
// import { children, createContext, useContext } from "react";

// export const AppContext = createContext();

// export const useAppContext = ()=>{
//     return useContext(AppContext)
// }

// export const AppContextProvider = ({children})=>{
//     const {user} = useUser();

//     const value = {
//         user
//     }

//     return (
//   <AppContext.Provider value={value}>
//     {children}
//   </AppContext.Provider>
// )
// }
"use client";

import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AppContext = createContext();

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createChat = (title = "New chat") => ({
    id: createId(),
    title,
    messages: [],
});

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
    const { user } = useUser();
    const [chats, setChats] = useState([createChat()]);
    const [currentChatId, setCurrentChatId] = useState(chats[0].id);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!chats.some((chat) => chat.id === currentChatId)) {
            setCurrentChatId(chats[0]?.id || null);
        }
    }, [chats, currentChatId]);

    const activeChat = useMemo(
        () => chats.find((chat) => chat.id === currentChatId) || chats[0] || null,
        [chats, currentChatId]
    );

    const startNewChat = () => {
        const newChat = createChat();

        setChats((previousChats) => [newChat, ...previousChats]);
        setCurrentChatId(newChat.id);
    };

    const selectChat = (chatId) => {
        setCurrentChatId(chatId);
    };

    const renameChat = (chatId, title) => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) return;

        setChats((previousChats) =>
            previousChats.map((chat) =>
                chat.id === chatId ? { ...chat, title: trimmedTitle } : chat
            )
        );
    };

    const deleteChat = (chatId) => {
        setChats((previousChats) => {
            const remainingChats = previousChats.filter((chat) => chat.id !== chatId);

            if (remainingChats.length === 0) {
                const fallbackChat = createChat();
                setCurrentChatId(fallbackChat.id);
                return [fallbackChat];
            }

            if (currentChatId === chatId) {
                setCurrentChatId(remainingChats[0].id);
            }

            return remainingChats;
        });
    };

    const sendPrompt = async (prompt) => {
        const trimmedPrompt = prompt.trim();

        if (!trimmedPrompt || isLoading) return;

        const chatId = currentChatId || chats[0]?.id;
        const chatSnapshot = chats.find((chat) => chat.id === chatId) || createChat();
        const userMessage = { role: "user", content: trimmedPrompt };

        setIsLoading(true);
        setChats((previousChats) =>
            previousChats.map((chat) => {
                if (chat.id !== chatId) return chat;

                const nextTitle = chat.messages.length === 0 ? trimmedPrompt.slice(0, 48) : chat.title;

                return {
                    ...chat,
                    title: nextTitle,
                    messages: [...chat.messages, userMessage],
                };
            })
        );

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...chatSnapshot.messages, userMessage],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Unable to generate a reply.");
            }

            const assistantMessage = {
                role: "assistant",
                content: data.reply || "No response received.",
            };

            setChats((previousChats) =>
                previousChats.map((chat) =>
                    chat.id === chatId
                        ? { ...chat, messages: [...chat.messages, assistantMessage] }
                        : chat
                )
            );
        } catch (error) {
            setChats((previousChats) =>
                previousChats.map((chat) =>
                    chat.id === chatId
                        ? {
                              ...chat,
                              messages: [
                                  ...chat.messages,
                                  {
                                      role: "assistant",
                                      content:
                                          error?.message ||
                                          "Something went wrong while generating a reply.",
                                  },
                              ],
                          }
                        : chat
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        chats,
        activeChat,
        currentChatId,
        isLoading,
        setIsLoading,
        startNewChat,
        selectChat,
        renameChat,
        deleteChat,
        sendPrompt,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};