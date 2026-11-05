import { getTenantModel } from '../../../database/tenant/tenantModels.js';

/**
 * Staff Notifications, Announcements, Preferences & Birthdays Controller
 */

// 1. In-App Notifications
export const getNotifications = async (req, res) => {
  try {
    const Notification = getTenantModel(req, 'Notification');
    const { isRead, page = 1, limit = 20 } = req.query;

    const filter = {
      tenantId: req.staff.tenantId,
      $or: [
        { staffId: req.staff._id },
        ...(req.user?._id ? [{ userId: req.user._id }] : []),
      ],
    };

    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ ...filter, isRead: false }),
    ]);

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
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

export const getNotificationById = async (req, res) => {
  try {
    const Notification = getTenantModel(req, 'Notification');
    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      tenantId: req.staff.tenantId,
      $or: [
        { staffId: req.staff._id },
        ...(req.user?._id ? [{ userId: req.user._id }] : []),
      ],
    }).lean();

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const Notification = getTenantModel(req, 'Notification');
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.notificationId,
        tenantId: req.staff.tenantId,
        $or: [
          { staffId: req.staff._id },
          ...(req.user?._id ? [{ userId: req.user._id }] : []),
        ],
      },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const Notification = getTenantModel(req, 'Notification');
    await Notification.updateMany(
      {
        tenantId: req.staff.tenantId,
        $or: [
          { staffId: req.staff._id },
          ...(req.user?._id ? [{ userId: req.user._id }] : []),
        ],
        isRead: false,
      },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const Notification = getTenantModel(req, 'Notification');
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      tenantId: req.staff.tenantId,
      $or: [
        { staffId: req.staff._id },
        ...(req.user?._id ? [{ userId: req.user._id }] : []),
      ],
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Notification Preferences
export const getPreferences = async (req, res) => {
  try {
    const NotificationPreference = getTenantModel(req, 'NotificationPreference');
    const userId = req.user?._id || req.staff._id;

    let pref = await NotificationPreference.findOne({
      tenantId: req.staff.tenantId,
      userId,
    }).lean();

    if (!pref) {
      pref = {
        channels: {
          inApp: true,
          email: true,
          sms: false,
          push: true,
          whatsapp: false,
        },
        events: {
          appointments: true,
          chat: true,
          leaves: true,
          attendance: true,
          payments: true,
          announcements: true,
        },
      };
    }

    return res.status(200).json({ success: true, data: pref });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const NotificationPreference = getTenantModel(req, 'NotificationPreference');
    const userId = req.user?._id || req.staff._id;
    const { channels, events } = req.body;

    const pref = await NotificationPreference.findOneAndUpdate(
      { tenantId: req.staff.tenantId, userId },
      {
        $set: {
          ...(channels ? { channels } : {}),
          ...(events ? { events } : {}),
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Notification preferences updated',
      data: pref,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Announcements
export const getAnnouncements = async (req, res) => {
  try {
    const Announcement = getTenantModel(req, 'Announcement');
    const announcements = await Announcement.find({
      tenantId: req.staff.tenantId,
      $or: [
        { targetRoles: { $size: 0 } },
        { targetRoles: 'STAFF' },
        { targetRoles: req.staff.role || 'STAFF' },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const currentUserId = req.user?._id || req.staff._id;
    const enriched = announcements.map((a) => ({
      ...a,
      isRead: a.readBy?.some((uid) => String(uid) === String(currentUserId)),
    }));

    return res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const Announcement = getTenantModel(req, 'Announcement');
    const announcement = await Announcement.findOne({
      _id: req.params.announcementId,
      tenantId: req.staff.tenantId,
    }).lean();

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    const currentUserId = req.user?._id || req.staff._id;
    return res.status(200).json({
      success: true,
      data: {
        ...announcement,
        isRead: announcement.readBy?.some((uid) => String(uid) === String(currentUserId)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAnnouncementRead = async (req, res) => {
  try {
    const Announcement = getTenantModel(req, 'Announcement');
    const currentUserId = req.user?._id || req.staff._id;

    await Announcement.updateOne(
      { _id: req.params.announcementId, tenantId: req.staff.tenantId },
      { $addToSet: { readBy: currentUserId } }
    );

    return res.status(200).json({ success: true, message: 'Announcement marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Staff Birthdays
export const getBirthdays = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staffMembers = await Staff.find(
      { tenantId: req.staff.tenantId, status: 'active', dateOfBirth: { $ne: null } },
      'name photo dateOfBirth department designation'
    ).lean();

    return res.status(200).json({ success: true, data: staffMembers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUpcomingBirthdays = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staffMembers = await Staff.find(
      { tenantId: req.staff.tenantId, status: 'active', dateOfBirth: { $ne: null } },
      'name photo dateOfBirth department designation'
    ).lean();

    const today = new Date();
    const currentMonth = today.getMonth();

    const upcoming = staffMembers.filter((s) => {
      if (!s.dateOfBirth) return false;
      const bDate = new Date(s.dateOfBirth);
      const bMonth = bDate.getMonth();
      return bMonth === currentMonth || bMonth === (currentMonth + 1) % 12;
    });

    return res.status(200).json({ success: true, data: upcoming });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
