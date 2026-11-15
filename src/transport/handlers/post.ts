import { getPosts, getPost, createPost } from "../../services/post.js";
import type { ErrorResponse } from "../dto/errors.js";
import type { CreatePostRequest } from "../dto/requests.js";
import type { PostResponse } from "../dto/responses.js";
import type { Request, Response } from "express";

export function getAllPosts(
    req: Request,
    res: Response<PostResponse[] | ErrorResponse>
) {
    const { category, take } = req.query;
    let takeNum: number | undefined;

    if (take !== undefined) {
        takeNum = Number(take);

        if (!Number.isInteger(takeNum) || takeNum <= 0) {
            return res.status(400).json({
                message: "Query parameter 'take' must be a positive integer",
            });
        }
    }

    if (category !== undefined && (typeof category !== "string" || !category.trim())) {
        return res.status(400).json({
            message: "Query parameter 'category' must be a non-empty string",
        });
    }

    const posts = getPosts(category?.trim(), takeNum);
    return res.status(200).json(posts);
}

export function getPostById(
    req: Request,
    res: Response<PostResponse | ErrorResponse>
) {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).json({
            message: "id must be a positive integer",
        });
    }

    const post = getPost(postId);

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
        });
    }

    return res.status(200).json(post);
}

export async function createNewPost(
    req: Request<{}, {}, CreatePostRequest>,
    res: Response<PostResponse | ErrorResponse>
) {
    const { title, content, author, category } = req.body || {};

    if (
        typeof title !== "string" || !title.trim() ||
        typeof content !== "string" || !content.trim()
    ) {
        return res.status(422).json({
            message: "Fields 'title' and 'content' are required",
        });
    }

    if (
        (author !== undefined && (typeof author !== "string" || !author.trim())) ||
        (category !== undefined && (typeof category !== "string" || !category.trim()))
    ) {
        return res.status(422).json({
            message: "Fields 'author' and 'category' must be non-empty strings",
        });
    }

    try {
        const createdPost = await createPost({
            title: title.trim(),
            content: content.trim(),
            author: author?.trim(),
            category: category?.trim(),
        });

        return res.status(201).json(createdPost);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to create post",
        });
    }
}
