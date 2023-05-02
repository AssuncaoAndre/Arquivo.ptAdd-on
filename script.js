// Read it using the storage API
var loading = 1
get_data()
//refresh every 2 seconds (until a final state is reached)
const intervalId = setInterval(get_data, 2000);

function get_data()
{
    chrome.storage.sync.get(['clean_struct'], function(items) {
        let data = JSON.parse(JSON.stringify(items))
        data = data['clean_struct']

        let loading_p = document.getElementById("loading")
        if(data == "loading")
        {
            loading_p.style.display = "inline-block"
            return;
        }
        
        loading_p.style.display = "none"
        //final state reached (not loading) so dont refresh anymore
        clearInterval(intervalId);

        let lista = document.getElementById("lista")
        if (data.length == 0)
        {
            loading_p.style.display = "inline-block"
            loading_p.innerHTML="Nã há resultados históricos para esta página :("
        }

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
    
        //links are opened in another tab
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
}





