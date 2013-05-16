(function() {
	'use strict';

	var URL = 'http://api.themoviedb.org/3/';
	var API = '20c37a7bb085a194a8781df8dd193ac1';

	var baseURL = localStorage.getItem('url'),
		size = localStorage.getItem('size');

	window.addEventListener('load', windowLoadHandler, false);

	function windowLoadHandler() {
		addEventListeners();
		getConfig();
		//getFilmID('Pitch Perfect');
		// search('Crimson Tide');
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
		// Search document for all poster elements
		var posters = document.getElementsByClassName('poster');
		
		// Get id from each poster element
		for (var i = 0; i < posters.length; i++) {
			search(posters[i].id);
		}
	}

	function search(filmTitle) {
		ajax(URL + 'search/movie?query=' + encodeURI(filmTitle) + '&api_key=' + API, function(content){
			console.log(content['results'][0]['poster_path']);
			var filmID = content['results'][0]['id'];
			var filmPosterPath = content['results'][0]['poster_path'];

			// Build Poster URL
			var imgPath = baseURL + size + filmPosterPath;
	
			drawPosterNew(imgPath);
		});
	}

	function getFilmID(filmTitle) {
		ajax(URL + 'search/movie?query=' + filmTitle + '&api_key=' + API, function(content){
			console.log(content);
		});
	}

	function getPoster() {
		ajax(URL + 'movie/114150/images?api_key=' + API , drawPoster);
	}

	function drawPoster(content) {
		var posterDiv = document.getElementById('poster');
		var imgPath = content['posters'][0]['file_path'];

		var img = document.createElement('img');
		img.setAttribute('src', baseURL + size + imgPath);

		posterDiv.appendChild(img);
	}

	function drawPosterNew(path) {
		var posterDiv = document.getElementById('poster');
		var img = document.createElement('img');
		img.setAttribute('src', path);
		posterDiv.appendChild(img);
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
		xhr.open("GET", url, true);
		xhr.send();
	}
})();