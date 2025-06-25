// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract AGLToken is IERC20 {
    string public constant name = "Agent Algo";
    string public constant symbol = "AGL";
    uint8 public constant decimals = 18;
    uint256 private _totalSupply = 100000000 * 10**decimals; // 100 million tokens
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    address public owner;
    address public platformTreasury;
    
    // Platform specific variables
    uint256 public constant AGENT_CREATION_FEE = 1000 * 10**decimals; // 1000 AGL
    uint256 public constant ALGO_TO_AGL_RATE = 10; // 1 ALGO = 10 AGL
    
    mapping(address => bool) public authorizedAgentCreators;
    mapping(address => uint256) public userAgentCount;
    
    event AgentCreated(address indexed creator, uint256 fee, uint256 agentId);
    event TokensSwapped(address indexed user, uint256 algoAmount, uint256 aglAmount);
    event TreasuryUpdated(address indexed newTreasury);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedAgentCreators[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        platformTreasury = msg.sender;
        _balances[msg.sender] = _totalSupply;
        authorizedAgentCreators[msg.sender] = true;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }
    
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function allowance(address tokenOwner, address spender) public view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "Transfer amount exceeds allowance");
        
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, currentAllowance - amount);
        
        return true;
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "Transfer from zero address");
        require(recipient != address(0), "Transfer to zero address");
        require(_balances[sender] >= amount, "Transfer amount exceeds balance");
        
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }
    
    function _approve(address tokenOwner, address spender, uint256 amount) internal {
        require(tokenOwner != address(0), "Approve from zero address");
        require(spender != address(0), "Approve to zero address");
        
        _allowances[tokenOwner][spender] = amount;
        emit Approval(tokenOwner, spender, amount);
    }
    
    // Platform specific functions
    function swapETHForAGL() external payable {
        require(msg.value > 0, "Must send ETH to swap");
        
        // Calculate AGL amount (simplified rate: 1 ETH = 1000 AGL)
        uint256 aglAmount = msg.value * 1000;
        require(_balances[platformTreasury] >= aglAmount, "Insufficient AGL in treasury");
        
        _transfer(platformTreasury, msg.sender, aglAmount);
        
        // Send ETH to treasury
        payable(platformTreasury).transfer(msg.value);
        
        emit TokensSwapped(msg.sender, msg.value, aglAmount);
    }
    
    function createAgent(uint256 agentId) external {
        require(_balances[msg.sender] >= AGENT_CREATION_FEE, "Insufficient AGL balance");
        
        _transfer(msg.sender, platformTreasury, AGENT_CREATION_FEE);
        userAgentCount[msg.sender]++;
        
        emit AgentCreated(msg.sender, AGENT_CREATION_FEE, agentId);
    }
    
    function hasMinimumTokensForAgent(address user) external view returns (bool) {
        return _balances[user] >= AGENT_CREATION_FEE;
    }
    
    function getAgentCreationFee() external pure returns (uint256) {
        return AGENT_CREATION_FEE;
    }
    
    function getUserAgentCount(address user) external view returns (uint256) {
        return userAgentCount[user];
    }
    
    // Admin functions
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        platformTreasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }
    
    function authorizeAgentCreator(address creator) external onlyOwner {
        authorizedAgentCreators[creator] = true;
    }
    
    function revokeAgentCreator(address creator) external onlyOwner {
        authorizedAgentCreators[creator] = false;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Mint to zero address");
        _totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function burn(uint256 amount) external {
        require(_balances[msg.sender] >= amount, "Burn amount exceeds balance");
        _balances[msg.sender] -= amount;
        _totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    receive() external payable {
        swapETHForAGL();
    }
}