import { Router } from "express";
import { getAllPosts, getPostById, createNewPost } from "../handlers/post.js";

const postRouter = Router();

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);
postRouter.post("/", createNewPost);

export default postRouter;
