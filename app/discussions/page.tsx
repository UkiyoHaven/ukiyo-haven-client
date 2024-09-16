'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io('http://localhost:3000');  // Backend server URL

export default function Discussions() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ user: string, message: string }[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('receiveMessage');  // Clean up the listener on component unmount
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message && username) {
      // Send the message to the server
      socket.emit('sendMessage', { user: username, message });
      setMessage('');  // Clear input field after sending
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
            <p><strong>{msg.user}:</strong> {msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
