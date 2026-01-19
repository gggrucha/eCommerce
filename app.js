// app.js, aby zarządzać listą produktów, zarządza router.js 

import './components/shopping-cart.js';
import './components/product-list.js'; 
import './components/product-details.js';
import './components/counting-box.js';
//import { applyAllFilters}  from './utils/applyFilters.js';
import { Router } from './router.js';
import productsData from './produkty.json' with { type: 'json' };

const outlet = document.querySelector('#router-outlet');
const cartComponent = document.querySelector('shopping-cart');
const countingBox = document.querySelector('counting-box');

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

function applyAllFilters() {
    const list = document.querySelector('product-list');
    if (!list || !productsData || !productsData.products) return;

    const selectedColor = document.querySelector('#kolor-sort').value;
    const selectedType = document.querySelector('#clothing-type').value;
    const selectedPricePromo = document.querySelector('#price-promo').value; // np. Nowości/Bestsellery
    const selectedSize = document.querySelector('#size').value;

    // kopia zapasowa wszystkich produktów
    let results = [...productsData.products];

    // filtr typu promocje (np. Nowości / Bestsellery)
    if (selectedPricePromo === "Nowości") {
        results = results.filter(p => p.promo === "Nowość");
    } else if (selectedPricePromo === "Bestsellery") {
        results = results.filter(p => p.promo === "Bestseller");
    } 

    // filtr koloru
    if (selectedColor && selectedColor !== "Sortowanie według koloru") {
        results = results.filter(p => p.colors && p.colors.includes(selectedColor));
    }

    // filtr typu ubrania
    if (selectedType && selectedType !== "Typ odzieży") {
        results = results.filter(p => p.type === selectedType);
    }
    //filtr rozmiar
    if (selectedSize && selectedSize !== "Rozmiar") {
        results = results.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }
    
    //sortowanie 
    if (selectedPricePromo === "Od najniższej") {
        results.sort((a, b) => a.price - b.price);
    } else if (selectedPricePromo === "Od najwyższej ceny") {
        results.sort((a, b) => b.price - a.price);
    }


    // wyświetlenie wyników
    list.products = results;
    countingBox.render();
}
//nasłuchiwanie elementu / rejestracja zdarzenia
document.querySelector('#kolor-sort').addEventListener('change', applyAllFilters);
document.querySelector('#clothing-type').addEventListener('change', applyAllFilters);
document.querySelector('#price-promo').addEventListener('change', applyAllFilters);
document.querySelector('#size').addEventListener('change', applyAllFilters);

//reset-btn
const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        document.querySelector('#kolor-sort').selectedIndex = 0;
        document.querySelector('#clothing-type').selectedIndex = 0;
        document.querySelector('#price-promo').selectedIndex = 0;
        document.querySelector('#size').selectedIndex = 0;
        const list = document.querySelector('product-list');
        if (!list || !productsData || !productsData.products) return;
        let results = [...productsData.products]
        list.products = results;

        countingBox.render();
    });
}



