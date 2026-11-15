import type { Post } from "./entity.js";

export interface PostRepository {
    getAllPosts: (category?: string, take?: number) => Post[];
    createPost: (post: Post) => Promise<Post>;
    findPostById: (id: number) => Post | undefined;
}
