import type { PublicUser } from "../../domain/user/entity.js";
import type { RefreshSessionRepository } from "../../repositories/refresh-session.types.js";
import type { UserRepository } from "../../repositories/user.repository.js";

export interface AuthInput {
	email: string;
	password: string;
}

export interface PasswordHasher {
	hash: (password: string) => Promise<string>;
	verify: (hash: string, password: string) => Promise<boolean>;
}

export interface TokenSigner {
	signAccessToken: (userId: number) => string;
	signRefreshToken: (userId: number) => string;
}

export interface TokenVerifier {
	verifyAccessToken: (token: string) => number;
	verifyRefreshToken: (token: string) => number;
}

export interface RefreshTokenHasher {
	hash: (token: string) => string;
}

export type TokenService = TokenSigner & TokenVerifier & RefreshTokenHasher;

export interface AuthServiceDependencies {
	users: UserRepository;
	sessions: RefreshSessionRepository;
	passwords: PasswordHasher;
	tokens: TokenService;
}

export interface UserTokens {
	accessToken: string;
	refreshToken: string;
}

export interface UserService {
	register: (input: AuthInput) => Promise<PublicUser>;
	login: (input: AuthInput) => Promise<{ user: PublicUser } & UserTokens>;
	refresh: (refreshToken: string) => Promise<UserTokens>;
	me: (userId: number) => Promise<PublicUser>;
	logout: (refreshToken?: string) => Promise<void>;
}
