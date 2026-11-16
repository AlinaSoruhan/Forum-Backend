import { Router, type RequestHandler } from "express";
import type { PostHandler } from "../handlers/posts/posts.types.js";

export function createPostRouter(handler: PostHandler, requireAuth: RequestHandler) {
    const postRouter = Router();

    postRouter.get("/", handler.getAllPosts);
    postRouter.get("/:id", handler.getPostById);
    postRouter.post("/", requireAuth, handler.createNewPost);

    return postRouter;
}
