import type { Request, Response } from "express";
import type { PostResponse } from "../../dto/responses.js";
import type { ErrorResponse } from "../../dto/errors.js";
import type { CreatePostRequest } from "../../dto/requests.js";

export interface PostHandler {
    getAllPosts: (
        req: Request,
        res: Response<PostResponse[] | ErrorResponse>
    ) => Promise<void>;
    getPostById: (
        req: Request,
        res: Response<PostResponse | ErrorResponse>
    ) => Promise<void>;
    createNewPost: (
        req: Request<{}, {}, CreatePostRequest>,
        res: Response<PostResponse | ErrorResponse>
    ) => Promise<void>;
}
