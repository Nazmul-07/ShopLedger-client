export type CategoryType = "PRODUCT" | "EXPENSE" | "BOTH";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  type: CategoryType;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: CategoryType;
  isActive?: boolean;
}
