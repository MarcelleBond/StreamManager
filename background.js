const getUser = `https://localhost:5001/api/test/getUsers`
const getSongs = `https://localhost:5001/api/test/getSongs`
const userdata = {
	username: "",
	password: "",
	playList: [{ url: "", time: "", played: false }],
	valid: false
}


/*
* get username and password
*		# make http request to the server to collect the username and password for one account
*		# store username and password in local storage
*/

chrome.runtime.onInstalled.addListener(() => {
	getUsername()
})

function setupStreams() {
	userdata.playList.forEach(el => {
		if (el.played == false) {
			setTimeout(() => {
				chrome.tabs.create({
					url: el.url
				})
				el.played = true
			}, el.time)
		}
	})
}

function getUsername() {

	let noCache = true
	console.log("noCache: ", noCache)
	chrome.storage.sync.get("dockeruser", ({ dockeruser }) => {
		console.log("checking outside if:", dockeruser)
		if (dockeruser) {
			console.log("checking insideside if:", dockeruser)
			Object.assign(userdata, dockeruser)
			console.log(userdata.valid)
			noCache = false
			console.log("noCache: ", noCache)
		}
	})

	if (noCache) {
		console.log("checking outside if no cache")
		fetch(getUser).then(response => response.json())
			.then(data => {
				// console.log("response from get user",data)
				Object.assign(userdata, data)
				chrome.storage.sync.set({ "dockeruser": userdata })
				// console.log("Userdata after getting user name and password",userdata)
				getSongList()
			}).catch((err) => {

				console.log(err)
			})
	}
}

function getSongList() {
	fetch(getSongs).then(response => response.json())
		.then(data => {
			// console.log("response from get songs",data)
			Object.assign(userdata, data)
			chrome.storage.sync.set({ dockeruser: userdata })
			// console.log("Userdata after getting somgs: ",userdata)
			// setupStreams()
		}).catch((err) => {

			console.log(err)
		})
}

// pick random times to play song on url

// test = document.querySelectorAll('[data-testid="play-button"]') play song


// check if the user is logged in

// stream 6 times a day on each link

// keep track of streams

// click play when opening up platform
