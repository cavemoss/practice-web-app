import mongoose from "mongoose"
import PostModel, { selectPost } from "./post-model.js"
import CommentModel, { selectComment } from "./comment-model.js"

// Define Schema
const UserSchema = new mongoose.Schema({
    
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },

    name: {
        type: String,
        trim: true,
        default: null
    },

    bio: {
        type: String,
        default: null
    },
    
    picture: {
        type: String,
        default: null
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    emailVerified: {
        type: Boolean,
        default: false
    },

    password: {
        type: String,
        required: true,
    },

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],

    created: {
        type: Date,
        default: Date.now
    }
})

// Create Model
const UserModel = mongoose.model('User', UserSchema)

export async function createUser(obj){

    await new UserModel({
        username: obj.username,
        name: obj.name,
        bio: obj.bio,
        picture: obj.picture,
        email: obj.email,
        password: obj.password
    }).save()
}

export async function selectUser(userInfo){
    const userData = await UserModel.findOne(userInfo)
    if(!userData) return
    const following = await UserModel.findOne(userInfo).populate('following').then(result => result.following)
    const followers = await UserModel.findOne(userInfo).populate('followers').then(result => result.followers)
    const posts = await UserModel.findOne(userInfo).populate('posts').then(result => result.posts)
    
    return {
        ...userData._doc,
        following: following,
        followers: followers,
        posts: posts.reverse(),

        editProfile: async (update) => await UserModel.updateOne(userInfo, update),

        deleteProfile: async () => await UserModel.deleteOne(userInfo), 

        follow: async function(targetInfo) {
            const targetData = await UserModel.findOne(targetInfo)

            function findDuplicates(element){
                return element.toString() == userData._id.toString()
            }

            if(targetData.followers.filter(findDuplicates).length == 0) {
                await UserModel.updateOne(targetInfo, {followers: [...targetData.followers, userData._id]})
                await UserModel.updateOne(userInfo, {following: [...userData.following, targetData._id]})
            }
        },     

        unfollow: async function(targetInfo) {
            const targetData = await UserModel.findOne(targetInfo)

            function findDuplicates(element){
                return element.toString() == userData._id.toString()
            }

            function removeUser(element) {
                return element._id.toString() != userData._id.toString()
            }

            function removeTarget(element) {
                return element._id.toString() != targetData._id.toString()
            }

            if(targetData.followers.filter(findDuplicates).length > 0) {
                await UserModel.updateOne(targetInfo, {followers: targetData.followers.filter(removeUser)})
                await UserModel.updateOne(userInfo, {following: userData.following.filter(removeTarget)})
            }
        },

        post: async function(content) {

            const newPost = await new PostModel({
                op: userData._id,
                body: content.body,
                images: content.images,
                video: content.video,
            }).save()

            await UserModel.updateOne(userInfo, {posts: [...userData.posts, newPost._id]})
        },

        repost: async function(targetPost_id, content) {
            const targetData = await selectPost(targetPost_id)
            if(!content) content = {}

            function findDuplicates(element) {
                return element.op.toString() == userData._id.toString()
            }

            if(targetData.reposts.filter(findDuplicates).length == 0) {

                const newPost = await new PostModel({
                    op: userData._id,
                    body: content.body,
                    images: content.images,
                    video: content.video,
                    reference: targetPost_id
                }).save()

                await PostModel.updateOne({_id: targetPost_id}, {reposts: [...targetData.reposts, newPost._id]})
                await UserModel.updateOne(userInfo, {posts: [...userData.posts, newPost._id]})
            }
        },

        deletePost: async function(targetPost_id) {
            try {
                const targetData = await selectPost(targetPost_id)

                if(targetData.op._id.toString() == userData._id.toString()) {
                    await PostModel.deleteOne({_id: targetPost_id})
                }

            } catch {
                console.error(`! Post ${targetPost_id.toString()} doesn't exist`)
            }
        },

        view: async function(targetPost_id) {
            const targetData = await selectPost(targetPost_id)

            function findDuplicates(element){
                return element._id.toString() == userData._id.toString()
            }

            if(targetData.views.filter(findDuplicates).length == 0) {
                await PostModel.updateOne({_id: targetPost_id}, {views: [...targetData.views, userData._id]})
            }
        }, 

        like: async function(targetPost_id) {
            const targetData = await selectPost(targetPost_id)

            function findDuplicates(element){
                return element._id.toString() == userData._id.toString()
            }

            function removeElement(element) {
                return element._id.toString() != userData._id.toString()
            }

            if(targetData.likes.filter(findDuplicates).length == 0) {
                await PostModel.updateOne({_id: targetPost_id}, {likes: [...targetData.likes, userData._id]})
            } else {
                await PostModel.updateOne({_id: targetPost_id}, {likes: targetData.likes.filter(removeElement)})
            }
        },

        comment: async function(targetPost_id, body) {
            const targetData = await selectPost(targetPost_id)

            const newComment = await new CommentModel({
                post: targetData._id,
                author: userData._id,
                body: body
            }).save()

            await PostModel.updateOne({_id: targetPost_id}, {comments: [...targetData.comments, newComment._id]})
        },

        reply: async function(targetComment_id, body) {
            const targetData = await selectComment(targetComment_id)

            const newComment = await new CommentModel({
                post: targetData.post._id,
                author: userData._id,
                body: body
            }).save()

            await CommentModel.updateOne({_id: targetComment_id}, {replies: [...targetData.replies, newComment._id]})
        },

        deleteComment: async function(targetComment_id) {
            try {
                const targetData = await selectComment(targetComment_id)
                
                if(targetData.author._id.toString() == userData._id.toString()) {
                    await CommentModel.deleteOne({_id: targetComment_id})
                }

            } catch {
                console.error(`! comment ${targetComment_id.toString()} doesn't exist`)
            }
        },

        likeComment: async function(targetComment_id) {
            const targetData = await selectComment(targetComment_id)

            function findDuplicates(element){
                return element._id.toString() == userData._id.toString()
            }

            function removeElement(element) {
                return element._id.toString() != userData._id.toString()
            }

            if(targetData.likes.filter(findDuplicates).length == 0) {
                await CommentModel.updateOne({_id: targetComment_id}, {likes: [...targetData.likes, userData._id]})
            } else {
                await CommentModel.updateOne({_id: targetComment_id}, {likes: targetData.likes.filter(removeElement)})
            }
        }
    }
}

export default UserModel