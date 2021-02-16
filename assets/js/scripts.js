var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var recipe = urlParams.get('recipe');
if (recipe) {
    document.getElementById('dishes').classList.toggle('d-none');
    document.getElementById('recipe').classList.toggle('d-none');
    var httpStorage = new XMLHttpRequest();
    httpStorage.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var storage = JSON.parse(this.responseText);
            var curRecipe = storage.filter(function (item) {
                return item.folder == recipe;
            })[0];
            var title = document.createTextNode(curRecipe.name);
            document.querySelector('#recipe .card-header h5').appendChild(title);
            var description = document.createTextNode(curRecipe.description);
            document.querySelector('#recipe .card-body #descText').appendChild(description);
            var image = document.createElement("img");
            image.className = 'img-fluid';
            image.setAttribute('src', 'storage/' + curRecipe.folder + '/' + curRecipe.image);
            image.setAttribute('alt', curRecipe.name);
            document.querySelector('#recipe .card-body #image').appendChild(image);
        }
    };
    httpStorage.open('GET', 'storage/storage.json', true);
    httpStorage.send();
    var httpCredentials = new XMLHttpRequest();
    httpCredentials.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var credentials = JSON.parse(this.responseText);
            for (var _i = 0, credentials_1 = credentials; _i < credentials_1.length; _i++) {
                var credential = credentials_1[_i];
                var div = document.createElement("div");
                div.className = 'row';
                div.addEventListener("click", function () {
                    this.classList.toggle("checked");
                });
                var sub1 = document.createElement("div");
                sub1.className = 'col-1 check';
                var sub2 = document.createElement("div");
                sub2.className = 'col-2';
                var sub3 = document.createElement("div");
                sub3.className = 'col-9';
                var sub1text = document.createElement('i');
                sub1text.className = 'far fa-square';
                var tempText = credential.amount + ' ' + credential.unit;
                if (credential.appendix) {
                    tempText = tempText + ' (' + credential.appendix + ')';
                }
                var sub2text = document.createTextNode(credential.name);
                var sub3text = document.createTextNode(tempText);
                div.appendChild(sub1).appendChild(sub1text);
                div.appendChild(sub2).appendChild(sub2text);
                div.appendChild(sub3).appendChild(sub3text);
                document.querySelector('#ingredients div.card-body').appendChild(div);
            }
        }
    };
    httpCredentials.open('GET', 'storage/' + recipe + '/credentials.json', true);
    httpCredentials.send();
    var httpInstructions = new XMLHttpRequest();
    httpInstructions.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var instructions = JSON.parse(this.responseText);
            for (var _i = 0, instructions_1 = instructions; _i < instructions_1.length; _i++) {
                var instruction = instructions_1[_i];
                if (instruction.type == 'step') {
                    var row = document.createElement("div");
                    row.className = 'row';
                    row.addEventListener("click", function () {
                        this.classList.toggle("checked");
                    });
                    var col1 = document.createElement("div");
                    col1.className = 'd-flex align-items-center';
                    var col2 = document.createElement("div");
                    col2.className = '';
                    var div1a = document.createElement('div');
                    div1a.className = 'check';
                    var div1aText = document.createElement('i');
                    div1aText.className = 'far fa-square';
                    var div2a = document.createElement('div');
                    div2a.className = 'bold';
                    if (instruction.credentials) {
                        var div2aText = document.createTextNode(instruction.credentials.join(', '));
                    }
                    var div2b = document.createElement('div');
                    var div2bText = document.createTextNode(instruction.description);
                    col1.appendChild(div1a).appendChild(div1aText);
                    col2.appendChild(div2a).appendChild(div2aText);
                    col2.appendChild(div2b).appendChild(div2bText);
                    row.appendChild(col1);
                    row.appendChild(col2);
                    document.querySelector('#instructions div.card-body').appendChild(row);
                }
                else if (instruction.type == 'break') {
                    var row = document.createElement("div");
                    row.className = 'row';
                    row.addEventListener("click", function () {
                        this.classList.toggle("checked");
                    });
                    var col1 = document.createElement("div");
                    col1.className = 'd-flex align-items-center';
                    var col2 = document.createElement("div");
                    col2.className = '';
                    var col3 = document.createElement("div");
                    col3.className = 'd-flex align-items-center';
                    var tempText = instruction.tool.name;
                    if (instruction.tool.degrees) {
                        tempText = tempText + ' (' + instruction.tool.degrees + '°';
                        if (instruction.tool.mode) {
                            tempText = tempText + ' ' + instruction.tool.mode;
                        }
                        tempText = tempText + ')';
                    }
                    var div1a = document.createElement('div');
                    div1a.className = 'check';
                    var div1aText = document.createElement('i');
                    div1aText.className = 'far fa-square';
                    var div2a = document.createElement('div');
                    div2a.className = 'bold';
                    var div2aText = document.createTextNode(tempText);
                    var div2b = document.createElement('div');
                    var div2bText = document.createTextNode(instruction.description);
                    var div3a = document.createElement('div');
                    div3a.className = 'play';
                    var div3aText = document.createElement('i');
                    div3aText.className = 'fas fa-play';
                    div3aText.setAttribute('data-time', instruction.duration);
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
    httpInstructions.open('GET', 'storage/' + recipe + '/instructions.json', true);
    httpInstructions.send();
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
//# sourceMappingURL=scripts.js.map