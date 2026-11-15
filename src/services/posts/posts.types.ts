import type { Post } from "../../domain/post/entity.js";

export interface CreatePostInput {
    title: string;
    content: string;
    author?: string;
    category?: string;
}

export interface PostService {
    getPosts: (category?: string, take?: number) => Post[];
    getPost: (id: number) => Post | undefined;
    createPost: (data: CreatePostInput) => Promise<Post>;
}
