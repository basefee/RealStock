import {
    Web3Function,
    Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "@ethersproject/contracts";
import ky from "ky";

const abi = ["function updateMarketData(bool _isOpen) external"];

interface MarketResponse {
    is_open: boolean,
}

Web3Function.onRun(async (context: Web3FunctionContext) => {
    const { multiChainProvider } = context;
    const provider = multiChainProvider.default();
    const alpacaKey = await context.secrets.get("ALPACA_KEYS");
    const alpacaSecret = await context.secrets.get("ALPACA_SECRET");
  

    const contractAddr = "0xc74E6d979CE9004FF8D92f6F0ea0654dF2E52e42";
    const contract = new Contract(contractAddr, abi, provider);

    const marketUrl = "https://paper-api.alpaca.markets/v2/clock";
    const headers = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'APCA-API-KEY-ID': alpacaKey,
        'APCA-API-SECRET-KEY': alpacaSecret
    };

    const marketRespone = await ky.get(marketUrl, { headers: headers }).json<MarketResponse>();
    const open = marketRespone.is_open;

    return {
        canExec: true,
        callData: [{to: contractAddr, data: contract.interface.encodeFunctionData("updateMarketData", [open]),},],
    };

});