(function() {
	'use strict';

	var URL = 'http://api.themoviedb.org/3/';
	var API = '20c37a7bb085a194a8781df8dd193ac1';

	var baseURL,
		size;

	window.addEventListener('load', windowLoadHandler, false);

	function windowLoadHandler() {
		addEventListeners();
		getConfig();
	}

	function addEventListeners() {
		document.getElementById('getPoster').addEventListener('click', getPoster, false);
	}

	function getConfig() {
		ajax(URL + 'configuration?api_key=' + API, loadConfig);
	}

	function loadConfig(content) {
		console.log(content);

		baseURL = content['images']['base_url'];
		size = content['images']['poster_sizes'][3];
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

		console.log(img);
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