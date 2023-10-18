import { useState, useEffect, useCallback } from "react";

import { getSymbols, findByValue } from "../utils";
import { CRYPTOCURRENCIES } from "../configs";

export const useTicker = () => {
    const [cryptocurrencies, setCryptocurrencies] = useState(CRYPTOCURRENCIES);

    const fetchCrypto = useCallback(async () => {
        try {
            //getSymbols will return all the symbols from the CRYPTOCURRENCIES array
            const response = await fetch(
                `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(
                    getSymbols(),
                )}`,
            );
            const data = await response.json();
            setCryptocurrencies(
                cryptocurrencies.map((i) => {
                    const { lastPrice, lowPrice, highPrice } = findByValue(data, i.symbol) || {};
                    return {
                        ...i,
                        price: lastPrice,
                        lowPrice,
                        highPrice,
                        prevPrice: i?.price || 0,
                    };
                }),
            );
        } catch (error) {
            console.log(error);
        }
    }, [cryptocurrencies]);

    useEffect(() => {
        const interval = setInterval(fetchCrypto, 5000);
        return () => clearInterval(interval);
    }, [fetchCrypto]);
    return cryptocurrencies;
};
