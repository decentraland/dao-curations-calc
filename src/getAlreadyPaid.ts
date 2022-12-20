import BigNumber from 'bignumber.js'
import * as ethers from 'ethers'
import * as fs from 'fs/promises'

const transactions = [
  '0x2051751f2461b2fd3ffad049ad5e4dcbc8a34a84d6ce49b57e33d15d8ccedbd9',
  '0x417e5ad80b14d74d11804e856c7d4ab21aada7224b33dd677b204773e559ba01',
  '0x5e7dfd79a2003d83c5ff03f0abbba9f4e612e0c679e2e35f0ac0b19f07820fdb',
  '0x823a46f378ea454c633fe288e8e01864ca1b2c9a4e83b908098af8525d3244d4',
  '0x77b7de0ee74ef5db9cdaed1f7a1e5336874f59ff9f45dfab2a15cda0f4953c84',
  '0x0013c440d74771b0f98a43bef797b103590c572cbf768af9d0075157079338f2',
  '0x7165f5fd46a3f8fd75583905d169a36a2c278889695d605cd9888001561cbd89',
  '0x248e091e6a57883b45ed0fc35078616e704f8a21fcf217deec9890286fed06ff',
  '0x8b029d4a39330618559e78a1243eed8b544d2a518e6e43df82bc3f16ac333e25',
  '0x678361a30d16b774403f21e6b5ff10032c922490a063c5bdfff9fa7aa237a7d9',
  '0xed1b0f6c60d39b988ae77c11bf46f2d78f4e63def2a366c5c4fff0d4fd2d5dbb',
  '0xd5e08c3782cd0f8ed8b8ccfcdb586394015d9b7e702fc00a95ba88d9a27674b2',
  '0x6177fdb165d37e0588fe0e25ecbe2249b626c31f3c4bfc146cb77c55abeaa68a'
]

const curators = {
  '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0': {
    name: 'Lau',
    paymentAddress: '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0'
  },
  '0x716954738e57686a08902d9dd586e813490fee23': {
    name: 'HirotoKai',
    paymentAddress: '0x716954738e57686a08902d9dd586e813490fee23'
  },
  '0x7a3891acf4f3b810992c4c6388f2e37357d7d3ab': {
    name: 'JP',
    paymentAddress: '0xC958f028d1b871ab2e32C2aBdA54F37191eFe0C2'
  },
  '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9': {
    name: 'Malloy',
    paymentAddress: '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9'
  },
  '0x8938d1f65abe7750b0777206ee26c974a6721194': {
    name: 'Shibu',
    paymentAddress: '0x9dB59920d3776c2d8A3aA0CbD7b16d81FcAb0A2b'
  },
  '0x91e222ed7598efbcfe7190481f2fd14897e168c8': {
    name: 'Chestnutbruze',
    paymentAddress: '0x91e222ed7598efbcfe7190481f2fd14897e168c8'
  },
  '0x399a44f5821b1f859bc236e14367c4f7c36933fb': {
    name: 'Shibu Old',
    paymentAddress: '0x9dB59920d3776c2d8A3aA0CbD7b16d81FcAb0A2b'
  },
  '0x967fb0c36e4f5288f30fb05f8b2a4d7b77eaca4b': {
    name: 'Kat',
    paymentAddress: '0x6cDFDB9a4D99f16B5607caB1d00c792206db554E'
  },
  '0x5e382071464a6f9ea29708a045983dc265b0d86d': {
    name: 'Sango',
    paymentAddress: '0x862f109696d7121438642a78B3CaA38F476db08b'
  },
  '0xc8ad6322821b51da766a4b2a82b39fb72b53d276': {
    name: 'Grimey',
    paymentAddress: '0xc8ad6322821b51da766a4b2a82b39fb72b53d276'
  },
  '0xa8c7d5818a255a1856b31177e5c96e1d61c83991': {
    name: 'AndreusAs',
    paymentAddress: '0xa8c7d5818A255A1856b31177E5c96E1D61c83991'
  },
  '0x336685bb3a96e13b77e909d7c52e8afcff1e859e': {
    name: 'Mitch',
    paymentAddress: '0x336685bb3A96E13B77E909d7C52e8AfCfF1E859E'
  },
  '0x41eb5f82af60873b3c14fedb898a1712f5c35366': {
    name: 'Kristian',
    paymentAddress: '0x41eb5F82af60873b3C14fEDB898A1712f5c35366'
  },
  '0x470c33abd57166940095d59bd8dd573cbae556c3': {
    name: 'James Guard ',
    paymentAddress: '0x470c33aBD57166940095d59BD8Dd573cBae556c3'
  },
  '0x1dec5f50cb1467f505bb3ddfd408805114406b10': {
    name: 'Fabeeo',
    paymentAddress: '0x1DeC5f50cB1467F505BB3ddFD408805114406b10'
  },
  '0x805797df0c0d7d70e14230b72e30171d730da55e': {
    name: 'Yannakis Old',
    paymentAddress: '0x5ce9fb617333b8c5a8f7787710f7c07002cb3516'
  },
  '0x5ce9fb617333b8c5a8f7787710f7c07002cb3516': {
    name: 'Yannakis',
    paymentAddress: '0x5ce9fb617333b8c5a8f7787710f7c07002cb3516'
  }
}

async function main() {
  const payments: { [address: string]: BigNumber } = {}
  const provider = new ethers.providers.InfuraProvider('homestead', '')
  for (const tx of transactions) {
    const block = await provider.getTransaction(tx)
    const logs = await provider.getLogs({
      blockHash: block.blockHash,
      address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
    })
    payments
    for (const log of logs) {
      if (log.transactionHash != tx) continue
      const address = ethers.utils.getAddress(log.topics[2].replace('0x000000000000000000000000', '0x'))
      if (!Object.entries(curators).find((a) => a[0].toLowerCase() == address.toLowerCase() || a[1].paymentAddress.toLowerCase() == address.toLowerCase()))
        continue
      if (!payments[address]) payments[address] = new BigNumber(0)
      payments[address] = payments[address].plus(new BigNumber(log.data))
    }
  }
  console.log(Object.entries(payments).map((a) => `${a[0]} received ${a[1].div(new BigNumber(10).pow(18)).toFixed(2)} MANA`))
  await fs.writeFile(
    'alreadydone.json',
    JSON.stringify(
      Object.entries(payments).map((a) => [a[0], a[1].toString(10)]),
      null,
      2
    )
  )
}

void main()
