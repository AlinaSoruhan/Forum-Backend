import { Router } from "express";
import type { UserHandler } from "../handlers/user/user.types.js";

export function createUserRouter(handler: UserHandler): Router {
    const router = Router();

    router.post("/register", handler.register);
    router.post("/login", handler.login);

    return router;
}
