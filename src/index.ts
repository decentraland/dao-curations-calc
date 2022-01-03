import fetch from 'isomorphic-fetch'

async function main() {
  const curationsList: Curation[] = []

  while (true) {
    const skip = curationsList.length
    const res = await fetch(
      'https://api.thegraph.com/subgraphs/name/decentraland/collections-matic-mainnet',
      {
        headers: {
          'content-type': 'application/json'
        },
        body: `{\"query\":\"{\\n  curations(orderBy: timestamp, orderDirection: asc, first: 1000, skip: ${skip}, block: {number: 22027329}) {\\n    curator {\\n      id\\n    }\\n    collection {\\n      id\\n      itemsCount\\n      name\\n    }\\n    isApproved\\n    timestamp\\n    txHash\\n  }\\n}\\n\",\"variables\":null}`,
        method: 'POST'
      }
    )
    const json = await res.json()

    if (!json.data.curations.length) {
      break
    }
    curationsList.push(...json.data.curations)
  }
  const collectionsList: [string, Curation][] = []
  curationsList.sort((a, b) => {
    return +a.timestamp - +b.timestamp
  })

  for (const curation of curationsList) {
    if (collectionsList.findIndex((a) => a[0] == curation.collection.id) >= 0) {
      continue
    }
    collectionsList.push([curation.collection.id, curation])
  }

  console.log(collectionsList.length)

  const curators: { [curator: string]: number } = {
    //Lau
    '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0': 0,
    //HirotoKai
    '0x716954738e57686a08902d9dd586e813490fee23': 0,
    //JP
    '0x7a3891acf4f3b810992c4c6388f2e37357d7d3ab': 0,
    //Malloy
    '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9': 0,
    //Shibu
    '0x8938d1f65abe7750b0777206ee26c974a6721194': 0,
    //Chestnutbruze
    '0x91e222ed7598efbcfe7190481f2fd14897e168c8': 0,
    //Shibu Old
    '0x399a44f5821b1f859bc236e14367c4f7c36933fb': 0,
    //Kat
    '0x967fb0c36e4f5288f30fb05f8b2a4d7b77eaca4b': 0
  }
  for (const collection of collectionsList) {
    curators[collection[1].curator.id] += collection[1].collection.itemsCount
  }

  console.log(curators)
}

void main()

interface Curation {
  collection: {
    id: string
    itemsCount: number
    name: string
  }
  curator: { id: string }
  isApproved: boolean
  timestamp: string
  txHash: string
}
