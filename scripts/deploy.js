const hre = require("hardhat");
const { items } = require("../src/items.json");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  let networkName = hre.network.name;

  if (networkName !== "goerli" && networkName !== "localhost") {
    throw new Error(
      "Invalid network. Please use 'goerli' or 'localhost' for deployment."
    );
  }

  // Setup accounts
  const [deployer] = await ethers.getSigners();

  // Deploy
  const Dappazon = await hre.ethers.getContractFactory("Dappazon");
  const dappazon = await Dappazon.deploy();
  await dappazon.deployed();

  console.log(`Deployed Dappazon Contract at: ${dappazon.address}\n`);

  // Listing items
  for (let i = 0; i < items.length; i++) {
    const transaction = await dappazon.connect(deployer).list(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      tokens(items[i].price),
      items[i].rating,
      items[i].stock
    );

    await transaction.wait();

    console.log(`Listed item ${items[i].id}: ${items[i].name}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
