import { categoryApi } from "../api/categoryApi";
import { productApi } from "../api/productApi";
import { Category } from "../types/categoryTypes";
import { Product } from "../types/productTypes";
import { ApiPaginatedData } from "../types/sharedTypes";
import { PaginationTableHeader } from "../components/PaginationTable/PaginationTable";
import { formatDate } from "./sharedUtils";
import { FormField } from "../scenes/UpsertPage/UpsertPage";

export enum Model {
	product = "product",
	category = "category",
}

export const modelDataTable: Record<Model, () => Promise<ApiPaginatedData<Product | Category>>> = {
	[Model.category]: () => categoryApi.dataTable(),
	[Model.product]: () => productApi.dataTable(),
};

export const productHeaders: PaginationTableHeader<Product>[] = [
	{ text: "Name", value: "name" },
	{ text: "Price", value: "price" },
	{ text: "Category", value: "category.name" },
	{ text: "Created At", value: (product) => formatDate(product.createdAt) },
];

export const categoryHeaders: PaginationTableHeader<Category>[] = [
	{ text: "Name", value: "name" },
	{ text: "Created At", value: (product) => formatDate(product.createdAt) },
];

export const modelDatatableHeaders: Record<Model, PaginationTableHeader<Product & Category>[]> = {
	[Model.product]: productHeaders,
	[Model.category]: categoryHeaders,
};

export const productUpsertFields: FormField<Product>[] = [
	{ type: "text", label: "Name", name: "name" },
	{ type: "number", label: "Price", name: "price" },
	{ type: "file", label: "Image", name: "image" },
	{
		type: "pointer",
		label: "Category",
		name: "categoryId",
		itemText: "name",
		itemValue: "id",
		items: () => categoryApi.list(),
	},
];

export const categoryUpsertFields: FormField<Category>[] = [
	{ type: "text", label: "Name", name: "name" },
	{ type: "file", label: "Image", name: "image" },
];
