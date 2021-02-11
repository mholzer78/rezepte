const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const recipe = urlParams.get('recipe');

if (recipe) {
    document.getElementById('dishes').classList.toggle('d-none');
    document.getElementById('accordion').classList.toggle('d-none');

    let httpStorage = new XMLHttpRequest();
    httpStorage.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let storage = JSON.parse(this.responseText);
            let curRecipe = storage.filter(function(item){
                return item.folder == recipe;
            })[0];
            let curImage = storage.filter(function(item){
                return item.image == recipe;
            })[0];
            let title = document.createTextNode(curRecipe.name);
            document.querySelector('#accordion .card-header h5').appendChild(title);
            let description = document.createTextNode(curRecipe.description);
            document.querySelector('#accordion .card-body #descText').appendChild(description);
            let image = document.createElement("img");
            image.className = 'img-fluid';
            image.setAttribute('src', 'storage/'+curRecipe+'/'+curImage);
            image.setAttribute('alt', curRecipe.name);
        }
    };
    httpStorage.open('GET', 'storage/storage.json', true);
    httpStorage.send();   

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let credentials = JSON.parse(this.responseText);
            for (let credential of credentials) {
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                let td2 = document.createElement("td");
    
                let tempText = credential.amount + ' ' + credential.unit;
                if (credential.appendix) {
                    tempText = tempText + ' (' + credential.appendix + ')'
                }
                let td1text = document.createTextNode(credential.name);
                let td2text = document.createTextNode(tempText);
                tr.appendChild(td1).appendChild(td1text);
                tr.appendChild(td2).appendChild(td2text);
                document.querySelector('#ingredients table').appendChild(tr);
            }
        }
    };
    xmlhttp.open('GET', 'storage/'+recipe+'/credentials.json', true);
    xmlhttp.send();   
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

/*
*/