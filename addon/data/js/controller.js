//scoped functions
var LocalMusicPlayer = {

	separator: null,
	currentSongRow: null,
	playStyle: 'one',

	selectDir: function () {
		self.port.emit("selectDir", '');
	},
	play: function (dir, filename) {
		document.getElementById('player').src = 'file://' + dir + LocalMusicPlayer.separator + filename;
		document.getElementById('player').play();

		document.getElementById('currentTrack').textContent = filename;

		if (document.getElementById('notificationPref').checked) {
			self.port.emit("play", filename); // for notification
		}
	},
	pause: function () {
		document.getElementById('player').pause();
	},
	stop: function () {
		if (LocalMusicPlayer.currentSongRow !== null) {
			document.getElementById('currentTrack').textContent = '';
			LocalMusicPlayer.currentSongRow = null;
			document.getElementById('player').src = '';
		}
	},
	previousTrack: function () {
		if (document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow - 1]) {
			LocalMusicPlayer.currentSongRow--;
			LocalMusicPlayer.play(
				document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[0].innerHTML,
				document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[1].innerHTML);
		}
	},
	nextTrack: function () {

		if (LocalMusicPlayer.playStyle === 'random') {
			LocalMusicPlayer.random();

		} else {

			if (document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow + 1]) {
				LocalMusicPlayer.currentSongRow++;
				LocalMusicPlayer.play(
					document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[0].innerHTML,
					document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[1].innerHTML);

			} else {

				if (document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow] !== undefined) {

					LocalMusicPlayer.currentSongRow = 0;
					LocalMusicPlayer.play(
						document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[0].innerHTML,
						document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[1].innerHTML);
				}
			}
		}
	},
	random: function () {

		var randomTrackNum = Math.floor((Math.random() * document.getElementById('tracks').rows.length));

		if (document.getElementById('tracks').rows[randomTrackNum]) {
			LocalMusicPlayer.currentSongRow = randomTrackNum;
			LocalMusicPlayer.play(
				document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[0].innerHTML,
				document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[1].innerHTML);
		}
	},
	toggle: function (obj) {

		if (obj.id === 'repeatAll') {

			if (obj.id === LocalMusicPlayer.playStyle) {
				document.getElementById('repeatAll').style.backgroundColor = '';
				document.getElementById('random').style.backgroundColor = '';
				LocalMusicPlayer.playStyle = 'one';
				document.getElementById('player').removeEventListener('ended', LocalMusicPlayer.songEnded);
			} else {
				document.getElementById('repeatAll').style.backgroundColor = '#B2B2B2';
				document.getElementById('random').style.backgroundColor = '';
				LocalMusicPlayer.playStyle = 'repeatAll';
				document.getElementById('player').addEventListener('ended', LocalMusicPlayer.songEnded);
			}

		} else if (obj.id === 'random') {

			if (obj.id === LocalMusicPlayer.playStyle) {
				document.getElementById('repeatAll').style.backgroundColor = '';
				document.getElementById('random').style.backgroundColor = '';
				LocalMusicPlayer.playStyle = 'one';
				document.getElementById('player').removeEventListener('ended', LocalMusicPlayer.songEnded);
			} else {
				document.getElementById('repeatAll').style.backgroundColor = '';
				document.getElementById('random').style.backgroundColor = '#B2B2B2';
				LocalMusicPlayer.playStyle = 'random';
				document.getElementById('player').addEventListener('ended', LocalMusicPlayer.songEnded);
			}
		}
	},
	songEnded: function () {

		if (LocalMusicPlayer.playStyle === 'repeatAll') {
			LocalMusicPlayer.nextTrack();
		} else if (LocalMusicPlayer.playStyle === 'random') {
			LocalMusicPlayer.random();
		}
	},
	tweetTrack: function () {

		if (LocalMusicPlayer.currentSongRow !== null) {

			var url = 'https://twitter.com/intent/tweet?hashtags=LocalMusicPlayer&text=' +
				encodeURIComponent('Listening to "' + document.getElementById('tracks').rows[LocalMusicPlayer.currentSongRow].cells[1].innerHTML + '"');
			self.port.emit("tweetTrack", url);
		}
	},
	populateRow: function (song, iteration) {
		var table = document.getElementById("tracks"),
			row = table.insertRow(table.rows.length),
			cell0 = row.insertCell(0),
			cell1 = row.insertCell(1),
			cell2 = row.insertCell(2);

		var dirText = document.createTextNode(song.dir);
		cell0.appendChild(dirText);
		cell0.style.display = 'none';

		var filenameText = document.createTextNode(song.filename);
		cell1.appendChild(filenameText);

		var img = document.createElement('img');
		img.src = "../images/play-24.png";

		img.addEventListener('click', function (event) {

			LocalMusicPlayer.currentSongRow = iteration;
			LocalMusicPlayer.play(song.dir, song.filename);

		}, false);

		cell2.appendChild(img);
	},
	toggleView: function (obj) {
		if (obj.id === 'libraryShow') {

			document.getElementById('playerView').style.display = 'none';
			document.getElementById('libraryView').style.display = 'inline';

		} else if (obj.id === 'libraryBack') {

			document.getElementById('libraryView').style.display = 'none';
			document.getElementById('playerView').style.display = 'inline';

		} else if (obj.id === 'settingsShow') {

			document.getElementById('playerView').style.display = 'none';
			document.getElementById('settingsView').style.display = 'inline';

		} else if (obj.id === 'settingsBack') {

			document.getElementById('settingsView').style.display = 'none';
			document.getElementById('playerView').style.display = 'inline';
		}
	},
	removeDirs: function () {

		var dirsToRemove = [];

		for (var j = 0; j < document.getElementById('directoriesTable').rows.length; j++) {

			if (document.getElementById('directoriesTable').rows[j].cells[1].firstChild.checked) {

				dirsToRemove.push(document.getElementById('directoriesTable').rows[j].cells[0].innerHTML);
			}
		}

		if (dirsToRemove.length > 0) {
			self.port.emit("dirsToRemove", dirsToRemove);
		}
	}
};


