import { useEffect, useState } from 'react';


// Components
import Rating from './Rating';

import close from '../assets/close.svg';
import image from '../items.json';

const ethers = require("ethers")

const Product = ({ item, provider, account, togglePop }) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  const fetchDetails = async () => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    // Update the contract address for Goerli deployment
    const contractAddress = "0x8207f62B0F8706081E4e029e6a61888b622f8b50"; // Goerli contract address

    const DappazonFactory = await ethers.getContractFactory("Dappazon");
    const dappazon = new ethers.Contract(contractAddress, DappazonFactory, signer);

    const events = await dappazon.queryFilter("Buy");
    const orders = events.filter(
      (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
    );

    if (orders.length === 0) return;

    const order = await dappazon.orders(account, orders[0].args.orderId);
    setOrder(order);
  };

  const buyHandler = async () => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    // Update the contract address for Goerli deployment
    const contractAddress = "0x8207f62B0F8706081E4e029e6a61888b622f8b50"; // Goerli contract address

    const DappazonFactory = await ethers.getContractFactory("Dappazon");
    const dappazon = new ethers.Contract(contractAddress, DappazonFactory, signer);

    // Buy item
    let transaction = await dappazon.connect(signer).buy(item.id, { value: item.cost });
    await transaction.wait();

    setHasBought(true);
  };

  useEffect(() => {
    fetchDetails();
  }, [hasBought]);

  return (
    <div className="product">
      {/* Rest of the code remains the same... */}
    </div>
  );
};

export default Product;
