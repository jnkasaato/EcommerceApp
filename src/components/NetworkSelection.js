import { useState } from 'react';
import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const connectHandler = async () => {
    try {
      const ethereum = window.ethereum;
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
        setShowNetworkDropdown(true); // Show the network dropdown after connecting
      } else {
        console.error('Metamask not found. Please install Metamask.');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const handleNetworkChange = (event) => {
    const selectedNetwork = event.target.value;
    setSelectedNetwork(selectedNetwork);
    addNetwork(selectedNetwork); // Add the selected network to Metamask
    setShowNetworkDropdown(false); // Hide the network dropdown after selecting a network
  };

  const addNetwork = async (chainId) => {
    try {
      const ethereum = window.ethereum;
      if (ethereum) {
        // Convert chainId to hexadecimal
        const formattedChainId = '0x' + chainId.toString(16);

        // Define network parameters
        const networkParams = {
          chainId: formattedChainId,
          chainName: getNetworkName(chainId),
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [getRpcUrl(chainId)], // Use your function to get the RPC URL based on chainId
        };

        // Request to add the custom network to Metamask
        await ethereum.request({ method: 'wallet_addEthereumChain', params: [networkParams] });
      } else {
        console.error('Metamask not found. Please install Metamask.');
      }
    } catch (error) {
      console.error('Error adding custom network:', error);
    }
  };

  // Function to get the RPC URL based on the selected network
  const getRpcUrl = (chainId) => {
    // Replace this with your function to get the correct RPC URL for each network
    // For example, you can use a switch statement to map chainId to the corresponding URL
    switch (chainId) {
      case '80001':
        return 'https://rpc-mumbai.matic.today';
      case '5':
        return 'https://goerli.infura.io/v3/your-infura-api-key';
      case '31337':
        return 'http://localhost:8545';
      default:
        return null;
    }
  };

  // Function to get the network name based on the selected network
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '80001':
        return 'Mumbai Test Network';
      case '5':
        return 'Goerli Test Network';
      case '31337':
        return 'Localhost';
      default:
        return 'Custom Network';
    }
  };

  return (
    <nav>
      <div className='nav__brand'>
        <h1>Acclimate</h1>
      </div>
      <div>
        <ul className='nav__links'>
          <li><a href="#Essentials">Essentials</a></li>
          <li><a href="#Clothing & Costumes">Clothing</a></li>
          <li><a href="#Toys">Toys</a></li>
        </ul>
      </div>
      <input type="text" className="nav__search" />

      {account ? (
        <div>
          <button type="button" className='nav__connect' onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}>
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </button>
          {showNetworkDropdown && (
            <div>
              <select value={selectedNetwork} onChange={handleNetworkChange}>
                <option value="80001">Mumbai Test Network</option>
                <option value="5">Goerli Test Network</option>
                <option value="31337">Localhost</option>
              </select>
            </div>
          )}
        </div>
      ) : (
        <button type="button" className='nav__connect' onClick={connectHandler}>
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;