// event listeners
document.getElementById('stopTrack').addEventListener('click', LocalMusicPlayer.stop);
document.getElementById('previousTrack').addEventListener('click', LocalMusicPlayer.previousTrack);
document.getElementById('nextTrack').addEventListener('click', LocalMusicPlayer.nextTrack);
document.getElementById('repeatAll').addEventListener('click', function () {
	LocalMusicPlayer.toggle(this);
});
document.getElementById('random').addEventListener('click', function () {
	LocalMusicPlayer.toggle(this);
});
document.getElementById('libraryShow').addEventListener('click', function () {
	LocalMusicPlayer.toggleView(this);
});
document.getElementById('tweetTrack').addEventListener('click', LocalMusicPlayer.tweetTrack);
document.getElementById('libraryAdd').addEventListener('click', LocalMusicPlayer.selectDir);
document.getElementById('libraryRemove').addEventListener('click', LocalMusicPlayer.removeDirs);
document.getElementById('libraryBack').addEventListener('click', function () {
	LocalMusicPlayer.toggleView(this);
});
document.getElementById('settingsShow').addEventListener('click', function () {
	LocalMusicPlayer.toggleView(this);
});
document.getElementById('settingsBack').addEventListener('click', function () {
	LocalMusicPlayer.toggleView(this);
});
document.getElementById('notificationPref').addEventListener("change", function (event) {
	if (document.getElementById('notificationPref').checked) {
		self.port.emit("notificationSetting", true);
	} else {
		self.port.emit("notificationSetting", false);
	}
}, false);


// populate panel with addon data when shown
self.port.on("uiData", function (uiData) {
	var parsed = JSON.parse(uiData);

	LocalMusicPlayer.separator = parsed.separator;

	// remove children
	while (document.getElementById("tracks").firstChild) {
		document.getElementById("tracks").removeChild(document.getElementById("tracks").firstChild);
	}

	// add selected directories to library view 
	if (parsed.dirs.length > 0) {

		// remove children first
		var element = document.getElementById('libraries');
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}

		document.getElementById('libraryRemove').disabled = false;

		// populate
		var table = document.createElement('table');
		table.id = 'directoriesTable';

		for (var i = 0; i < parsed.dirs.length; i++) {

			var row = table.insertRow(table.rows.length),
				cell0 = row.insertCell(0),
				cell1 = row.insertCell(1);

			var dirText = document.createTextNode(parsed.dirs[i]);
			cell0.appendChild(dirText);

			var checkbox = document.createElement("input");
			checkbox.setAttribute("type", "checkbox");

			cell1.appendChild(checkbox);
		}

		document.getElementById('libraries').appendChild(table);

	} else if (parsed.dirs.length === 0) {

		// remove children first
		var librariesElement = document.getElementById('libraries');
		while (librariesElement.firstChild) {
			librariesElement.removeChild(librariesElement.firstChild);
		}

		document.getElementById('libraryRemove').disabled = true;
		document.getElementById('libraries').appendChild(document.createTextNode('No directories added.'));
	}

	// add music files to player view
	if (parsed.files !== undefined) {
		if (parsed.files.length > 0) {
			for (var j = 0; j < parsed.files.length; j++) {
				LocalMusicPlayer.populateRow(parsed.files[j], j);
			}
		}
	}

	document.getElementById('notificationPref').checked = parsed.notification;
});
