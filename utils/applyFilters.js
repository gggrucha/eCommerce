export function applyAllFilters() {
    const list = document.querySelector('product-list');
    if (!list || !productsData || !productsData.products) return;

    const selectedColor = document.querySelector('#kolor-sort').value;
    const selectedType = document.querySelector('#clothing-type').value;
    const selectedPricePromo = document.querySelector('#price-promo').value; // np. Nowości/Bestsellery
    

    // kopia zapasowa wszystkich produktów
    let results = [...productsData.products];

    // filtr koloru
    if (selectedColor && selectedColor !== "Sortowanie według koloru") {
        results = results.filter(p => p.colors && p.colors.includes(selectedColor));
    }

    // filtr typu ubrania
    if (selectedType && selectedType !== "Typ odzieży") {
        results = results.filter(p => p.type === selectedType);
    }

    // filtr typu promocje (np. Nowości / Bestsellery) i sortowanie ceny
    if (selectedPricePromo === "Nowości") {
        results = results.filter(p => p.promo === "Nowość");
    } else if (selectedPricePromo === "Bestsellery") {
        results = results.filter(p => p.promo === "Bestseller");
    }  
    if (selectedPricePromo === "Od najniższej") {
        results.sort((a, b) => a.price - b.price);
    } else if (selectedPricePromo === "Od najwyższej ceny") {
        results.sort((a, b) => b.price - a.price);
    }

    // wyświetlenie wyników
    list.products = results;
    countingBox.render();
}