// Read it using the storage API

chrome.storage.sync.get(['clean_struct'], function(items) {
    console.log(items)
    let data = JSON.parse(JSON.stringify(items))
    console.log(data)
    data = data['clean_struct']
    console.log(data)

    let lista = document.getElementById("lista")

    for (let i = 0; i < data.length; i++)
    {
        var list_element = document.createElement('li');
        var div = document.createElement('a');
        div.className="newTab"
        div.innerHTML = data[i]["date"];
        div.href = data[i]["link"]
        list_element.appendChild(div)
        lista.appendChild(list_element);

    }

    if(data.length > 0)
    {

        var more_results_link = document.createElement('a');
    
        more_results_link.href = data[0]["link"]
        more_results_link.className="newTab decoration"
        more_results_link.innerHTML = "Para mais resultados clique aqui"
        document.body.appendChild(more_results_link);
    }

    var links = document.querySelectorAll(".newTab");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});





