import { useEffect, useState, useMemo } from 'react';
import { ethers } from 'ethers';

import Rating from './Rating';
import close from '../assets/close.svg';

import Dappazon from '../abis/Dappazon.json';

const Product = ({ item, provider, account, dappazon, togglePop, selectedNetworkProd }) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  // Set the correct contract based on the selected network
  const contract = useMemo(() => {
    return getContract(selectedNetworkProd);
  }, [selectedNetworkProd]);

  // Set the correct contract based on the selected network
  function getContract(chainId) {
    switch (chainId) {
      case 'localhost':
        return new ethers.Contract('0x5fbdb2315678afecb367f032d93f642f64180aa3', Dappazon.abi, provider);
      case 'goerli':
        return new ethers.Contract('0x3C8B15EC9F0902Af82841c026BBA99a62861C009', Dappazon.abi, provider);
      case 'mumbai':
        return new ethers.Contract('0x2211b7aFBCD6860Ab6201CF361D48183Cb9b9AAb', Dappazon.abi, provider);
      case 'sepolia':
        return new ethers.Contract('0x28d935E1d050f1300feb868a849bbE838d160eA4', Dappazon.abi, provider);
      default:
        return dappazon; // Fallback to the mainnet contract
    }
  }

  useEffect(() => {
    // Fetch the order details for the current item if the user has bought it
    const fetchDetails = async () => {
      if (hasBought) {
        const events = await dappazon.queryFilter('Buy');
        const orders = events.filter(
          (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
        );

        if (orders.length === 0) return;

        const order = await dappazon.orders(account, orders[0].args.orderId);
        setOrder(order);
      }
    };

    fetchDetails();
  }, [hasBought, account, item.id, dappazon]);





  useEffect(() => {
    console.log('Product Component - selectedNetworkProd:', selectedNetworkProd);
  }, [item, provider, account, dappazon, togglePop, selectedNetworkProd]);


  const buyHandler = async () => {
    const signer = await provider.getSigner();

    // Buy item
    try {
      const transaction = await contract.connect(signer).buy(item.id, { value: item.cost });
      await transaction.wait();

      setHasBought(true);
    } catch (error) {
      console.error('Error buying item:', error);
    }
  };


  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>
          <h1>{item.price}</h1>

          <Rating value={item.rating} />
          <small>Based on 99+ ratings</small>
          <p>{item.address}</p>

          <hr />

          <p>{item.address}</p>

          <h2>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>

          <hr />

          <h2>Description</h2>

          <p>
            {item.description}
            Introducing a new must-have for your furry companion! Our carefully crafted product is a game-changer that
            will ignite pure excitement in your pet's eyes. Made from top-quality materials and a dash of love, it is an
            irresistible addition to your pet's world. Embrace the magic of bonding with your pet and elevate their
            happiness with this extraordinary addition to your pet-loving home!
          </p>
        </div>

        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>

          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 349600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </strong>
          </p>

          {item.stock > 0 ? (
            <p>In Stock.</p>
          ) : (
            <p>Out of Stock.</p>
          )}

          <button className="product__buy" onClick={buyHandler}>
            Buy Now
          </button>

          <p>
            <small>Ships from</small> Boston
          </p>
          <p>
            <small>Sold by</small> Acclimate
          </p>
          <p>
            <small>
              Return eligible through {new Date(Date.now() + 1949600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </small>
          </p>

          {order && (
            <div className="product__bought">
              Item bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(undefined, {
                  weekday: 'long',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
              </strong>
            </div>
          )}
        </div>

        <button onClick={togglePop} className="product__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Product;
