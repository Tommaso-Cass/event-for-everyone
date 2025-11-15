function mostraProdotto() {
  const param = new URLSearchParams(window.location.search);
  const id = param.get('id');

  fetch(`http://localhost:3000/carrello/${id}`)
    .then(risultato => {
      if (!risultato.ok) {
        return fetch(`http://localhost:3000/prodotti/${id}`);
      } else {
        return risultato;
      }
    })
    .then(data => data.json())
    .then(response => {
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
      btnCarrello.textContent = "Compra ora";


      let dataEvento = document.createElement("p");
      dataEvento.setAttribute("class", "data-evento mb-3 text-muted fs-3");

      let dataFormattata = new Date(response.data.split("-").reverse().join("-")).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      dataEvento.textContent = "Data evento: " + dataFormattata;


      btnCarrello.addEventListener("click", function () {
        fetch(`http://localhost:3000/carrello/${response.id}`)
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              return fetch("http://localhost:3000/carrello", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(response)
              });
            }
          })
          .finally(() => {
            window.location.href = "./carrello.html";
          });
      });

      let btnShop = document.createElement("a");
      btnShop.setAttribute("class", "btnGoToShop");
      btnShop.setAttribute("href", "./shop.html");
      btnShop.textContent = "Continua gli acquisti";

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
    });
}

document.addEventListener("DOMContentLoaded", mostraProdotto);
