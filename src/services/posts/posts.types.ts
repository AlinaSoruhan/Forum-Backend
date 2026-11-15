import type { Post } from "../../domain/post/entity.js";

export interface CreatePostInput {
    title: string;
    content: string;
    author?: string;
    categoryId?: number;
}

export interface PostService {
    getPosts: (categoryName?: string, take?: number) => Promise<Post[]>;
    getPost: (id: number) => Promise<Post | undefined>;
    createPost: (data: CreatePostInput) => Promise<Post>;
}
