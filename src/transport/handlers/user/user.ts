import type { Response } from "express";
import type { UserService, UserTokens } from "../../../services/user/user.types.js";
import type { UserHandler } from "./user.types.js";

const secure = process.env.NODE_ENV === "production";

export function setUserCookies(res: Response, tokens: UserTokens) {
	res.cookie("accessToken", tokens.accessToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: secure,
		maxAge: 15 * 60 * 1000,
		path: "/",
	});
	res.cookie("refreshToken", tokens.refreshToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: secure,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		path: "/auth",
	});
}

export function createUserHandler(service: UserService): UserHandler {
	return {
		async register(req, res) {
			try {
				const { email, password } = req.body;
				const user = await service.register({
					email,
					password,
				});
				res.status(201).json(user);
			} catch (error) {
				if (error instanceof Error && error.message === "Email already exists") {
					res.status(409).json({ message: "Email already exists" });
					return;
				}
				res.status(500).json({ message: "Internal server error" });
			}
		},
		async login(req, res) {
			try {
				const { email, password } = req.body;
				const result = await service.login({
					email,
					password,
				});
				setUserCookies(res, {
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
				});
				res.status(200).json(result.user);
			} catch (error) {
				if (error instanceof Error && error.message === "Invalid credentials") {
					res.status(401).json({ message: "Invalid credentials" });
					return;
				}
				res.status(500).json({ message: "Internal server error" });
			}
		},
		async refresh(req, res) {
			try {
				const token = req.cookies?.refreshToken;
				if (typeof token !== "string") {
					res.status(401).json({ message: "Unauthorized" });
					return;
				}
				const tokens = await service.refresh(token);
				setUserCookies(res, {
					accessToken: tokens.accessToken,
					refreshToken: tokens.refreshToken,
				});
				res.status(200).json("Token updated!");
			} catch (error) {
				if (error instanceof Error && error.message === "INVALID_REFRESH_TOKEN") {
					res.status(401).json({ message: "Unauthorized" });
					return;
				}
				res.status(500).json({ message: "Internal server error" });
			}
		},
		async logout(req, res) {
			try {
				const token = req.cookies?.refreshToken;
				await service.logout(typeof token === "string" ? token : undefined);
				res.clearCookie("accessToken", {
					httpOnly: true,
					secure: secure,
					sameSite: "lax",
					path: "/",
				});
				res.clearCookie("refreshToken", {
					httpOnly: true,
					secure: secure,
					sameSite: "lax",
					path: "/auth",
				});
				res.status(200).json("Logged out!");
			} catch {
				res.status(500).json("Internal server error");
			}
		},
		async me(req, res) {
			try {
				const userId = res.locals.userId;
				const user = await service.me(userId);
				res.status(200).json(user);
			} catch (error) {
				if (error instanceof Error && error.message === "UNAUTHORIZED") {
					res.status(401).json({ message: "Unauthorized" });
					return;
				}
				res.status(500).json("Internal server error");
			}
		},
	};
}
