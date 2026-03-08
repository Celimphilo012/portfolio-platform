import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { messageService } from '../../services/messageService.js';

export default function ManageContact() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    messageService.getAll().then(setMessages);
  }, []);

  const handleRead = async (id) => {
    await messageService.markRead(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-8">Messages</h1>
      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`bg-gray-900 border rounded-xl p-5 ${m.read ? 'border-gray-800' : 'border-blue-700'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-medium">
                  {m.name}
                  <span className="text-gray-500 font-normal text-sm ml-2">{m.email}</span>
                </p>
                {m.subject && <p className="text-gray-400 text-sm mt-0.5">{m.subject}</p>}
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">{m.body}</p>
                <p className="text-gray-600 text-xs mt-2">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              {!m.read && (
                <button
                  onClick={() => handleRead(m.id)}
                  className="shrink-0 text-xs text-blue-400 hover:text-blue-300 whitespace-nowrap"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-gray-600 text-sm">No messages yet.</p>}
      </div>
    </AdminLayout>
  );
}
