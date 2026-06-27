import { prisma } from '../lib/prisma.js';

async function getUserPosts(req, res) {
    try {
        const id = req.user; 
        const posts = await prisma.post.findMany({
            where: { userId: Number(id) },
            orderBy: { createdAt: 'desc' } 
        });
        return res.json({ posts });
    } catch (error) {
        return res.sendStatus(500);
    }
}


async function getPostsByAuthor(req, res) {
    try {
        const { userId } = req.params;
        const posts = await prisma.post.findMany({
            where: { userId: Number(userId) },
            orderBy: { createdAt: 'desc' }
        });
        return res.json({ posts });
    } catch (error) {
        return res.sendStatus(500);
    }
}

async function createPost(req, res) {
    try {
        const id = req.user;
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Post content cannot be empty" });
        }

        const newPost = await prisma.post.create({
            data: {
                userId: Number(id),
                text: text
            }
        });
        return res.status(201).json({ msg: "Post created successfully", post: newPost });
    } catch (error) {
        return res.sendStatus(500);
    }
}

async function updatePost(req, res) {
    try {
        const id = req.user;
        const { postId } = req.params;
        const { text } = req.body;

        const post = await prisma.post.findUnique({
            where: { id: Number(postId) }
        });

        if (!post || post.userId !== Number(id)) {
            return res.sendStatus(403); 
        }

        const updated = await prisma.post.update({
            where: { id: Number(postId) },
            data: { text: text }
        });

        return res.json({ msg: "Post is updated", newPost: updated });
    } catch (error) {
        return res.sendStatus(500);
    }
}

async function deletePost(req, res) {
    try {
        const id = req.user;
        const { postId } = req.params;

        const post = await prisma.post.findUnique({
            where: { id: Number(postId) }
        });

        if (!post || post.userId !== Number(id)) {
            return res.sendStatus(403); 
        }

        await prisma.post.delete({
            where: { id: Number(postId) }
        });

        return res.json({ msg: "Post is deleted" });
    } catch (error) {
        return res.sendStatus(500);
    }
}

export default {
    getUserPosts,
    updatePost,
    deletePost,
    createPost,
    getPostsByAuthor
};
