'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import withAuth from '@/utils/withAuth';
import NavBar from '@/components/NavBar';
import { useSession } from 'next-auth/react'; // Import session to get user info

const socket = io('http://localhost:3000');

type Message = {
  id: number;
  user: string;
  content: string;
  createdAt: string;
};

function Discussions() {
  const { data: session } = useSession();  // Fetch session for user data
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load previous messages when connected
    socket.on('loadPreviousMessages', (previousMessages: Message[]) => {
      setMessages(previousMessages); // Update state with previous messages
    });

    // Listen for new messages from the server
    socket.on('receiveMessage', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('loadPreviousMessages');
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message) {
      const username = session?.user?.name || 'Anonymous'; // Infer username from session
      socket.emit('sendMessage', { user: username, message });
      setMessage('');
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-4xl mb-6 text-blue-400">Discussion Board</h1>

        <div className="w-full max-w-4xl flex-grow overflow-y-auto p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.user === session?.user?.name ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-4 rounded-lg ${
                    msg.user === session?.user?.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-gray-100'
                  } max-w-md`}
                >
                  <p className="font-bold">{msg.user}</p>
                  <p>{msg.content}</p>
                  <small className="text-xs opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={sendMessage} className="w-full max-w-4xl flex items-center mt-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-l-lg bg-white dark:bg-gray-700 text-black dark:text-white border-none focus:outline-none"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default withAuth(Discussions);
