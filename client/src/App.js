import React, { useState } from 'react';
import './App.css';
import { ethers } from "ethers";
import PreciousChickenToken from "./contracts/PreciousChickenToken.json";
import { Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress ='0x7fB9049f6600Be18182de8dc8873559F19D8eFB7';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const erc20 = new ethers.Contract(contractAddress, PreciousChickenToken.abi, signer);

function App() {
	const [walAddress, setWaladdress] = useState("0x00");
	const [pccBal, setPccbal] = useState(0);
	const [ethBal, setEthbal] = useState(0);
	const [coinsymbol, setCoinsymbol] = useState("Nil");
	const [transAmount, setTransAmount] = useState('0');
	const [pendingFrom, setPendingfrom] = useState('0x00');
	const [pendingTo, setPendingto] = useState('0x00');
	const [pendingAmount, setPendingAmount] = useState('0');
	const [isPending, setIspending] = useState(false);
	const [errMsg, setErrmsg] = useState("Transaction failed!");
	const [isError, setIserror] = useState(false);

	const PendingAlert = () => {
		if (!isPending) return null;
		return (
			<Alert key="pending" variant="info">
			Blockchain event notification: transaction of {pendingAmount} Eth from <br /> {pendingFrom} <br /> to <br /> {pendingTo}.
			</Alert>
		);
	};
	const ErrorAlert = () => {
		if (!isError) return null;
		return (
			<Alert key="error" variant="danger">{errMsg}</Alert>
		);
	};

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
		let amount = await ethers.utils.parseEther(transAmount.toString());
		try {
			await erc20.buyToken(transAmount, {value: amount});
			await erc20.on("PCTBuyEvent", (from, to, amount) => {
				setPendingfrom(from.toString());
				setPendingto(to.toString());
				setPendingAmount(amount.toString());
				setIspending(true);
			})
		} catch(err) {
			if(typeof err.data !== 'undefined') {
				setErrmsg("Error: "+ err.data.message);
			} 
			setIserror(true);
		} 	
	}

	async function sellPCT() {
		try {
			await erc20.sellToken(transAmount);
			await erc20.on("PCTSellEvent", (from, to, amount) => {
				setPendingfrom(from.toString());
				setPendingto(to.toString());
				setPendingAmount(amount.toString());
				setIspending(true);
			})
		} catch(err) {
			if(typeof err.data !== 'undefined') {
				setErrmsg("Error: "+ err.data.message);
			} 
			setIserror(true);
		} 
	}

	function valueChange(value) {
		setTransAmount(value);
		setIspending(false);
		setIserror(false);
	}

	const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
		setIspending(false);
		setIserror(false);
		buyPCT();
  };

	const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
		setIspending(false);
		setIserror(false);
		sellPCT();
  };

	return (
		<div className="App">
		<header className="App-header">
		<ErrorAlert />
		<PendingAlert />
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/512px-Ethereum-icon-purple.svg.png" className="App-logo" alt="Ethereum logo" />
		<h2>{coinsymbol}</h2>
		<p>
		User Wallet address: {walAddress}<br/>
		Eth held: {ethBal}<br />
		PCT held: {pccBal}<br />
		</p>
		<form onSubmit={handleBuySubmit}>
		<p>
		<label htmlFor="buypct">PCT to buy:</label>
		<input type="number" step="1" min="0" id="buypct" name="buypct" onChange={e => valueChange(e.target.value)} required style={{margin:'12px'}}/>	
		<Button type="submit" >Buy PCT</Button>
		</p>
		</form>
		<form onSubmit={handleSellSubmit}>
		<p>
		<label htmlFor="sellpct">PCT to sell:</label>
		<input type="number" step="1" min="0" id="sellpct" name="sellpct" onChange={e => valueChange(e.target.value)} required style={{margin:'12px'}}/>	
		<Button type="submit" >Sell PCT</Button>
		</p>
		</form>

<a  title="GitR0n1n / CC BY-SA (https://creativecommons.org/licenses/by-sa/4.0)" href="https://commons.wikimedia.org/wiki/File:Ethereum-icon-purple.svg"><span style={{fontSize:'12px',color:'grey'}}>Ethereum logo by GitRon1n</span></a>
		</header>
		</div>
	);
}

export default App;

