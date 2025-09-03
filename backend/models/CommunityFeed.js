import mongoose from 'mongoose';

const CommunityFeedSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeCapsuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeCapsule',
        required: true
    },
    type: {
        type: String,
        enum: ['capsule', 'comment'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', 'none'],
        default: 'none'
    },
    isAnonymous: {
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
    }]
}, {
    timestamps: true
});

export default mongoose.model('CommunityFeed', CommunityFeedSchema);
