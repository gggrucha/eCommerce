import loadTemplate from '../utils/loadTemplate.js';

export default class ComputingBox extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
    }
    //funkcja do zliczania produktów
    getAllProducts() {
        const productList = document.querySelector('product-list');
        if(!productList) return 0;
        return productList.shadowRoot.querySelectorAll('product-card').length;
    }
    //funkcja do wyświetlania ich na stronie
    render() 
    {
        const totalNum = this.shadowRoot.querySelector("#totalNum");
        totalNum.textContent = this.getAllProducts();
    }

    async connectedCallback() {
        const template = await loadTemplate('./components/counting-box.html');
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.render();
    }
}    
customElements.define('counting-box', ComputingBox); 
