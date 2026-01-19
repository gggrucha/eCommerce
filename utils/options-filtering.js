import '../components/product-list.js'
export class OptionsFiltering {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
    }

    reset() {
        const productList = document.querySelector('product-list')
        if(!productList) return 0;
        cardHolder = [];
    }
    sortFromHighestPrice() {

    }
    sortFromLowestPrice() {
        const cards = Array.from(this.shadowRoot.querySelectorAll('product-card'));
        cards.sort((a,b) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.pruce) || 0;
            return priceA - priceB;
        });
        cards.foreach(card => {
            this.shadowRoot.appendChild(card);
        })
    }
    showBestsellers() {
        allCards = document.shadowRoot.querySelectorAll('product-card');
        allCards.foreach(card => {
            if(card.querySelector('[slot="promo"]') == "Bestseller") {
                cardHolder.push(card);
            }
        })
        return this.cardHolder();
    }
    showNew() {
        reset();
        _products = document.shadowRoot.querySelectorAll('product-card');
        _products.foreach(card => {
            //element którego szukam = [!promo=""] promo różne od niczego
            const promoSlot = card.shadowRoot.querySelectorAll('[slot="promo"]');
            if (promoSlot.textContent.trim() == "Nowość") {
                cardHolder.push(card);
            }
        })
        return this.cardHolder();
    }
} 
customElements.define('options-filtering', OptionsFiltering);