var account;
var web3;

async function loadToken() {
   await $.getJSON("http://" + document.domain + ":" + location.port + "/token-abi", (data) => tokenabi = data);
   await $.getJSON("http://" + document.domain + ":" + location.port + "/swap-abi", (data) => swapabi = data);
   token = new web3.eth.Contract(tokenabi, "0x5843903E30812581BF99448d5D9C4ADB14EE2EBe");
   swap = new web3.eth.Contract(swapabi, "0x3CA472Be694df26d3c3e29a00d3afFc9B2B89D6F");
	let bal = await token.methods.balance(account).call();
    $(".bal").html(web3.utils.fromWei(bal.toString(), 'ether'))
	let eth_bal = await web3.eth.getBalance(account)
    $("#bnb_bal").html(web3.utils.fromWei(eth_bal.toString(), 'ether'))
	$("#buy_btn").prop("disabled", false)
	$("#buy_btn").html("Buy")
}
async function check_right_network() {
	const yourNetworkId = 97;
	let err;
	await web3.eth.net.getId().then((networkId) => {
			if (networkId != yourNetworkId) {
				alert("Network is wrong. Switch to SmartChain network.");
				err = true;
			}
		})
		.catch((err) => {alert("Unable to connect");err = true;});
	return err
}
async function connected_to_web3() {
	console.log("connected");
	const accounts = await web3.eth.getAccounts();
	account = accounts[0];
	$("#connect_btn").html(account);
	$("#wallet").val(account);
	loadToken()
	// $("#connect_btn").prop("disabled", true)
}
async function loadweb3() {
	if (window.ethereum) {
		web3 = window.web3 = new Web3(window.ethereum);
		err = check_right_network();
		if (err == true) return
		await window.ethereum.request({ method: "eth_requestAccounts" });
		connected_to_web3();
	}
	else {
		window.alert(
			"Wallet extension detected. You should consider trying MetaMask or Trust wallet!"
		);
	}
}
$("#connect_btn").click((e) => {
	web3 = window.web3 = undefined;
	loadweb3();
});

loadweb3();
