const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "2ac87f0bdc004deab755bb718161f99b";
const mnemonic = "USE YOUR SPECIAL WORDS RIGHT HERE";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      websockets: true,
      networkCheckTimeout: 999999
    },

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.5.0"
    }
  }
};
