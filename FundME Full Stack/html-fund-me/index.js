import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;
const fundButton = document.getElementById("fundButton");
fundButton.onclick = fund;
const balanceButton = document.getElementById("balanceButton");
balanceButton.onclick = getBalance;
const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;

async function connect() {
  if (window.ethereum !== undefined) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Install MetaMask";
  }
}

async function getBalance() {
    if(typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(contractAddress)
        
        console.log(ethers.formatEther(balance));
    }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}`);
  if (window.ethereum !== undefined) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const singer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, singer);

    try {
      const transtionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      });

       await lisentForTranscationMined(transtionResponse, provider);
       console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

function lisentForTranscationMined(transtionResponse, provider) {
  console.log(`Mining ${transtionResponse.hash}...`);

    return new Promise((resolve, reject) => {
      provider.once(transtionResponse.hash, async (transtionReceipt) => {
        await transtionResponse.wait(1)
        console.log(
          `Completed with ${await transtionReceipt.confirmations()} confirmations`
        );
        resolve();
      });
    });
}

async function withdraw() {
    console.log("Withdrawing.....");
    if(typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const singer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, singer);

        try {
            const transtionResponse = await contract.withdraw();
            await lisentForTranscationMined(transtionResponse, provider);
        } catch (error) {
            console.log(error);
        }
    }
}
