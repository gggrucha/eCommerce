// to jest skrypt, który odpowiada za obsługę użytkownika 

const userBtn = document.getElementById('user-button');
const dropdown = document.getElementById('user-dropdown');
const modal = document.getElementById('loginModal');
const closeBtn = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');

// Aktualizacja widoku menu (Zalogowany vs Niezalogowany)
function refreshUserMenu() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const userName = sessionStorage.getItem('userName') || 'Użytkownik';

    if (isLoggedIn) {
        dropdown.innerHTML = `
            <p style="color: green; font-size: 14px;">● Witaj, ${userName}</p>
            <hr>
            <button class="menu-item">Mój profil</button>
            <button id="go-to-orders" class="menu-item">Moje zamówienia</button>
            <button id="logoutBtn" style="color: red; margin-top: 10px; cursor: pointer;">Wyloguj się</button>
        `;
        document.getElementById('logoutBtn').onclick = () => {
            sessionStorage.removeItem('isLoggedIn');
            refreshUserMenu();
        };
    } else {
        dropdown.innerHTML = `
            <p style="color: gray; font-size: 14px;">Nie jesteś zalogowany</p>
            <button id="showLoginBtn" style="background: #007bff; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; width: 100%;">Zaloguj się teraz</button>
        `;
        document.getElementById('showLoginBtn').onclick = () => {
            modal.classList.add('active'); // Pokazuje okienko
            dropdown.classList.remove('show'); // Zamyka dropdown
        };
    }
}

// Kliknięcie w ikonkę profilu
userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
});

// Obsługa formularzu logowania (dane z pliku json)
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const uInp = document.getElementById('username').value;
    const pInp = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    try {
        const response = await fetch('hasla.json'); // lokalne dane z pliku json 
        
        if (!response.ok) {
            throw new Error('Nie udało się załadować bazy haseł');
        }

        const data = await response.json();
        const uzytkownicy = data.dane_uzytkownikow;

        const znalezionyUzytkownik = uzytkownicy.find(user => //szukanie użytkownika 
            user.nazwa === uInp && user.haslo === pInp
        );

        //zapisanie stanu logowania w sessionStorage
        if (znalezionyUzytkownik) {
            sessionStorage.setItem('isLoggedIn', 'true'); 
            sessionStorage.setItem('userName', znalezionyUzytkownik.nazwa);
            
            modal.classList.remove('active');
            refreshUserMenu();
            errorMsg.innerText = ""; // Czyści błędy
        } else {
            errorMsg.innerText = "złe dane logowania"; // jeden ogólny komunikat o błędzie niezależnie od tego co jest błędne
        }

    } catch (error) {
        console.error("Błąd podczas logowania:", error);
        errorMsg.innerText = "Błąd połączenia z bazą haseł";
    }
};

// Zamykanie okienka logowania (X lub klikniecie poza oknem)
closeBtn.onclick = () => modal.classList.remove('active');
window.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('active');
    if (!e.target.closest('.user-menu-wrapper')) dropdown.classList.remove('show');
};

refreshUserMenu(); // Inicjalizacja przy starcie