import { Router } from "express";
import type { PostHandler } from "../transport/handlers/posts/posts.types.js";

export function createPostRouter(handler: PostHandler) {
    const postRouter = Router();

    postRouter.get("/", handler.getAllPosts);
    postRouter.get("/:id", handler.getPostById);
    postRouter.post("/", handler.createNewPost);

    return postRouter;
}
