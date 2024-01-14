const btnaddPoke = document.getElementById("addPoke");
btnaddPoke.addEventListener('click', afegirPoke);
let contador = document.getElementById("numPoke");
let numerosGenerados = [];
let contadorColor = 0;
let textDone = false;
let firstPokemon = {
    "id":0,
    "attack":0,
    "defense":0
};
let secondPokemon = {
    "id":0,
    "attack":0,
    "defense":0
};

function writeNumber(randomNumber){
    numerosGenerados.push(randomNumber);
}

function searchPokemon() {
    let input = document.getElementById('input').value;
    for (let i = 0; i < contador.value; i++) {
        fetch('https://pokeapi.co/api/v2/pokemon/' + numerosGenerados[i])
            .then(x => x.json())
            .then(poke => {
                let article = document.querySelector(`#pokeList article:nth-child(${i + 1})`);
                let name = article.querySelector('#name').innerText;
                if (name.includes(input)) {
                    article.removeAttribute("hidden");
                } else {
                    article.setAttribute("hidden", true);
                }
            });
    }
}

function resetAll(){
    firstPokemon.id = 0;
    firstPokemon.attack = 0;
    firstPokemon.defense = 0;
    secondPokemon.id = 0;
    secondPokemon.attack = 0;
    secondPokemon.defense = 0;
    contadorColor = 0;
    textDone = false;
    for (let i = 0; i < contador.value; i++) {
        fetch('https://pokeapi.co/api/v2/pokemon/' + numerosGenerados[i])
        .then(x => x.json())
        .then(poke => {
            let article = document.querySelector(`#pokeList article:nth-child(${i + 1})`);
            if(article.style.border == '3px solid lightgreen') {
                article.style.border = '2px solid black';
                article.style.boxShadow = '0 0 10px 2px rgba(0, 0, 0, 0.5)';
                article.dataset.color = "false";
            }
        });
    }
    const text = document.getElementById("text");
    text.innerText = "Selecciona dos Pokemons i pulsa Fight! para iniciar";
    const fightBtn = document.getElementById("fightBtn");
    const endBtn = document.getElementById("endBtn");
    fightBtn.setAttribute("hidden", true);
    endBtn.setAttribute("hidden", true);
}

function fight(){
    const endBtn = document.getElementById("endBtn");
    const text = document.getElementById("text");
    while((firstPokemon.defense > 0) && (secondPokemon.defense > 0)){
        text.innerText = firstPokemon.id+" ataca a "+secondPokemon.id+" i inflinge "+firstPokemon.attack+" de daño";
        secondPokemon.defense -= firstPokemon.attack;
        if(secondPokemon.defense > 0){
            text.innerText += "\n"+secondPokemon.id+" ataca a "+firstPokemon.id+" i inflinge "+secondPokemon.attack+" de daño";
            firstPokemon.defense -= secondPokemon.attack;
        }
    }
    if(firstPokemon.defense<=0 && textDone == false){
        text.innerText += "\n"+firstPokemon.id+" ha sido debilitado!";
        text.innerText += "\nHa ganado el pokemon "+secondPokemon.id+"!";
        endBtn.removeAttribute("hidden");
        textDone = true;
    }else if(secondPokemon.defense<=0 && textDone == false){
        text.innerText += "\n"+secondPokemon.id+" ha sido debilitado!";
        text.innerText += "\nHa ganado el pokemon "+firstPokemon.id+"!";
        endBtn.removeAttribute("hidden");
        textDone = true;

    }
}

function colorButton(info){
    const fightBtn = document.getElementById("fightBtn");
    if(info.dataset.color == "false" && contadorColor < 2) {
        info.style.border = '3px solid lightgreen';
        info.style.boxShadow = '0 4px 8px rgba(0, 255, 0, 0.5)';
        info.dataset.color = "true";
        contadorColor++;
        if(firstPokemon.id == 0){
            firstPokemon.id = info.dataset.name;
            firstPokemon.attack = info.dataset.attack;
            firstPokemon.defense = info.dataset.defense;
        }else if(secondPokemon.id == 0){
            secondPokemon.id = info.dataset.name;
            secondPokemon.attack = info.dataset.attack;
            secondPokemon.defense = info.dataset.defense;
        }
        if(contadorColor == 2){
            fightBtn.removeAttribute("hidden");
        }
    } else if(info.dataset.color == "true"){
        comprovacio = info.querySelector("#name");
        info.style.border = '2px solid black';
        info.style.boxShadow = '0 0 10px 2px rgba(0, 0, 0, 0.5)';
        info.dataset.color = "false";
        if(comprovacio.innerText == firstPokemon.id){
            firstPokemon.id = 0;
            firstPokemon.attack = 0;
            firstPokemon.defense = 0;
        }else if(comprovacio.innerText == secondPokemon.id){
            secondPokemon.id = 0;
            secondPokemon.attack = 0;
            secondPokemon.defense = 0;
        }
        contadorColor--;
        fightBtn.setAttribute("hidden", true);
    }
}


function afegirPoke(){
    pokeList.innerHTML = "";
    let i = 0;
    while(i < contador.value){
        let randomNumber = Math.floor(Math.random() * 1017)+1;
        if(!numerosGenerados.includes(randomNumber)){
            writeNumber(randomNumber);
            i++;
            fetch('https://pokeapi.co/api/v2/pokemon/'+randomNumber)
            .then(x => x.json())
            .then(poke => {
                const pokeList = document.getElementById("pokeList");
                const temp = document.getElementById("poke-template");
                const clonedTemplate = temp.content.cloneNode(true);       
                let article = clonedTemplate.querySelector('article');
                article.dataset.num = randomNumber;
                article.dataset.name = poke.name;
                article.dataset.attack = poke.stats[1].base_stat;
                article.dataset.defense = poke.stats[2].base_stat;
                let name = clonedTemplate.querySelector('#name');
                name.innerText = poke.name;
                let img = clonedTemplate.querySelector('img');
                img.setAttribute("src", poke.sprites.front_default);
                let types = clonedTemplate.querySelector('#types');
                temporalTypes = [];
                poke.types.forEach(type => {
                    temporalTypes.push(type.type.name);
                });
                types.innerHTML = temporalTypes.join("|");
                let stats = clonedTemplate.querySelector('#stats');
                temporalAttack = "A:"+poke.stats[1].base_stat;
                temporalDefense = "D:"+poke.stats[2].base_stat;
                stats.innerHTML = temporalAttack + "|" + temporalDefense;
                pokeList.appendChild(clonedTemplate);
            })
        }
    }
    let text = document.querySelector('#text');
    text.removeAttribute("hidden");
}