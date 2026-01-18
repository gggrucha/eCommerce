// app.js, aby zarządzać listą produktów, zarządza router.js 

import './components/shopping-cart.js';
import './components/product-list.js'; 
import './components/product-details.js';
import './components/counting-box.js';

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

//sortowanie
const sortSelect = document.querySelector('select#sortowanie');

sortSelect.addEventListener('change', () => {
    const list = document.querySelector('product-list');
    if (!list || !list._products) return;
    let sorted = [...productsData.products]; // kopia tablicy

    switch (sortSelect.value) {
    
        case "Od najniższej":
            sorted = sorted.sort((a, b) => a.price - b.price);
            break;

        case "Od najwyższej ceny":
            sorted.sort((a, b) => b.price - a.price);
            break;

        case "Nowości":
            // filtruje wyniki do promo z wartością "Nowość"
            sorted = sorted.filter(p=>p.promo === "Nowość");
            break;

        case "Bestsellery":
            
            sorted = sorted.filter(p=>p.promo === "Bestseller");
            break;

        default:
            // brak sortowania
            sorted = [...productsData.products];
        
    }

    list.products = sorted; // ponowne renderowanie listy
    countingBox.render(); //countingBox się aktualizuje
});

//sortowanie po kolorach
const colorSort = document.querySelector('select#kolor-sort');

colorSort.addEventListener('change', () => {
    const list = document.querySelector('product-list');
    if (!list || !list._products) return;
    let sorted = [...productsData.products]; // kopia tablicy

    switch (colorSort.value) {
    
        case "czerwony":
            sorted = sorted.filter(p=>
                p.colors && p.colors.some( c =>["czerwony", "czerwone","czerwona"].includes(c)));
            break;

        case "biały":
            sorted = sorted.filter(p =>
                p.colors && p.colors.some(c => ["biały","białe","biała"].includes(c))
            ); //nie zadziała bez przypisywania nowej wartości do tablicy sorted
            break;

        case "szary":
            sorted = sorted.filter(p =>
                p.colors && p.colors.some(c => ["szary","szare","szara"].includes(c))
            );
            break;

        case "czarny":
            sorted = sorted.filter(p =>
                p.colors && p.colors.some(c => ["czarny","czarne","czarna"].includes(c.toLowerCase()))
            );
            
            break;
        case "brązowy":
            sorted = sorted.filter(p =>
                p.colors && p.colors.some(c => ["brązowy","brązowa","brązowe"].includes(c))
            );
            break;

        case "purpurowy":
            sorted = sorted.filter(p=> 
                p.colors && p.colors.some(c=> ["purpurowy","purpurowe", "purpurowa"].includes(c))
            );
            break;

        case "niebieski":
            sorted = sorted.filter(p=> 
                p.colors && p.colors.some(c=> ["niebieski","niebieskie", "niebieska"].includes(c))
            );
            break;
        case "zielony":
            sorted = sorted.filter(p=> 
                p.colors && p.colors.some(c=> ["zielony","zielone","zielona"].includes(c))
            );
            break;
        case "granatowy":
            sorted = sorted.filter(p=> 
                p.colors && p.colors.some(c=> ["granatowy","granatowe","granatowa"].includes(c))
            );
            break;
         case "ze wzorem":
            sorted = sorted.filter(p=> 
                p.colors && p.colors.some(c=> ["ze wzorem"].includes(c))
            );
            break;

        default:
            // brak sortowania
            sorted = [...productsData.products];
        
    }

    list.products = sorted; // ponowne renderowanie listy
    countingBox.render(); //countingBox się aktualizuje
});
