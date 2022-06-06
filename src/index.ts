import { ethers } from 'ethers';
import fetch from 'isomorphic-fetch'
import { createObjectCsvWriter } from 'csv-writer'

async function main() {
  const curationsList: Curation[] = []
  let timestamp = '0';

  while (true) {
    const res = await fetch(
      'https://api.thegraph.com/subgraphs/name/decentraland/collections-matic-mainnet',
      {
        headers: {
          'content-type': 'application/json'
        },
        body: `{\"query\":\"{\\n  curations(orderBy: timestamp, orderDirection: asc, first: 1000, where: { timestamp_gte: ${timestamp} }, block: { number: 29050000 }) {\\n    curator {\\n      id\\n    }\\n    collection {\\n      id\\n      itemsCount\\n      name\\n    }\\n    isApproved\\n    timestamp\\n    txHash\\n  }\\n}\\n\",\"variables\":null}`,
        method: 'POST'
      }
    )
    const json = await res.json()

    if (!json.data.curations.length) {
      break
    }
    curationsList.push(...json.data.curations)

    if (timestamp == json.data.curations.slice(-1)[0].timestamp) {
      break;
    }
    timestamp = curationsList.slice(-1)[0].timestamp;
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
  exportCurations(collectionsList);

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
    '0x967fb0c36e4f5288f30fb05f8b2a4d7b77eaca4b': 0,
    //Sango
    '0x5e382071464a6f9ea29708a045983dc265b0d86d': 0,
    //Grimey
    '0xc8ad6322821b51da766a4b2a82b39fb72b53d276': 0,
    //AndreusAs
    '0xa8c7d5818a255a1856b31177e5c96e1d61c83991': 0,
    //Mitch
    '0x336685bb3a96e13b77e909d7c52e8afcff1e859e': 0,
    //Kristian
    '0x41eb5f82af60873b3c14fedb898a1712f5c35366': 0,
    //James Guard
    '0x470c33abd57166940095d59bd8dd573cbae556c3': 0,
    //Fabeeo
    '0x1dec5f50cb1467f505bb3ddfd408805114406b10': 0,
    //Yannakis
    '0x805797df0c0d7d70e14230b72e30171d730da55e': 0,
  }
  for (const collection of collectionsList) {
    curators[collection[1].curator.id] += collection[1].collection.itemsCount
  }

  console.log("Total Curations");
  console.log(curators);

  const lastTotal : { [curator: string]: number } = {
    '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0': 240,
    '0x716954738e57686a08902d9dd586e813490fee23': 133,
    '0x7a3891acf4f3b810992c4c6388f2e37357d7d3ab': 373,
    '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9': 456,
    '0x8938d1f65abe7750b0777206ee26c974a6721194': 685,
    '0x91e222ed7598efbcfe7190481f2fd14897e168c8': 392,
    '0x399a44f5821b1f859bc236e14367c4f7c36933fb': 140,
    '0x967fb0c36e4f5288f30fb05f8b2a4d7b77eaca4b': 94,
    '0x5e382071464a6f9ea29708a045983dc265b0d86d': 289,
    '0xc8ad6322821b51da766a4b2a82b39fb72b53d276': 133,
    '0xa8c7d5818a255a1856b31177e5c96e1d61c83991': 258,
    '0x336685bb3a96e13b77e909d7c52e8afcff1e859e': 220,
    '0x41eb5f82af60873b3c14fedb898a1712f5c35366': 247,
    '0x470c33abd57166940095d59bd8dd573cbae556c3': 52,
    '0x1dec5f50cb1467f505bb3ddfd408805114406b10': 110,
    '0x805797df0c0d7d70e14230b72e30171d730da55e': 841
  };
  const newTotal : { [curator: string]: number } = {};
  const newPayment : { [curator: string]: number } = {};
  var newPamentCSV = 'token_type,token_address,receiver,amount\n';

  const curatorsAddresses = Object.keys(curators);
  for(var i = 0; i < curatorsAddresses.length; i++) {
    let address = String(curatorsAddresses[i]);
    newTotal[address] = curators[address] - lastTotal[address];

    if (newTotal[address] > 0) {
      let paddress = ethers.utils.getAddress(paymentAddress[address]);
      newPayment[paddress] = newTotal[address] * 10;
      newPamentCSV += `erc20,0x0F5D2fB29fb7d3CFeE444a200298f468908cC942,${paddress},${newPayment[paddress]}\n`;
    }
  }

  console.log('New Total');
  console.log(newTotal);

  console.log('New Payment');
  console.log(newPayment);

  console.log('=== CSV For Gnosis Transfer ===');
  console.log(newPamentCSV);
}

void main()


