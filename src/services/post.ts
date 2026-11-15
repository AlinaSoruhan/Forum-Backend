import { createPost as savePost, findPostById, getAllPosts } from "../repositories/post.js";
import type { CreatePostRequest } from "../transport/dto/requests.js";
import type { PostResponse } from "../transport/dto/responses.js";

export function getPosts(category?: string, take?: number): PostResponse[] {
    let posts = getAllPosts();

    if (category) {
        posts = posts.filter((post) => post.category === category);
    }

    if (take !== undefined) {
        posts = posts.slice(0, take);
    }

    return posts;
}

export function getPost(id: number): PostResponse | undefined {
    return findPostById(id);
}

export function createPost(data: CreatePostRequest): Promise<PostResponse> {
    const { title, content, author, category } = data;

    const posts = getAllPosts();
    const newPost: PostResponse = {
        id: posts.length + 1,
        title,
        content,
        author,
        category,
    };

    return savePost(newPost);
}
