export class Paging<T>{
    items:T[];
    currentPage :number;
    totalPages :number;
    pageSize :number;
    totalCount :number;
    hasPrevious :boolean;
    hasNext :boolean;
}