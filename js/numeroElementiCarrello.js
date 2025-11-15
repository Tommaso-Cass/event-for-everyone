

const cartCountSpan = document.querySelector("#cart-count");

async function aggiornaContatoreCarrello() {
    try {
        let response = await fetch("http://localhost:3000/carrello");
        let carrello = await response.json();
        
        if (cartCountSpan) {
            if (carrello.length === 0) {
                cartCountSpan.style.display = "none";
            } else {
                cartCountSpan.style.display = "inline-block";
                cartCountSpan.textContent = carrello.length;
            }
        }
    } catch (error) {
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
