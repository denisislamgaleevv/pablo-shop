import React, {useState} from 'react';
import './ProductList.css';
import {ProductItem} from "./ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
  {id: '1', title: 'Пополнение Steam', price: 100, description: 'На ваш профиль в Steam. Цену уточняйтеу продавца!!!', img: 'https://steam-account.ru/img/product/s/steam-wallet-buy/phpXnHVs1.jpg'},
  {id: '2', title: 'Игры Гифтом для России', price: 10, description: 'Для покупки вы должны быть в России или скачайте Впн!! Цену обговаривать у продавца!!!', img: 'https://3dnews.ru/assets/external/illustrations/2023/07/27/1090623/2.jpg'},
  {id: '3', title: 'Пополнение UC Пабг', price: 90, description: 'Цену уточнять у продавца!!!', img: 'https://static8.tgstat.ru/channels/_0/d6/d6218c579e126b9e1cdbff9c6cec001f.jpg'},
  {id: '4', title: 'Ключ для Майнкрафт', price: 2600, description: 'Ключ на ваш профиль! Игра будеть полностью ваша!Удачи', img:'https://ggsel.net/_next/image?url=https%3A%2F%2Fimg.ggsel.ru%2F3931204%2Foriginal%2F250x250%2Fp1_3931204_129c0713.webp&w=640&q=75'}
]


const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

export const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);

    const {tg, queryId, onClose} = useTelegram();

    const onSendData = useCallback(() => {
        
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
            tg.onClose()
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
            <div class = 'rev'>
            <h1>Отзывы:</h1>
             <a href = 'https://t.me/+b_BbA3d1s_U1OThi'>Опубликовать свой отзыв!!</a>  
             
            </div>
            
        </div>
    );
};
 