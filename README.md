# Dappazon

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 6. Start frontend
`$ npm run start`

## Connecting to the Blockchain
To interact with Acclimate, connect your Ethereum wallet to the Hardhat network. Make sure you have some test Ether in your wallet to perform transactions on the test network.

### 1. Install MetaMask: 
If you haven't already, install the MetaMask browser extension for your web browser.

### 2. Configure Custom RPC Network: 
Once MetaMask is installed, open the extension and create or import an Ethereum wallet. Then, click on the network dropdown and choose "Custom RPC."

### 3. Configure Network Details:
Network Name: "Hardhat" 
New RPC URL: http://localhost:8545.
Chain ID: '1337'

### 4. Save Configuration: 
After filling in the network details, click the "Save" button to save the custom network configuration.

### 5. Connect to Hardhat Network: 
Your MetaMask wallet should now be connected to your local Hardhat network.

