function month_to_string(month)
{
    let months_vector = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

    return months_vector[parseInt(month)-1]
}

function time_stamp_to_data(inputDateTime)
{
    const year = inputDateTime.substring(0, 4);
    const month = inputDateTime.substring(4, 6);
    const day = inputDateTime.substring(6, 8);
    const hour = inputDateTime.substring(8, 10);
    const minute = inputDateTime.substring(10, 12);
    const second = inputDateTime.substring(12, 14);

    let month_string = month_to_string(month)
    //const outputDateTime = `${year}/${month}/${day} ${hour}:${minute}:${second}`;

    const outputDateTime = `${month_string} de ${year}`;

    return outputDateTime;
}

function get_month(inputDateTime)
{
    const month = parseInt(inputDateTime.substring(4, 6));
    return month
}

function get_year(inputDateTime)
{
    const year = inputDateTime.substring(0, 4);
    return year
}

var API_SEARCH_URL = 'https://arquivo.pt/textsearch?versionHistory=';

const url = window.location.href;

let searchUrl = API_SEARCH_URL.concat(url).concat("&maxItems=2000")
searchUrl = encodeURI(searchUrl)
console.log(searchUrl)

//default loading state
let super_clean="loading"
chrome.storage.sync.set({"clean_struct":super_clean});


//HTTP request to arquivo.pt API
fetch(searchUrl) .then(response => console.log(response.status) || response) 
.then(response => response.text()) 
.then(body => {
    let json = JSON.parse(body)
    let clean_struct = []
    if(json["response_items"].length == 0)
    {
        chrome.storage.sync.set({"clean_struct":clean_struct});
        super_clean=clean_struct
        return
    }

    let current_month = get_month(json["response_items"][0].tstamp)
    let current_year = get_year(json["response_items"][0].tstamp)
    
    //display at most 1 result per month
    for (let i = 0; i < json["response_items"].length; i++)
    {
        if(get_year(json["response_items"][i].tstamp) < current_year)
        {
            clean_struct.push({"date":time_stamp_to_data(json["response_items"][i].tstamp),"link":json["response_items"][i].linkToArchive})
            current_year = get_year(json["response_items"][i].tstamp)
            current_month = get_month(json["response_items"][i].tstamp)
        }
        else if(get_month(json["response_items"][i].tstamp) < current_month)
        {
            clean_struct.push({"date":time_stamp_to_data(json["response_items"][i].tstamp),"link":json["response_items"][i].linkToArchive})
            current_month = get_month(json["response_items"][i].tstamp)
        }
    }
    chrome.storage.sync.set({"clean_struct":clean_struct});
    super_clean=clean_struct

})


document.addEventListener("visibilitychange", () => {
    //when user activate the tab again, refresh the storage so that it wont display the information from other tabs
    if(!document.hidden)
    {
        chrome.storage.sync.set({"clean_struct":super_clean});
        //console.log(super_clean)
    }
  });

