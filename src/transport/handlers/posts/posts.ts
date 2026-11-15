import type { ErrorResponse } from "../../dto/errors.js";
import type { CreatePostRequest } from "../../dto/requests.js";
import type { PostResponse } from "../../dto/responses.js";
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

        const posts = service.getPosts(category?.trim(), takeNum);
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

        const post = service.getPost(postId);

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
        const { title, content, author, category } = req.body || {};

        if (
            typeof title !== "string" || !title.trim() ||
            typeof content !== "string" || !content.trim()
        ) {
            res.status(422).json({
                message: "Fields 'title' and 'content' are required",
            });
            return;
        }

        if (
            (author !== undefined && (typeof author !== "string" || !author.trim())) ||
            (category !== undefined && (typeof category !== "string" || !category.trim()))
        ) {
            res.status(422).json({
                message: "Fields 'author' and 'category' must be non-empty strings",
            });
            return;
        }

        try {
            const createdPost: Post = await service.createPost({
                title: title.trim(),
                content: content.trim(),
                author: author?.trim(),
                category: category?.trim(),
            });

            res.status(201).json(createdPost);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to create post",
            });
        }
    }

    return { getAllPosts, getPostById, createNewPost };
}
