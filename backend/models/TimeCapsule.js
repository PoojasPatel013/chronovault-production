// backend/models/TimeCapsule.js
import mongoose from 'mongoose';

const TimeCapsuleSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [1, 'Title must be at least 1 character long']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        minlength: [1, 'Content must be at least 1 character long']
    },
    media: {
        type: String,
        // Store the file path in MongoDB
        required: false
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', 'none'],
        default: 'none'
    },
    file: {
        data: Buffer,
        contentType: String
    },
    unlockDate: {
        type: Date,
        required: [true, 'Unlock date is required'],
        validator: function(value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // normalize to start of today
            return value >= today;
          },
        message: props => `${props.value} is not a valid unlock date`
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for public capsules
TimeCapsuleSchema.virtual('publicCapsules', {
    ref: 'TimeCapsule',
    localField: '_id',
    foreignField: 'createdBy',
    match: { isPublic: true },
    justOne: false
});

// Virtual for user
TimeCapsuleSchema.virtual('user', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});

// Static methods
TimeCapsuleSchema.statics = {
    async getPublicCapsules() {
        return this.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name avatar');
    },

    async getPublicCapsulesByUser(userId) {
        return this.find({
            createdBy: userId,
            isPublic: true
        })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name avatar');
    }
};

// Instance methods
TimeCapsuleSchema.methods = {
    async like(userId) {
        if (this.likes.some(like => like.userId.toString() === userId.toString())) {
            this.likes = this.likes.filter(like => like.userId.toString() !== userId.toString());
        } else {
            this.likes.push({ userId });
        }
        await this.save();
        return this;
    },

    async addComment(userId, content) {
        this.comments.push({ userId, content });
        await this.save();
        return this;
    }
};

// Pre-save middleware
TimeCapsuleSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const TimeCapsule = mongoose.model('TimeCapsule', TimeCapsuleSchema);

export default TimeCapsule;
export { TimeCapsuleSchema };