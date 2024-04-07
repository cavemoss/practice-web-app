import mongoose from "mongoose"

// Define Schema
const CommentSchema = new mongoose.Schema({

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    body: {
        type: String,
        required: true
    },

    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    published: {
        type: Date,
        default: Date.now
    }
})

// Create Model
const CommentModel = mongoose.model('Comment', CommentSchema)

export async function selectComment(comment_id) {
    const thisComment = await CommentModel.findOne({_id: comment_id})
    if(!thisComment) return
    const post = await thisComment.populate('post').then(result => result.post)
    const author = await thisComment.populate('author').then(result => result.author)
    const replies = await thisComment.populate('replies').then(result => result.replies)
    const likes = await thisComment.populate('likes').then(result => result.likes)

    return {
        ...thisComment._doc,
        post: post,
        author: author,
        replies: replies,
        likes: likes,
    }
}

export default CommentModel
