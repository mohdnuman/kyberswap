const Web3 = require("web3");

const Abi = require("./abi.json");
const abi2 = require("./abi2.json");
const erc20 = require("./erc20.json");

const secondAbi=require("./secondAbi.json");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

async function getBalance(address, pid) {
  const contract = "0x31De05f28568e3d3D612BFA6A78B356676367470";

  const Instance = new web3.eth.Contract(Abi, contract);

  let userInfo = await Instance.methods.getUserInfo(pid, address).call();
  let LPtokensRecieved = userInfo.amount;

  let rewards = await Instance.methods.pendingRewards(pid, address).call();
  rewards=(rewards/10**18).toFixed(2);

  let poolInfo = await Instance.methods.getPoolInfo(pid).call();
  let LPtoken = poolInfo.stakeToken;

  const LPinstance = new web3.eth.Contract(abi2, LPtoken);

  let LPtotalSupply = await LPinstance.methods.totalSupply().call();
  let reserves = await LPinstance.methods.getReserves().call();
  let token0 = await LPinstance.methods.token0().call();
  let token1 = await LPinstance.methods.token1().call();

  const token0instance = new web3.eth.Contract(erc20, token0);
  const token1instance = new web3.eth.Contract(erc20, token1);

  let symbol0 = await token0instance.methods.symbol().call();
  let symbol1 = await token1instance.methods.symbol().call();
  let decimals0 = await token0instance.methods.decimals().call();
  let decimals1 = await token1instance.methods.decimals().call();

  let token0amount=(LPtokensRecieved/LPtotalSupply*(reserves[0]/10**decimals0)).toFixed(2);
  let token1amount=(LPtokensRecieved/LPtotalSupply*(reserves[1]/10**decimals1)).toFixed(2);

  if(token0amount!=0 && token1amount!=0){
    console.log(symbol0,'+',symbol1,token0amount,'+',token1amount);
    console.log(rewards,"KNC");
  }

}


async function getBalance2(address, pid) {
  const contract = "0x833e4083B7ae46CeA85695c4f7ed25CDAd8886dE";

  const Instance = new web3.eth.Contract(secondAbi, contract);

  let LPtoken= await Instance.methods.allPools(pid).call();

  const LPinstance = new web3.eth.Contract(abi2, LPtoken);

  let LPtokensRecieved=await LPinstance.methods.balanceOf(address).call();

  let LPtotalSupply = await LPinstance.methods.totalSupply().call();
  let reserves = await LPinstance.methods.getReserves().call();
  let token0 = await LPinstance.methods.token0().call();
  let token1 = await LPinstance.methods.token1().call();

  const token0instance = new web3.eth.Contract(erc20, token0);
  const token1instance = new web3.eth.Contract(erc20, token1);

  let symbol0 = await token0instance.methods.symbol().call();
  let symbol1 = await token1instance.methods.symbol().call();
  let decimals0 = await token0instance.methods.decimals().call();
  let decimals1 = await token1instance.methods.decimals().call();

  let token0amount=(LPtokensRecieved/LPtotalSupply*(reserves[0]/10**decimals0)).toFixed(2);
  let token1amount=(LPtokensRecieved/LPtotalSupply*(reserves[1]/10**decimals1)).toFixed(2);

  if(token0amount!=0 && token1amount!=0){
    console.log(symbol0,'+',symbol1,token0amount,'+',token1amount);
  }

}

let address = "0x454208f71ebc2454cdb6c6e35f66d583548f86b0";
// getBalance(address,5);  //poolLength=7
getBalance2(address,3)
