// Nasłuchuje zmian w historii przeglądarki.
// Czyści <main>.
// Wstawia odpowiedni komponent w zależności od adresu URL.

// router.js

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.outlet = document.querySelector('#router-outlet');
        
        // Odpala się, gdy zachodzi zmiana 
        window.addEventListener('hashchange', () => this.render());

        // Oodświeżenie strony (load)
        window.addEventListener('load', () => this.render());   
        
        // Obsługa kliknięć w linki z atrybutem data-link
        document.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });

        // Pierwsze renderowanie po wejściu na stronę
        this.render();
    }

    navigate(path) {
        // Zmiana URL bez przeładowania (History API)
        // window.history.pushState({}, "", path);
        window.location.hash = path;
        // this.render();
    }

    // render() {
    //     const path = window.location.pathname;
    //     const searchParams = new URLSearchParams(window.location.search);
        
    //     // Czyścimy widok
    //     this.outlet.innerHTML = '';

    //     // Prosta logika routingu
    //     if (path === '/' || path === '/index.html') {
    //         // STRONA GŁÓWNA
    //         const view = document.createElement(this.routes['/']);
    //         this.outlet.appendChild(view);
    //     } 
    //     else if (path === '/product') {
    //         // STRONA PRODUKTU
    //         const id = searchParams.get('id'); // Pobieramy ?id=1
    //         const view = document.createElement(this.routes['/product']);
    //         view.setAttribute('product-id', id); // Przekazujemy ID do komponentu
    //         this.outlet.appendChild(view);
    //     } 
    //     else {
    //         this.outlet.innerHTML = '<h1>404 - Nie znaleziono</h1>';
    //     }
    // }

    render() {
        // Pobieramy "ścieżkę" z hasha. 
        // Np. dla "http://site.com/#/product?id=1", hash to "#/product?id=1"
        // Usuwamy pierwszy znak '#' za pomocą slice(1)
        let hash = window.location.hash.slice(1);
        
        // Jeśli hash jest pusty (wejście na stronę główną), ustawiamy '/'
        if (!hash) hash = '/';

        // Rozdzielamy ścieżkę od parametrów (np. "/product" od "?id=1")
        const [path, queryString] = hash.split('?');
        const searchParams = new URLSearchParams(queryString);

        // Czyścimy widok
        this.outlet.innerHTML = '';

        // Logika routingu
        // Sprawdzamy czy mamy trasę dla danej ścieżki
        const viewName = this.routes[path];

        if (viewName) {
            const view = document.createElement(viewName);
            
            // Jeśli są parametry (np. id), przekazujemy je do komponentu
            if (searchParams.has('id')) {
                view.setAttribute('product-id', searchParams.get('id'));
            }
            
            this.outlet.appendChild(view);
        } else {
            // Fallback na stronę główną lub 404
            if (path === '/') {
                 // Jeśli w routes['/'] masz zdefiniowany komponent:
                 const homeView = document.createElement(this.routes['/']);
                 this.outlet.appendChild(homeView);
            } else {
                this.outlet.innerHTML = '<h1>404 - Nie znaleziono</h1><a href="#/">Wróć</a>';
            }
        }
    }
}