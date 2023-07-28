require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const  privateKeys = process.env.PRIVATE_KEYS || ""

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: { 
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: privateKeys.split(','),
    }
  },
};