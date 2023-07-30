import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const localhostChainId = '0x7A69'; // Localhost
  const goerliChainId = '0x5'; // Goerli
  const mumbaiChainId = '0x13881'; // Mumbai
  const sepoliaChainId = '0xaa36a7'; // Sepolia

  useEffect(() => {
    // Check the current network on initial load
    const checkCurrentNetwork = async () => {
      const ethereum = window.ethereum;
      if (ethereum) {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        setSelectedNetwork(chainId);
      }
    };

    checkCurrentNetwork();
  }, []);

  const handleNetworkChange = async (event) => {
    const selectedNetwork = event.target.value;
    setSelectedNetwork(selectedNetwork); // Update selected network state
    switchNetwork(selectedNetwork); // Switch to the selected network in MetaMask
    setShowNetworkDropdown(false); // Hide the network dropdown after selecting a network
  };

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
      <div className='nav__brand'>
        <h1>Acclimate</h1>
      </div>
      <div>
        <ul className='nav__links'>
          <li><a onClick={() => smoothScrollTo('Essentials')} href="#electronics">Essentials</a></li>
          <li><a onClick={() => smoothScrollTo('Clothing & Costumes')} href="#clothing">Clothing</a></li>
          <li><a onClick={() => smoothScrollTo('Toys')} href="#toys">Toys</a></li>
        </ul>
      </div>
      <input type="text" className="nav__search" />

      <div className='nav__network'>
        {account && selectedNetwork ? (
          <button
            type="button"
            className='nav__connect'
            onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
          >
            {`${getNetworkName(selectedNetwork)} (${account.slice(0, 6)}...${account.slice(38, 42)})`}
          </button>
        ) : (
          <button
            type="button"
            className='nav__connect'
            onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
          >
            Connect
          </button>
        )}
        {showNetworkDropdown && (
          <select className="nav__network-dropdown" onChange={handleNetworkChange} value={selectedNetwork || ''}>
            <option value="" disabled hidden>
              Choose Network
            </option>
            <option value={localhostChainId}>Localhost</option>
            <option value={goerliChainId}>Goerli</option>
            <option value={sepoliaChainId}>Sepolia</option>
            <option value={mumbaiChainId}>Mumbai</option>
          </select>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
