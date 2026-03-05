export type Email = string & { readonly __brand: 'Email' }
export type Phone = string & { readonly __brand: 'Phone' }
export type Url = string & { readonly __brand: 'Url' }
export type ISODate = string & { readonly __brand: 'ISODate' }

export const makeEmail = (raw: string): Email => raw.toLowerCase().trim() as Email
export const makeUrl = (raw: string): Url => raw as Url
