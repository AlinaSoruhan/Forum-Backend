import type { Request, Response } from "express";

export interface UserHandler {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
}
