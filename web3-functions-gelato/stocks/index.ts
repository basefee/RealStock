import { Web3Function } from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import ky from "ky";

const abi = [
  `event BuyRequest(uint256 amountOfStocks, address trader, uint256 value)`,
  `function mintRStock(uint256 _amoutnOfStocks, address _trader, uint256 _value) external`,
  `event SellRequest(uint256 amountOfStocks, address trader, uint256 value)`,
  `function burnRStock(uint256 _amountOfStocks, address _trader, uint256 _value) external`,
];

Web3Function.onRun(async (context) => {
  const { log, multiChainProvider } = context;
  const provider = multiChainProvider.default();
  const contractAddr = "0xDD7e4D53570E998446576C1FFb3c53D2E9b5139f";
  const rMarket = new Contract(contractAddr, abi, provider);
  const rMarketInterface = new Interface(abi);

  const alpacaKey = "PK04ZU0BUN9HS5KYJ76I";
  const alpacaSecret = "r3tgc4lCjPclWlzVF70aQ5Gw5iPMSJBV8fBK2rVL";

  const description = rMarketInterface.parseLog(log);
  const { amountOfStocks, trader, value } = description.args;

  const url = "https://paper-api.alpaca.markets/v2/orders";
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "APCA-API-KEY-ID": alpacaKey,
    "APCA-API-SECRET-KEY": alpacaSecret,
  };

  if (description.name === "BuyRequest") {
    const data = {
      side: "buy",
      type: "market",
      time_in_force: "gtc",
      symbol: "SPY",
      qty: amountOfStocks.toString(),
    };

    const response = await ky.post(url, { headers, json: data }).json();
    await sleep(1e3);

    const filledResponse = await ky.get(url + `/${response.id}`, { headers }).json();
    const amount = Number(filledResponse.filled_qty) || 0;
    const avgPrice = Number(filledResponse.filled_avg_price) || 0;
    const purchaseValue = avgPrice * amount;

    return {
      canExec: true,
      callData: [
        {
          to: contractAddr,
          data: rMarket.interface.encodeFunctionData("mintRStock", [
            amount,
            trader,
            purchaseValue,
          ]),
        },
      ],
    };
  } else if (description.name === "SellRequest") {
    const data = {
      side: "sell",
      type: "market",
      time_in_force: "gtc",
      symbol: "SPY",
      qty: amountOfStocks.toString(),
    };

    const response = await ky.post(url, { headers, json: data }).json();
    await sleep(1e3);

    const filledResponse = await ky.get(url + `/${response.id}`, { headers }).json();
    const amount = Number(filledResponse.filled_qty) || 0;
    const avgPrice = Number(filledResponse.filled_avg_price) || 0;
    const sellValue = avgPrice * amount;

    return {
      canExec: true,
      callData: [
        {
          to: contractAddr,
          data: rMarket.interface.encodeFunctionData("burnRStock", [
            amount,
            trader,
            sellValue,
          ]),
        },
      ],
    };
  } else {
    throw new Error("Unexpected");
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
