import { createObjectCsvWriter } from 'csv-writer'
import { Collection, DB } from './type'
import { fetchCurations } from './theGraph'
import { Low, JSONFile } from 'lowdb'
import BigNumber from 'bignumber.js'
import curatorsList from './curators'

const wei = BigNumber(10).pow(18)

const adapter = new JSONFile<DB>('db.json')
const db = new Low(adapter)

async function main() {
  await db.read()
  db.data ||= { collections: [], curations: [] }

  const curationsList: Curation[] = []
  while (true) {
    const curations = await fetchCurations(curationsList.length, db.data!.curations.length ? db.data!.curations[db.data!.curations.length - 1].timestamp : '0')

    if (!curations.length) break
    console.log('got n result', curations.length)

    db.data?.curations.push(...curations)
    db.data?.curations.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp))

    for (const curation of curations) {
      if (!db.data?.collections.find((a) => a.id == curation.collection.id))
        db.data?.collections.push({
          id: curation.collection.id,
          itemsCount: curation.collection.itemsCount,
          creationFee: curation.collection.items[0].creationFee,
          name: curation.collection.name,
          createdAt: +curation.collection.createdAt,
          firstCuration: curation,
          creator: curation.collection.creator
        })
    }
    if (curations.length < 1000) break
  }
  await db.write()
  const allCollections = db.data.collections

  const curators: { [address: string]: BigNumber } = {}

  for (const curator of Object.keys(curatorsList)) {
    if (!curatorsList[curator].active) continue
    if (!curators[curator.toLowerCase()]) {
      curators[curator.toLowerCase()] = BigNumber(0)
    }
  }

  for (const l of allCollections) {
    const paid = getFeePaidToCurator(l)
    let curatorId = l.firstCuration.curator.id
    if (!curatorsList[l.firstCuration.curator.id].active)
      curatorId = Object.entries(curatorsList).find(
        (a) => a[1].active == true && a[1].paymentAddress == curatorsList[l.firstCuration.curator.id].paymentAddress
      )[0]
    curators[curatorId] = curators[curatorId].plus(paid)
  }

  for (const curator in curatorsList) {
    if (Object.prototype.hasOwnProperty.call(curatorsList, curator)) {
      const element = curatorsList[curator]
      const num = (curators[curator] && curators[curator].div(new BigNumber(10).pow(18))) || BigNumber(0)
      const minus = num.minus(BigNumber(curatorsList[curator].alreadyPaid).div(new BigNumber(10).pow(18)))
      minus.isPositive() && console.log(`erc20,0x0F5D2fB29fb7d3CFeE444a200298f468908cC942,${curatorsList[curator].paymentAddress},${minus.toPrecision(8)}`)
      /*       console.log(`${element.name} = ${num.isPositive() ? '+' : ''}${num.toFixed(0)}`)
      console.log(`${element.name} = ${minus.isPositive() ? '+' : ''}${minus.toFixed(0)} difference`)
 */
    }
  }
  /* 
  let con = true
  let month = 0
  let lastYear = 2020
  console.log(new Date(+db.data.collections[0].firstCuration.timestamp * 1000).getFullYear())

  while (con) {
    console.log(`${lastYear}-${month}`)

    const colls = db.data.collections.filter(
      (a) => new Date(+a.firstCuration.timestamp * 1000).getFullYear() == lastYear && new Date(+a.firstCuration.timestamp * 1000).getUTCMonth() == month
    )
    if (colls.length)
      await exportCurations(
        `csv/months/${lastYear}-${('0' + (month + 1).toString()).slice(-2)}.csv`,
        colls.map((a) => a.firstCuration).sort((a, b) => +a.timestamp - +b.timestamp)
      )

    month++
    if (month > 11) {
      month = 0
      lastYear++
      if (lastYear >= 2023) con = false
    }
  }
  for (const curator of Object.keys(curatorsList)) {
    await exportCurations(
      `csv/curators/${curatorsList[curator].name}.csv`,
      db.data.collections
        .filter((a) => a.firstCuration.curator.id == curator)
        .map((a) => a.firstCuration)
        .sort((a, b) => +a.timestamp - +b.timestamp)
    )
  }

  await exportCurations(
    'csv/all-curations.csv',
    db.data.collections.map((a) => a.firstCuration).sort((a, b) => +a.timestamp - +b.timestamp)
  ) */
}

void main()

async function exportCurations(path: string, collectionsList: Curation[]) {
  const csvWriter = createObjectCsvWriter({
    path,
    header: [
      { id: 'curatorAddress', title: 'Curator Address' },
      { id: 'curatorName', title: 'Curators Name' },
      { id: 'collectionId', title: 'Collection ID' },
      { id: 'collectionName', title: 'Collection Name' },
      { id: 'collectionItems', title: 'Collection Items' },
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'fee', title: 'Collection fee' },
      { id: 'paidFee', title: 'Paid fee' }
    ]
  })

  const data = collectionsList.map((curation) => {
    return {
      curatorAddress: curation.curator.id,
      curatorName: curatorsList[curation.curator.id].name,
      collectionId: curation.collection.id,
      collectionName: curation.collection.name,
      collectionItems: curation.collection.itemsCount,
      timestamp: curation.timestamp,
      fee: BigNumber(curation.collection.items[0].creationFee).times(curation.collection.itemsCount).div(wei).toFixed(8, BigNumber.ROUND_FLOOR),
      paidFee: getFeePaidToCurator({
        createdAt: curation.collection.createdAt,
        creationFee: curation.collection.items[0].creationFee,
        name: curation.collection.name,
        itemsCount: curation.collection.itemsCount
      } as any)
        .div(wei)
        .toFixed(8, BigNumber.ROUND_FLOOR)
    }
  })

  await csvWriter.writeRecords(data).then(() => console.log('The CSV file was written successfully'))
}

interface Curation {
  collection: {
    id: string
    itemsCount: number
    items: { creationFee: string }[]
    name: string
    createdAt: number
  }
  curator: { id: string }
  isApproved: boolean
  timestamp: string
  txHash: string
}

function getFeePaidToCurator(collection: Collection): BigNumber {
  // Before 1637935200
  if (collection.createdAt < 1637935200) {
    if (collection.creationFee != '500000000000000000000') console.log(1, collection.name, collection.createdAt)
    return BigNumber(50).times(wei)
  }
  // Between 1637854200 and 1658149200
  if (collection.createdAt < 1658149200) {
    if (collection.creationFee != '100000000000000000000') console.log(1, collection.name, collection.createdAt)
    return BigNumber(10).times(wei)
  }
  if (collection.creationFee == '100000000000000000000') console.log(2, collection.name, collection.createdAt)
  if (collection.creationFee == '500000000000000000000') console.log(2, collection.name, collection.createdAt)
  // After 1658149200
  return BigNumber(collection.creationFee).times(collection.itemsCount).div(3)
}
