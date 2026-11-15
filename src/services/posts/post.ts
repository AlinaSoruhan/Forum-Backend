import type { PostRepository } from "../../domain/post/repository.js";
import type { CreatePostInput, PostService } from "./posts.types.js";

export function createPostService(repository: PostRepository): PostService {
    function getPosts(category?: string, take?: number) {
        return repository.getAllPosts(category, take);
    }

    function getPost(id: number) {
        return repository.findPostById(id);
    }

    function createPost(data: CreatePostInput) {
        const { title, content, author, category } = data;

        const posts = repository.getAllPosts();
        const post = {
            id: posts.length + 1,
            title,
            content,
            author,
            category,
        };

        return repository.createPost(post);
    }

    return { getPosts, getPost, createPost };
}