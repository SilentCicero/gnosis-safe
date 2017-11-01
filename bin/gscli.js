#!/usr/bin/env node
import { default as initializeLib } from '../index'

const RPC_HOST = 'localhost'
const RPC_PORT = '8545'

var command = process.argv[2]
var args = process.argv.splice(3)

console.log('command: ' + command);

if (command === 'create') {
  var creator = args[0]
  var factoryAddress = args[1]
  var owners = args[2].split(",")
  var requiredConfirmations = args[3]
  console.log('creator: ' + creator)
  console.log('factoryAddress: ' + factoryAddress)
  console.log('owners: ' + owners)
  console.log('requiredConfirmations: ' + requiredConfirmations)
  let gslib = initializeLib(RPC_HOST, RPC_PORT, creator)
  gslib.create(factoryAddress, owners, requiredConfirmations)
    .then((gsafe) => {
    	console.log('Gnosis Safe address is ' + gsafe['receipt']['logs'][0]['address'])
    })
    .catch((error) => {
  		console.log(error)
	});
}
if (command === 'getOwners') {
  var user = args[0]
  var safeAddress = args[1]
  console.log('user: ' + user)
  console.log('safeAddress: ' + safeAddress)
  let gslib = initializeLib(RPC_HOST, RPC_PORT, user)
  gslib.getOwners(safeAddress)
    .then((owners) => {
    	console.log('The owners of the safe are ' + owners)
    })
    .catch((error) => {
  		console.log(error)
	});
}
if (command === 'confirm') {
  var user = args[0]
  var safeAddress = args[1]
  var transaction = new Object();
  transaction.to = args[2]
  transaction.value = args[3]
  transaction.data = args[4]
  transaction.operation = args[5]
  transaction.nonce = args[6]
  var subject = args[7]
  let gslib = initializeLib(RPC_HOST, RPC_PORT, user)
  gslib.confirmTransaction(safeAddress, transaction, subject)
    .then((result) => {
    	console.log('result ' + result)
    })
    .catch((error) => {
  		console.log(error)
	})
}
if (command === 'statusWithDescription') {
  var user = args[0]
  var safeAddress = args[1]
  var descriptionHash = args[2]
  let gslib = initializeLib(RPC_HOST, RPC_PORT, user)
  gslib.statusWithDescription(safeAddress, descriptionHash)
    .then((result) => {
    	console.log('result ' + result)
    })
    .catch((error) => {
  		console.log(error)
	})
}
if (command === 'descriptions') {
  var user = args[0]
  var safeAddress = args[1]
  let gslib = initializeLib(RPC_HOST, RPC_PORT, user)
  gslib.listDescriptions(safeAddress, transaction)
    .then((result) => {
    	console.log("Description Hashes:", result)
    })
    .catch((error) => {
  		console.log(error)
	})
}