const names: { [curator: string]: string } = {
  '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0': 'Lau',
  '0x716954738e57686a08902d9dd586e813490fee23': 'HirotoKai',
  '0x7a3891acf4f3b810992c4c6388f2e37357d7d3ab': 'JP',
  '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9': 'Malloy',
  '0x8938d1f65abe7750b0777206ee26c974a6721194': 'Shibu',
  '0x91e222ed7598efbcfe7190481f2fd14897e168c8': 'Chestnutbruze',
  '0x399a44f5821b1f859bc236e14367c4f7c36933fb': 'Shibu Old',
  '0x967fb0c36e4f5288f30fb05f8b2a4d7b77eaca4b': 'Kat',
  '0x5e382071464a6f9ea29708a045983dc265b0d86d': 'Sango',
  '0xc8ad6322821b51da766a4b2a82b39fb72b53d276': 'Grimey',
  '0xa8c7d5818a255a1856b31177e5c96e1d61c83991': 'AndreusAs',
  '0x336685bb3a96e13b77e909d7c52e8afcff1e859e': 'Mitch',
  '0x41eb5f82af60873b3c14fedb898a1712f5c35366': 'Kristian',
  '0x470c33abd57166940095d59bd8dd573cbae556c3': 'James Guard ',
  '0x1dec5f50cb1467f505bb3ddfd408805114406b10': 'Fabeeo',
  '0x805797df0c0d7d70e14230b72e30171d730da55e': 'Yannakis',
}

const paymentAddress: { [curator: string]: string } = {
  '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0': '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0',
  '0x716954738e57686a08902d9dd586e813490fee23': '0x716954738e57686a08902d9dd586e813490fee23',
  '0x7a3891acf4f3b810992c4c6388f2e37357d7d3ab': '0xC958f028d1b871ab2e32C2aBdA54F37191eFe0C2',
  '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9': '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9',
  '0x8938d1f65abe7750b0777206ee26c974a6721194': '0x9dB59920d3776c2d8A3aA0CbD7b16d81FcAb0A2b',
  '0x91e222ed7598efbcfe7190481f2fd14897e168c8': '0x91e222ed7598efbcfe7190481f2fd14897e168c8',
  '0x399a44f5821b1f859bc236e14367c4f7c36933fb': '0x9dB59920d3776c2d8A3aA0CbD7b16d81FcAb0A2b',
  '0x967fb0c36e4f5288f30fb05f8b2a4d7b77eaca4b': '0x6cDFDB9a4D99f16B5607caB1d00c792206db554E',
  '0x5e382071464a6f9ea29708a045983dc265b0d86d': '0x862f109696d7121438642a78B3CaA38F476db08b',
  '0xc8ad6322821b51da766a4b2a82b39fb72b53d276': '0xc8ad6322821b51da766a4b2a82b39fb72b53d276',
  '0xa8c7d5818a255a1856b31177e5c96e1d61c83991': '0xa8c7d5818A255A1856b31177E5c96E1D61c83991',
  '0x336685bb3a96e13b77e909d7c52e8afcff1e859e': '0x336685bb3A96E13B77E909d7C52e8AfCfF1E859E',
  '0x41eb5f82af60873b3c14fedb898a1712f5c35366': '0x41eb5F82af60873b3C14fEDB898A1712f5c35366',
  '0x470c33abd57166940095d59bd8dd573cbae556c3': '0x470c33aBD57166940095d59BD8Dd573cBae556c3',
  '0x1dec5f50cb1467f505bb3ddfd408805114406b10': '0x1DeC5f50cB1467F505BB3ddFD408805114406b10',
  '0x805797df0c0d7d70e14230b72e30171d730da55e': '0x805797Df0c0d7D70E14230b72E30171d730DA55e',
}

function exportCurations(collectionsList: [string, Curation][]) {
  const csvWriter = createObjectCsvWriter({
    path: 'curations.csv',
    header: [
      {id: 'curatorAddress', title: 'Curator Address'},
      {id: 'curatorName', title: 'Curators Name'},
      {id: 'collectionId', title: 'Collection ID'},
      {id: 'collectionName', title: 'Collection Name'},
      {id: 'collectionItems', title: 'Collection Items'},
      {id: 'timestamp', title: 'Timestamp'},
    ]
  });

const data = collectionsList.map(([id, curation]) => {
    return {
      curatorAddress: curation.curator.id,
      curatorName: names[curation.curator.id],
      collectionId: curation.collection.id,
      collectionName: curation.collection.name,
      collectionItems: curation.collection.itemsCount,
      timestamp: curation.timestamp,
    }
  });

  csvWriter.writeRecords(data).then(()=> console.log('The CSV file was written successfully'));
}

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
