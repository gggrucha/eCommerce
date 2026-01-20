//po atrybucie szuka produktu w pliku produkty.json i bez przeładowania strony podmienia kompontent do pliku index.html
import './comp.js'; 
import productsData from '../produkty.json' with { type: 'json' };
import commentsData from '../komentarze.json' with { type: 'json' };

export class ProductDetails extends HTMLElement {
    static get observedAttributes() {
        return ['product-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'product-id' && newValue) {
            this.render(newValue);
        }
    }

    render(id) {
        // konwersja id na liczbę/string zależnie od JSON
        const product = productsData.products.find(p => p.id == id);

        if (!product) {
            this.innerHTML = "<h2>Produkt nie istnieje</h2>";
            return;
        }

        // Jeśli dla danego ID nie ma komentarzy, przypisujemy pustą tablicę [].
        const productComments = commentsData[id] || [];

        this.innerHTML = `
            <style>
                .details-container { padding: 20px; background: white; border-radius: 8px; }
                .details-img { max-width: 100%; height: 400px; object-fit: contain; }
                .back-btn { display: inline-block; margin-bottom: 20px; text-decoration: underline; cursor: pointer; color: blue; }
                button.add-btn {
                    margin-top: auto; /* Dopycha przycisk do dołu */
                    width: 100%;
                    padding: 15px;
                    border: none;
                    background-color: #1d3557;
                    color: white;
                    font-weight: 600;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                button.add-btn:hover {
                    background-color: #457b9d;
                }
                
                button.add-btn:active {
                    transform: scale(0.98);
                }
            </style>
            
            <div class="details-container">
                <a class="back-btn" data-link href="/">← Wróć do listy</a>
                <h1>${product.name}</h1>
                <img class="details-img" src="${product.image}" alt="${product.name}">
                <p>${product.description || "Brak dodatkowego opisu."}</p>
                <h3>Cena: ${product.price} PLN</h3>
                
                <button id="add-btn" class="add-btn">Dodaj do koszyka</button>

                <div class="comments-section" style="margin-top: 30px;">
                    <h3>Komentarze:</h3>
                    ${productComments.length > 0 
                        ? productComments.map(c => `
                            <div class="comment-item">
                                <strong>${c.uzytkownik}:</strong> ${c.tresc}
                            </div>
                        `).join('') 
                        : "<p>Brak komentarzy dla tego produktu.</p>"}
                </div>
            </div>
        `;

        // Obsługa dodawania do koszyka z widoku szczegółów
        this.querySelector('#add-btn').addEventListener('click', () => {
             this.dispatchEvent(new CustomEvent('added-to-cart', {
                bubbles: true,
                composed: true,
                detail: { name: product.name, price: product.price }
            }));
        });
    }
}

customElements.define('product-details', ProductDetails);