import React, { useState } from 'react';
import { formatDateTime } from '../../src/utils/formatters';
import { groupApi } from '../../src/utils/api';

const GroupMessages = ({ messages, members, groupId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const getMessageAuthor = (message, userId) => {
    // First try to get user from message.user if it exists (from our updated API)
    if (message.user) {
      return message.user.username || `User ${message.user.user_id || ''}`;
    }
    
    // Otherwise try to find from members array
    if (!members || !Array.isArray(members)) return "Unknown";
    
    // Try to match by _id or user_id
    const member = members.find(m => 
      (m._id && m._id.toString() === userId.toString()) || 
      (m.user_id && m.user_id.toString() === userId.toString())
    );
    
    if (member) {
      return member.username || member.name || `User ${member.user_id || ''}`;
    }
    
    return "Unknown User";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await groupApi.addMessage(groupId, newMessage.trim());
      
      // In a real app, you would update the messages list with the new message
      // Here we'll just clear the input field
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl text-blue-700">Group Messages</h2>
        <button 
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center"
          onClick={() => console.log('Edit messages settings')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => {
            // Try to use user property first (from updated API), then fall back to user_oid
            const userId = message.user?._id || message.user_oid || message.user_id;
            const author = message.user?.username || getMessageAuthor(message, userId);
            const firstLetter = author.charAt(0).toUpperCase();
            
            return (
              <div key={index} className="flex space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold text-lg">
                  {firstLetter}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-baseline">
                    <span className="font-medium text-blue-600">{author}</span>
                    <span className="ml-2 text-xs text-gray-500">{formatDateTime(message.timestamp)}</span>
                  </div>
                  <div className="mt-1">{message.text}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..." 
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sending}
        />
        <button 
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg ${
            sending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default GroupMessages;