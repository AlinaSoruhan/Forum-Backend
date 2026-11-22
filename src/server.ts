import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {
	hashRefreshToken,
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "./lib/jwt.js";
import { hashPassword, verifyPassword } from "./lib/password.js";
import { db } from "./prisma/db.js";
import { createCategoryRepository } from "./repositories/category.js";
import { createPostRepository } from "./repositories/post.js";
import { createRefreshSessionRepository } from "./repositories/refresh-session.js";
import { createUserRepository } from "./repositories/user.js";
import { createCategoryService } from "./services/category/category.js";
import { createPostService } from "./services/posts/post.js";
import { createAuthService } from "./services/user/user.js";
import { createCategoryHandlers } from "./transport/handlers/category/category.js";
import { createPostHandler } from "./transport/handlers/posts/posts.js";
import { createUserHandler } from "./transport/handlers/user/user.js";
import { createRequireAuth } from "./transport/middlewares/require-auth.js";
import { createUserRouter } from "./transport/routers/auth.js";
import { createCategoryRouter } from "./transport/routers/category.js";
import { createPostRouter } from "./transport/routers/post.js";

const PORT = 8000;
const HOST = "localhost";

const app = express();

const requireAuth = createRequireAuth(verifyAccessToken);

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler, requireAuth);

const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandlers = createCategoryHandlers(categoryService);
const categoryRouter = createCategoryRouter(categoryHandlers);

const sessionRepository = createRefreshSessionRepository(db);
const userRepository = createUserRepository(db);
const userService = createAuthService(
	userRepository,
	{ hash: hashPassword, verify: verifyPassword },
	{ signAccessToken, signRefreshToken },
	{ verifyAccessToken, verifyRefreshToken },
	{ hash: hashRefreshToken },
	sessionRepository,
);
const userHandler = createUserHandler(userService);
const userRouter = createUserRouter(userHandler, requireAuth);

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.json());

app.use("/posts", postRouter);
app.use("/categories", categoryRouter);
app.use("/auth", userRouter);

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});
