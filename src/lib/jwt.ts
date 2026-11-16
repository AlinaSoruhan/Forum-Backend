import "dotenv/config";
import jwt from "jsonwebtoken";

const secretAccess = process.env.JWT_ACCESS_SECRET;
const secretRefresh = process.env.JWT_REFRESH_SECRET;

if (!secretAccess) throw new Error("JWT_ACCESS_SECRET is not defined");
if (!secretRefresh) throw new Error("JWT_REFRESH_SECRET is not defined");

const accessSecret: string = secretAccess;
const refreshSecret: string = secretRefresh;

export function signAccessToken(userId: number): string {
    return jwt.sign({ type: "access" }, accessSecret, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: "15m",
    });
}

export function signRefreshToken(userId: number): string {
    return jwt.sign({ type: "refresh" }, refreshSecret, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: "7d",
    });
}

export function verifyAccessToken(token: string): number {
    try {
        const payload = jwt.verify(token, accessSecret, {
            algorithms: ["HS256"],
        });
        if (typeof payload === "string" || typeof payload.sub !== "string" || payload.type !== "access") {
            throw new Error();
        }
        return Number(payload.sub);
    } catch {
        throw new Error("INVALID_ACCESS_TOKEN");
    }
}

export function verifyRefreshToken(token: string): number {
    try {
        const payload = jwt.verify(token, refreshSecret, {
            algorithms: ["HS256"],
        });
        if (typeof payload === "string" || typeof payload.sub !== "string" || payload.type !== "refresh") {
            throw new Error();
        }
        return Number(payload.sub);
    } catch {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
}
