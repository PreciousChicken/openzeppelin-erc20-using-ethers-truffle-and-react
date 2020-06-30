import React, { useState } from 'react';
import './App.css';
import { ethers } from "ethers";
import PreciousChickenToken from "./contracts/PreciousChickenToken.json";

// const walletAddress = "0x92eBD1E9CbA8a1f0AF5B878f0Bb1E48C5B8Abd2A";
const contractAddress ='0x768341C4A2887eC614e8532d1363a1968766E3d2';

const provider = new ethers.providers.Web3Provider(window.ethereum);
// JDH - Address of contract got by running app.address at truffle console once added to instance.
// const erc20 = new ethers.Contract(contractAddress, PreciousChickenToken.abi, provider);
const signer = provider.getSigner();
const erc20 = new ethers.Contract(contractAddress, PreciousChickenToken.abi, signer);

function App() {
	const [walAddress, setWaladdress] = useState("0x00");
	const [pccBal, setPccbal] = useState(0);
	const [ethBal, setEthbal] = useState(0);
	const [coinsymbol, setCoinsymbol] = useState("Nil");
	const [buyinput, setBuyInput] = useState('0');

	signer.getAddress().then(response => {
		setWaladdress(response);
		return erc20.balanceOf(response);
	}).then(balance => {
		setPccbal(balance.toString())
	});

	signer.getAddress().then(response => {
		return provider.getBalance(response);
	}).then(balance => {
		let formattedBalance = ethers.utils.formatUnits(balance, 18);
		setEthbal(formattedBalance.toString())
	});

	async function getSymbol() {
		let symbol = await erc20.symbol();
		return symbol;
	}
	let symbol = getSymbol();
	symbol.then(x => setCoinsymbol(x.toString()));

	async function buyPCT() {
		let amount = await ethers.utils.parseEther(buyinput.toString());
		let result = await erc20.buyToken(buyinput, {value: amount});
		console.log("Buying PCT?", result);
	}
	

	return (
		<div className="App">
		<header className="App-header">
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/512px-Ethereum-icon-purple.svg.png" className="App-logo" alt="Ethereum logo" />
		<h2>{coinsymbol}</h2>
		<p>
		User Wallet address: {walAddress}<br/>
		Eth held: {ethBal}<br />
		PCT held: {pccBal}<br />
		</p>
		<form onSubmit={buyPCT}>
		<p>
		<label htmlFor="buypct">PCT to buy:</label>
		<input type="number" id="buypct" name="buypct" value={buyinput} onChange={e => setBuyInput(e.target.value)} required />	
		<button type="button" onClick={buyPCT}>Buy PCT</button>
		</p>
		</form>
		<p>
		<label htmlFor="sellpct">PCT to sell:</label>
		<input type="number" id="sellpct" name="buypct" required />	
		<button type="button">Sell PCT</button>
		</p>

<a  title="GitR0n1n / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)" href="https://commons.wikimedia.org/wiki/File:Ethereum-icon-purple.svg"><span style={{fontSize:'12px',color:'grey'}}>Ethereum logo by GitRon1n</span></a>
		</header>
		</div>
	);
}

export default App;

// <a title="GitR0n1n / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)" href="https://commons.wikimedia.org/wiki/File:Ethereum-icon-purple.svg"><img width="512" alt="Ethereum-icon-purple" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/512px-Ethereum-icon-purple.svg.png"></a>
