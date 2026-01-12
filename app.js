// app.js, aby zarządzać listą produktów, zarządza router.js 

import './components/shopping-cart.js';
import './components/product-list.js'; 
import './components/product-details.js';
import { Router } from './router.js';
import productsData from './produkty.json' with { type: 'json' };

const outlet = document.querySelector('#router-outlet');
const cartComponent = document.querySelector('shopping-cart');

const listComponent = document.querySelector('product-list');
// const cartComponent = document.querySelector('shopping-cart');

if (!outlet) {
    console.error("BŁĄD KRYTYCZNY: Nie znaleziono <main id='router-outlet'> w index.html");
} //działa więc się nic nie printuje

// Używamy MutationObserver, żeby wykryć, kiedy <product-list> pojawi się w DOM
const observer = new MutationObserver((mutations) => {
    const list = outlet.querySelector('product-list');
    if (list && !list.products) {
        console.log("Wykryto listę produktów! Wstrzykuję dane...");
        list.products = productsData.products;
    }
    else {
        console.log("nie wykryto żadnych produktów")
    }
});

if (outlet) {
    console.log("siema")
    observer.observe(outlet, { childList: true, subtree: true });
}

//Konfiguracja tras
const routes = {
    '/': 'product-list',
    // '/index.html': 'product-list', //
    '/product': 'product-details'
};

//Start routera
const router = new Router(routes);

//Obsługa kliknięcia w kartę
document.addEventListener('navigate-to-product', (e) => {
    const productId = e.detail.id;
    // Używamy metody routera do zmiany strony
    router.navigate(`/product?id=${productId}`);
});

if (listComponent) {
    listComponent.products = productsData.products;
}

document.addEventListener('added-to-cart', (e) => { // Lista -> Koszyk
    const productToAdd = e.detail;
    
    if (cartComponent) {
        cartComponent.addItem(productToAdd);
    }
});