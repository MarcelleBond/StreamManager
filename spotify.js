
const userdata = {
	username: "",
	password: "",
	playList: [{ url: "", time: "", played: false }],
	valid: false
}
var playBtn= null
var playing = false

var homeLoginBtn = document.querySelectorAll('[data-testid="login-button"]')
var loginUsername = document.getElementById('login-username')
var loginPassword = document.getElementById('login-password')
var loginButton = document.getElementById('login-button')
var checkBox = document.getElementById("login-remember")
// var advert = document.querySelectorAll('[data-testid="now-playing-widget"]')
// var advert = document.querySelectorAll('[aria-label="Advertisement]')

if (homeLoginBtn.length > 0) {
	homeLoginBtn[0].click()
}

checkLogin()
startSong()


function checkLogin() {
	if (loginButton != null) {
		chrome.storage.sync.get("dockeruser", ({ dockeruser }) => {
			console.log("checking outside if:", dockeruser)
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
			playing = true
			await sleep(2000)
			playBtn.click()
			me.disconnect() // stop observing
			return
		}
	})

	body.observe(document, {
		childList: true,
		subtree: true
	})
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
