import { PageInterface } from '../types/types';

export  const wrapList=<T>(list:T[],pageInfo:PageInterface)=>({
    list,
    ...pageInfo
})
