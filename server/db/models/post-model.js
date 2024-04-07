import mongoose from "mongoose"

// Define Schema
const PostSchema = new mongoose.Schema({

    op: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    body: {
        type: String,
        default: null
    },

    images: [
        {
            type: String,
            default: null
        }
    ],

    video: {
        type: String,
        default: null
    },

    reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },

    reposts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],

    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

    published: {
        type: Date,
        default: Date.now
    }
})

// Create Model
const PostModel = mongoose.model('Post', PostSchema)

export async function selectPost(post_id) {
    const thisPost = await PostModel.findById(post_id)
    if(!thisPost) return
    const op = await thisPost.populate('op').then(result => result.op)
    const reference = await thisPost.populate('reference').then(result => result.reference)
    const reposts = await thisPost.populate('reposts').then(result => result.reposts)
    const views = await thisPost.populate('views').then(result => result.views)
    const likes = await thisPost.populate('likes').then(result => result.likes)
    const comments = await thisPost.populate('comments').then(result => result.comments)

    return {
        ...thisPost._doc,
        op: op,
        reference: reference,
        reposts: reposts,
        views: views,
        likes: likes,
        comments: comments
    }
}

export default PostModel