export interface ResponseInterface<T> {
  code: number;
  msg: string;
  data?: T;
}

export interface PageInterface {
  pageIndex?: number;
  pageSize?: number;
  total:number;
}