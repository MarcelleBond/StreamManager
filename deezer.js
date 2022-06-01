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
		if (playBtn.length > 0 && !playBtnClicked) {
			me.disconnect()
			playBtnClicked = true
			console.log("clicking play")
			await sleep(5000)
			let btn = playBtn[0]
			console.log(btn)
			btn.click()
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
		if (switchLogin.textContent.includes("Log in with email address")) {
			switchLogin.click()
		}
		let login_mail = document.getElementById("login_mail")
		let login_password = document.getElementById('login_password')
		let login_form_submit = document.getElementById('login_form_submit')
		chrome.storage.sync.get("dockeruser", async ({ dockeruser }) => {
			if (dockeruser) {

				const { username, password } = dockeruser
				login_mail.value = username
				login_password.value = password
				await sleep(2000)
				login_form_submit.click()

			}
		})
	}
}

async function checkForLogin() {
	var body = new MutationObserver(async function (mutations, me) {
		homeLoginBtn = document.getElementsByClassName('navbar-btn-login')[0]
		if (homeLoginBtn && !clicked) {
			clicked = true
			homeLoginBtn.click()
			me.disconnect() // stop observing
			return
		}
		let check = document.querySelector("#page_topbar > div:nth-child(3) > button")
		if (check != null)
			me.disconnect()
	})

	body.observe(document, {
		childList: true,
		subtree: true
	})
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
