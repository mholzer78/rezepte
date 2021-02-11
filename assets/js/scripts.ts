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
                div.className = 'row align-items-center';
                let sub1 = document.createElement("div");
                sub1.className = 'col-1 check';
                let sub2 = document.createElement("div");
                sub2.className = 'col-2';
                let sub3 = document.createElement("div");
                sub3.className = 'col-9';

                let sub1text = document.createTextNode('X');
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
                    div.className = 'row align-items-center';
                    let sub1 = document.createElement("div");
                    sub1.className = 'col-1 check';
                    let sub2 = document.createElement("div");
                    sub2.className = 'col-3';
                    let sub3 = document.createElement("div");
                    sub3.className = 'col-9';

                    let sub1text = document.createTextNode('X');

                    if (instruction.credentials) {
                        let sub2text = document.createTextNode(instruction.credentials.join(', '));
                        sub2.appendChild(sub2text);
                    }
                    let sub3text = document.createTextNode(instruction.description);

                    div.appendChild(sub1).appendChild(sub1text);
                    div.appendChild(sub2);
                    div.appendChild(sub3).appendChild(sub3text);
                    document.querySelector('#instructions div.card-body').appendChild(div);
                } else if (instruction.type == 'break') {
                    let div = document.createElement("div");
                    div.className = 'row align-items-center';
                    let sub1 = document.createElement("div");
                    sub1.className = 'col-1 check';
                    let sub2 = document.createElement("div");
                    sub2.className = 'col-2 d-flex align-items-center justify-content-between';
                    let sub3 = document.createElement("div");
                    sub3.className = 'col-9';

                    let sub1text = document.createTextNode('X');

                    let tempText = instruction.tool.name;
                    if (instruction.tool.degrees) {
                        tempText = tempText + ' (' + instruction.tool.degrees + '°';
                        if (instruction.tool.mode) {
                            tempText = tempText + ' ' + instruction.tool.mode;
                        }
                        tempText = tempText + ')';
                    }
                    let sub2left = document.createElement('div');
                    let sub2leftText = document.createTextNode(tempText);

                    let sub2right = document.createElement('div');
                    sub2right.className = 'play';
                    let sub2rightText = document.createTextNode('X');

                    let sub3bar = document.createElement('div');
                    sub3bar.className = 'w-100 progressBar';
                    let sub3barText = document.createTextNode(String(instruction.duration/60) + ' Minuten');
                    let sub3desc = document.createElement('div');
                    let sub3descText = document.createTextNode(instruction.description);

                    sub2.appendChild(sub2left).appendChild(sub2leftText);
                    sub2.appendChild(sub2right).appendChild(sub2rightText);

                    sub3.appendChild(sub3bar).appendChild(sub3barText);
                    sub3.appendChild(sub3desc).appendChild(sub3descText);
                    
                    div.appendChild(sub1).appendChild(sub1text);
                    div.appendChild(sub2);
                    div.appendChild(sub3);
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