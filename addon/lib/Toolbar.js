var {
	ActionButton
} = require('sdk/ui/button/action');
var {
	Toolbar
} = require("sdk/ui/toolbar");
var {
	Frame
} = require("sdk/ui/frame");
var Data = require("./Data"),
	Localisation = require("./Localisation"),
	Panel = require("./Panel"),
	frameObject,
	playButton,
	repeatAll,
	random,
	playing = false;

exports.init = function () {

	playButton = ActionButton({
		id: "localmusicplayer-play",
		label: Localisation.getString("hotkeyPlay_title"),
		icon: Data.get("images/play-24.png"),
		onClick: function (state) {

			if (playing) {
				Panel.get().port.emit("pauseTrack", '');
				playing = false;
				playButton.icon = Data.get("images/play-24.png");
			} else {
				Panel.get().port.emit("playTrack", '');
				playing = true;
				playButton.icon = Data.get("images/pause-24.png");
			}
		}
	});

	var previous = ActionButton({
		id: "localmusicplayer-prev",
		label: Localisation.getString("hotkeyPrev_title"),
		icon: Data.get("images/previous-24.png"),
		onClick: function (state) {
			Panel.get().port.emit("prevTrack", '');
		}
	});

	var stop = ActionButton({
		id: "localmusicplayer-stop",
		label: Localisation.getString("hotkeyStop_title"),
		icon: Data.get("images/stop-24.png"),
		onClick: function (state) {
			Panel.get().port.emit("stopTrack", '');
		}
	});

	var next = ActionButton({
		id: "localmusicplayer-next",
		label: Localisation.getString("hotkeyNext_title"),
		icon: Data.get("images/next-24.png"),
		onClick: function (state) {
			Panel.get().port.emit("nextTrack", '');
		}
	});

	frameObject = new Frame({
		url: Data.get("html/FrameView.html")
	});

	repeatAll = ActionButton({
		id: "localmusicplayer-repeatAll",
		label: Localisation.getString("repeatAll_title"),
		icon: Data.get("images/repeatAll-24.png"),
		onClick: function (state) {
			Panel.get().port.emit("repeatAll", '');

			if (this.badge === '~') {

				this.badge = "";
			} else {
				this.badge = "~";
				random.badge = "";
			}
		}
	});

	random = ActionButton({
		id: "localmusicplayer-random",
		label: Localisation.getString("random_title"),
		icon: Data.get("images/random-24.png"),
		onClick: function (state) {
			Panel.get().port.emit("random", '');

			if (this.badge === '~') {

				this.badge = "";
			} else {
				this.badge = "~";
				repeatAll.badge = "";
			}
		}
	});

	var toolbar = Toolbar({
		title: Localisation.getString("addonName_title"),
		//hidden: true,
		items: [playButton, previous, stop, next, frameObject, repeatAll, random]
	});
};

exports.getFrame = function () {
	return frameObject;
};

exports.setPlaying = function (value) {
	playing = value;

	// if play clicked from a panel row
	if (playing) {
		playButton.icon = Data.get("images/pause-24.png");
	} else {
		playButton.icon = Data.get("images/play-24.png");
	}
};

exports.setRepeatAll = function (value) {
	if (value) {
		repeatAll.badge = "~";
	} else {
		repeatAll.badge = "";
	}
};

exports.setRandom = function (value) {
	if (value) {
		random.badge = "~";
	} else {
		random.badge = "";
	}
};