#ItemDeed

`ItemDeed.sol` is an implementation of the latest draft of the ERC721 standard.

A mostly functional MVP can be found here: http://itemdeed.io (requires Chrome browser with Metamask plugin and a Mainnet Ethereum account with Ether).

Its inheriting contract `ERC721Deed.sol` is based on the `ERC721Token` from OpenZeppelin (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Token.sol).

*Warning:* The standard is still open for discussion, so this project should be considered work in progress. Follow the discussion here: https://github.com/ethereum/EIPs/pull/841

## About this example

ItemDeed is a first attempt at building an Ethereum Dapp.  ItemDeed leans heavily on the incredible efforts of:
1. https://github.com/nastassiasachs/ERC721ExampleDeed
2. OpenZeppelin.  

Thank you!  

## Prerequisites
1. npm
2. Truffle v4.1.3 (core: 4.1.3)
3. Solidity v0.4.19 (solc-js)
4. Git
5. Ganache
6. Chrome browser with Metamask plugin

## Dev Installation
1. git clone https://github.com/permanonce/items.git
2. npm install
3. truffle compile
4. npm run test (optional)
5. start ganache on http://localhost:8545
6. truffle migrate
7. truffle exec scripts/populateitemdeed.js
8. truffle exec scripts/displayitems.js (optional)
9. npm run build
10. npm start
11. Make sure you have an Internet connection and go to http://localhost:8080 with your browser.

# Configure and start IPFS
1. ipfs init
2. ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
3. ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
4. ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
5. ipfs daemon

## Tests and mocks

The tests and mocks of this repository are based on OpenZeppelin work. The directory structure is a result of the decision to install their contracts through EthPM instead of NPM.  To perform unit tests type 'truffle exec tests/test.sh'.

## TODO
1. Add Approval functionality.
2. Update Proof of Ownership of existing Item deeds - experiment with complex IPFS objects.
3. Refactor Javascript and Vue js.
4. Redesign UI for Android/IPhone compatibility.
5. Remove unused Node modules.
6. Improve Registration workflow.
7. Make ItemDeed use 'Composables' (ERC-998).
