import type { Post } from "../domain/post/entity.js";
import type { CreatePostRepoInput, PostRepository } from "../domain/post/repository.js";

type Database = typeof import("../prisma/db.js").db;

function mapRowToPost(row: {
    id: number;
    title: string;
    content: string;
    author: string | null;
    category: string | null;
}): Post {
    return {
        id: row.id,
        title: row.title,
        content: row.content,
        author: row.author ?? undefined,
        category: row.category ?? undefined,
    };
}

export function createPostRepository(database: Database): PostRepository {
    async function getAllPosts(category?: string, take?: number): Promise<Post[]> {
        const baseQuery = database.orm.public.Post.orderBy((post) => post.id.asc());
        const filteredQuery = category ? baseQuery.where({ category }) : baseQuery;
        const rows = take !== undefined
            ? await filteredQuery.limit(take).all()
            : await filteredQuery.all();

        return rows.map(mapRowToPost);
    }

    async function createPost(post: CreatePostRepoInput): Promise<Post> {
    const created = await database.orm.public.Post.create({
        title: post.title,
        content: post.content,
        author: post.author ?? null,
        category: post.category ?? null,
    });

    return mapRowToPost(created);
}


    async function findPostById(id: number): Promise<Post | undefined> {
        const row = await database.orm.public.Post.where({ id }).first();
        return row ? mapRowToPost(row) : undefined;
    }

    return { getAllPosts, createPost, findPostById };
}
