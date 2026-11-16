import express from "express";
import { db } from "./prisma/db.js";
import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/posts/post.js";
import { createPostHandler } from "./transport/handlers/posts/posts.js";
import { createPostRouter } from "./transport/routers/post.js";
import { createCategoryRepository } from "./repositories/category.js";
import { createCategoryService } from "./services/category/category.js";
import { createCategoryHandlers } from "./transport/handlers/category/category.js";
import { createCategoryRouter } from "./transport/routers/category.js";
import { createUserRepository } from "./repositories/user.js";
import { createAuthService } from "./services/user/user.js";
import { createUserHandler } from "./transport/handlers/user/user.js";
import { hashPassword, verifyPassword } from "./lib/password.js";
import { createUserRouter } from "./transport/routers/auth.js";
import { signAccessToken } from "./lib/jwt.js";

const PORT = 8000;
const HOST = "localhost";

const app = express();
app.use(express.json());

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandlers = createCategoryHandlers(categoryService);
const categoryRouter = createCategoryRouter(categoryHandlers);

const userRepository = createUserRepository(db);
const userService = createAuthService(
    userRepository,
    { hash: hashPassword, verify: verifyPassword },
    { signAccessToken }
);
const userHandler = createUserHandler(userService);
const userRouter = createUserRouter(userHandler);

app.use("/posts", postRouter);
app.use("/categories", categoryRouter);
app.use("/auth", userRouter);

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
