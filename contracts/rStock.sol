// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";
import { Pausable } from "@openzeppelin/contracts/security/Pausable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title rStock
 * @author mrk1tty
 * @notice This contract uses gelato's functions to get market related updates and to make requests to Alpaca API to buy real world stock/commodities and mint the backed token on-chain.
 * @notice Also uses redstone pricefeed to get the pricing info.
 * @dev This contract is not audited or rigorously tested, just a prototype. Do not use in production.
 */

contract rStock is MainDemoConsumerBase, ERC20, Pausable {
    error rMarket_Insufficient_Funds();
    error rMarket_Insufficient_Tokens();
    event BuyRequest(uint256 amountOfStocks, address trader, uint256 value);
    event SellRequest(uint256 amountOfStocks, address trader, uint256 value);

    uint256 SLIPPAGE = 102;
    ERC20 public usdt;
    address gelato;

    mapping(address => uint256) public s_USDTBalance;

    modifier onlyGelato {
        require(msg.sender == gelato, "Not Authorized");
        _;
    }

    modifier whenMarketOpen {
        require(!paused(), "Market is Closed");
        _;
    }

    constructor(address _gelato, address _usdtAddr, string memory name, string memory symbol) ERC20(name, symbol) {
        usdt = ERC20(_usdtAddr);
        gelato = _gelato;
    }

    function depositUSDT(uint256 _amount) external {
        bool success = usdt.transferFrom(msg.sender, address(this), _amount);
        require(success, "TransferDeniedOrFailed");
        s_USDTBalance[msg.sender] += _amount;
    } // Updates mapping for balance of ERC20

    function buyRStock(uint256 _amountOfStocks) external whenMarketOpen {
        bytes32[] memory dataFeedIds = new bytes32[](2);
        dataFeedIds[0] = bytes32("AAPL");
        dataFeedIds[1] = bytes32("USDT");
        uint256[] memory values = getOracleNumericValuesFromTxMsg(dataFeedIds);
        uint256 stockValue = values[0];
        uint256 usdtValue = values[1];

        uint256 purchaseValue = (((stockValue*_amountOfStocks) / usdtValue) * SLIPPAGE) / 100;
        if(purchaseValue > s_USDTBalance[msg.sender]) {
            revert rMarket_Insufficient_Funds();
        }
        emit BuyRequest(_amountOfStocks, msg.sender, purchaseValue);
    } // checks amount of stock can be bought from price feed and calls functions

    function mintRStock(uint256 _amountOfStocks, address _trader, uint256 _value) external onlyGelato {
        s_USDTBalance[_trader] -= _value;
        _mint(_trader, _amountOfStocks*(10**18));
    } // Upon event of buyStock, mints the token for user

    function sellRStock(uint256 _amountOfStocks) external whenMarketOpen {
        bytes32[] memory dataFeedIds = new bytes32[](2);
        dataFeedIds[0] = bytes32("AAPL");
        dataFeedIds[1] = bytes32("USDT");
        uint256[] memory values = getOracleNumericValuesFromTxMsg(dataFeedIds);
        uint256 stockValue = values[0];
        uint256 usdtValue = values[1];

        if(balanceOf(msg.sender) < _amountOfStocks) {
            revert rMarket_Insufficient_Tokens();
        }

        uint256 sellValue = (stockValue*_amountOfStocks) / usdtValue;
        emit SellRequest(_amountOfStocks, msg.sender, sellValue);
    } // emits event to sell the stock, gelato.

    function burnRStock(uint256 _amountOfStocks, address _trader, uint256 _value) external onlyGelato {
        s_USDTBalance[_trader] += _value;
        _burn(_trader, _amountOfStocks*(10**18));
    } // burns erc and updates portfolio balance

    function withdrawUSDT(uint256 _withdrawalAmount) external {
        if(_withdrawalAmount > s_USDTBalance[msg.sender]) {
            revert rMarket_Insufficient_Funds();
        }
        s_USDTBalance[msg.sender] -= _withdrawalAmount;
        usdt.transfer(msg.sender, _withdrawalAmount);
    } // Withdraws the USDT affter selling

    function updateMarketData(bool _isOpen) external {
        if(_isOpen) {
            _unpause();
        }
        else {
            _pause();
        }
    } // can only trade if market is open.
}