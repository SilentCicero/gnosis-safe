import { default as GnosisSafeLib } from './lib/gnosis_safe'
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

const GnosisSafeWithDescriptionsFactory = contract(require('./build/contracts/GnosisSafeWithDescriptionsFactory.json'))
const GnosisSafeWithDescriptions = contract(require('./build/contracts/GnosisSafeWithDescriptions.json'))

export default function (host, port, user) {
  let provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`)
  return new GnosisSafeLib(
      GnosisSafeWithDescriptionsFactory,
      GnosisSafeWithDescriptions,
      provider,
      user
  )
}