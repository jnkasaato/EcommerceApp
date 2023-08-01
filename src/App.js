import { useEffect, useState, useCallback } from 'react';
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
  const [selectedNetworkProd, setSelectedNetworkProd] = useState(null);

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

  const switchNetwork = async (selectedNetwork) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the current chainId from the provider
      const chainId = await provider.send('eth_chainId');

      if (chainId !== selectedNetwork) {
        // Use the provider to switch the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork }],
        });
      }
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  const handleNetworkChange = async (selectedNetwork) => {
   // console.log('NEW APP COMPONENT - New selected network:', selectedNetwork);
    setSelectedNetwork(selectedNetwork);
    switchNetwork(selectedNetwork);
  };

  useEffect(() => {
    //console.log('APP Component - account:', account);
    //console.log('APP Component - selectedNetwork:', setSelectedNetwork(selectedNetwork));
  }, [account, selectedNetwork]);


  const handleDataFromChild = (data) => {
    // Do something with the data received from the child component
    setSelectedNetwork(data);
    setSelectedNetworkProd(data)
    console.log('App Component New Network:', selectedNetwork);
    console.log('App Component New Network - Product: ', selectedNetworkProd)
  };
 
console.log('App Component global:', selectedNetworkProd);




  const handleChainChanged = useCallback((chainId) => {
  console.log('Network changed:', chainId);
  // You can handle the network change here, e.g., update your provider or reload data.
  setSelectedNetwork(chainId);
  // You might want to call loadBlockchainData again to update data from the new network.
  loadBlockchainData();
}, [setSelectedNetwork]);

  useEffect(() => {
    // Set up the event listener for chainChanged
    const handleNetworkChange = (chainId) => {
      // Convert chainId to the format used by ethers.js (hex string with 0x prefix)
      const formattedChainId = `0x${parseInt(chainId).toString(16)}`;
      handleChainChanged(formattedChainId);
  };

    // Listen for the "chainChanged" event from MetaMask
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleNetworkChange);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleNetworkChange);
      }
    };
  }, [handleChainChanged]);



  return (
    <div>
      <br/>
      <Navigation
        account={account}
        setAccount={setAccount}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={handleNetworkChange} // Pass the callback func
        sendDataToParent={handleDataFromChild}
      />
      <div>
        <div className="header">
          <img src={header} alt="" className="center" />
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
            selectedNetworkProd={selectedNetworkProd}
          />
        )}
      </div>
    </div>
  );
}

export default App;
