# AGL Token Smart Contract

## Overview
The AGL (Agent Algo) token is an ERC-20 compatible smart contract deployed on Ethereum that serves as the platform token for the Chain Agent ecosystem.

## Contract Features

### 🪙 **Token Specifications**
- **Name**: Agent Algo
- **Symbol**: AGL
- **Decimals**: 18
- **Total Supply**: 100,000,000 AGL
- **Standard**: ERC-20 Compatible

### 🔄 **Core Functions**

#### **Token Operations**
- `transfer()` - Transfer tokens between addresses
- `approve()` - Approve spending allowance
- `transferFrom()` - Transfer tokens on behalf of another address
- `balanceOf()` - Check token balance
- `totalSupply()` - Get total token supply

#### **Platform Functions**
- `swapETHForAGL()` - Swap ETH for AGL tokens (1 ETH = 1000 AGL)
- `createAgent()` - Pay 1000 AGL to create an AI agent
- `hasMinimumTokensForAgent()` - Check if user can create agents
- `getAgentCreationFee()` - Get current agent creation fee

#### **Admin Functions**
- `setTreasury()` - Update platform treasury address
- `authorizeAgentCreator()` - Authorize agent creation addresses
- `mint()` - Mint new tokens (owner only)
- `burn()` - Burn tokens from supply

### 💰 **Economic Model**

#### **Token Distribution**
- **Platform Treasury**: 50,000,000 AGL (50%)
- **Public Sale**: 30,000,000 AGL (30%)
- **Team & Advisors**: 15,000,000 AGL (15%)
- **Ecosystem Rewards**: 5,000,000 AGL (5%)

#### **Pricing Structure**
- **ETH to AGL Rate**: 1 ETH = 1,000 AGL
- **Agent Creation Fee**: 1,000 AGL
- **Minimum Balance**: 1,000 AGL (to create agents)

### 🚀 **Deployment Instructions**

#### **Prerequisites**
```bash
npm install web3 solc
```

#### **Environment Setup**
```bash
# Create .env file
DEPLOYER_PRIVATE_KEY=your_private_key_here
INFURA_PROJECT_ID=your_infura_project_id
```

#### **Compile Contract**
```bash
node deploy.js compile
```

#### **Deploy to Testnet**
```bash
node deploy.js sepolia
```

#### **Deploy to Mainnet**
```bash
node deploy.js mainnet
```

### 🔧 **Integration Guide**

#### **Web3.js Integration**
```javascript
import Web3 from 'web3';
import { AGL_TOKEN_ABI, AGL_CONTRACT_ADDRESS } from './config';

const web3 = new Web3(window.ethereum);
const aglContract = new web3.eth.Contract(AGL_TOKEN_ABI, AGL_CONTRACT_ADDRESS);

// Check balance
const balance = await aglContract.methods.balanceOf(userAddress).call();

// Swap ETH for AGL
await aglContract.methods.swapETHForAGL().send({
  from: userAddress,
  value: web3.utils.toWei('0.1', 'ether') // 0.1 ETH
});

// Create agent
await aglContract.methods.createAgent(agentId).send({
  from: userAddress
});
```

#### **React Hook Usage**
```javascript
import { usePlatformToken } from '../hooks/usePlatformToken';

function MyComponent() {
  const { 
    platformToken, 
    swapAlgoForAGL, 
    hasMinimumTokens, 
    canCreateAgent 
  } = usePlatformToken();

  const handleSwap = async () => {
    await swapAlgoForAGL(0.1); // Swap 0.1 ETH for AGL
  };

  return (
    <div>
      <p>AGL Balance: {platformToken.balance}</p>
      <p>Can Create Agent: {canCreateAgent() ? 'Yes' : 'No'}</p>
      <button onClick={handleSwap}>Swap ETH for AGL</button>
    </div>
  );
}
```

### 🔒 **Security Features**

#### **Access Control**
- Owner-only functions for critical operations
- Authorized agent creator system
- Treasury management controls

#### **Safety Mechanisms**
- Overflow/underflow protection
- Zero address checks
- Balance validation
- Emergency withdrawal function

#### **Audit Considerations**
- Standard ERC-20 implementation
- No complex mathematical operations
- Clear function visibility
- Event logging for transparency

### 📊 **Contract Events**

#### **Transfer Events**
```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

#### **Platform Events**
```solidity
event AgentCreated(address indexed creator, uint256 fee, uint256 agentId);
event TokensSwapped(address indexed user, uint256 algoAmount, uint256 aglAmount);
event TreasuryUpdated(address indexed newTreasury);
```

### 🌐 **Network Deployment**

#### **Testnet Deployment**
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: https://sepolia.infura.io/v3/YOUR_KEY
- **Explorer**: https://sepolia.etherscan.io/

#### **Mainnet Deployment**
- **Network**: Ethereum Mainnet
- **Chain ID**: 1
- **RPC**: https://mainnet.infura.io/v3/YOUR_KEY
- **Explorer**: https://etherscan.io/

### 📈 **Usage Analytics**

The contract tracks:
- Total agents created per user
- Total AGL spent on agent creation
- Swap volume and frequency
- Treasury balance and flows

### 🛠 **Development Tools**

#### **Testing**
```bash
# Run contract tests
npm test

# Coverage report
npm run coverage
```

#### **Verification**
```bash
# Verify on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### 📞 **Support**

For technical support or questions:
- GitHub Issues: [Repository Issues](https://github.com/your-repo/issues)
- Documentation: [Full Documentation](https://docs.chainagent.io)
- Discord: [Community Discord](https://discord.gg/chainagent)