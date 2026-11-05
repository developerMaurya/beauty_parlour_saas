/**
 * @file studentChatNotif.controller.js
 * @description Student Communication, Internal Academy Chat, Notifications & Announcements Controller.
 * Conforms to Phase 06 Section 31, 32, 33 & 34.
 * Enables secure Student <-> Admin, Student <-> Trainer and Support channels with message read status.
 * @module backend/src/modules/student/communication/studentChatNotif.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/* ==========================================================================
   1. TRAINERS (Section 31)
   ========================================================================== */

export const getTrainers = async (req, res) => {
  try {
    const StaffModel = getTenantModel(req, 'Staff');
    const trainers = await StaffModel.find({
      tenantId: req.tenantId,
      status: { $ne: 'terminated' },
    }).select('name photo designation department skills phone email');

    return sendSuccess(res, 'Academy trainers', trainers, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch trainers', [], 500);
  }
};

export const getTrainerById = async (req, res) => {
  try {
    const StaffModel = getTenantModel(req, 'Staff');
    const CourseModel = getTenantModel(req, 'Course');

    const trainer = await StaffModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });
    if (!trainer) return sendError(res, 'Trainer not found', [], 404);

    const assignedCourses = await CourseModel.find({
      tenantId: req.tenantId,
      trainerId: trainer._id,
    }).select('name code duration totalClasses');

    return sendSuccess(res, 'Trainer profile', { ...trainer.toObject(), assignedCourses }, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch trainer profile', [], 500);
  }
};

export const getTrainerProfile = async (req, res) => {
  return getTrainerById(req, res);
};

/* ==========================================================================
   2. INTERNAL CHAT (Section 32)
   ========================================================================== */

export const getChats = async (req, res) => {
  try {
    const ChatModel = getTenantModel(req, 'StudentChat');
    const chats = await ChatModel.find({
      tenantId: req.tenantId,
      studentId: req.studentId,
      isArchived: false,
    })
      .populate('trainerId', 'name photo designation')
      .sort({ lastMessageAt: -1 });

    return sendSuccess(res, 'Student chats', chats, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch chats', [], 500);
  }
};

export const createChat = async (req, res) => {
  try {
    const { chatType = 'trainer', trainerId, title } = req.body;
    const ChatModel = getTenantModel(req, 'StudentChat');

    let chat = await ChatModel.findOne({
      tenantId: req.tenantId,
      studentId: req.studentId,
      chatType,
      ...(trainerId ? { trainerId } : {}),
    });

    if (!chat) {
      chat = await ChatModel.create({
        tenantId: req.tenantId,
        studentId: req.studentId,
        chatType,
        trainerId: trainerId || null,
        title: title || (chatType === 'trainer' ? 'Trainer Discussion' : 'Academy Support'),
      });
    }

    return sendSuccess(res, 'Chat channel initialized', chat, 201);
  } catch (error) {
    return sendError(res, 'Failed to create chat', [], 500);
  }
};

export const getChatById = async (req, res) => {
  try {
    const ChatModel = getTenantModel(req, 'StudentChat');
    const chat = await ChatModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    }).populate('trainerId', 'name photo designation');

    if (!chat) return sendError(res, 'Chat not found', [], 404);

    return sendSuccess(res, 'Chat details', chat, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch chat', [], 500);
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const MessageModel = getTenantModel(req, 'StudentChatMessage');
    const messages = await MessageModel.find({
      chatId: req.params.id,
      tenantId: req.tenantId,
    }).sort({ createdAt: 1 });

    return sendSuccess(res, 'Chat messages', messages, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch messages', [], 500);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, attachments = [] } = req.body;
    const chatId = req.params.id;
    if (!message) return sendError(res, 'Message text is required', [], 400);

    const ChatModel = getTenantModel(req, 'StudentChat');
    const MessageModel = getTenantModel(req, 'StudentChatMessage');

    const chat = await ChatModel.findOne({ _id: chatId, studentId: req.studentId, tenantId: req.tenantId });
    if (!chat) return sendError(res, 'Chat channel not found', [], 404);

    const newMsg = await MessageModel.create({
      tenantId: req.tenantId,
      chatId,
      senderRole: 'STUDENT',
      senderId: req.user._id,
      senderName: req.student?.name || req.user.username,
      message,
      attachments,
      isRead: false,
    });

    chat.lastMessage = message;
    chat.lastMessageAt = new Date();
    await chat.save();

    return sendSuccess(res, 'Message sent successfully', newMsg, 201);
  } catch (error) {
    return sendError(res, 'Failed to send message', [], 500);
  }
};

export const markChatRead = async (req, res) => {
  try {
    const MessageModel = getTenantModel(req, 'StudentChatMessage');
    await MessageModel.updateMany(
      { chatId: req.params.id, tenantId: req.tenantId, senderRole: { $ne: 'STUDENT' }, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    return sendSuccess(res, 'Chat marked as read', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to mark chat read', [], 500);
  }
};

export const archiveChat = async (req, res) => {
  try {
    const ChatModel = getTenantModel(req, 'StudentChat');
    await ChatModel.findOneAndUpdate(
      { _id: req.params.id, studentId: req.studentId, tenantId: req.tenantId },
      { $set: { isArchived: true } }
    );
    return sendSuccess(res, 'Chat archived', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to archive chat', [], 500);
  }
};

/* ==========================================================================
   3. NOTIFICATIONS (Section 33)
   ========================================================================== */

export const getNotifications = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'Notification');
    const notifications = await NotificationModel.find({
      tenantId: req.tenantId,
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return sendSuccess(res, 'Student notifications', { notifications, unreadCount }, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch notifications', [], 500);
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'Notification');
    const notif = await NotificationModel.findOne({
      _id: req.params.id,
      userId: req.user._id,
      tenantId: req.tenantId,
    });
    if (!notif) return sendError(res, 'Notification not found', [], 404);

    return sendSuccess(res, 'Notification details', notif, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch notification', [], 500);
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'Notification');
    const notif = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, tenantId: req.tenantId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );
    return sendSuccess(res, 'Notification marked as read', notif, 200);
  } catch (error) {
    return sendError(res, 'Failed to mark notification read', [], 500);
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'Notification');
    await NotificationModel.updateMany(
      { userId: req.user._id, tenantId: req.tenantId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    return sendSuccess(res, 'All notifications marked as read', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to mark all notifications read', [], 500);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const NotificationModel = getTenantModel(req, 'Notification');
    await NotificationModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
      tenantId: req.tenantId,
    });
    return sendSuccess(res, 'Notification deleted', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to delete notification', [], 500);
  }
};

/* ==========================================================================
   4. ANNOUNCEMENTS (Section 34)
   ========================================================================== */

export const getAnnouncements = async (req, res) => {
  try {
    const AnnouncementModel = getTenantModel(req, 'Announcement');
    const announcements = await AnnouncementModel.find({
      tenantId: req.tenantId,
      targetRoles: { $in: ['STUDENT', 'ALL'] },
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Academy announcements', announcements, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch announcements', [], 500);
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const AnnouncementModel = getTenantModel(req, 'Announcement');
    const item = await AnnouncementModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });
    if (!item) return sendError(res, 'Announcement not found', [], 404);

    return sendSuccess(res, 'Announcement details', item, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch announcement', [], 500);
  }
};

export const markAnnouncementRead = async (req, res) => {
  try {
    const AnnouncementModel = getTenantModel(req, 'Announcement');
    await AnnouncementModel.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: req.user._id },
    });
    return sendSuccess(res, 'Announcement marked as read', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to mark announcement read', [], 500);
  }
};
