/// <reference path="chrome.intellisense.js" />

/* const getUser = `https://night-shadow.eastus.cloudapp.azure.com/api/agents/GetCredential`
const getSongs = `https://night-shadow.eastus.cloudapp.azure.com/api/agents/GetPlaylist` */
const getUser = `https://localhost:5001/api/test/getusers`
const getSongs = `https://localhost:5001/api/test/GetSongs`
const tabUrls = ["spotify", "deezer", "pandora"];
const userdata = {
	username: "",
	password: "",
	playList: [{ Name: "", Url: "", time: "", played: false }],
	valid: false
}

// isValid()

if (userdata.username === "")
	getCachedData()
else {
	setupStreams()
}


function setupStreams() {
	if (!isValid()) {
		getSongList()
	}
	for (var i = 0; i < userdata.playList.length; i++) {
		if (userdata.playList[i].played == false && userdata.playList[i].Url != "") {
			setTimeout((index) => {
				chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
					console.log(tabs)
					tabs.forEach(tab => {
						if (findUrl(tab.url)) {
							chrome.tabs.remove(tab.id)
						}
					})
					chrome.tabs.create({
						url: userdata.playList[index].Url
					})
				})
				userdata.playList[index].played = true
				chrome.storage.sync.set({ "dockeruser": userdata })
			}, userdata.playList[i].time, i)
		}
	}
	userdata.valid = false
}


function isValid() {
	if (userdata.playList.length == 0)
		return userdata.valid
	for (let i = 0; i < userdata.playList.length; i++) {
		if (userdata.playList[i].played == false)
			userdata.valid = true
	}
	return userdata.valid
}

function findUrl(url) {
	for (var i = 0; i < tabUrls.length; i++) {
		if (url.toLowerCase().includes(tabUrls[i].toLowerCase()))
			return true
	}
	return false
}

function getCachedData() {

	let noCache = true
	chrome.storage.sync.get("dockeruser", ({ dockeruser }) => {
		if (dockeruser) {
			Object.assign(userdata, dockeruser)
			noCache = false
		}
		if (noCache) {
			getUsername()
		}
		setupStreams()
	})
}

function getUsername() {
	fetch(getUser).then(response => response.json())
		.then(data => {
			Object.assign(userdata, data)
			chrome.storage.sync.set({ "dockeruser": userdata })
			getSongList()
		}).catch((err) => {
			console.log(err)
		})
}

function getSongList() {
	fetch(getSongs + `?email=${userdata.username}`).then(response => response.json())
		.then(data => {
			mapPlaylist(data)
			chrome.storage.sync.set({ "dockeruser": userdata })
			setupStreams()
		}).catch((err) => {
			console.log(err)
		})
}

function mapPlaylist(playlists) {
	userdata.playList = []
	playlists.forEach(playlist => userdata.playList.push({ Name: playlist.Name, Url: playlist.Url, time: playlist.time, played: false }))
	userdata.valid = true
}



