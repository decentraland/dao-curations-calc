export interface Curation {
  collection: {
    id: string
    itemsCount: number
    items: { creationFee: string }[]
    name: string
    createdAt: number
    creator: string
  }
  curator: { id: string }
  isApproved: boolean
  timestamp: string
  txHash: string
}
export interface Collection {
  id: string
  itemsCount: number
  creationFee: string
  name: string
  createdAt: number
  creator: string
  firstCuration: Curation
}

export interface DB {
  curations: Curation[]
  collections: Collection[]
}
