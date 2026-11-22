import type { Category } from "./entity.js";

export interface CreateCategoryRepoInput {
	name: string;
}

export interface CategoryRepository {
	getAll: () => Promise<Category[]>;
	getById: (id: number) => Promise<Category | null>;
	createCategory: (data: CreateCategoryRepoInput) => Promise<Category>;
}
