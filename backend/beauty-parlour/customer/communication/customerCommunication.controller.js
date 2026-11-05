/**
 * @file customerCommunication.controller.js
 * @description Customer Communication Controller: Real-time Chats, Notifications, and Channel Preferences.
 * @module backend/src/modules/customer/communication/customerCommunication.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// ==========================================
// CHAT ENDPOINTS (Customer <-> Admin/Staff/Support)
// ==========================================

export const getChats = async (req, res) => {
  try {
    const ChatModel = getTenantModel(req, 'CustomerChat');

    const chats = await ChatModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      isArchived: false,
    })
      .populate('staffId', 'name photo designation')
      .populate('branchId', 'name')
      .sort({ updatedAt: -1 });

    return sendSuccess(res, 'Customer chats retrieved successfully', chats);
  } catch (error) {
    return sendError(res, `Failed to retrieve chats: ${error.message}`, [], 500);
  }
};

export const createChat = async (req, res) => {
  try {
    const { recipientType = 'SUPPORT', staffId, branchId, subject, initialMessage } = req.body;
    const ChatModel = getTenantModel(req, 'CustomerChat');
    const MessageModel = getTenantModel(req, 'CustomerChatMessage');

    // Check if an open chat already exists with the same party
    const filter = {
      tenantId: req.tenantId,
      customerId: req.customerId,
      recipientType,
      isArchived: false,
    };
    if (staffId) filter.staffId = staffId;

    let chat = await ChatModel.findOne(filter);

    if (!chat) {
      chat = await ChatModel.create({
        tenantId: req.tenantId,
        customerId: req.customerId,
        staffId: staffId || null,
        branchId: branchId || null,
        recipientType,
        subject: subject || `${recipientType} Conversation`,
        unreadCountCustomer: 0,
        unreadCountSupport: initialMessage ? 1 : 0,
        lastMessage: initialMessage || 'Chat started',
        lastMessageAt: new Date(),
      });
    }

    if (initialMessage) {
      await MessageModel.create({
        tenantId: req.tenantId,
        chatId: chat._id,
        senderType: 'CUSTOMER',
        senderId: req.customerId,
        senderName: req.customer?.name || 'Customer',
        message: initialMessage,
        createdAt: new Date(),
      });
      chat.lastMessage = initialMessage;
      chat.lastMessageAt = new Date();
      await chat.save();
    }

    return sendSuccess(res, 'Chat initiated successfully', chat, 201);
  } catch (error) {
    return sendError(res, `Failed to create chat: ${error.message}`, [], 500);
  }
};

export const getChatById = async (req, res) => {
  try {
    const ChatModel = getTenantModel(req, 'CustomerChat');

    const chat = await ChatModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    })
      .populate('staffId', 'name photo designation')
      .populate('branchId', 'name');

    if (!chat) {
      return sendError(res, 'Chat conversation not found', [], 404);
    }

    return sendSuccess(res, 'Chat details retrieved', chat);
  } catch (error) {
    return sendError(res, `Failed to retrieve chat: ${error.message}`, [], 500);
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const ChatModel = getTenantModel(req, 'CustomerChat');
    const MessageModel = getTenantModel(req, 'CustomerChatMessage');

    const chat = await ChatModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!chat) {
      return sendError(res, 'Chat conversation not found or access denied', [], 404);
    }

    // Mark unread for customer as 0
    chat.unreadCountCustomer = 0;
    await chat.save();

    const messages = await MessageModel.find({
      tenantId: req.tenantId,
      chatId: chat._id,
    }).sort({ createdAt: 1 });

    return sendSuccess(res, 'Chat messages retrieved', messages);
  } catch (error) {
    return sendError(res, `Failed to retrieve messages: ${error.message}`, [], 500);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, attachments = [] } = req.body;
    if (!message && (!attachments || attachments.length === 0)) {
      return sendError(res, 'Message text or attachment is required', [], 400);
    }

    const ChatModel = getTenantModel(req, 'CustomerChat');
    const MessageModel = getTenantModel(req, 'CustomerChatMessage');

    const chat = await ChatModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!chat) {
      return sendError(res, 'Chat conversation not found or access denied', [], 404);
    }

    const chatMessage = await MessageModel.create({
      tenantId: req.tenantId,
      chatId: chat._id,
      senderType: 'CUSTOMER',
      senderId: req.customerId,
      senderName: req.customer?.name || 'Customer',
      message: (message || '').trim(),
      attachments,
      createdAt: new Date(),
    });

    chat.lastMessage = message || 'Sent an attachment';
    chat.lastMessageAt = new Date();
    chat.unreadCountSupport = (chat.unreadCountSupport || 0) + 1;
    await chat.save();

    return sendSuccess(res, 'Message sent successfully', chatMessage, 201);
  } catch (error) {
    return sendError(res, `Failed to send message: ${error.message}`, [], 500);
  }
};

export const markChatRead = async (req, res) => {
  try {
    const ChatModel = getTenantModel(req, 'CustomerChat');
    await ChatModel.updateOne(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: { unreadCountCustomer: 0 } }
    );
    return sendSuccess(res, 'Chat marked as read', { chatId: req.params.id });
  } catch (error) {
    return sendError(res, `Failed to mark read: ${error.message}`, [], 500);
  }
};

export const archiveChat = async (req, res) => {
  try {
    const ChatModel = getTenantModel(req, 'CustomerChat');
    await ChatModel.updateOne(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: { isArchived: true } }
    );
    return sendSuccess(res, 'Chat archived successfully', { chatId: req.params.id });
  } catch (error) {
    return sendError(res, `Failed to archive chat: ${error.message}`, [], 500);
  }
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const getNotifications = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'CustomerNotification');
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const query = {
      tenantId: req.tenantId,
      customerId: req.customerId,
    };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [notifications, total, unreadCount] = await Promise.all([
      NotificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      NotificationModel.countDocuments(query),
      NotificationModel.countDocuments({ tenantId: req.tenantId, customerId: req.customerId, isRead: false }),
    ]);

    return sendSuccess(res, 'Customer notifications retrieved', {
      notifications,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve notifications: ${error.message}`, [], 500);
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'CustomerNotification');
    const notification = await NotificationModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!notification) {
      return sendError(res, 'Notification not found', [], 404);
    }

    return sendSuccess(res, 'Notification details retrieved', notification);
  } catch (error) {
    return sendError(res, `Failed to retrieve notification: ${error.message}`, [], 500);
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'CustomerNotification');
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );

    if (!notification) {
      return sendError(res, 'Notification not found', [], 404);
    }

    return sendSuccess(res, 'Notification marked as read', notification);
  } catch (error) {
    return sendError(res, `Failed to update notification: ${error.message}`, [], 500);
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'CustomerNotification');
    await NotificationModel.updateMany(
      { tenantId: req.tenantId, customerId: req.customerId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return sendSuccess(res, 'All notifications marked as read', { markedAll: true });
  } catch (error) {
    return sendError(res, `Failed to update notifications: ${error.message}`, [], 500);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'CustomerNotification');
    const result = await NotificationModel.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!result) {
      return sendError(res, 'Notification not found', [], 404);
    }

    return sendSuccess(res, 'Notification deleted successfully', { notificationId: req.params.id });
  } catch (error) {
    return sendError(res, `Failed to delete notification: ${error.message}`, [], 500);
  }
};

// ==========================================
// NOTIFICATION PREFERENCES
// ==========================================

export const getNotificationPreferences = async (req, res) => {
  try {
    const PrefModel = getTenantModel(req, 'CustomerNotificationPreference');

    let prefs = await PrefModel.findOne({
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!prefs) {
      prefs = await PrefModel.create({
        tenantId: req.tenantId,
        customerId: req.customerId,
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: true,
        whatsappEnabled: true,
        appointmentReminders: true,
        paymentAlerts: true,
        promotionalOffers: true,
        reviewReminders: true,
        chatNotifications: true,
      });
    }

    return sendSuccess(res, 'Notification preferences retrieved', prefs);
  } catch (error) {
    return sendError(res, `Failed to retrieve preferences: ${error.message}`, [], 500);
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const PrefModel = getTenantModel(req, 'CustomerNotificationPreference');

    const updated = await PrefModel.findOneAndUpdate(
      { tenantId: req.tenantId, customerId: req.customerId },
      { $set: req.body },
      { new: true, upsert: true }
    );

    return sendSuccess(res, 'Notification preferences updated successfully', updated);
  } catch (error) {
    return sendError(res, `Failed to update preferences: ${error.message}`, [], 500);
  }
};

export default {
  getChats,
  createChat,
  getChatById,
  getChatMessages,
  sendMessage,
  markChatRead,
  archiveChat,
  getNotifications,
  getNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
};
