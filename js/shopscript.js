

class Prodotto {
    letructor(nome, prezzo, immagine, descrizione, disponibilita) {
        this.nome = nome;
        this.prezzo = prezzo;
        this.immagine = immagine;
        this.descrizione = descrizione;
        this.disponibilita = disponibilita;
    }
}


let showroom = document.querySelector("#showroom");


async function mostraProdotti() {


    const { data: eventi, error } = await supabaseClient
        .from('prodotti') // CORRETTO: Usiamo 'prodotti' come specificato
        .select('*');
    if (error) {
        console.error('Errore nel caricamento degli eventi:', error);
        return;
    }


    eventi.forEach(prodotto => {
        showroom.appendChild(creaCard(prodotto));
    });
}

document.addEventListener("DOMContentLoaded", mostraProdotti);

let barraRicerca = document.querySelector("#barraRicerca");

if (barraRicerca) {
    barraRicerca.addEventListener("input", function () {
        let query = this.value.toLowerCase();
        let cards = document.querySelectorAll("#showroom .card");

        cards.forEach(card => {
            let titolo = card.querySelector(".card-title")?.textContent.toLowerCase() || "";
            let descrizione = card.querySelector(".card-text")?.textContent.toLowerCase() || "";
            let match = titolo.includes(query) || descrizione.includes(query);

            card.parentElement.style.display = match ? "block" : "none";
        });
    });
}



/**
 * @param {Prodotto} prodotto 
*/
function creaCard(prodotto) {
    let col = document.createElement("div");
    col.setAttribute("class", "col-12 col-lg-4 col-md-6");

    let card = document.createElement("div");
    card.setAttribute("class", "card h-100");

    let cardImg = document.createElement("img");
    cardImg.setAttribute("class", "card-img-top");
    cardImg.setAttribute("src", prodotto.immagine);

    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    let title = document.createElement("h3");
    title.setAttribute("class", "card-title");
    title.textContent = prodotto.nome;

    let dataEvento = document.createElement("p");
    dataEvento.setAttribute("class", "card-text");


    if (prodotto.data) {
        let dataFormattata = new Date(prodotto.data.split("-").reverse().join("-")).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dataEvento.textContent = "Evento: " + dataFormattata;
    }



    let prezzo = document.createElement("p");
    prezzo.setAttribute("class", "card-text");
    prezzo.textContent = "Prezzo: €" + prodotto.prezzo;

    let disp = document.createElement("p");
    disp.setAttribute("class", "card-text");
    if (prodotto.disponibilita == true) {
        disp.textContent = "";
    } else {
        disp.innerHTML = 'Prodotto<span class="red"> Esaurito</span>';
    }


    let btnCard = document.createElement("button");
    btnCard.setAttribute("class", "btnCard bi bi-bag-plus");


    let divBtn = document.createElement("div");
    divBtn.setAttribute("class", "divBtn");

    let btnVisualizza = document.createElement("button");
    btnVisualizza.setAttribute("class", "btnVisualizza");
    btnVisualizza.innerHTML = "Scopri di più";


    btnVisualizza.addEventListener("click", function () {
        console.log(prodotto.id);
        window.location.href = `singoloProdotto.html?id=${prodotto.id}`;
        
    });



    if (!prodotto.disponibilita) {
        btnCard.setAttribute("disabled", true);
    }

    btnCard.addEventListener("click", function () {
        try {
            postInCarrello(prodotto);
        } catch (error) {
            console.log(error);

        } finally {

        }

        btnCard.classList.remove("bi");
        btnCard.classList.remove("bi-bag-plus");
        btnCard.classList.add("fs-6")
        btnCard.textContent = "Aggiungendo...";

        setTimeout(() => {
            btnCard.classList.add("bi");
            btnCard.classList.add("bi-bag-plus");
            btnCard.classList.remove("fs-6")
            btnCard.textContent = "";
        }, 1600);
    });

    col.appendChild(card);
    card.appendChild(cardImg);

    cardBody.appendChild(title);
    cardBody.appendChild(dataEvento);
    cardBody.appendChild(prezzo);
    cardBody.appendChild(disp);
    cardBody.appendChild(divBtn);
    divBtn.appendChild(btnVisualizza);
    divBtn.appendChild(btnCard);

    card.appendChild(cardBody);

    if (prodotto.disponibilita == true) {

    } else {
        btnCard.classList.remove("bi", "bi-bag-plus");
        card.classList.add("cardFalse");
        btnCard.classList.add("btn-false", "bi", "bi-bag-x");
        divBtn.removeChild(btnVisualizza);
    }


    return col;
}


// Funzione postInCarrello aggiornata con Supabase
// Nel tuo shopscript.js

async function postInCarrello(prodotto) {
   
    const { id, disponibilita, ...itemToInsert } = prodotto;

    const { data, error } = await supabaseClient
        .from('carrello')
        .insert([itemToInsert]) // Inseriamo solo l'oggetto pulito
        .select();

    if (error) {
        console.error("Errore nell'aggiunta al carrello:", error);
    } else {
        console.log("prodotto aggiunto", data);
        if (typeof aggiornaContatoreCarrello === 'function') {
             aggiornaContatoreCarrello(); 
        }
    }
}


const icona = document.querySelector('.animazione-tremolio');

if (icona) { // Aggiunto if per gestire il TypeError
    setInterval(() => {
        icona.classList.remove('tremolio');

        setTimeout(() => {
            icona.classList.add('tremolio');
        }, 500);
    }, 2000);
}


let modal = document.querySelector(".modal");
let btnClose = document.querySelector(".btn-close");

if (btnClose) { 
    btnClose.addEventListener("click", chiudiModal);
}


function chiudiModal() {
    if (modal) {
        modal.classList.remove("modal-display");
        modal.classList.add("modal-display-none")
    }
}



document.addEventListener('DOMContentLoaded', function () {

    let modalId = 'offerModal';

    let hasSeenModalKey = 'hasSeenShopOfferModal';


    if (sessionStorage.getItem(hasSeenModalKey) !== 'true') {


        let offerModalElement = document.getElementById(modalId);
        if (offerModalElement) {
            let myModal = new bootstrap.Modal(offerModalElement);

            myModal.show();


            sessionStorage.setItem(hasSeenModalKey, 'true');
        }
    }
});