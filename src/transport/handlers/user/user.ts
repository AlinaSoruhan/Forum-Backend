import type { UserService } from "../../../services/user/user.types.js";
import type { UserHandler } from "./user.types.js";

export function createUserHandler(service: UserService): UserHandler {
    return {
        async register(req, res) {
            try {
                const { email, password } = req.body || {};

                if (
                    typeof email !== "string" || !email.trim() ||
                    typeof password !== "string" || password.length < 6
                ) {
                    res.status(422).json({
                        message: "Valid 'email' and 'password' (min 6 chars) are required",
                    });
                    return;
                }

                const user = await service.register({
                    email,
                    password,
                });

                res.status(201).json(user);
            } catch (error) {
                if (error instanceof Error && error.message === "Email already exists") {
                    res.status(409).json({
                        message: "Email already exists",
                    });
                    return;
                }

                console.error(error);
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        },

        async login(req, res) {
            try {
                const { email, password } = req.body || {};

                if (
                    typeof email !== "string" || !email.trim() ||
                    typeof password !== "string" || !password
                ) {
                    res.status(422).json({
                        message: "Fields 'email' and 'password' are required",
                    });
                    return;
                }

                const result = await service.login({
                    email,
                    password,
                });

                res.cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                    path: "/",
                });

                console.log(result.accessToken);
                res.status(200).json(result.user);
            } catch (error) {
                if (error instanceof Error && error.message === "Invalid credentials") {
                    res.status(401).json({
                        message: "Invalid credentials",
                    });
                    return;
                }

                console.error(error);
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        },
    };
}
