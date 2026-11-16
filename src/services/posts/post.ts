import type { PostRepository } from "../../domain/post/repository.js";
import type { CreatePostInput, PostService } from "./posts.types.js";

export function createPostService(repository: PostRepository): PostService {
    function getPosts(categoryName?: string, take?: number) {
        return repository.getAllPosts(categoryName, take);
    }

    function getPost(id: number) {
        return repository.findPostById(id);
    }

    function createPost(data: CreatePostInput) {
    return repository.createPost({
        title: data.title,
        content: data.content,
        author: data.author,
        userId: data.userId,
        categoryId: data.categoryId,
    });
}


    return { getPosts, getPost, createPost };
}
