import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Section from './components/Section';
import Product from './components/Product';
import header from './assets/header.jpg';

// ABIs
import Dappazon from './abis/Dappazon.json';

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);

  const [account, setAccount] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null); 

  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };

  const loadBlockchainData = async () => {
    try {
      const ethereum = window.ethereum;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        setProvider(provider);

        // Get the current chainId from the provider
        const chainId = await provider.send('eth_chainId');
        
        // Use the chainId to find the corresponding network config
        const networkConfig = config[parseInt(chainId)];

        if (networkConfig) {
          const dappazon = new ethers.Contract(
            networkConfig.dappazon.address,
            Dappazon,
            provider
          );
          setDappazon(dappazon);

          const items = [];

          for (var i = 0; i < 9; i++) {
            const item = await dappazon.items(i + 1);
            items.push(item);
          }

          const electronics = items.filter((item) => item.category === 'electronics');
          const clothing = items.filter((item) => item.category === 'clothing');
          const toys = items.filter((item) => item.category === 'toys');

          setElectronics(electronics);
          setClothing(clothing);
          setToys(toys);
        } else {
          console.error('Network not supported.');
        }
      } else {
        console.error('Metamask not found. Please install Metamask.');
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
   <div>
   <br/>
    <Navigation
      account={account}
      setAccount={setAccount}
      selectedNetwork={selectedNetwork} 
      setSelectedNetwork={setSelectedNetwork} 
    />
    <div>
      <div className="header">
        <img src={header} className="center" />
      </div>

      {electronics && clothing && toys && (
        <>
          <Section title={"Essentials"} items={clothing} togglePop={togglePop} />
          <Section title={"Clothing & Costumes"} items={electronics} togglePop={togglePop} />
          <Section title={"Toys"} items={toys} togglePop={togglePop} />
        </>
      )}
      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          dappazon={dappazon}
          togglePop={togglePop}
          selectedNetwork={selectedNetwork}
        />
      )}
    </div>
  </div>
  );
}

export default App;
