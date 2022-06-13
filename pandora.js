CheckHomePage()
CheckLoginPage()
PlaySong()


function CheckHomePage() {
	console.log("starting checks")
	var body = new MutationObserver(async function (mutations, me) {
		var HSLBtn = document.querySelector("body > div.Container > div > div.Onboarding.Onboarding--notSticky > div:nth-child(1) > div > div.AnonHeader.sticky > div > div.AnonHeader__anonButtons > div > ul > li:nth-child(3) > a")
		var HSLBtn2 = document.querySelector("body > div.Container > div > div.region-topBar.region-topBar--searchT3 > div.Nav.Nav--lightTheme.Nav--standard > ul > li.NavSecondary__item.NavSecondary__last > a.ButtonLink.ButtonLink--nav.ButtonLink--nav--login--anonymous.ButtonLink--nav--login--lightTheme")
		if (HSLBtn != null) {
			console.log(HSLBtn.href)
			HSLBtn.dispatchEvent(new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				view: window
			}))
			// location.href = HSLBtn.href
			me.disconnect()
		}
		else if (HSLBtn2 != null) {
			console.log(HSLBtn2)
			HSLBtn2.dispatchEvent(new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				view: window
			}))
			// location.href = HSLBtn2.href
			me.disconnect()
		}
		var LoginBtn = document.querySelector('[data-qa="login_button"]')
		if (LoginBtn != null) {
			me.disconnect()
		}

	})

	body.observe(document, {
		childList: true,
		subtree: true
	})
}

function CheckLoginPage() {
	var body = new MutationObserver(async function (mutations, me) {
		var LoginBtn = document.querySelector('[data-qa="login_button"]')
		var profile = document.querySelector("body > div.Container > div > div.region-topBar.region-topBar--searchT3 > div.Nav.Nav--lightTheme.Nav--standard.Nav--rightRail > ul > li.NavSecondary__item.NavSecondary__last > button")
		if (LoginBtn != null) {
			chrome.storage.sync.get("dockeruser", ({ dockeruser }) => {
				if (dockeruser) {
					const { username, password } = dockeruser
					Login(username, password)
				}
			})
			me.disconnect()
		}
		if (profile != null)
			me.disconnect()
	})

	body.observe(document, {
		childList: true,
		subtree: true
	})

}

async function Login(username, password) {
	var LoginBtn = document.querySelector('[data-qa="login_button"]')
	var EmailInput = document.querySelector('[data-qa="email_input"]')
	var PwdInput = document.querySelector('[data-qa="password_input"]')
	const keyboardEventInit = { bubbles: false, cancelable: false, composed: false, key: '', code: '', location: 0 };
	console.log("before assigning ", EmailInput.value, PwdInput.value)

	EmailInput.focus()
	EmailInput.dispatchEvent(new KeyboardEvent("keydown", keyboardEventInit));
	EmailInput.value = username
	EmailInput.dispatchEvent(new KeyboardEvent("keyup", keyboardEventInit));
	EmailInput.dispatchEvent(new Event('change', { bubbles: true }));

	PwdInput.focus()
	PwdInput.dispatchEvent(new KeyboardEvent("keydown", keyboardEventInit));
	PwdInput.value = password
	PwdInput.dispatchEvent(new KeyboardEvent("keyup", keyboardEventInit));
	PwdInput.dispatchEvent(new Event('change', { bubbles: true }));
	var showBtn = document.querySelector("#form-template > div:nth-child(2) > div > label > div.FormInput__container > div > button")
	showBtn.click()
	console.log("After assigning ", EmailInput.value, PwdInput.value)
	await sleep(10000)
	while (LoginBtn != null) {
		LoginBtn.click()
		await sleep(10000)
	}
}

async function PlaySong() {
	var body = new MutationObserver(async function (mutations, me) {
		
		var profile = document.querySelector('[data-qa="header_profile_image"]')
		var PlayBtn = document.getElementsByClassName("ButtonRow__button ButtonRow__button--play")[0]
		console.log("wating for play Btn: ", PlayBtn)
		if (profile != null && PlayBtn != null) {
			console.log("We in")
			me.disconnect()
			PlayBtn.click()
			await sleep(30000)
			var div = document.querySelector("#region-coachmark")
			var iframe = div.querySelector('iframe')
			console.log(iframe)
			var RewardBtn = iframe.contentWindow.document.querySelector("#reward")
			console.log("rewardBtn: ", RewardBtn)
			if (RewardBtn != null) {
				console.log("clicking rewardBtn")
				RewardBtn.click()
			}
			console.log("Waiting for 2 minutes")
			await sleep(1200000)
			var timer = document.querySelector("body > div.Container > div > div.region-bottomBar > nav > div.Tuner__ContentWrapper.Tuner__ContentWrapper--withTrackDetails > div.Tuner__VolumeDurationControl > div > div.Duration.VolumeDurationControl__Duration")
			while (timer == null) {
				console.log("clicking play")
				PlayBtn.click()
				await sleep(5000)
				timer = document.querySelector("body > div.Container > div > div.region-bottomBar > nav > div.Tuner__ContentWrapper.Tuner__ContentWrapper--withTrackDetails > div.Tuner__VolumeDurationControl > div > div.Duration.VolumeDurationControl__Duration")
			}
			var inPlayList = localStorage.getItem("inPlayList")
			console.log("Playlist check beforec switch: ",inPlayList)
			if(inPlayList == "yes"){
				localStorage.setItem("inPlayList", "no")
				return
			}
			switchToPlaylist()
		}

	})

	body.observe(document, {
		childList: true,
		subtree: true
	})

}

function switchToPlaylist() {
	var playbackPosition = document.querySelector("body > div.Container > div > div.region-bottomBar > nav > div.Tuner__ContentWrapper.Tuner__ContentWrapper--withTrackDetails > div.Tuner__VolumeDurationControl > div > div.Duration.VolumeDurationControl__Duration > span:nth-child(1)")
	console.log(playbackPosition.innerHTML)
	playbackPosition.addEventListener('DOMSubtreeModified', () => {
		var playbackDuration = document.querySelector("body > div.Container > div > div.region-bottomBar > nav > div.Tuner__ContentWrapper.Tuner__ContentWrapper--withTrackDetails > div.Tuner__VolumeDurationControl > div > div.Duration.VolumeDurationControl__Duration > span:nth-child(3)")
		if (playbackDuration.innerHTML == playbackPosition.innerHTML /* && whatsPlaying.getAttribute("aria-label").toLowerCase().indexOf("advertisement") == -1 */) {
			localStorage.setItem("inPlayList", "yes")
			var inPlayList = localStorage.getItem("inPlayList")
			console.log("Playlist check after switch: ",inPlayList)
			
			location.href = "https://pandora.app.link/gWzA0v2vPqb"
		}
	})
}



function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getElementByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

