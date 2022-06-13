console.log("Starting Script")


var homeLoginBtn = document.getElementsByClassName('navbar-btn-login')
var clicked = false
var playBtnClicked = false
var playListBtnClicked = false



checkForLogin()
login()
playSong()



function playSong() {
	var body = new MutationObserver(async function (mutations, me) {
		playBtn = document.querySelectorAll('[aria-label="Pause"]')
		playListBtn = document.querySelector("#page_naboo_playlist > div.catalog-content > div > div._5BJsj > div > div._2yyo6 > div._1k3N9 > div > div:nth-child(1) > button")
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
			switchToPlaylist()
		}
		if (playListBtn != null && !playListBtnClicked) {
			me.disconnect()
			playListBtnClicked = true
			console.log("clicking play")
			await sleep(5000)
			console.log(playListBtn)
			playListBtn.click()
			console.log("done clicking play")
		}
	})

	body.observe(document, {
		childList: true,
		subtree: true
	})

}

function switchToPlaylist() {
	var playbackPosition = document.querySelector("#page_player > div > div.player-track > div > div.track-seekbar > div > div.slider-counter.slider-counter-current")
	console.log(playbackPosition.innerHTML)
	playbackPosition.addEventListener('DOMSubtreeModified', () => {
		// var whatsPlaying = document.querySelector('[data-testid="now-playing-widget"]')
		var playbackDuration = document.querySelector("#page_player > div > div.player-track > div > div.track-seekbar > div > div.slider-counter.slider-counter-max")
		if (playbackDuration.innerHTML == playbackPosition.innerHTML /* && whatsPlaying.getAttribute("aria-label").toLowerCase().indexOf("advertisement") == -1 */) {
			window.open("https://deezer.page.link/yAjRJ3XPBMHpoSQ69")
			window.close()
		}
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
