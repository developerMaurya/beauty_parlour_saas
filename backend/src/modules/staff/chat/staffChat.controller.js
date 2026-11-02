import { getTenantModel } from '../../../database/tenant/tenantModels.js';

/**
 * Staff Tenant Chat Controller
 * Supports:
 * - Admin <-> Staff
 * - Staff <-> Staff
 * - Staff <-> Customer
 * Enforces tenant isolation and participant access control.
 */

export const createChat = async (req, res) => {
  try {
    const Chat = getTenantModel(req, 'Chat');
    const targetParticipantId = req.body.targetParticipantId || req.body.participantId;
    const targetParticipantType = req.body.targetParticipantType || req.body.participantModel || 'STAFF';
    const targetParticipantName = req.body.targetParticipantName || req.body.title || 'User';
    const chatType = req.body.chatType || 'STAFF_STAFF';

    if (!targetParticipantId) {
      return res.status(400).json({
        success: false,
        message: 'participantId or targetParticipantId is required',
      });
    }

    const currentUserId = req.user?._id || req.staff?._id;
    const currentName = req.staff?.name || req.user?.name || 'Staff Member';

    // Check if chat already exists between these two participants
    const existingChat = await Chat.findOne({
      tenantId: req.tenantId,
      chatType,
      'participants.userId': { $all: [currentUserId, targetParticipantId] },
    });

    if (existingChat) {
      return res.status(200).json({ success: true, data: existingChat, isExisting: true });
    }

    const newChat = await Chat.create({
      tenantId: req.tenantId,
      chatType,
      title: req.body.title || '',
      participants: [
        {
          userId: currentUserId,
          userType: 'STAFF',
          name: currentName,
          photo: req.staff?.photo || '',
        },
        {
          userId: targetParticipantId,
          userType: targetParticipantType,
          name: targetParticipantName,
          photo: '',
        },
      ],
      lastMessage: {
        text: 'Chat started',
        senderId: currentUserId,
        senderName: currentName,
        sentAt: new Date(),
      },
    });

    return res.status(201).json({ success: true, message: 'Chat created successfully', data: newChat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const Chat = getTenantModel(req, 'Chat');
    const currentUserId = req.user?._id || req.staff._id;

    const chats = await Chat.find({
      tenantId: req.tenantId,
      $or: [
        { 'participants.userId': currentUserId },
        { 'participants.userId': req.staff._id },
        ...(req.user?._id ? [{ 'participants.userId': req.user._id }] : []),
      ],
      isArchived: false,
    })
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const Chat = getTenantModel(req, 'Chat');
    const currentUserId = req.user?._id || req.staff._id;

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      tenantId: req.tenantId,
      $or: [
        { 'participants.userId': currentUserId },
        { 'participants.userId': req.staff._id },
        ...(req.user?._id ? [{ 'participants.userId': req.user._id }] : []),
      ],
    }).lean();

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat conversation not found' });
    }

    return res.status(200).json({ success: true, data: chat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const Chat = getTenantModel(req, 'Chat');
    const ChatMessage = getTenantModel(req, 'ChatMessage');
    const Notification = getTenantModel(req, 'Notification');

    const currentUserId = req.user?._id || req.staff._id;
    const currentName = req.staff.name || 'Staff Member';

    // Verify staff is participant in chat
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      tenantId: req.tenantId,
      $or: [
        { 'participants.userId': currentUserId },
        { 'participants.userId': req.staff._id },
        ...(req.user?._id ? [{ 'participants.userId': req.user._id }] : []),
      ],
    });

    if (!chat) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      });
    }

    const text = req.body.text || req.body.content || '';
    const attachments = req.body.attachments || [];
    if (!text && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, message: 'Message text or attachment is required' });
    }

    const message = await ChatMessage.create({
      tenantId: req.tenantId,
      chatId: chat._id,
      senderId: currentUserId,
      senderType: 'STAFF',
      senderName: currentName,
      text: text || '',
      attachments: Array.isArray(attachments) ? attachments : [],
      readBy: [currentUserId],
    });

    // Update chat last message
    chat.lastMessage = {
      text: text || 'Sent an attachment',
      senderId: currentUserId,
      senderName: currentName,
      sentAt: new Date(),
    };
    await chat.save();

    const responseData = {
      ...(message.toObject ? message.toObject() : message),
      content: text,
    };

    return res.status(201).json({ success: true, message: 'Message sent', data: responseData });

    // Trigger in-app notification to other participants
    const otherParticipants = chat.participants.filter(
      (p) => String(p.userId) !== String(currentUserId) && String(p.userId) !== String(req.staff._id)
    );

    for (const participant of otherParticipants) {
      try {
        await Notification.create({
          tenantId: req.tenantId,
          userId: participant.userId,
          userType: participant.userType,
          title: `New message from ${currentName}`,
          message: text || 'Sent an attachment',
          type: 'chat',
          metadata: { chatId: chat._id, messageId: message._id },
        });
      } catch (err) {
        // Notification creation silent fail safe
      }
    }

    return res.status(201).json({ success: true, message: 'Message sent', data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const Chat = getTenantModel(req, 'Chat');
    const ChatMessage = getTenantModel(req, 'ChatMessage');
    const currentUserId = req.user?._id || req.staff._id;

    // Verify chat participant
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      tenantId: req.tenantId,
      $or: [
        { 'participants.userId': currentUserId },
        { 'participants.userId': req.staff._id },
        ...(req.user?._id ? [{ 'participants.userId': req.user._id }] : []),
      ],
    }).lean();

    if (!chat) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation',
      });
    }

    const { limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [messages, total] = await Promise.all([
      ChatMessage.find({ chatId: chat._id, tenantId: req.tenantId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      ChatMessage.countDocuments({ chatId: chat._id, tenantId: req.tenantId }),
    ]);

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const ChatMessage = getTenantModel(req, 'ChatMessage');
    const currentUserId = req.user?._id || req.staff._id;

    await ChatMessage.updateMany(
      {
        chatId: req.params.chatId,
        tenantId: req.tenantId,
        readBy: { $ne: currentUserId },
      },
      {
        $addToSet: { readBy: currentUserId },
      }
    );

    return res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const archiveChat = async (req, res) => {
  try {
    const Chat = getTenantModel(req, 'Chat');
    const currentUserId = req.user?._id || req.staff._id;

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      tenantId: req.tenantId,
      $or: [
        { 'participants.userId': currentUserId },
        { 'participants.userId': req.staff._id },
        ...(req.user?._id ? [{ 'participants.userId': req.user._id }] : []),
      ],
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat conversation not found' });
    }

    chat.isArchived = true;
    await chat.save();

    return res.status(200).json({ success: true, message: 'Chat archived successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
