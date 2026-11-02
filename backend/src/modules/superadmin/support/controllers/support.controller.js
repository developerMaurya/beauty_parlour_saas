import { SupportTicket } from '../models/support.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const supportController = {
  async listTickets(req, res, next) {
    try {
      const query = {};
      if (req.query.status) query.status = req.query.status;

      const tickets = await SupportTicket.find(query).populate('tenantId', 'name slug email').sort({ createdAt: -1 });
      return sendSuccess(res, 'Support tickets retrieved', tickets);
    } catch (e) { next(e); }
  },

  async createTicket(req, res, next) {
    try {
      const { tenantId, subject, category, priority, message } = req.body;
      const ticketNumber = `TCK-${Date.now().toString().slice(-6)}`;

      const ticket = await SupportTicket.create({
        ticketNumber,
        tenantId,
        subject,
        category: category || 'technical',
        priority: priority || 'medium',
        messages: [{ sender: req.user.name || 'Super Admin', senderRole: 'superadmin', message }],
      });
      return sendSuccess(res, 'Support ticket created', ticket, 201);
    } catch (e) { next(e); }
  },

  async getTicketById(req, res, next) {
    try {
      const ticket = await SupportTicket.findById(req.params.ticketId).populate('tenantId');
      if (!ticket) return sendError(res, 'Ticket not found', [], 404);
      return sendSuccess(res, 'Ticket details', ticket);
    } catch (e) { next(e); }
  },

  async updateTicket(req, res, next) {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(req.params.ticketId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Ticket updated', ticket);
    } catch (e) { next(e); }
  },

  async deleteTicket(req, res, next) {
    try {
      await SupportTicket.findByIdAndDelete(req.params.ticketId);
      return sendSuccess(res, 'Ticket removed');
    } catch (e) { next(e); }
  },

  async replyToTicket(req, res, next) {
    try {
      const { message } = req.body;
      if (!message) return sendError(res, 'Message is required', [], 400);

      const ticket = await SupportTicket.findById(req.params.ticketId);
      if (!ticket) return sendError(res, 'Ticket not found', [], 404);

      ticket.messages.push({
        sender: req.user.name || 'Super Admin',
        senderRole: 'superadmin',
        message,
        createdAt: new Date(),
      });
      ticket.status = 'in_progress';
      await ticket.save();

      return sendSuccess(res, 'Reply added', ticket);
    } catch (e) { next(e); }
  },

  async closeTicket(req, res, next) {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(req.params.ticketId, { $set: { status: 'closed' } }, { new: true });
      return sendSuccess(res, 'Ticket closed', ticket);
    } catch (e) { next(e); }
  },

  async reopenTicket(req, res, next) {
    try {
      const ticket = await SupportTicket.findByIdAndUpdate(req.params.ticketId, { $set: { status: 'open' } }, { new: true });
      return sendSuccess(res, 'Ticket reopened', ticket);
    } catch (e) { next(e); }
  },
};

export default supportController;
