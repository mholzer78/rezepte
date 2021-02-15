const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const recipe = urlParams.get('recipe');

if (recipe) {
    document.getElementById('dishes').classList.toggle('d-none');
    document.getElementById('recipe').classList.toggle('d-none');

    let httpStorage = new XMLHttpRequest();
    httpStorage.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let storage = JSON.parse(this.responseText);
            let curRecipe = storage.filter(function(item){
                return item.folder == recipe;
            })[0];
            let title = document.createTextNode(curRecipe.name);
            document.querySelector('#recipe .card-header h5').appendChild(title);
            let description = document.createTextNode(curRecipe.description);
            document.querySelector('#recipe .card-body #descText').appendChild(description);
            let image = document.createElement("img");
            image.className = 'img-fluid';
            image.setAttribute('src', 'storage/'+curRecipe.folder+'/'+curRecipe.image);
            image.setAttribute('alt', curRecipe.name);
            document.querySelector('#recipe .card-body #image').appendChild(image);
        }
    };
    httpStorage.open('GET', 'storage/storage.json', true);
    httpStorage.send();   

    let httpCredentials = new XMLHttpRequest();
    httpCredentials.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let credentials = JSON.parse(this.responseText);
            for (let credential of credentials) {
                let div = document.createElement("div");
                div.className = 'row';
                div.addEventListener("click", function () {
                    this.classList.toggle("checked");
                });
                let sub1 = document.createElement("div");
                sub1.className = 'col-1 check';
                let sub2 = document.createElement("div");
                sub2.className = 'col-2';
                let sub3 = document.createElement("div");
                sub3.className = 'col-9';

                let sub1text = document.createElement('i');
                sub1text.className = 'far fa-square';
                let tempText = credential.amount + ' ' + credential.unit;
                if (credential.appendix) {
                    tempText = tempText + ' (' + credential.appendix + ')'
                }
                let sub2text = document.createTextNode(credential.name);
                let sub3text = document.createTextNode(tempText);
                div.appendChild(sub1).appendChild(sub1text);
                div.appendChild(sub2).appendChild(sub2text);
                div.appendChild(sub3).appendChild(sub3text);
                document.querySelector('#ingredients div.card-body').appendChild(div);
            }
        }
    };
    httpCredentials.open('GET', 'storage/'+recipe+'/credentials.json', true);
    httpCredentials.send();

    let httpInstructions = new XMLHttpRequest();
    httpInstructions.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let instructions = JSON.parse(this.responseText);
            for (let instruction of instructions) {
                if (instruction.type == 'step') {
                    let div = document.createElement("div");
                    div.className = 'row';
                    div.addEventListener("click", function () {
                        this.classList.toggle("checked");
                    });
                    let sub1 = document.createElement("div");
                    sub1.className = 'col-3 d-flex align-items-center';
                    let sub2 = document.createElement("div");
                    sub2.className = 'col-9';

                    let sub1a = document.createElement('div');
                    sub1a.className = 'check';
                    let sub1aText = document.createElement('i');
                    sub1aText.className = 'far fa-square';

                    let sub1b = document.createElement('div');
                    sub1b.className = 'mr-auto px-3';
                    if (instruction.credentials) {
                        let sub1bText = document.createTextNode(instruction.credentials.join(', '));
                        sub1b.appendChild(sub1bText);
                    }

                    let sub2text = document.createTextNode(instruction.description);

                    sub1.appendChild(sub1a).appendChild(sub1aText);
                    sub1.appendChild(sub1b);

                    div.appendChild(sub1);
                    div.appendChild(sub2).appendChild(sub2text);
                    document.querySelector('#instructions div.card-body').appendChild(div);
                } else if (instruction.type == 'break') {
                    let div = document.createElement("div");
                    div.className = 'row';
                    div.addEventListener("click", function () {
                        this.classList.toggle("checked");
                    });
                    let sub1 = document.createElement("div");
                    sub1.className = 'col-3 d-flex align-items-center justify-content-between';
                    let sub2 = document.createElement("div");
                    sub2.className = 'col-9';

                    let tempText = instruction.tool.name;
                    if (instruction.tool.degrees) {
                        tempText = tempText + ' (' + instruction.tool.degrees + '°';
                        if (instruction.tool.mode) {
                            tempText = tempText + ' ' + instruction.tool.mode;
                        }
                        tempText = tempText + ')';
                    }
                    let sub1a = document.createElement('div');
                    sub1a.className = 'check';
                    let sub1aText = document.createElement('i');
                    sub1aText.className = 'far fa-square';

                    let sub1b = document.createElement('div');
                    sub1b.className = 'mr-auto px-3';
                    let sub1bText = document.createTextNode(tempText);

                    let sub1c = document.createElement('div');
                    sub1c.className = 'play';
                    let sub1cText = document.createElement('i');
                    sub1cText.className = 'fas fa-hourglass-start';

                    let sub2bar = document.createElement('div');
                    sub2bar.className = 'progress';
                    let sub2barText = document.createElement('div');
                    sub2barText.className = 'progress-bar';
                    sub2barText.innerHTML = String(instruction.duration/60) + ' Minuten';
                    sub2barText.setAttribute('role', 'progressbar');
                    sub2barText.setAttribute('aria-valuenow', '0');
                    sub2barText.setAttribute('aria-valuemin', '0');
                    sub2barText.setAttribute('aria-valuemax', '100');

                    let sub2desc = document.createElement('div');
                    let sub2descText = document.createTextNode(instruction.description);

                    sub1.appendChild(sub1a).appendChild(sub1aText);
                    sub1.appendChild(sub1b).appendChild(sub1bText);
                    sub1.appendChild(sub1c).appendChild(sub1cText);

                    sub2.appendChild(sub2bar).appendChild(sub2barText);
                    sub2.appendChild(sub2desc).appendChild(sub2descText);
                    
                    div.appendChild(sub1);
                    div.appendChild(sub2);
                    document.querySelector('#instructions div.card-body').appendChild(div);
                }
            }
        }
    };
    httpInstructions.open('GET', 'storage/'+recipe+'/instructions.json', true);
    httpInstructions.send();  
} else {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let dishes = JSON.parse(this.responseText);
            for (let dish of dishes) {
                let col = document.createElement('div');
                col.className = 'col-6 col-md-3';
                let card = document.createElement('div');
                card.className = 'card';

                let cardTop = document.createElement('img');
                cardTop.className = 'card-img-top';
                cardTop.setAttribute('src', 'storage/'+dish.folder+'/'+dish.image);

                let cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                let cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                let cardTitleText = document.createTextNode(dish.name);

                let cardLink = document.createElement('a');
                cardLink.className = 'btn btn-primary';
                cardLink.setAttribute('href', '/?recipe='+dish.folder)
                let cardLinkText = document.createTextNode('Kochen!');

                cardBody.appendChild(cardTitle).appendChild(cardTitleText);
                cardBody.appendChild(cardLink).appendChild(cardLinkText);
                card.appendChild(cardTop);
                card.appendChild(cardBody);
                col.appendChild(card);

                document.querySelector('#dishes').appendChild(col);
            }
        }
    };
    xmlhttp.open('GET', 'storage/storage.json', true);
    xmlhttp.send();   
}