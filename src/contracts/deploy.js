const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

// Contract deployment configuration
const DEPLOYMENT_CONFIG = {
    // Ethereum Mainnet
    mainnet: {
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
        chainId: 1,
        gasPrice: '20000000000', // 20 gwei
    },
    // Ethereum Sepolia Testnet
    sepolia: {
        rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
        chainId: 11155111,
        gasPrice: '10000000000', // 10 gwei
    },
    // Local development
    local: {
        rpcUrl: 'http://localhost:8545',
        chainId: 1337,
        gasPrice: '20000000000',
    }
};

async function compileContract() {
    console.log('📝 Compiling AGL Token contract...');
    
    const contractSource = fs.readFileSync('./AGLToken.sol', 'utf8');
    
    const input = {
        language: 'Solidity',
        sources: {
            'AGLToken.sol': {
                content: contractSource,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };
    
    const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (compiled.errors) {
        compiled.errors.forEach(error => {
            console.error('❌ Compilation error:', error.formattedMessage);
        });
        if (compiled.errors.some(error => error.severity === 'error')) {
            throw new Error('Contract compilation failed');
        }
    }
    
    const contract = compiled.contracts['AGLToken.sol']['AGLToken'];
    console.log('✅ Contract compiled successfully');
    
    return {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object,
    };
}

async function deployContract(network = 'sepolia') {
    try {
        console.log(`🚀 Starting deployment to ${network}...`);
        
        const config = DEPLOYMENT_CONFIG[network];
        if (!config) {
            throw new Error(`Unknown network: ${network}`);
        }
        
        // Initialize Web3
        const web3 = new Web3(config.rpcUrl);
        
        // Compile contract
        const { abi, bytecode } = await compileContract();
        
        // Get deployer account (you'll need to set this up)
        const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('DEPLOYER_PRIVATE_KEY environment variable not set');
        }
        
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        
        console.log(`📍 Deploying from address: ${account.address}`);
        
        // Check balance
        const balance = await web3.eth.getBalance(account.address);
        console.log(`💰 Account balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
        
        // Create contract instance
        const contract = new web3.eth.Contract(abi);
        
        // Estimate gas
        const gasEstimate = await contract.deploy({
            data: '0x' + bytecode,
        }).estimateGas({ from: account.address });
        
        console.log(`⛽ Estimated gas: ${gasEstimate}`);
        
        // Deploy contract
        console.log('🔄 Deploying contract...');
        const deployedContract = await contract.deploy({
            data: '0x' + bytecode,
        }).send({
            from: account.address,
            gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer
            gasPrice: config.gasPrice,
        });
        
        console.log('🎉 Contract deployed successfully!');
        console.log(`📍 Contract address: ${deployedContract.options.address}`);
        console.log(`🔗 Transaction hash: ${deployedContract.transactionHash}`);
        
        // Save deployment info
        const deploymentInfo = {
            network,
            contractAddress: deployedContract.options.address,
            transactionHash: deployedContract.transactionHash,
            deployerAddress: account.address,
            timestamp: new Date().toISOString(),
            abi: abi,
        };
        
        fs.writeFileSync(
            `./deployment-${network}.json`,
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log(`💾 Deployment info saved to deployment-${network}.json`);
        
        return deploymentInfo;
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        throw error;
    }
}

// Export for use in other files
module.exports = {
    compileContract,
    deployContract,
    DEPLOYMENT_CONFIG,
};

// CLI usage
if (require.main === module) {
    const network = process.argv[2] || 'sepolia';
    deployContract(network)
        .then(() => {
            console.log('✅ Deployment completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Deployment failed:', error);
            process.exit(1);
        });
}