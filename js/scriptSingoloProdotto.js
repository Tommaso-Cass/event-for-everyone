

async function mostraProdotto() { 
    const param = new URLSearchParams(window.location.search);
    const id = param.get('id');

   
    const { data: response, error } = await supabaseClient
        .from('prodotti')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !response) {
        console.error("Errore nel recupero del prodotto o prodotto non trovato:", error);
        return;
    }
    
    
    let card = document.createElement("div");
    card.setAttribute("class", "card d-flex flex-column flex-lg-row");

    let img = document.createElement("img");
    img.setAttribute("class", "card-img-top");
    img.setAttribute("src", response.immagine);

    let title = document.createElement("h1");
    title.setAttribute("class", "titleProd mb-5");
    title.textContent = response.nome;

    let desc = document.createElement("p");
    desc.setAttribute("class", "desc mb-5");
    desc.textContent = response.descrizione;

    let prezzo = document.createElement("p");
    prezzo.setAttribute("class", "prezzo");
    prezzo.textContent = response.prezzo + "€";

    let divImg = document.createElement("div");
    divImg.setAttribute("class", "divImg w-100 w-lg-50");

    let divText = document.createElement("div");
    divText.setAttribute("class", "divText w-100 w-lg-50 d-flex flex-column align-items-center justify-content-center");

    let btnCarrello = document.createElement("button");
    btnCarrello.setAttribute("class", "btnGoToCarrello");
    btnCarrello.textContent = "Aggiungi al carrello";


    let dataEvento = document.createElement("p");
    dataEvento.setAttribute("class", "data-evento mb-3 text-muted fs-3");

    
    let dataFormattata = new Date(response.data).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
   

    dataEvento.textContent = "Data evento: " + dataFormattata;


    btnCarrello.addEventListener("click", async function () {
        
        
        const { id, disponibilita, created_at, ...itemToInsert } = response;

        const { error: insertError } = await supabaseClient
            .from('carrello')
            .insert([itemToInsert]);

        if (insertError) {
            console.error("Errore nell'aggiunta al carrello:", insertError);
            alert("Errore nell'aggiunta al carrello.");
            return;
        }

        if (typeof aggiornaContatoreCarrello === 'function') {
             aggiornaContatoreCarrello(); 
        }
        window.location.href = "./carrello.html";
    });
  

    let btnShop = document.createElement("a");
    btnShop.setAttribute("class", "btnGoToShop");
    btnShop.setAttribute("href", "./shop.html");
    btnShop.textContent = "Torna allo shop";

    let divBtn = document.createElement("div");
    divBtn.setAttribute("class", "divBtn");

    let prodotto = document.querySelector(".prodotto");

    prodotto.appendChild(card);
    card.appendChild(divImg);
    card.appendChild(divText);
    divImg.appendChild(img);
    divText.appendChild(title);
    divText.appendChild(desc);
    divText.appendChild(dataEvento);
    divText.appendChild(prezzo);
    divText.appendChild(divBtn);
    divBtn.appendChild(btnShop);
    divBtn.appendChild(btnCarrello);
}

document.addEventListener("DOMContentLoaded", mostraProdotto);