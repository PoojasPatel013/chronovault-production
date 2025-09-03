import { Router } from 'express';
import multer from 'multer';
import { join, extname, dirname } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import TimeCapsule from '../models/TimeCapsule.js';
import CommunityFeed from '../models/CommunityFeed.js';
import verifyToken from '../middleware/auth.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = join(__dirname, '../uploads/timecapsules');
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
        const fileExt = filetypes.test(extname(file.originalname).toLowerCase());
        const mimeType = filetypes.test(file.mimetype);
      
        if (mimeType && fileExt) {
          return cb(null, true);
        }
      
        cb(new Error('Only JPEG, PNG, GIF, MP4, and MOV files are allowed!'));
      }
});

// Create a new time capsule
router.post('/', upload.single('media'), async (req, res) => {
    try {
        const { title, content, unlockDate, isPublic } = req.body;

        if (!title || !content || !unlockDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const timeCapsule = new TimeCapsule({
            title,
            content,
            unlockDate: new Date(unlockDate),
            isPublic: isPublic === 'true',
            createdBy: req.user._id,
            media: req.file ? `/uploads/timecapsules/${req.file.filename}` : null,
            mediaType: req.file ? 
                (req.file.mimetype.includes('video') ? 'video' : 'image') : 
                'none'
        });

        await timeCapsule.save();

        // Create community feed entry if public
        if (isPublic === 'true') {
            const feedItem = new CommunityFeed({
                userId: req.user._id,
                timeCapsuleId: timeCapsule._id,
                type: 'capsule',
                content: `New time capsule: ${title}`,
                mediaUrl: timeCapsule.media,
                mediaType: timeCapsule.mediaType,
                isAnonymous: false
            });
            await feedItem.save();
        }

        res.json({
            success: true,
            message: 'Time capsule created successfully',
            data: timeCapsule
        });
    } catch (err) {
        console.error('Error creating time capsule:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// Get user's time capsules
router.get('/', async (req, res) => {
    try {
        const timeCapsules = await TimeCapsule.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name avatar');
        
        res.json({
            success: true,
            data: timeCapsules
        });
    } catch (err) {
        console.error('Error fetching time capsules:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// Get all public time capsules
router.get('/public', async (req, res) => {
    try {
        const timeCapsules = await TimeCapsule.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name avatar');
        
        res.json({
            success: true,
            data: timeCapsules
        });
    } catch (err) {
        console.error('Error fetching public time capsules:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// Get public time capsules by user
router.get('/public/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const timeCapsules = await TimeCapsule.find({
            createdBy: userId,
            isPublic: true
        })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name avatar');
        
        res.json({
            success: true,
            data: timeCapsules
        });
    } catch (err) {
        console.error('Error fetching user public time capsules:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// ⚠️ MUST be placed BEFORE router.get('/:id')
router.get('/private', verifyToken, async (req, res) => {
    try {
      const userId = req.user._id;
  
      const capsules = await TimeCapsule.find({
        createdBy: userId,
        isPublic: false
      }).sort({ unlockDate: 1 });
  
      res.status(200).json({ data: capsules });
    } catch (err) {
      console.error('Error fetching private capsules:', err);
      res.status(500).json({ error: 'Failed to fetch private capsules' });
    }
  });  

// Get a single time capsule
router.get('/:id', async (req, res) => {
    try {
        const timeCapsule = await TimeCapsule.findById(req.params.id)
            .populate('createdBy', 'name avatar');
        
        if (!timeCapsule) {
            return res.status(404).json({
                success: false,
                message: 'Time capsule not found'
            });
        }
        
        // Check if user can view this capsule
        if (!timeCapsule.isPublic && timeCapsule.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view this time capsule'
            });
        }

        res.json({
            success: true,
            data: timeCapsule
        });
    } catch (err) {
        console.error('Error fetching time capsule:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

// Update a time capsule
router.put('/:id', upload.single('media'), async (req, res) => {
    try {
        const timeCapsule = await TimeCapsule.findById(req.params.id);
        
        if (!timeCapsule) {
            return res.status(404).json({
                success: false,
                message: 'Time capsule not found'
            });
        }

        // Only allow updates to own capsules
        if (timeCapsule.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this time capsule'
            });
        }

        // Update fields
        timeCapsule.title = req.body.title || timeCapsule.title;
        timeCapsule.content = req.body.content || timeCapsule.content;
        timeCapsule.unlockDate = req.body.unlockDate ? new Date(req.body.unlockDate) : timeCapsule.unlockDate;
        timeCapsule.isPublic = req.body.isPublic === 'true';

        // Update media if new file is uploaded
        if (req.file) {
            // Delete old file if exists
            if (timeCapsule.media) {
                const oldFilePath = join(__dirname, '..', timeCapsule.media);
                if (existsSync(oldFilePath)) {
                    unlinkSync(oldFilePath);
                }
            }
            
            timeCapsule.media = `/uploads/timecapsules/${req.file.filename}`;
            timeCapsule.mediaType = req.file.mimetype.includes('video') ? 'video' : 'image';
        }

        await timeCapsule.save();

        // Update community feed entry if public
        if (timeCapsule.isPublic) {
            const feedItem = await CommunityFeed.findOne({
                timeCapsuleId: timeCapsule._id,
                type: 'capsule'
            });

            if (feedItem) {
                feedItem.mediaUrl = timeCapsule.media;
                feedItem.mediaType = timeCapsule.mediaType;
                await feedItem.save();
            }
        }

        res.json({
            success: true,
            message: 'Time capsule updated successfully',
            data: timeCapsule
        });
    } catch (err) {
        console.error('Error updating time capsule:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}); 

// Delete a time capsule
router.delete('/:id', async (req, res) => {
    try {
        const timeCapsule = await TimeCapsule.findById(req.params.id);
        
        if (!timeCapsule) {
            return res.status(404).json({
                success: false,
                message: 'Time capsule not found'
            });
        }

        // Only allow deletion of own capsules
        if (timeCapsule.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this time capsule'
            });
        }

        // Delete associated media file if exists
        if (timeCapsule.media) {
            const filePath = join(__dirname, '..', timeCapsule.media);
            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
        }

        // Delete community feed entry if exists
        if (timeCapsule.isPublic) {
            await CommunityFeed.deleteOne({
                timeCapsuleId: timeCapsule._id,
                type: 'capsule'
            });
        }

        await timeCapsule.deleteOne();

        res.json({
            success: true,
            message: 'Time capsule deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting time capsule:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

export default router;
