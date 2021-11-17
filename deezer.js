console.log("Starting Script")


var homeLoginBtn = document.getElementsByClassName('navbar-btn-login')
var clicked = false
var playBtnClicked = false



checkForLogin()
login()



playSong()



function playSong() {
	var body = new MutationObserver(async function (mutations, me) {
		playBtn = document.querySelectorAll('[aria-label="Pause"]')
		console.log(playBtn)
		console.log(playBtnClicked)
		if (playBtn.length > 0 && !playBtnClicked) {
			playBtnClicked = true
			console.log("clicking play")
			playBtn[0].click()
			console.log("done clicking play")
		}
	})

	body.observe(document, {
		childList: true,
		subtree: true
	})

}

function login() {
	let switchLogin = document.getElementById("switch-log-method-link")
	if (switchLogin) {
		console.log("I can switch")
		if (switchLogin.textContent.includes("Log in with email address")) {
			console.log("Changing")
			switchLogin.click()
		}
		let login_mail = document.getElementById("login_mail")
		let login_password = document.getElementById('login_password')
		let login_form_submit = document.getElementById('login_form_submit')
		chrome.storage.sync.get("dockeruser", async ({ dockeruser }) => {
			console.log("checking outside if:", dockeruser)
			if (dockeruser) {

				const { username, password } = dockeruser
				login_mail.value = username
				login_password.value = password
				console.log("clicking submit")
				await sleep(2000)
				login_form_submit.click()
				console.log("clicking submit")

			}
		})
	}
}

async function checkForLogin() {
	console.log("checking in")
	var body = new MutationObserver(async function (mutations, me) {
		homeLoginBtn = document.getElementsByClassName('navbar-btn-login')[0]
		console.log("value of the button: ", homeLoginBtn)
		if (homeLoginBtn && !clicked) {
			clicked = true
			console.log("login button: ", homeLoginBtn)
			homeLoginBtn.click()
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
