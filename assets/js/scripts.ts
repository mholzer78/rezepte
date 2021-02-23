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
                let row = document.createElement("div");
                row.className = 'row';
                row.addEventListener("click", function () {
                    console.log('3', this);
                    this.classList.toggle("checked");
                });
                let col1 = document.createElement("div");
                col1.className = 'check';
                let col2 = document.createElement("div");
                col2.className = '';
                let col3 = document.createElement("div");
                col3.className = '';

                let div1text = document.createElement('i');
                div1text.className = 'far fa-square';
                let tempText = credential.amount + ' ' + credential.unit;
                if (credential.appendix) {
                    tempText = tempText + ' (' + credential.appendix + ')'
                }
                let div2text = document.createTextNode(credential.name);
                let div3text = document.createTextNode(tempText);
                row.appendChild(col1).appendChild(div1text);
                row.appendChild(col2).appendChild(div2text);
                row.appendChild(col3).appendChild(div3text);
                document.querySelector('#ingredients div.card-body').appendChild(row);
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
                    let row = document.createElement("div");
                    row.className = 'row';
                    row.addEventListener("click", function () {
                        console.log('2', this);
                        this.classList.toggle("checked");
                    });
                    let col1 = document.createElement("div");
                    col1.className = 'd-flex align-items-center';
                    let col2 = document.createElement("div");
                    col2.className = '';

                    let div1a = document.createElement('div');
                    div1a.className = 'check';
                    let div1aText = document.createElement('i');
                    div1aText.className = 'far fa-square';

                    let div2a = document.createElement('div');
                    div2a.className = 'bold';
                    let div2aText = document.createTextNode(instruction.credentials.join(', '));

                    let div2b = document.createElement('div');
                    let div2bText = document.createTextNode(instruction.description);

                    col1.appendChild(div1a).appendChild(div1aText);
                    col2.appendChild(div2a).appendChild(div2aText);
                    col2.appendChild(div2b).appendChild(div2bText);

                    row.appendChild(col1);
                    row.appendChild(col2);

                    document.querySelector('#instructions div.card-body').appendChild(row);
                } else if (instruction.type == 'break') {
                    let row = document.createElement("div");
                    row.className = 'row';
                    row.addEventListener("click", function () {
                        console.log('1', this);
                        this.classList.toggle("checked");
                    });
                    let col1 = document.createElement("div");
                    col1.className = 'd-flex align-items-center';
                    let col2 = document.createElement("div");
                    col2.className = '';
                    let col3 = document.createElement("div");
                    col3.className = 'd-flex align-items-center';

                    let tempText = instruction.tool.name;
                    if (instruction.tool.degrees) {
                        tempText = tempText + ' (' + instruction.tool.degrees + '°';
                        if (instruction.tool.mode) {
                            tempText = tempText + ' ' + instruction.tool.mode;
                        }
                        tempText = tempText + ')';
                    }
                    let div1a = document.createElement('div');
                    div1a.className = 'check';
                    let div1aText = document.createElement('i');
                    div1aText.className = 'far fa-square';

                    let div2a = document.createElement('div');
                    div2a.className = 'bold';
                    let div2aText = document.createTextNode(tempText);

                    let div2b = document.createElement('div');
                    let div2bText = document.createTextNode(instruction.description);

                    let div3a = document.createElement('div');
                    div3a.className = 'play';
                    let div3aText = document.createElement('i');
                    div3aText.className = 'fas fa-play';
                    div3aText.setAttribute('data-time',instruction.duration);

                    col1.appendChild(div1a).appendChild(div1aText);

                    col2.appendChild(div2a).appendChild(div2aText);
                    col2.appendChild(div2b).appendChild(div2bText);

                    col3.appendChild(div3a).appendChild(div3aText);

                    row.appendChild(col1);
                    row.appendChild(col2);
                    row.appendChild(col3);
                    document.querySelector('#instructions div.card-body').appendChild(row);
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