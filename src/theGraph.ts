import { Curation } from './type.js'
import { fetch } from 'undici'

export async function fetchCurations(skip: number, from: string = '1658153853', to?: string): Promise<Curation[]> {
  const where = `{ timestamp_gt: ${from}${to ? `, timestamp_lte: ${to}` : ''} }`
  const res = await fetch('https://api.thegraph.com/subgraphs/name/decentraland/collections-matic-mainnet', {
    headers: {
      'content-type': 'application/json'
    },
    body: `{\"query\":\"{\\n    curations(orderBy: timestamp, orderDirection: asc, skip: ${skip}, first: 1000, where: ${where} ) {\\ntimestamp      curator {\\n        id\\n      }\\n      collection {creator\\n        id\\n        createdAt\\n        itemsCount\\n        name\\n        items {\\n          creationFee\\n        }\\n        isApproved\\n        }\\n    }\\n            }\",\"variables\":null}`,
    method: 'POST'
  })
  const json: { data: { curations: Curation[] } } = (await res.json()) as any
  console.log(json)

  return json.data.curations
}
