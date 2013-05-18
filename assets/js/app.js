(function() {
    'use strict';

    var URL = 'http://api.themoviedb.org/3/',
        API = '20c37a7bb085a194a8781df8dd193ac1',
        baseURL = localStorage.getItem('url'),
        size = localStorage.getItem('size');

    window.addEventListener('load', windowLoadHandler, false);

    function windowLoadHandler() {
        getConfig();
        getFilmTitles();
    }

    function addEventListeners() {
        document.getElementById('getPoster').addEventListener('click', getPoster, false);
    }

    function getConfig() {
        if (!localStorage.getItem('url')){
            ajax(URL + 'configuration?api_key=' + API, loadConfig);       
        }
    }

    function loadConfig(content) {
        console.log(content);

        var baseURL = content['images']['base_url'];
        var size = content['images']['poster_sizes'][3];

        localStorage.setItem('url', baseURL);
        localStorage.setItem('size', size);
    }

    // Extracts film titles from element IDs
    function getFilmTitles() {
        var posters = document.getElementsByClassName('poster');
        for (var i = 0; i < posters.length; i++) {
            search(posters[i], posters[i].id);
        }
    }

    function search(poster, filmTitle) {
        return ajax(URL + 'search/movie?query=' + encodeURI(filmTitle) + '&api_key=' + API, function (content) {
            getPoster(content, poster);
        });
    }

    function getPoster(content, poster) {
        var filmPosterPath = content['results'][0]['poster_path'];
        var imgPath = baseURL + size + filmPosterPath;
        outputPoster(imgPath, poster);
    }

    function outputPoster(imgPath, poster) {
        var img = document.createElement('img');
        img.setAttribute('src', imgPath);
        poster.appendChild(img);
    }

    // AJAX utility
    function ajax(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    callback(JSON.parse(xhr.responseText));
                    console.log("Request to " + url + " succeeded");
                }
                else {
                    console.log("Request to " + url + " failed.");
                }
            }
        };
        xhr.open("GET", url, false);
        xhr.send();
    }
})();