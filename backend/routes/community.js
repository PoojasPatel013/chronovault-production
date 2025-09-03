// backend/routes/community.js
import express from 'express';
import auth from '../middleware/auth.js';
import CommunityFeed from '../models/CommunityFeed.js';
import TimeCapsule from '../models/TimeCapsule.js';
import User from '../models/User.js';
import multer from 'multer';
import { join, extname } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = join(__dirname, '../uploads/community');
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
        const extname = filetypes.test(extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only JPEG, PNG, GIF, MP4, and MOV files are allowed!'));
    }
});

// Get all feed items
router.get('/feed', auth, async (req, res) => {
    try {
        const feedItems = await CommunityFeed.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar')
            .populate('timeCapsuleId', 'title')
            .populate('likes.userId', 'name avatar')
            .populate('comments.userId', 'name avatar');
        
        res.json(feedItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Create a new feed item (for comments)
router.post('/comments', auth, async (req, res) => {
    try {
        const { content, timeCapsuleId } = req.body;
        
        const timeCapsule = await TimeCapsule.findById(timeCapsuleId);
        if (!timeCapsule) {
            return res.status(404).json({ msg: 'Time capsule not found' });
        }

        const feedItem = new CommunityFeed({
            userId: req.user._id,
            timeCapsuleId,
            type: 'comment',
            content,
            mediaUrl: null,
            mediaType: 'none',
            isAnonymous: false
        });

        await feedItem.save();
        res.json(feedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Add media to a feed item
router.post('/feed/:id/media', auth, upload.single('media'), async (req, res) => {
    try {
        const feedItem = await CommunityFeed.findById(req.params.id);
        if (!feedItem) {
            return res.status(404).json({ msg: 'Feed item not found' });
        }

        // Check ownership
        if (feedItem.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        // Delete old media if exists
        if (feedItem.mediaUrl) {
            const oldFilePath = join(__dirname, '..', feedItem.mediaUrl);
            if (existsSync(oldFilePath)) {
                unlinkSync(oldFilePath);
            }
        }

        // Update with new media
        feedItem.mediaUrl = `/uploads/community/${req.file.filename}`;
        feedItem.mediaType = req.file.mimetype.includes('video') ? 'video' : 'image';
        await feedItem.save();

        res.json(feedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Delete media from a feed item
router.delete('/feed/:id/media', auth, async (req, res) => {
    try {
        const feedItem = await CommunityFeed.findById(req.params.id);
        if (!feedItem) {
            return res.status(404).json({ msg: 'Feed item not found' });
        }

        // Check ownership
        if (feedItem.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        // Delete media file if exists
        if (feedItem.mediaUrl) {
            const filePath = join(__dirname, '..', feedItem.mediaUrl);
            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
            feedItem.mediaUrl = null;
            feedItem.mediaType = 'none';
            await feedItem.save();
        }

        res.json(feedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Like a feed item
router.post('/feed/:id/like', auth, async (req, res) => {
    try {
        const feedItem = await CommunityFeed.findById(req.params.id);
        
        if (!feedItem) {
            return res.status(404).json({ msg: 'Feed item not found' });
        }

        // Check if user has already liked
        const hasLiked = feedItem.likes.some(like => like.userId.toString() === req.user._id.toString());

        if (hasLiked) {
            // Remove like
            feedItem.likes = feedItem.likes.filter(like => like.userId.toString() !== req.user._id.toString());
        } else {
            // Add like
            feedItem.likes.unshift({ userId: req.user._id });
        }

        await feedItem.save();
        res.json(feedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Add comment to feed item
router.post('/feed/:id/comments', auth, async (req, res) => {
    try {
        const feedItem = await CommunityFeed.findById(req.params.id);
        
        if (!feedItem) {
            return res.status(404).json({ msg: 'Feed item not found' });
        }

        const comment = {
            userId: req.user._id,
            content: req.body.content
        };

        feedItem.comments.unshift(comment);
        await feedItem.save();

        res.json(feedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Delete comment from feed item
router.delete('/feed/:feedId/comments/:commentId', auth, async (req, res) => {
    try {
        const feedItem = await CommunityFeed.findById(req.params.feedId);
        
        if (!feedItem) {
            return res.status(404).json({ msg: 'Feed item not found' });
        }

        // Find comment to remove
        const comment = feedItem.comments.find(
            c => c._id.toString() === req.params.commentId
        );

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check user
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Remove comment
        feedItem.comments = feedItem.comments.filter(
            c => c._id.toString() !== req.params.commentId
        );

        await feedItem.save();
        res.json(feedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Create a new public time capsule
router.post('/time-capsules', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, content, unlockDate, isPublic } = req.body;
        
        // Validate required fields
        if (!title || !content || !unlockDate) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                errors: {
                    title: !title ? 'Title is required' : null,
                    content: !content ? 'Content is required' : null,
                    unlockDate: !unlockDate ? 'Unlock date is required' : null
                }
            });
        }

        // Validate unlock date
        const unlockDateObj = new Date(unlockDate);
        if (isNaN(unlockDateObj.getTime())) {
            return res.status(400).json({ 
                message: 'Invalid unlock date format'
            });
        }

        const timeCapsule = new TimeCapsule({
            title,
            content,
            createdBy: req.user._id,
            unlockDate: unlockDateObj,
            isPublic: isPublic === 'true',
            file: req.file ? {
                data: req.file.buffer,
                contentType: req.file.mimetype
            } : undefined
        });

        await timeCapsule.save();

        // If public, create community feed entry
        if (isPublic === 'true') {
            const feedItem = new CommunityFeed({
                userId: req.user._id,
                timeCapsuleId: timeCapsule._id,
                type: 'capsule',
                content: `New public time capsule: ${title}`,
                mediaUrl: req.file ? `/api/timecapsules/${timeCapsule._id}/file` : null,
                isAnonymous: false
            });

            await feedItem.save();
        }

        res.status(201).json(timeCapsule);
    } catch (error) {
        console.error('Error creating time capsule:', error);
        res.status(500).json({ 
            message: 'Failed to create time capsule',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
});

// Get all public time capsules
router.get('/time-capsules', auth, async (req, res) => {
    try {
        const timeCapsules = await TimeCapsule.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name avatar');
        
        res.json(timeCapsules);
    } catch (err) {
        console.error('Error fetching public time capsules:', err);
        res.status(500).json({ 
            message: 'Server Error',
            error: process.env.NODE_ENV === 'development' ? {
                message: err.message,
                stack: err.stack
            } : undefined
        });
    }
});

// Get user's public time capsules
router.get('/time-capsules/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const timeCapsules = await TimeCapsule.find({
            createdBy: user._id,
            isPublic: true,
            unlockDate: { $lte: new Date() }
        })
        .populate('createdBy', 'name avatar');
        
        res.json(timeCapsules);
    } catch (err) {
        console.error('Error fetching user time capsules:', err);
        res.status(500).json({ 
            message: 'Server Error',
            error: process.env.NODE_ENV === 'development' ? {
                message: err.message,
                stack: err.stack
            } : undefined
        });
    }
});

export default router;