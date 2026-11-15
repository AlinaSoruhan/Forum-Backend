import { getAll, getById, addPost } from "../repositories/post.js";

export function getPosts(category, take) {
    return getAll(category, take);
}

export function getPost(id) {
    return getById(id);
}

export function createPost(data) {
    const { title, content, author, category } = data;

    const newPost = {
        title,
        content,
        author: author || "Anonymous",
        category: category || "general"
    };

    return addPost(newPost);
}
