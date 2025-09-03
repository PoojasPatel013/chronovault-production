"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getFeedItems, likeFeedItem, addComment } from "../actions/communityActions"
import {
  FaHeart,
  FaComment,
  FaVideo,
  FaImage,
  FaCalendar,
  FaUser,
  FaFileAlt,
  FaDownload,
  FaClock,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaTimes,
  FaEllipsisH,
} from "react-icons/fa"
import api from "./api"

const CommunityFeed = () => {
  const dispatch = useDispatch()
  const { feedItems, loading, error } = useSelector((state) => state.community)
  const [commentModal, setCommentModal] = useState(false)
  const [selectedFeedItem, setSelectedFeedItem] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [showComments, setShowComments] = useState({})
  const [comments, setComments] = useState({})
  const [likedPosts, setLikedPosts] = useState(new Set())

  useEffect(() => {
    dispatch(getFeedItems())
  }, [dispatch])

  const handleLike = async (feedItemId) => {
    try {
      await dispatch(likeFeedItem(feedItemId))
      setLikedPosts((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(feedItemId)) {
          newSet.delete(feedItemId)
        } else {
          newSet.add(feedItemId)
        }
        return newSet
      })
    } catch (err) {
      console.error("Like failed:", err)
    }
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return
    try {
      await dispatch(addComment(selectedFeedItem._id, commentText))
      setCommentText("")
      setCommentModal(false)
    } catch (err) {
      console.error("Comment failed:", err)
    }
  }

  const toggleComments = (feedItemId) => {
    setShowComments((prev) => ({
      ...prev,
      [feedItemId]: !prev[feedItemId],
    }))
  }

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className="text-gray-400" />
    const ext = fileName.toLowerCase()
    if (ext.includes("pdf")) return <FaFileAlt className="text-red-400" />
    if (ext.includes("doc")) return <FaFileAlt className="text-blue-400" />
    return <FaFileAlt className="text-gray-400" />
  }

  const getMediaComponent = (feedItem) => {
    const { mediaUrl, mediaType, fileName } = feedItem

    console.log("[FeedItem]", feedItem) // ← log the whole item

    if (!mediaUrl) {
      console.warn("Media URL missing for feedItem:", feedItem._id)
      return null
    }

    const fullUrl = mediaUrl.startsWith("http") ? mediaUrl : `${api.defaults.baseURL?.replace(/\/$/, "")}${mediaUrl}`

    console.log("Resolved media URL:", fullUrl, "Type:", mediaType)

    if (mediaType === "image") {
      return (
        <div className="relative w-full rounded-2xl overflow-hidden mb-4 group">
          <img
            src={fullUrl || "/placeholder.svg"}
            alt="Post"
            className="w-full h-auto max-h-96 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.error("Image failed to load:", fullUrl)
              e.target.src = "/placeholder-image.jpg"
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      )
    } else if (mediaType === "video") {
      return (
        <div className="relative w-full rounded-2xl overflow-hidden mb-4 bg-black">
          <video
            src={fullUrl}
            className="w-full h-auto max-h-96 object-cover"
            controls
            poster="/placeholder-video.jpg"
            onError={(e) => {
              console.error("Video failed to load:", fullUrl)
            }}
          />
        </div>
      )
    } else if (mediaType === "document" || fileName) {
      return (
        <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(fileName)}
              <div>
                <p className="text-white font-medium">{fileName || "Document"}</p>
                <p className="text-gray-400 text-sm">Click to download</p>
              </div>
            </div>
            <a href={fullUrl} download className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <FaDownload className="text-white" />
            </a>
          </div>
        </div>
      )
    }

    return null
  }

  const renderTimeCapsuleContent = (feedItem) => {
    // Check if feedItem has time capsule data
    const { timeCapsule, title, memories, media } = feedItem
    const capsuleData = timeCapsule || { title, memories, media }

    if (!capsuleData || (!capsuleData.title && !capsuleData.memories && !capsuleData.media)) {
      return null
    }

    return (
      <div className="space-y-4 mb-4">
        {/* Title Section */}
        {capsuleData.title && (
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-bold text-white mb-2">{capsuleData.title}</h3>
            {capsuleData.description && <p className="text-gray-300">{capsuleData.description}</p>}
          </div>
        )}

        {/* Memories Section */}
        {capsuleData.memories && capsuleData.memories.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <FaClock className="mr-2 text-blue-400" />
              Memories
            </h4>
            <div className="space-y-3">
              {capsuleData.memories.map((memory, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-300">{memory.text || memory}</p>
                  {memory.date && (
                    <p className="text-gray-500 text-sm mt-2">
                      <FaCalendar className="inline mr-1" />
                      {new Date(memory.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Section */}
        {capsuleData.media && capsuleData.media.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <FaImage className="mr-2 text-blue-400" />
              Media
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {capsuleData.media.map((mediaItem, index) => (
                <div key={index} className="relative group">
                  {mediaItem.type === "image" || (!mediaItem.type && mediaItem.url) ? (
                    <img
                      src={mediaItem.url || mediaItem}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg"
                      }}
                    />
                  ) : mediaItem.type === "video" ? (
                    <div className="relative w-full h-24 bg-black rounded-lg flex items-center justify-center">
                      <FaVideo className="text-white text-xl" />
                    </div>
                  ) : (
                    <div className="w-full h-24 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-gray-400 text-xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderCommentSection = (feedItem) => {
    const feedItemId = feedItem._id
    const feedComments = feedItem.comments || []

    if (!showComments[feedItemId]) return null

    return (
      <div className="mt-4 border-t border-white/10 pt-4 space-y-4">
        {/* Comment Input */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-sm" />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  setSelectedFeedItem(feedItem)
                  setCommentText(e.target.value)
                  handleCommentSubmit()
                  e.target.value = ""
                }
              }}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-400 hover:text-blue-300 transition-colors">
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          {feedComments.map((comment, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="text-white text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-white">{comment.userId?.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                  </p>
                </div>
                <p className="text-gray-300 text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto p-6">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-700 rounded"></div>
                    <div className="w-24 h-3 bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-700 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="w-full h-48 bg-gray-700 rounded-2xl mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Community Feed
          </h1>
          <p className="text-gray-400">Discover shared memories and stories from our community</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center space-x-3">
            <FaTimes className="text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error.msg || error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && feedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaComment className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400">Be the first to share your story with the community!</p>
          </div>
        )}

        {/* Feed Items */}
        <div className="space-y-6">
          {feedItems.map((feedItem, index) => (
            <div
              key={feedItem._id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {feedItem.isAnonymous ? "Anonymous User" : feedItem.userId?.name || "Unknown User"}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <FaCalendar />
                      <span>{new Date(feedItem.createdAt).toLocaleDateString()}</span>
                      {feedItem.location && (
                        <>
                          <span>•</span>
                          <FaMapMarkerAlt />
                          <span>{feedItem.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <FaEllipsisH />
                </button>
              </div>

              {/* Post Content */}
              {feedItem.content && (
                <div className="mb-4">
                  <p className="text-gray-300 leading-relaxed">{feedItem.content}</p>
                </div>
              )}

              {/* Time Capsule Content */}
              {renderTimeCapsuleContent(feedItem)}

              {/* Media */}
              {getMediaComponent(feedItem)}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(feedItem._id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      likedPosts.has(feedItem._id)
                        ? "text-red-400 bg-red-500/10"
                        : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <FaHeart />
                    <span className="text-sm font-medium">{feedItem.likes?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(feedItem._id)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                  >
                    <FaComment />
                    <span className="text-sm font-medium">{feedItem.comments?.length || 0}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {renderCommentSection(feedItem)}
            </div>
          ))}
        </div>
      </div>

      {/* Comment Modal */}
      <div className={`fixed inset-0 z-50 ${commentModal ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Comment on Post</h3>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setCommentModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommentSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityFeed
