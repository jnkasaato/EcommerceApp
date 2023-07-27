require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
//require("@nomiclabs/hardhat-waffle");

const  privateKeys = process.env.PRIVATE_KEYS || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {}, 
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: privateKeys.split(','),
    },
    /*
    mumbai: { 
      url: "https://polygon-mumbai.g.alchemy.com/v2/_mQdF1FgbtohnR7GrWej4SrGyX9vX7bv",
      accounts: `8af4bdd998e54914e8181a2c0eef0ec0ee07b8905f080464c171217fd5f5ff97`, `ba2ead27a571c33e51774195db7924dc130a960b46134b1e585cae4205da7f17`,
    }
    */
  },
};