import { useState, useEffect } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
    const [fromCurrency, setFromCurrency] = useState('UAH');
    const [toCurrency, setToCurrency] = useState('UAH');
    const [fromPrice, setFromPrice] = useState(0);
    const [toPrice, setToPrice] = useState(0);

    const [rates, setRates] = useState([]);

    useEffect(() => {
        fetch(
            'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
        )
            .then((res) => res.json())
            .then((json) => {
                setRates(json);
            })
            .catch((err) => {
                console.warn(err);
                alert('Failed to get information');
            });
    }, []);

    const currency = Object.fromEntries(rates.map((el) => [el.cc, el.rate]));
    currency.UAH = 1;

    const onChangeFromPrice = (value) => {
        const result = (value * currency[fromCurrency]) / currency[toCurrency];
        setToPrice(Math.round(result * 100) / 100);
        setFromPrice(value);
    };

    const onChangeToPrice = (value) => {
        const result = (value * currency[toCurrency]) / currency[fromCurrency];
        setToPrice(value);
        setFromPrice(Math.round(result * 100) / 100);
    };

    useEffect(() => {
        onChangeFromPrice(fromPrice);
    }, [fromCurrency]);

	useEffect(() => {
        onChangeToPrice(toPrice);
    }, [toCurrency]);

    return (
        <div className='App'>
            <Block
                value={fromPrice}
                currency={fromCurrency}
                onChangeCurrency={setFromCurrency}
                onChangeValue={onChangeFromPrice}
            />
            <Block
                value={toPrice}
                currency={toCurrency}
                onChangeCurrency={setToCurrency}
                onChangeValue={onChangeToPrice}
            />
        </div>
    );
}

export default App;
