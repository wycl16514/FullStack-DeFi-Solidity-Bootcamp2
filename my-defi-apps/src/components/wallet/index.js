import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers-v5"
export const ETHEREM_NETWORK_ID = 1
export const SEPOLIA_NETWORK_ID = 11155111
export const LOCAL_NETWORK_ID = 31337

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
        ETHEREM_NETWORK_ID,
        SEPOLIA_NETWORK_ID,
        LOCAL_NETWORK_ID,
    ]
})

export const getLibrary = (provider) => {
    return new Web3Provider(provider)
}

export const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_LOCAL_RPC_URL)