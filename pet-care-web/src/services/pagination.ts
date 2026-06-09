export const DEFAULT_PAGE_SIZE = 10;

export type PaginationMeta = {
  page: number;
  hasNext: boolean;
  basePath: string;
  totalPages: number;
  isTotalEstimated: boolean;
};

export function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? "1");

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function getPageWindow(page: number, pageSize = DEFAULT_PAGE_SIZE) {
  return {
    limit: pageSize + 1,
    offset: (page - 1) * pageSize,
  };
}

export function resolvePageRows<T>(
  rows: T[],
  page: number,
  basePath: string,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const hasNext = rows.length > pageSize;

  return {
    items: rows.slice(0, pageSize),
    pagination: {
      page,
      hasNext,
      basePath,
      totalPages: hasNext ? page + 1 : page,
      isTotalEstimated: hasNext,
    } satisfies PaginationMeta,
  };
}
