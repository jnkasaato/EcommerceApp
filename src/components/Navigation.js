import React, { useState, useEffect } from 'react';


const Navigation = ({ account, setAccount, sendDataToParent}) => {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [prevNetwork, setPrevNetwork] = useState(null); // New state to track previous network

  const localhostChainId = '0x7A69'; // Localhost
  const goerliChainId = '0x5'; // Goerli
  const mumbaiChainId = '0x13881'; // Mumbai
  const sepoliaChainId = '0xaa36a7'; // Sepolia

  useEffect(() => {
    // Check the current network and connected accounts on initial load
    const checkInitialData = async () => {
      const ethereum = window.ethereum;
      if (ethereum) {
        // Get the initial network
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        setSelectedNetwork(chainId);
        setPrevNetwork(chainId);

        // Get the initial connected accounts
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };

    checkInitialData();

    // Listen for changes in connected accounts
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      // Clean up the event listener when the component unmounts
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [setAccount]);

  useEffect(() => {
    // This useEffect will be triggered whenever selectedNetwork changes
    // Check if selectedNetwork is not null and it's different from the previous network
    if (selectedNetwork && selectedNetwork !== prevNetwork) {
      console.log(`Nav Component - Switched to ${getNetworkName(selectedNetwork)} network`);
      console.log('chainID:',selectedNetwork);
      setPrevNetwork(selectedNetwork);
    }
  }, [selectedNetwork, prevNetwork]);

const handleNetworkChange = async (event) => {
  const selectedNetwork = event.target.value;
  setSelectedNetwork(selectedNetwork);
  switchNetwork(selectedNetwork);
  // Pass the selected network value back to the parent component
  setSelectedNetwork(selectedNetwork);
};


//const dataToSendToParent = "Hello from child!";
  // Call the callback function and pass the data
  sendDataToParent(selectedNetwork);





  const switchNetwork = async (chainId) => {
    try {
      const ethereum = window.ethereum;
      if (ethereum) {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        });
      } else {
        console.error('MetaMask not found. Please install MetaMask.');
      }
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case localhostChainId:
        return 'Localhost';
      case goerliChainId:
        return 'Goerli';
      case mumbaiChainId:
        return 'Mumbai';
      case sepoliaChainId:
        return 'Sepolia';
      default:
        return 'Unknown Network';
    }
  };

  // Smooth scroll to the element with the given ID
  const smoothScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav>
      <div className="nav__brand">
        <h1>Acclimate</h1>
      </div>
      <div>
        <ul className="nav__links">
          <li>
            <a onClick={() => smoothScrollTo('Essentials')} href="#electronics">
              Essentials
            </a>
          </li>
          <li>
            <a onClick={() => smoothScrollTo('Clothing & Costumes')} href="#clothing">
              Clothing
            </a>
          </li>
          <li>
            <a onClick={() => smoothScrollTo('Toys')} href="#toys">
              Toys
            </a>
          </li>
        </ul>
      </div>
      
      <div className="nav__network">
        {account && selectedNetwork ? (
          <button
            type="button"
            className="nav__connect"
            onClick={() => {}}
          >
            {`${account.slice(0, 6)}...${account.slice(38, 42)}`}
          </button>
        ) : (
          <button
            type="button"
            className="nav__connect"
            onClick={() => {}}
          >
            Connect
          </button>
        )}
        <select
          className="nav__network-dropdown"
          onChange={handleNetworkChange}
          value={selectedNetwork || ''}
        >
          <option value="" disabled hidden>
            Choose Network
          </option>
          <option value={localhostChainId}>Localhost</option>
          <option value={goerliChainId}>Goerli</option>
          <option value={sepoliaChainId}>Sepolia</option>
          <option value={mumbaiChainId}>Mumbai</option>
        </select>
      </div>
    </nav>
  );
};

export default Navigation;
