import { useEffect, useState } from "react";
import { Search, ArrowUp } from "lucide-react";
import { useAuth } from "../AuthContext";
import profile_pic from "../assets/profile_default.png";

type ChatUser = {
  id: number;
  username: string;
  fullName: string;
  picture?: string;
};

type Message = {
  id: number;
  text: string;
  userId: number;
  chatId: number;
  createdAt: string;
};

function formatMessageTime(dateString: string) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function Chat() {
  const { user: me, authFetch } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  async function loadUsers() {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/users/suggestions`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data.users ? data.users : []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [authFetch]);

  async function openChat(targetUser: ChatUser) {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/chats/${targetUser.id}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setSelectedUser(targetUser);
      setChatId(data.chatId);
      setMessages(data.messages ? data.messages : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function onSubmit(e: any) {
    e.preventDefault();
    if (!draft.trim() || !chatId) return;
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/chats/${chatId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ text: draft }),
        }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setMessages((currentMessages) => [...currentMessages, data]);
      setDraft("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="text-white min-h-screen flex">
      <section className="w-[360px] shrink-0 border-r border-gray-800 min-h-screen">
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold text-left">Messages</h1>
          <label className="relative block mt-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search Direct Messages"
              className="w-full bg-[#202327] rounded-full py-3 pl-12 pr-4 outline-none placeholder-gray-500 text-sm"
            />
          </label>
        </header>

        <div>
          {users.length === 0 && (
            <p className="p-4 text-gray-500 text-left">No people to message right now.</p>
          )}
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => openChat(user)}
              className={`w-full p-4 flex gap-3 text-left hover:bg-white/3 transition-colors ${
                selectedUser && selectedUser.id === user.id ? "bg-white/5" : ""
              }`}
            >
              <img
                src={user.picture ? user.picture : profile_pic}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="font-bold truncate">{user.fullName}</p>
                <p className="text-gray-500 truncate">@{user.username}</p>
                <p className="text-gray-500 text-sm truncate">Start a conversation</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex-1 min-w-0 min-h-screen flex flex-col">
        {!selectedUser && (
          <div className="flex-1 flex items-center justify-center px-10 text-left">
            <div className="max-w-sm">
              <h2 className="text-3xl font-bold">Select a message</h2>
              <p className="text-gray-500 mt-2">
                Choose someone from the list to start or continue a conversation.
              </p>
            </div>
          </div>
        )}

        {selectedUser && (
          <>
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-gray-800 p-4 flex items-center gap-3">
              <img
                src={selectedUser.picture ? selectedUser.picture : profile_pic}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="min-w-0 text-left">
                <p className="font-bold truncate">{selectedUser.fullName}</p>
                <p className="text-gray-500 text-sm truncate">@{selectedUser.username}</p>
              </div>
            </header>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 pt-16">
                  <img
                    src={selectedUser.picture ? selectedUser.picture : profile_pic}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                  />
                  <p className="font-bold text-white">{selectedUser.fullName}</p>
                  <p>@{selectedUser.username}</p>
                  <p className="mt-3 text-sm">No messages yet. Send the first one.</p>
                </div>
              )}

              {messages.map((message) => {
                const isMine = me ? Number(message.userId) === Number(me.id) : false;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-3xl px-4 py-2 text-left ${
                        isMine
                          ? "bg-sky-500 text-white rounded-br-md"
                          : "bg-gray-800 text-white rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
                      <p
                        className={`text-[11px] mt-1 ${
                          isMine ? "text-sky-100" : "text-gray-500"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={onSubmit} className="border-t border-gray-800 p-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Start a new message"
                className="flex-1 bg-[#202327] rounded-full px-4 py-3 outline-none placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="w-12 h-12 rounded-full bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 flex items-center justify-center shrink-0"
              >
                <ArrowUp size={20} />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default Chat;