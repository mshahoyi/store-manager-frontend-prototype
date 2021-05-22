export interface ApiPaginatedData<T> {
    next: string | null;
    prev: string | null;
    first: string | null;
    last: string | null;
    results: T[];
    count: number
}