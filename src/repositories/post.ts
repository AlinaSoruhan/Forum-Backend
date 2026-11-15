import type { PostResponse } from "../transport/dto/responses.js";

let posts: PostResponse[] = [
    {
        id: 1,
        title: "First",
        content: "post",
        author: "Alina",
        category: "programming"
    },
    {
        id: 2,
        title: "Second",
        content: "post",
        author: "Alina",
        category: "news"
    }
];

export function getAllPosts(category?: string, take?: number): PostResponse[] {
    let result = [...posts];

    if (category) {
        result = result.filter((post) => post.category === category);
    }

    if (take !== undefined) {
        result = result.slice(0, take);
    }

    return result;
}

export function createPost(post: PostResponse): Promise<PostResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            posts = [...posts, post];
            resolve(post);
        }, 1000);
    });
}

export function findPostById(id: number): PostResponse | undefined {
    return posts.find((post) => post.id === id);
}
