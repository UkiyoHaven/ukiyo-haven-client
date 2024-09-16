'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

type Message = {
  id: number;
  user: string;
  content: string;
  createdAt: string;
};

export default function Discussions() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Load previous messages when connected
    socket.on('loadPreviousMessages', (previousMessages: Message[]) => {
      setMessages(previousMessages);
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
    if (message && username) {
      socket.emit('sendMessage', { user: username, message });
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl">Discussion Board</h1>
      <form onSubmit={sendMessage} className="flex flex-col items-center gap-4 mt-4">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border p-2 text-black"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-80 h-40 p-2 border text-black"
        />
        <button type="submit" className="bg-calmBlue text-white py-2 px-4 rounded">Send Message</button>
      </form>
      <div className="mt-10 w-80">
        <h2 className="text-2xl">Messages</h2>
        {messages.map((msg, index) => (
          <div key={index} className="mt-4 p-4 border rounded">
            <p><strong>{msg.user}:</strong> {msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
