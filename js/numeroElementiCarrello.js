const SUPABASE_URL = 'https://jucapwtfcqmxucioudgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1Y2Fwd3RmY3FteHVjaW91ZGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTMxMjMsImV4cCI6MjA3ODk2OTEyM30.9WgxXKZNB33wKQH4hNJ4o3bucxkgGHpBXoXyWdea2GQ';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const cartCountSpan = document.querySelector("#cart-count");

async function aggiornaContatoreCarrello() {
    try {
        // CHIAMATA MIGRATE A SUPABASE
        const { data: carrello, error } = await supabaseClient
            .from('carrello')
            .select('id');
        
        if (error) {
            throw error; // Manda l'errore al blocco catch
        }

        if (cartCountSpan) {
            if (carrello.length === 0) {
                cartCountSpan.style.display = "none";
            } else {
                cartCountSpan.style.display = "inline-block";
                cartCountSpan.textContent = carrello.length;
            }
        }
    } catch (error) {
        // Gestione errore
        console.error("Errore nel recupero del carrello:", error);
    }
}


document.addEventListener("DOMContentLoaded", aggiornaContatoreCarrello);


btnCard.addEventListener("click", async function () {
    try {
        await postInCarrello(prodotto);
        await aggiornaContatoreCarrello();

        btnCard.classList.remove("bi", "bi-cart");
        btnCard.classList.add("fs-6");
        btnCard.textContent = "Sto aggiungendo al carrello";

        setTimeout(() => {
            btnCard.classList.add("bi", "bi-cart");
            btnCard.classList.remove("fs-6");
            btnCard.textContent = "";
        }, 3000);
    } catch (error) {
        console.error("Errore nel click sul bottone:", error);
    }
});