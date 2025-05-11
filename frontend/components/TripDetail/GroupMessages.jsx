import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../../src/utils/formatters';
import { groupApi, authApi } from '../../src/utils/api';
import api from '../../src/utils/api';

const GroupMessages = ({ messages: initialMessages, members, groupId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState(initialMessages || []);
  const [isEditMode, setIsEditMode] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [pollInterval, setPollInterval] = useState(null);

  // Get current user ID
  const currentUserId = authApi.getCurrentUserId();
  const isGroupLeader = members[0]._id === currentUserId;

  useEffect(() => {

    const fetchMessages = async () => {
      try {
        const response = await groupApi.getByGroupId(groupId);
        if (response.data && response.data.messages) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const interval = setInterval(fetchMessages, 5000);
    setPollInterval(interval);
  
    fetchMessages();
  
    // Clean up interval on unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [groupId]);

  const getMessageAuthor = (message, userId) => {
    if (!userId) return "Unknown User";
    return userId.username;

  };

  const isCurrentUserMessageOrLeader = (message_userId) => {
    return message_userId._id === currentUserId || isGroupLeader;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      
      await groupApi.addMessage(groupId, newMessage.trim());
      
      const response = await groupApi.getByGroupId(groupId);
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      }

      setNewMessage('');

    } catch (error) {
      console.error('Failed to send message:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Initialize delete confirmation
  const initiateDelete = (message) => {
    setMessageToDelete(message);
    setShowDeleteConfirm(true);
  };

  // Handle message deletion with confirmation
  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    
    try {
      // Call API to delete the message
      const response = await api.delete(`/groups/${groupId}/messages/${messageToDelete._id}`);
      
      console.log('Message deleted successfully', response.data);
      
      // Update local state to remove the deleted message
      setMessages(messages.filter(message => 
        message._id !== messageToDelete._id
      ));
      
      // Close the confirmation popup
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
      
    } catch (error) {
      console.error('Failed to delete message:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      
      setError('Failed to delete message. Please try again.');
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      {/* Error Alert */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setError(null)}></div>
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 z-10">
            <h3 className="font-medium mb-2">Error: </h3>
            <p className="mb-6">{error}</p>
            <div className="flex justify-end">
              <button 
                className="px-6 py-2 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200"
                onClick={() => setError(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 z-10">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setMessageToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteMessage}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl text-blue-700">Group Messages</h2>
        <button 
          className={`text-sm ${isEditMode ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded-lg flex items-center`}
          onClick={toggleEditMode}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isEditMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            )}
          </svg>
          {isEditMode ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => {

            const userId = message.user?._id || message.user_oid || message.user_id;
            const author = message.user?.username || getMessageAuthor(message, userId);
            const firstLetter = author.charAt(0).toUpperCase();
            const canDelete = isEditMode && isCurrentUserMessageOrLeader(userId);
            
            return (
              <div key={index} className="flex space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold text-lg">
                  {firstLetter}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-medium text-blue-600">{author}</span>
                      <span className="ml-2 text-xs text-gray-500">{formatDateTime(message.timestamp)}</span>
                    </div>
                    {canDelete && (
                      <button 
                        onClick={() => initiateDelete(message)}
                        className="text-red-600 hover:text-red-800 ml-2"
                        title="Delete message"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
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