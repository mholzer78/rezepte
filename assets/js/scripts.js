var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var recipe = urlParams.get('recipe');
if (recipe) {
    document.getElementById('dishes').classList.toggle('d-none');
    document.getElementById('accordion').classList.toggle('d-none');
    var httpStorage = new XMLHttpRequest();
    httpStorage.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var storage = JSON.parse(this.responseText);
            var curRecipe = storage.filter(function (item) {
                return item.folder == recipe;
            })[0];
            var curImage = storage.filter(function (item) {
                return item.image == recipe;
            })[0];
            var title = document.createTextNode(curRecipe.name);
            document.querySelector('#accordion .card-header h5').appendChild(title);
            var description = document.createTextNode(curRecipe.description);
            document.querySelector('#accordion .card-body #descText').appendChild(description);
            var image = document.createElement("img");
            image.className = 'img-fluid';
            image.setAttribute('src', 'storage/' + curRecipe + '/' + curImage);
            image.setAttribute('alt', curRecipe.name);
        }
    };
    httpStorage.open('GET', 'storage/storage.json', true);
    httpStorage.send();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var credentials = JSON.parse(this.responseText);
            for (var _i = 0, credentials_1 = credentials; _i < credentials_1.length; _i++) {
                var credential = credentials_1[_i];
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                var tempText = credential.amount + ' ' + credential.unit;
                if (credential.appendix) {
                    tempText = tempText + ' (' + credential.appendix + ')';
                }
                var td1text = document.createTextNode(credential.name);
                var td2text = document.createTextNode(tempText);
                tr.appendChild(td1).appendChild(td1text);
                tr.appendChild(td2).appendChild(td2text);
                document.querySelector('#ingredients table').appendChild(tr);
            }
        }
    };
    xmlhttp.open('GET', 'storage/' + recipe + '/credentials.json', true);
    xmlhttp.send();
}
else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var dishes = JSON.parse(this.responseText);
            for (var _i = 0, dishes_1 = dishes; _i < dishes_1.length; _i++) {
                var dish = dishes_1[_i];
                var col = document.createElement('div');
                col.className = 'col-6 col-md-3';
                var card = document.createElement('div');
                card.className = 'card';
                var cardTop = document.createElement('img');
                cardTop.className = 'card-img-top';
                cardTop.setAttribute('src', 'storage/' + dish.folder + '/' + dish.image);
                var cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                var cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                var cardTitleText = document.createTextNode(dish.name);
                var cardLink = document.createElement('a');
                cardLink.className = 'btn btn-primary';
                cardLink.setAttribute('href', '/?recipe=' + dish.folder);
                var cardLinkText = document.createTextNode('Kochen!');
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
//# sourceMappingURL=scripts.js.map