export class OrderSummary extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    render() {
        // Pobieramy dane bezpośrednio z localStorage
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

        this.shadowRoot.innerHTML = `
            <style>
                .summary-container { padding: 20px; font-family: sans-serif; }
                .item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
                .actions { margin-top: 20px; display: flex; gap: 10px; }
                .btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
                .btn-back { background: #6c757d; color: white; }
                .btn-final { background: #28a745; color: white; }
            </style>
            <div class="summary-container">
                <h1>Podsumowanie zamówienia</h1>
                <div class="items-list">
                    ${items.map(item => `
                        <div class="item">
                            <span>${item.name}</span>
                            <span>${item.price} PLN</span>
                        </div>
                    `).join('')}
                </div>
                <h2>Suma: ${total} PLN</h2>
                <div class="actions">
                    <button class="btn btn-back" id="back-btn">Cofnij do sklepu</button>
                    <button class="btn btn-final" id="final-btn">Finalizuj zamówienie</button>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('back-btn').onclick = () => {
            window.location.hash = '/'; // Powrót do sklepu bez kasowania koszyka (zostaje w localStorage)
        };

        this.shadowRoot.getElementById('final-btn').onclick = () => {
            this.dispatchEvent(new CustomEvent('finalize-order', {
                bubbles: true,
                composed: true,
                detail: { items, total, date: new Date().toLocaleString() }
            }));
        };
    }

    connectedCallback() {
        this.render();
    }
}

customElements.define('order-summary', OrderSummary);