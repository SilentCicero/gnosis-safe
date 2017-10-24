const Web3 = require('web3')
const CID = require('cids')
const bl = require('bl')
const ipfsAPI = require('ipfs-api')
const BigNumber = require('bignumber.js')
const multihash = require('multihashes')

function configureContract(contract, provider, user) {
  contract.setProvider(provider)
  contract.defaults({
    from: user,
    gas: 4000000
  })
  if (typeof contract.currentProvider.sendAsync !== "function") {
    contract.currentProvider.sendAsync = function() {
      return contract.currentProvider.send.apply(
        contract.currentProvider, arguments
      );
    };
  }
}

function openIpfs() {
  return ipfsAPI('localhost', '5001', {
    protocol: 'http'
  })
}

function decodeHash(hash) {
  return new Promise(function(resolve, reject) {
    console.log("hash: ", hash)
    var cid = new CID(hash)
    console.log("cid: ", cid.multihash.slice(2).toString('hex'))
    resolve(new BigNumber(cid.multihash.slice(2).toString('hex'), 16))
  })
}

function addDescription(transaction) {
  var data = JSON.stringify(transaction)
  console.log("data: ", data)
  var ipfs = openIpfs()
  var dataBuffer = Buffer.from(data)
  return new Promise(function(resolve, reject) {
    ipfs.files.add(dataBuffer, (err, res) => {
      if (err != undefined) {
        reject(err)
        return
      }
      const file = res[0]
      resolve(file.hash)
    })
  })
}

function loadDescription(descriptionHash) {
  var ipfs = openIpfs()
  return new Promise(function(resolve, reject) {
    ipfs.files.cat(descriptionHash, (err, stream) => {
      if (err != undefined) {
        reject(err)
        return
      }
      stream.pipe(bl((err, data) => {
        var description = data.toString()
        console.log(data);
        resolve(JSON.parse(description))
      }))
    })
  })
}

function parseDescription(descriptionHashes) {
  return new Promise((resolve, reject) => {
    resolve(descriptionHashes.map((descriptionHash) => {
      return multihash.toB58String(Buffer.from("1220" + descriptionHash.slice(2), 'hex'))
    }))
  })
}

export default class {

  constructor(GnosisSafeWithDescriptionsFactory, GnosisSafeWithDescriptions, provider, user) {
    this.web3 = new Web3(provider)

    configureContract(GnosisSafeWithDescriptionsFactory, provider, user)
    configureContract(GnosisSafeWithDescriptions, provider, user)

    this.factoryContract = GnosisSafeWithDescriptionsFactory
    this.safeContract = GnosisSafeWithDescriptions
  }

  // npm run gscli -- create 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 0x19fd8863ea1185d8ef7ab3f2a8f4d469dc35dd52 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 1
  create(factoryAddress, owners, requiredConfirmations) {
    var factory = this.factoryContract.at(factoryAddress)
    return factory.create(owners, requiredConfirmations)
  }

  // npm run gscli -- getOwners 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 0x13de59675d22fb7befd213324f3f829135c6e8f8
  getOwners(safeAddress) {
    // GnosisSafeWithDescriptions.at(<safeAddress>).getOwners.call()
    var safe = this.safeContract.at(safeAddress)
    return safe.getOwners.call()
  }

  // npm run gscli -- descriptions 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 0x13de59675d22fb7befd213324f3f829135c6e8f8
  listDescriptions(safeAddress) {
    var safe = this.safeContract.at(safeAddress)
    return safe.getDescriptionCount.call()
      .then((count) => {
        return safe.getDescriptions.call(0, count)
      })
      .then((hashes) => {
        return parseDescription(hashes)
      })
  }

  // npm run gscli -- statusWithDescription 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 0x13de59675d22fb7befd213324f3f829135c6e8f8 QmVhoCU4sC4qAjhb7LipEv2H2cKXmqsfffL4bsUoJRe4af
  statusWithDescription(safeAddress, descriptionHash) {
    var safe = this.safeContract.at(safeAddress)
    return loadDescription(descriptionHash)
      .then((transaction) => {
        return safe.getTransactionHash.call(transaction.to, transaction.value, transaction.data, transaction.operation, transaction.nonce)
      })
      .then((transactionHash) => {
        return safe.isConfirmedByRequiredOwners.call(transactionHash)
      })
  }

  // npm run gscli -- confirm 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 0x13de59675d22fb7befd213324f3f829135c6e8f8 0x9bebe3b9e7a461e35775ec935336891edf856da2 1 asbc 0 2
  confirmTransaction(safeAddress, transaction) {
    // confirmAndExecuteTransaction(address to, uint value, bytes data, GnosisSafe.Operation operation, uint nonce, bytes32 descriptionHash)
    var safe = this.safeContract.at(safeAddress)

    return addDescription(transaction)
      .then((hash) => {
        return decodeHash(hash)
      })
      .then((descriptionHash) => {
        return safe.getTransactionHash.call(transaction.to, transaction.value, transaction.data, transaction.operation, transaction.nonce)
          .then((transactionHash) => {
            return safe.confirmTransaction(transactionHash, descriptionHash)
          })
      })
  }
}
