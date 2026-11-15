import type { Post } from "../domain/post/entity.js";
import type { PostRepository } from "../domain/post/repository.js";

export function createPostRepository(): PostRepository {
    let posts: Post[] = [
        {
            id: 1,
            title: "First post",
            content: "Good post",
            author: "Alina",
            category: "programming"
        },
        {
            id: 2,
            title: "Second post",
            content: "Good post",
            author: "Alina",
            category: "news"
        }
    ];

    function getAllPosts(category?: string, take?: number): Post[] {
        let result = [...posts];

        if (category) {
            result = result.filter((post) => post.category === category);
        }

        if (take !== undefined) {
            result = result.slice(0, take);
        }

        return result;
    }

    function createPost(post: Post): Promise<Post> {
        return new Promise<Post>((resolve) => {
            setTimeout(() => {
                posts = [...posts, post];
                resolve(post);
            }, 1000);
        });
    }

    function findPostById(id: number): Post | undefined {
        return posts.find((post) => post.id === id);
    }

    return { getAllPosts, createPost, findPostById };
}
