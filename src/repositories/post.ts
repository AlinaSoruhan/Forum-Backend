import { isStructuredError } from "@prisma/orm-postgres/utils";
import type { Category } from "../domain/category/entity.js";
import type { Post } from "../domain/post/entity.js";
import type { CreatePostRepoInput, PostRepository } from "../domain/post/repository.js";

type Database = typeof import("../prisma/db.js").db;

function mapRowToPost(row: {
    id: number;
    title: string;
    content: string;
    author: string | null;
    categoryId: number | null;
    category?: Category | null;
}): Post {
    return {
        id: row.id,
        title: row.title,
        content: row.content,
        author: row.author ?? undefined,
        categoryId: row.categoryId,
        category: row.category ?? null,
    };
}

export function createPostRepository(database: Database): PostRepository {
    return {
                async getAllPosts(categoryName, take) {
            let categoryId: number | undefined;

            if (categoryName) {
                const category = await database.orm.public.Category
                    .where({ name: categoryName })
                    .first();

                if (!category) {
                    return [];
                }

                categoryId = category.id;
            }

            const baseQuery = database.orm.public.Post
                .include("category")
                .orderBy((post) => post.id.asc());

            const query = categoryId !== undefined
                ? baseQuery.where({ categoryId })
                : baseQuery;

            const rows = !take
                ? await query.all()
                : await query.limit(take).all();

            return rows.map(mapRowToPost);
        },


        async createPost(post: CreatePostRepoInput) {
            try {
                const { categoryId, ...fields } = post;

                const created = categoryId !== undefined
                    ? await database.orm.public.Post.create({
                        title: fields.title,
                        content: fields.content,
                        author: fields.author ?? null,
                        category: (category) => category.connect({ id: categoryId }),
                    })
                    : await database.orm.public.Post.create({
                        title: fields.title,
                        content: fields.content,
                        author: fields.author ?? null,
                    });

                const fullPost = await database.orm.public.Post
                    .where({ id: created.id })
                    .include("category")
                    .first();

                return mapRowToPost(fullPost ?? created);
            } catch (error) {
                if (isStructuredError(error) && error.code === "ORM.RELATION_ROW_MISSING") {
                    throw new Error("CATEGORY_NOT_FOUND");
                }
                throw error;
            }
        },

        async findPostById(id) {
            const row = await database.orm.public.Post
                .where({ id })
                .include("category")
                .first();

            return row ? mapRowToPost(row) : undefined;
        },
    };
}
