

document.addEventListener("DOMContentLoaded", function () {


    let listaProdCarrello = document.querySelector("#listaProdCarrello");
    let form = document.querySelector("#formAcquistoTotale");
    let prodottoSelezionato = null;
    let form2 = document.querySelector("#form2");

    let totalePrezzo = document.querySelector("#totalePrezzo");


    async function scaricaDatiCarrello() {

        const { data: response, error } = await supabaseClient
            .from('carrello')
            .select('*');

        if (error) {
            console.error('Errore nel caricamento del carrello:', error);
            return;
        }


        console.log("Nel mio carrello ci sono i seguenti prodotti", response);

        let conteggio = {};



        response.forEach(prod => {
            if (conteggio[prod.nome]) {
                conteggio[prod.nome].quantita += 1;
                conteggio[prod.nome].ids.push(prod.id);
            } else {
                conteggio[prod.nome] = {
                    quantita: 1,
                    prezzo: prod.prezzo,
                    immagine: prod.immagine,
                    ids: [prod.id]
                };
            }
        });

        let totaleOriginale = 0;
        let quantitaTotale = 0;


        let notaScontoH3 = document.createElement("h3");
        notaScontoH3.setAttribute("class", "nota-sconto-h3");


        Object.values(conteggio).forEach(prod => {
            totaleOriginale += prod.prezzo * prod.quantita;
            quantitaTotale += prod.quantita;
        });


        let scontoApplicato = quantitaTotale >= 3;
        let totaleScontato = scontoApplicato ? totaleOriginale * 0.8 : totaleOriginale;

        if (totalePrezzo) {
            if (scontoApplicato) {
                totalePrezzo.innerHTML =
                    `<span class="text-muted text-decoration-line-through">€${totaleOriginale.toFixed(2)}</span>
                        <span class="fw-bold text-success">€${totaleScontato.toFixed(2)} (-20%)</span>`;
                notaScontoH3.innerHTML = 'Stai usufruendo dello <span class="red">sconto del 20%</span> in quanto strai aquistando più di 3 articoli.';

            } else {
                totalePrezzo.textContent = `€${totaleOriginale.toFixed(2)}`;
                notaScontoH3.innerHTML = 'Aggiungi almeno 3 elementi nel carrello per lo <span class="red">sconto del 20%</span>.'
            }
        }

        let notaSconto = document.querySelector("#notaSconto");
        if (notaSconto) {
            notaSconto.innerHTML = '';
            notaSconto.appendChild(notaScontoH3);
        }


        listaProdCarrello.innerHTML = "";

        Object.keys(conteggio).forEach(nome => {
            let dati = conteggio[nome];

            let card = document.createElement("div");
            card.className = "card shadow-sm col-lg-4";

            card.innerHTML = `
                        <img src="${dati.immagine}" class="card-img-top" alt="${nome}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column justify-content-between card-carrello">
                            <div class="mb-3">
                                <h5 class="card-title">${nome}</h5>
                                <p class="card-text">
                                    Hai <strong>${dati.quantita}</strong> biglietti nel carrello<br>
                                    Totale: €${(dati.prezzo * dati.quantita).toFixed(2)}
                                </p>
                            </div>
                            <div class="d-flex flex-column gap-2">
                                <div class="d-flex align-items-center gap-2">
                                <button class="btn btn-danger btn-sm rimuovi-btn d-flex align-items-center gap-1"><span>Quantità da rimuovere</span><i class="bi bi-arrow-right-short fs-4"></i></button>
                                    <input type="number" class="form-control form-control-sm input-rimuovi" min="1" max="${dati.quantita}" value="1" style="width: 70px;">
                                </div>
                               <button type="button" class="apri-modal-btn d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#exampleModal" data-nome="${nome}" data-prezzo="${dati.prezzo.toFixed(2)}"><span>Acquista prodotto singolarmente</span> <i class="bi bi-check-circle"></i>
                               </button>

                            </div>
                        </div>
                    `;

            //evento apri modal
            let apriModalBtn = card.querySelector(".apri-modal-btn");
            apriModalBtn.addEventListener("click", function () {
                let nome = this.getAttribute("data-nome");
                let prezzo = this.getAttribute("data-prezzo");

                document.querySelector("#modalNomeProdotto").textContent = `${nome}`;
                document.querySelector("#modalPrezzoProdotto").textContent = `Prezzo totale: €${prezzo}`;


                prodottoSelezionato = {
                    nome: nome,
                    prezzo: prezzo,
                    id: dati.ids[0]
                };
            });



            // EVENTO PER RIMUOVERE
            card.querySelector(".rimuovi-btn").addEventListener("click", async () => { 
                let quanti = parseInt(card.querySelector(".input-rimuovi").value);
                if (!quanti || quanti < 1 || quanti > dati.quantita) {
                    alert("Quantità non valida.");
                    return;
                }

                let idsDaRimuovere = dati.ids.slice(0, quanti);

                const { error } = await supabaseClient
                    .from('carrello')
                    .delete()
                    .in('id', idsDaRimuovere); 

                if (error) {
                    console.error("Errore nella rimozione:", error);
                    alert("Errore nella rimozione.");
                } else {
                    location.reload(); 
                }
            });

            listaProdCarrello.appendChild(card);
        });
    }


    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }


            const { data: items, error: selectError } = await supabaseClient
                .from('carrello')
                .select('id');

            if (selectError) {
                console.error("Errore nel controllo carrello:", selectError);
                return;
            }

            if (items.length === 0) {
                alert("Il carrello è vuoto!");
                return;
            }


            const { error: deleteError } = await supabaseClient
                .from('carrello')
                .delete()
                .neq('id', 0);

            if (deleteError) {
                console.error("Errore nello svuotare il carrello:", deleteError);
                alert("Si è verificato un errore durante l'acquisto totale.");
            } else {
                alert(`Grazie ${form.nome.value}, il tuo acquisto di ${items.length} prodotti è stato effettuato.`);
                location.reload();
            }
        });
    }

    let modalProcediBtn = document.querySelector("#modalProcediBtn");

    if (modalProcediBtn) {
        modalProcediBtn.addEventListener("click", async function (e) { 
            e.preventDefault();

            if (!form2.checkValidity()) {
                form2.classList.add("was-validated");
                return;
            }

            if (!prodottoSelezionato) {
                alert("Errore: nessun prodotto selezionato.");
                return;
            }

            const { error } = await supabaseClient
                .from('carrello')
                .delete()
                .eq('id', prodottoSelezionato.id); 

            if (error) {
                console.error("Errore nella cancellazione del prodotto:", error);
                alert("Si è verificato un errore durante l'acquisto.");
            } else {
                alert(`Grazie ${form2.nome.value}, il tuo acquisto di ${prodottoSelezionato.nome} è andato a buon fine.`);
                location.reload();
            }
        });
    }


    scaricaDatiCarrello();
});

let svuotaBtn = document.querySelector("#svuotaCarrelloBtn");

if (svuotaBtn) {
    svuotaBtn.addEventListener("click", async () => { 
        if (confirm("Sei sicuro di voler svuotare il carrello?")) {

            const { error } = await supabaseClient
                .from('carrello')
                .delete()
                .neq('id', 0);

            if (error) {
                console.error("Errore nello svuotare il carrello:", error);
                alert("Errore nello svuotare il carrello.");
            } else {
                location.reload();
            }
        }
    });
}