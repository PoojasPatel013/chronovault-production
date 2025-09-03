// routes/chat.js
import express from 'express';
import Chat from '../models/Chat.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Get chat history for the user
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select('_id title updatedAt');
    res.json(chats.map(chat => ({
      id: chat._id,
      title: chat.title,
      updatedAt: chat.updatedAt
    })));
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Load a specific chat
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json({ messages: chat.messages });
  } catch (err) {
    console.error('Error loading chat:', err);
    res.status(500).json({ error: 'Failed to load chat' });
  }
});

// Save or update chat
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { chatId, messages, title } = req.body;
    const userId = req.user._id;

    let chat;
    if (chatId) {
      chat = await Chat.findOneAndUpdate(
        { _id: chatId, userId },
        { messages, title },
        { new: true }
      );
    } else {
      chat = new Chat({ userId, messages, title });
      await chat.save();
    }

    res.json({ chatId: chat._id });
  } catch (err) {
    console.error('Error saving chat:', err);
    res.status(500).json({ error: 'Failed to save chat' });
  }
});

// Delete chat
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ error: 'Chat not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting chat:', err);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

export default router;
