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

export  interface TagStats{
  "name": string,   
  "icon": string,   
  "type": string,   
  "count": number,  
  "amount": number  
 
}

export interface  StatisticData{
  "id":string
  "type":        string    // daily(日统计) 或 monthly(月统计)
  "date":        string  // 统计日期
  "totalAmount": number     // 总金额
  "totalCount" : number      // 总笔数
  "income":      number    // 收入金额
  "expense":     number    // 支出金额
  tagStats  :Record<string,TagStats>
  "updatedAt": string  
  "createdAt": string,    // 创建时间
}