import express from "express";
import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/posts/post.js";
import { createPostHandler } from "./transport/handlers/posts/posts.js";
import { createPostRouter } from "./routers/post.js";

const PORT = 8000;
const HOST = "localhost";

const app = express();
app.use(express.json());

const postRepository = createPostRepository();
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

app.use("/posts", postRouter);

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
