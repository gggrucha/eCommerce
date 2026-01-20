// historia zamówień z localStorage

export class OrderHistory extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const userName = sessionStorage.getItem('userName');
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        // historia pobierana z localStorage
        const storageKey = isLoggedIn ? `orderHistory_${userName}` : null;
        const history = storageKey ? (JSON.parse(localStorage.getItem(storageKey)) || []) : [];

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; padding: 20px; font-family: 'Segoe UI', sans-serif; }
                h1 { border-bottom: 2px solid #1d3557; padding-bottom: 10px; color: #1d3557; }
                .order-card { 
                    background: #f8f9fa; 
                    border: 1px solid #dee2e6; 
                    border-radius: 8px; 
                    padding: 15px; 
                    margin-bottom: 15px; 
                }
                .order-header { display: flex; justify-content: space-between; font-weight: bold; color: #457b9d; }
                .order-items { margin-top: 10px; font-size: 0.9rem; color: #333; }
                .total { text-align: right; font-weight: bold; margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px; }
                .no-orders { text-align: center; color: #888; font-style: italic; }
            </style>
            
            <h1>Moje Zamówienia ${isLoggedIn ? `- ${userName}` : ''}</h1>
            <div id="history-container">
                ${!isLoggedIn 
                    ? '<p class="login-warning">Zaloguj się, aby zobaczyć swoją historię zamówień.</p>'
                    : history.length === 0 
                        ? '<p class="no-orders">Nie masz jeszcze żadnych zamówień.</p>' 
                        : history.reverse().map((order, index) => `
                            <div class="order-card">
                                <div class="order-header">
                                    <span>Zamówienie #${history.length - index}</span>
                                    <span>${order.date}</span>
                                </div>
                                <div class="order-items">
                                    ${order.items.map(item => `<div>• ${item.name} (${parseFloat(item.price).toFixed(2)} PLN)</div>`).join('')}
                                </div>
                                <div class="total">Suma: ${parseFloat(order.total).toFixed(2)} PLN</div>
                            </div>
                        `).join('')
                }
            </div>
            <button id="back-home">← Wróć do sklepu</button>
        `;

        this.shadowRoot.getElementById('back-home').onclick = () => {
            window.location.hash = '/'; // Powrót przez router
        };
    }
}

customElements.define('order-history', OrderHistory);