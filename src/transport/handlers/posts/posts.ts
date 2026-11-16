import type { ErrorResponse } from "../../dto/errors.js";
import type { CreatePostRequest } from "../../dto/post/requests.js";
import type { PostResponse } from "../../dto/post/responses.js";
import type { Request, Response } from "express";
import type { PostService } from "../../../services/posts/posts.types.js";
import type { Post } from "../../../domain/post/entity.js";
import type { PostHandler } from "./posts.types.js";

export function createPostHandler(service: PostService): PostHandler {
    async function getAllPosts(
        req: Request,
        res: Response<PostResponse[] | ErrorResponse>
    ) {
        const { category, take } = req.query;
        let takeNum: number | undefined;

        if (take !== undefined) {
            takeNum = Number(take);

            if (!Number.isInteger(takeNum) || takeNum <= 0) {
                res.status(400).json({
                    message: "Query parameter 'take' must be a positive integer",
                });
                return;
            }
        }

        if (category !== undefined && (typeof category !== "string" || !category.trim())) {
            res.status(400).json({
                message: "Query parameter 'category' must be a non-empty string",
            });
            return;
        }

        const posts = await service.getPosts(category?.trim(), takeNum);
        res.status(200).json(posts);
    }

    async function getPostById(
        req: Request,
        res: Response<PostResponse | ErrorResponse>
    ) {
        const postId = Number(req.params.id);

        if (!Number.isInteger(postId) || postId <= 0) {
            res.status(400).json({
                message: "id must be a positive integer",
            });
            return;
        }

        const post = await service.getPost(postId);

        if (!post) {
            res.status(404).json({
                message: "Post not found",
            });
            return;
        }

        res.status(200).json(post);
    }

    async function createNewPost(
        req: Request<{}, {}, CreatePostRequest>,
        res: Response<PostResponse | ErrorResponse>
    ) {
        try {
            const userId = Number(res.locals.userId);
            if (!Number.isInteger(userId) || userId <= 0) {
                res.status(401).json({
                    message: "Unauthorized",
                });
                return;
            }

            const { title, content, author, categoryId } = req.body || {};

            if (
                typeof title !== "string" || !title.trim() ||
                typeof content !== "string" || !content.trim()
            ) {
                res.status(422).json({
                    message: "Fields 'title' and 'content' are required",
                });
                return;
            }

            if (author !== undefined && (typeof author !== "string" || !author.trim())) {
                res.status(422).json({
                    message: "Field 'author' must be a non-empty string",
                });
                return;
            }

            if (categoryId !== undefined && (!Number.isInteger(categoryId) || categoryId <= 0)) {
                res.status(400).json({
                    message: "Field 'categoryId' must be a positive integer",
                });
                return;
            }

            const createdPost: Post = await service.createPost({
                title: title.trim(),
                content: content.trim(),
                author: author?.trim(),
                userId,
                categoryId,
            });

            res.status(201).json(createdPost);
        } catch (error) {
            if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
                res.status(404).json({
                    message: "Category not found",
                });
                return;
            }

            console.error(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    return { getAllPosts, getPostById, createNewPost };
}
