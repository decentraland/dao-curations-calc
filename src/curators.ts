export const curators: Curators = {
  '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0': {
    name: 'Lau',
    paymentAddress: '0x5d7846007c1dd6dca25d16ce2f71ec13bcdcf6f0',
    active: true,
    alreadyPaid: '2828525972000000000000'
  },
  '0x716954738e57686a08902d9dd586e813490fee23': {
    name: 'HirotoKai',
    paymentAddress: '0x716954738e57686a08902d9dd586e813490fee23',
    active: true,
    alreadyPaid: '3880000000000000000000'
  },
  '0x7a3891acf4f3b810992c4c6388f2e37357d7d3ab': {
    name: 'JP',
    paymentAddress: '0xC958f028d1b871ab2e32C2aBdA54F37191eFe0C2',
    active: true,
    alreadyPaid: '8480000000000000000000'
  },
  '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9': {
    name: 'Malloy',
    paymentAddress: '0x82d54417fc69681dc74a6c0c68c6dbad5a2857b9',
    active: true,
    alreadyPaid: '8147324875000000000000'
  },
  '0x8938d1f65abe7750b0777206ee26c974a6721194': {
    name: 'Shibu',
    paymentAddress: '0x9dB59920d3776c2d8A3aA0CbD7b16d81FcAb0A2b',
    active: true,
    alreadyPaid: '21059554540000000000000'
  },
  '0x91e222ed7598efbcfe7190481f2fd14897e168c8': {
    name: 'Chestnutbruze',
    paymentAddress: '0x91e222ed7598efbcfe7190481f2fd14897e168c8',
    active: true,
    alreadyPaid: '10060000000000000000000'
  },
  '0x967fb0c36e4f5288f30fb05f8b2a4d7b77eaca4b': {
    name: 'Kat',
    paymentAddress: '0x6cDFDB9a4D99f16B5607caB1d00c792206db554E',
    active: true,
    alreadyPaid: '1650000000000000000000'
  },
  '0x5e382071464a6f9ea29708a045983dc265b0d86d': {
    name: 'Sango',
    paymentAddress: '0x862f109696d7121438642a78B3CaA38F476db08b',
    active: true,
    alreadyPaid: '15759619200000000000000'
  },
  '0xc8ad6322821b51da766a4b2a82b39fb72b53d276': {
    name: 'Grimey',
    paymentAddress: '0xc8ad6322821b51da766a4b2a82b39fb72b53d276',
    active: true,
    alreadyPaid: '5765124210000000000000'
  },
  '0xa8c7d5818a255a1856b31177e5c96e1d61c83991': {
    name: 'AndreusAs',
    paymentAddress: '0xa8c7d5818A255A1856b31177E5c96E1D61c83991',
    active: true,
    alreadyPaid: '15855476700000000000000'
  },
  '0x336685bb3a96e13b77e909d7c52e8afcff1e859e': {
    name: 'Mitch',
    paymentAddress: '0x336685bb3A96E13B77E909d7C52e8AfCfF1E859E',
    active: true,
    alreadyPaid: '5126630100000000000000'
  },
  '0x41eb5f82af60873b3c14fedb898a1712f5c35366': {
    name: 'Kristian',
    paymentAddress: '0x41eb5F82af60873b3C14fEDB898A1712f5c35366',
    active: true,
    alreadyPaid: '16440495600000000000000'
  },
  '0x470c33abd57166940095d59bd8dd573cbae556c3': {
    name: 'James Guard ',
    paymentAddress: '0x470c33aBD57166940095d59BD8Dd573cBae556c3',
    active: true,
    alreadyPaid: '520000000000000000000'
  },
  '0x1dec5f50cb1467f505bb3ddfd408805114406b10': {
    name: 'Fabeeo',
    paymentAddress: '0x1DeC5f50cB1467F505BB3ddFD408805114406b10',
    active: true,
    alreadyPaid: '10855871000000000000000'
  },
  '0x5ce9fb617333b8c5a8f7787710f7c07002cb3516': {
    name: 'Yannakis',
    paymentAddress: '0x5ce9fb617333b8c5a8f7787710f7c07002cb3516',
    active: true,
    alreadyPaid: '32030784800000000000000'
  },
  '0x805797df0c0d7d70e14230b72e30171d730da55e': {
    name: 'Previous_Yannakis',
    paymentAddress: '0x5ce9fb617333b8c5a8f7787710f7c07002cb3516',
    active: false
  },
  '0x399a44f5821b1f859bc236e14367c4f7c36933fb': {
    name: 'Previous_Shibu',
    paymentAddress: '0x9dB59920d3776c2d8A3aA0CbD7b16d81FcAb0A2b',
    active: false
  }
}

interface Curator {
  name: string
  paymentAddress: string
  alreadyPaid?: string
  active?: boolean
}
interface Curators {
  [curatorAddress: string]: Curator
}

export default curators
