import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://ec2-52-91-126-131.compute-1.amazonaws.com/";

export const useChat = ({ userId }) => {
  const socketRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const pendingChatFetchRef = useRef(null);
  const isConnectedRef = useRef(false);

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [typingUser, setTypingUser] = useState(null);

  /* ------------------ CONNECT SOCKET ------------------ */
  useEffect(() => {
    if (!userId) {
      console.log("[useChat] No userId provided, skipping socket connection");
      return;
    }

    console.log("[useChat] Initializing socket connection...", {
      userId,
      SOCKET_URL,
    });
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("[useChat] Socket connected successfully", {
        socketId: socketRef.current.id,
      });
      isConnectedRef.current = true;
      console.log("[useChat] Emitting setup event", { userId });
      socketRef.current.emit("setup", userId);
      fetchChats();

      // Re-fetch messages if there's an active chat when reconnecting
      if (activeChatIdRef.current) {
        console.log(
          "[useChat] Re-fetching messages for active chat on reconnect",
          {
            activeChatId: activeChatIdRef.current,
          }
        );
        const fetchParams = {
          chatId: activeChatIdRef.current,
          page: 1,
          limit: 20,
        };
        socketRef.current.emit("fetch_chat", fetchParams);
        socketRef.current.emit("chat_history", fetchParams);
      }

      // Retry any pending chat fetch
      if (pendingChatFetchRef.current) {
        console.log(
          "[useChat] Retrying pending chat fetch on reconnect",
          pendingChatFetchRef.current
        );
        const { chatId, page: fetchPage, limit } = pendingChatFetchRef.current;
        socketRef.current.emit("fetch_chat", {
          chatId,
          page: fetchPage,
          limit,
        });
        socketRef.current.emit("chat_history", {
          chatId,
          page: fetchPage,
          limit,
        });
        pendingChatFetchRef.current = null;
      }
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("[useChat] Socket connection error", error);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("[useChat] Socket disconnected", { reason });
      isConnectedRef.current = false;
    });

    /* ---------------- SOCKET LISTENERS ---------------- */

    socketRef.current.on("all_chats", (chats) => {
      console.log("[useChat] Received all_chats event", {
        chatsCount: chats?.length || 0,
        chats,
      });
      setChats(chats);
    });

    socketRef.current.on("chat_history", (data) => {
      console.log("[useChat] Received chat_history event", {
        data,
        messagesCount: data?.messages?.length || 0,
        messages: data?.messages,
        activeChatId,
        currentPage: page,
        dataPage: data?.page,
      });
      const messages = data?.messages || data;
      const messagesArray = Array.isArray(messages) ? messages : [];
      const responsePage = data?.page || data?.pagination?.currentPage || 1;

      // Determine if this is loadMore (page > 1) or initial load (page === 1)
      // Check both the response page and current state
      const isLoadMore = responsePage > 1 || page > 1;

      if (isLoadMore) {
        // Append messages for pagination
        setMessages((prev) => {
          // Avoid duplicates by checking message IDs
          const existingIds = new Set(prev.map((m) => m._id));
          const newMessages = messagesArray.filter(
            (m) => m._id && !existingIds.has(m._id)
          );
          const updated = [...prev, ...newMessages];
          console.log("[useChat] Appended messages for loadMore", {
            previousCount: prev.length,
            newMessagesCount: newMessages.length,
            totalCount: updated.length,
          });
          return updated;
        });
        // Check if there are more messages to load
        if (messagesArray.length < 20) {
          setHasMore(false);
          console.log("[useChat] No more messages to load");
        }
      } else {
        // Initial load - replace messages
        setMessages(messagesArray);
        console.log("[useChat] Set initial messages", {
          messagesCount: messagesArray.length,
        });
        // Check if there are more messages to load
        if (messagesArray.length < 20) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
      setLoadingMessages(false);
    });

    // Listener for fetch_chat response (in case backend uses different event name)
    socketRef.current.on("fetch_chat_response", (data) => {
      console.log("[useChat] Received fetch_chat_response event", {
        data,
        messagesCount: data?.messages?.length || 0,
        activeChatId,
      });
      const messages = data?.messages || data;
      setMessages(Array.isArray(messages) ? messages : []);
      setLoadingMessages(false);
    });

    // Additional listeners for different possible response event names
    socketRef.current.on("chat_messages", (data) => {
      console.log("[useChat] Received chat_messages event", { data });
      const messages = data?.messages || data;
      if (Array.isArray(messages)) {
        setMessages(messages);
        setLoadingMessages(false);
      }
    });

    socketRef.current.on("messages", (data) => {
      console.log("[useChat] Received messages event", { data });
      const messages = data?.messages || data;
      if (Array.isArray(messages)) {
        setMessages(messages);
        setLoadingMessages(false);
      }
    });

    // Error listener
    socketRef.current.on("error", (error) => {
      console.error("[useChat] Socket error event", { error });
    });

    // Add a generic listener to catch any response to fetch_chat
    // The backend might respond with the same event name or a different one
    socketRef.current.on("fetch_chat", (data) => {
      console.log("[useChat] Received fetch_chat event (response)", {
        data,
        messagesCount: data?.messages?.length || 0,
        activeChatId,
      });
      const messages = data?.messages || data;
      if (Array.isArray(messages)) {
        setMessages(messages);
        setLoadingMessages(false);
      }
    });

    socketRef.current.on("receive_message", (msg) => {
      console.log("[useChat] Received new message", {
        message: msg,
        activeChatId,
      });

      setMessages((prev) => {
        const updated = [msg, ...prev];
        console.log("[useChat] Updated messages state", {
          previousCount: prev.length,
          newCount: updated.length,
        });
        return updated;
      });
      setChats((prev) => {
        return prev.map((chat) =>
          chat?._id === msg.chat?._id
            ? {
                ...chat,
                lastMessage: {
                  content: msg?.content,
                  createdAt: msg?.createdAt,
                  sender: msg?.sender,
                },
                // newMessage: true
              }
            : chat
        );
      });
      console.log("[useChat] Marking message as seen", { messageId: msg._id });
      socketRef.current.emit("mark_seen", { messageId: msg._id });
    });

    socketRef.current.on("message_sent", (msg) => {
      console.log("[useChat] Message sent confirmation received", {
        message: msg,
      });
      setMessages((prev) => {
        const updated = [msg, ...prev];
        console.log("[useChat] Added sent message to state", {
          previousCount: prev.length,
          newCount: updated.length,
        });
        return updated;
      });
      setChats((prev) => {
        return prev.map((chat) =>
          chat?._id === msg.chat?._id
            ? {
                ...chat,
                lastMessage: {
                  content: msg?.content,
                  createdAt: msg?.createdAt,
                  sender: msg?.sender,
                },
              }
            : chat
        );
      });
    });

    socketRef.current.on("message_seen", (msg) => {
      console.log("[useChat] Message seen confirmation received", {
        message: msg,
      });
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m._id === msg._id ? { ...m, status: "seen" } : m
        );
        console.log("[useChat] Updated message status to seen", {
          messageId: msg._id,
          updatedCount: updated.filter((m) => m.status === "seen").length,
        });
        return updated;
      });
    });

    socketRef.current.on("message_deleted", (msg) => {
      console.log("[useChat] Message deleted event received", { message: msg });
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m._id === msg._id
            ? { ...m, content: "[Message deleted]", status: "deleted" }
            : m
        );
        console.log("[useChat] Updated message to deleted status", {
          messageId: msg._id,
          updatedCount: updated.filter((m) => m.status === "deleted").length,
        });
        return updated;
      });
    });

    socketRef.current.on("user_typing", ({ senderId }) => {
      console.log("[useChat] User typing event received", {
        senderId,
        activeChatId,
      });
      setTypingUser(senderId);
    });

    socketRef.current.on("user_stop_typing", () => {
      console.log("[useChat] User stop typing event received", {
        activeChatId,
      });
      setTypingUser(null);
    });

    socketRef.current.on("chat_created", (chat) => {
      console.log("[useChat] Chat created event received", { chat });
      // Update activeChatId if we're in a new chat
      if (!activeChatId && chat) {
        setActiveChatId(chat._id);
        console.log("[useChat] Updated activeChatId to new chat", {
          chatId: chat._id,
        });
      }
      // Refresh chats list - fetchChats will be defined below
      if (socketRef.current) {
        socketRef.current.emit("fetch_all_chats", { userId });
      }
    });

    socketRef.current.on("chat_found_or_created", (data) => {
      console.log("[useChat] Chat found or created event received", { data });
      const chat = data.chat || data;
      if (chat && chat._id) {
        setActiveChatId(chat._id);
        activeChatIdRef.current = chat._id;
        console.log("[useChat] Updated activeChatId from fetch_or_create", {
          chatId: chat._id,
        });
        // Fetch messages for this chat
        if (chat.messages) {
          console.log("[useChat] Messages included in chat response", {
            messagesCount: chat.messages?.length || 0,
          });
          setMessages(chat.messages || []);
          setLoadingMessages(false);
        } else {
          // Fetch chat history if messages not included
          const fetchParams = {
            chatId: chat._id,
            page: 1,
            limit: 20,
          };
          console.log(
            "[useChat] Fetching chat history after chat found/created",
            fetchParams
          );
          // Only emit if socket is connected
          if (socketRef.current && isConnectedRef.current) {
            // Emit fetch_chat first, then chat_history
            socketRef.current.emit("fetch_chat", fetchParams);
            console.log(
              "[useChat] Emitting chat_history event after fetch_chat",
              fetchParams
            );
            socketRef.current.emit("chat_history", fetchParams);
          } else {
            console.log(
              "[useChat] Socket not connected, storing pending fetch",
              fetchParams
            );
            pendingChatFetchRef.current = fetchParams;
          }
        }
      }
      // Refresh chats list
      if (socketRef.current && isConnectedRef.current) {
        socketRef.current.emit("fetch_all_chats", { userId });
      }
    });

    return () => {
      console.log("[useChat] Cleaning up socket connection");
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("[useChat] Socket disconnected on cleanup");
      }
    };
  }, [userId]);

  /* ------------------ API METHODS ------------------ */

  const fetchChats = () => {
    console.log("[useChat] fetchChats called", { userId });
    setLoadingChats(true);
    console.log("[useChat] Emitting fetch_all_chats event", { userId });
    socketRef.current.emit("fetch_all_chats", { userId });
    setLoadingChats(false);
    console.log("[useChat] fetchChats completed");
  };

  const fetchOrCreateChat = (receiverId) => {
    console.log("[useChat] fetchOrCreateChat called", {
      senderId: userId,
      receiverId,
    });
    setMessages([]);
    setPage(1);
    setHasMore(true);
    setLoadingMessages(true);
    console.log("[useChat] Reset chat state for new chat", {
      messagesCount: 0,
      page: 1,
      hasMore: true,
    });

    const chatData = {
      senderId: userId,
      receiverId: receiverId,
    };
    console.log(
      "[useChat] Emitting fetch_or_create_chat_between_users event",
      chatData
    );
    socketRef.current.emit("fetch_or_create_chat_between_users", chatData);
  };

  const openChat = (chatId, receiverId) => {
    console.log("[useChat] openChat called", {
      chatId,
      receiverId,
      previousActiveChatId: activeChatId,
      isConnected: isConnectedRef.current,
      socketId: socketRef.current?.id,
    });

    // If no chatId but receiverId is provided, fetch or create chat
    if (!chatId && receiverId) {
      console.log(
        "[useChat] No chatId provided, fetching or creating chat between users"
      );
      fetchOrCreateChat(receiverId);
      return;
    }

    setActiveChatId(chatId);
    activeChatIdRef.current = chatId;
    setMessages([]);
    setPage(1);
    setHasMore(true);
    setLoadingMessages(true);
    console.log("[useChat] Reset chat state", {
      chatId,
      messagesCount: 0,
      page: 1,
      hasMore: true,
    });

    const fetchParams = {
      chatId,
      page: 1,
      limit: 20,
    };

    // Check if socket is connected before emitting
    if (!socketRef.current || !isConnectedRef.current) {
      console.log(
        "[useChat] Socket not connected, storing pending fetch",
        fetchParams
      );
      pendingChatFetchRef.current = fetchParams;
      return;
    }

    console.log("[useChat] Emitting fetch_chat event", fetchParams);
    // Emit fetch_chat first
    socketRef.current.emit("fetch_chat", fetchParams);

    // Then emit chat_history with the same chatId (backend requirement)
    console.log(
      "[useChat] Emitting chat_history event after fetch_chat",
      fetchParams
    );
    // socketRef.current.emit('chat_history', fetchParams);
  };

  const loadMoreMessages = () => {
    console.log("[useChat] loadMoreMessages called", {
      hasMore,
      loadingMessages,
      currentPage: page,
      activeChatId,
      isConnected: isConnectedRef.current,
    });

    if (!hasMore) {
      console.log("[useChat] No more messages to load");
      return;
    }

    if (loadingMessages) {
      console.log("[useChat] Already loading messages, skipping");
      return;
    }

    if (!socketRef.current || !isConnectedRef.current) {
      console.log("[useChat] Socket not connected, cannot load more messages");
      return;
    }

    const nextPage = page + 1;
    setLoadingMessages(true);
    console.log("[useChat] Loading more messages", { nextPage, activeChatId });

    const fetchParams = {
      chatId: activeChatId,
      page: nextPage,
      limit: 20,
    };
    console.log(
      "[useChat] Emitting chat_history event for loadMore",
      fetchParams
    );
    socketRef.current.emit("chat_history", fetchParams);

    setPage(nextPage);
    console.log("[useChat] Updated page state", { newPage: nextPage });
  };

  const sendMessage = (receiverId, content, isNewChat = false) => {
    console.log("[useChat] sendMessage called", {
      senderId: userId,
      receiverId,
      contentLength: content?.length || 0,
      activeChatId,
      isNewChat,
    });

    const messageData = {
      senderId: userId,
      receiverId,
      content,
    };

    // If it's a new chat, we might need to create it first
    // But typically the backend will create the chat automatically when first message is sent
    if (isNewChat && !activeChatId) {
      console.log(
        "[useChat] Sending first message to create new chat",
        messageData
      );
    }

    console.log("[useChat] Emitting send_message event", messageData);
    socketRef.current.emit("send_message", messageData);
    console.log("[useChat] sendMessage event emitted");
  };

  const deleteMessage = (messageId) => {
    console.log("[useChat] deleteMessage called", {
      messageId,
      senderId: userId,
      activeChatId,
    });

    const deleteData = {
      messageId,
      senderId: userId,
    };
    console.log("[useChat] Emitting delete_message event", deleteData);
    socketRef.current.emit("delete_message", deleteData);
    console.log("[useChat] deleteMessage event emitted");
  };

  const startTyping = (receiverId) => {
    console.log("[useChat] startTyping called", {
      senderId: userId,
      receiverId,
      activeChatId,
    });

    const typingData = { senderId: userId, receiverId };
    console.log("[useChat] Emitting typing event", typingData);
    socketRef.current.emit("typing", typingData);
  };

  const stopTyping = (receiverId) => {
    console.log("[useChat] stopTyping called", {
      senderId: userId,
      receiverId,
      activeChatId,
    });

    const stopTypingData = { senderId: userId, receiverId };
    console.log("[useChat] Emitting stop_typing event", stopTypingData);
    socketRef.current.emit("stop_typing", stopTypingData);
  };

  return {
    chats,
    messages,
    loadingChats,
    loadingMessages,
    typingUser,
    openChat,
    fetchOrCreateChat,
    loadMoreMessages,
    sendMessage,
    deleteMessage,
    startTyping,
    stopTyping,
  };
};
