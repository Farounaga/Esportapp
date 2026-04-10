/**
 * Messages API Service
 * Handles messaging between users
 */

import apiClient from './config';

export const messagesAPI = {
  /**
   * Get all conversations for current user
   * @returns {Promise} API response with conversations list
   */
  getConversations: () => apiClient.get('/messages'),

  /**
   * Get messages with a specific user
   * @param {number} userId - ID of the other user
   * @returns {Promise} API response with messages
   */
  getMessages: (userId) => apiClient.get(`/messages/${userId}`),

  /**
   * Send a message to another user
   * @param {number} receiverId - ID of the message recipient
   * @param {string} content - Message content
   * @returns {Promise} API response
   */
  sendMessage: (receiverId, content) =>
    apiClient.post('/messages', { receiver_id: receiverId, content }),

  /**
   * Supprime logiquement un message (soft-delete)
   * Le message est conservé en base mais n'est plus affiché
   * @param {number} messageId - ID du message à supprimer
   * @returns {Promise} API response
   */
  deleteMessage: (messageId) => apiClient.delete(`/messages/${messageId}`),
};

export default messagesAPI;
