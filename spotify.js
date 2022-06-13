
var playBtn = null
var playing = false

var homeLoginBtn = document.querySelectorAll('[data-testid="login-button"]')
var loginUsername = document.getElementById('login-username')
var loginPassword = document.getElementById('login-password')
var loginButton = document.getElementById('login-button')
var checkBox = document.getElementById("login-remember")

if (homeLoginBtn.length > 0) {
	homeLoginBtn[0].click()
}

checkLogin()
startSong()


function checkLogin() {
	if (loginButton != null) {
		chrome.storage.sync.get("dockeruser", ({ dockeruser }) => {
			if (dockeruser) {

				const { username, password } = dockeruser
				Login(username, password)
			}
		})
	}
}

async function Login(username, password) {
	loginUsername.value = username
	loginPassword.focus()
	const keyboardEventInit = { bubbles: false, cancelable: false, composed: false, key: '', code: '', location: 0 };
	loginPassword.dispatchEvent(new KeyboardEvent("keydown", keyboardEventInit));
	loginPassword.value = password
	loginPassword.dispatchEvent(new KeyboardEvent("keyup", keyboardEventInit));
	loginPassword.dispatchEvent(new Event('change', { bubbles: true })); // usually not needed
	if (checkBox.value != "on")
		checkBox.click()
	loginButton.click()
}

async function startSong() {

	var body = new MutationObserver(async function (mutations, me) {
		playBtn = document.querySelectorAll('[data-testid="play-button"]')[1]
		if (playBtn && !playing) {
			console.log("playing song")
			me.disconnect() // stop observing
			playing = true
			await sleep(5000)
			playBtn.click()
			console.log("clicked play")
			await sleep(5000)
			switchToPlaylist()
		}
	})

	body.observe(document, {
		childList: true,
		subtree: true
	})
}

function switchToPlaylist() {
	if (location.href == "https://open.spotify.com/playlist/37i9dQZF1DWUoBHp4pr8cg")
		return
	var playbackPosition = document.querySelector('[data-testid="playback-position"]')
	console.log(playbackPosition.innerHTML)
	playbackPosition.addEventListener('DOMSubtreeModified', () => {
		var whatsPlaying = document.querySelector('[data-testid="now-playing-widget"]')
		var playbackDuration = document.querySelector('[data-testid="playback-duration"]')
		if (playbackDuration.innerHTML == playbackPosition.innerHTML && whatsPlaying.getAttribute("aria-label").toLowerCase().indexOf("advertisement") == -1)
			location.href = "https://open.spotify.com/playlist/37i9dQZF1DWUoBHp4pr8cg"
	})
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
