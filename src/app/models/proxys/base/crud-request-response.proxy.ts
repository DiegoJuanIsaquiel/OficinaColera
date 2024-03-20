export type CrudRequestResponseProxy<TProxy> = TProxy [] | {
  count: number;
  data: TProxy[];
  page: number;
  pageCount: number;
  total: number;
};
