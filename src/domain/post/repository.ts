import type { Post } from "./entity.js";

export interface CreatePostRepoInput {
    title: string;
    content: string;
    author?: string;
    userId?: number;
    categoryId?: number;
}

export interface PostRepository {
    getAllPosts: (categoryName?: string, take?: number) => Promise<Post[]>;
    createPost: (post: CreatePostRepoInput) => Promise<Post>;
    findPostById: (id: number) => Promise<Post | undefined>;
}
