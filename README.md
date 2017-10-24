# gnosis-safe
Gnosis Safe allows secure management of privately owned blockchain assets.

## GnosisSafeWithDescriptions
This safe uses ipfs to store the descriptions for each transaction

### Setup ipfs

#### Install
- `brew install ipfs` or follow https://ipfs.io/docs/install/

#### Getting started
TL; DR version of https://ipfs.io/docs/getting-started/
- ipfs init
- ipfs daemon

Test with (you might need to adjust the hash)
```
ipfs cat /ipfs/QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg >cat.jpg
open cat.jpg
```

Check http://localhost:5001/webui

## Setup Gnosis Safe

### Use Factory

- `truffle migrate`

- Get factory address from log out put (look for `GnosisSafeWithDescriptionsFactory: 0x19fd8863ea1185d8ef7ab3f2a8f4d469dc35dd52`)

- Create Gnosis Safe with `npm run gscli -- create <creator> <factory> <owner>,<owner> <required_confirmations>`
  - e.g. `npm run gscli -- create 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 0x19fd8863ea1185d8ef7ab3f2a8f4d469dc35dd52 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 1`

### Use Migration

- `truffle migrate <owner>,<owner> <required_confirmations>`
  - e.g. `truffle migrate 0xa5056c8efadb5d6a1a6eb0176615692b6e648313 1`

## Command Line Interface

### Create safe
`npm run gscli -- create <creator> <factory> <owner>,<owner> <required_confirmations>`

### Get Owners
`npm run gscli -- getOwners <user> <safe>`

### Confirm transaction
`npm run gscli -- confirm <user> <safe> <to> <value> <data> <operation> <nonce>`

### Get descriptions
`npm run gscli -- descriptions <user> <safe>`

### Get status with description
`npm run gscli -- statusWithDescription <user> <safe> <descriptionHash>`

## Notes
- https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes
