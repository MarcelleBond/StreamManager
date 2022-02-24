const getUser = `https://night-shadow.eastus.cloudapp.azure.com/api/test/getUsers`
const getSongs = `https://night-shadow.eastus.cloudapp.azure.com/api/test/getSongs`
const userdata = {
	username: "",
	password: "",
	playList: [{ name: "", url: "", time: "", played: false }],
	valid: false
}

console.log("Hellow world")
if (userdata.username === "")
	getUsername()
else
	setupStreams()

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

function getCachedData() {

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
		getUsername()
	}
}

function getUsername() {
	fetch(getUser).then(response => response.json())
		.then(data => {
			console.log("response from get user", data)
			Object.assign(userdata, data)
			chrome.storage.sync.set({ "dockeruser": userdata })
			console.log("Userdata after getting user name and password", userdata)
			getSongList()
		}).catch((err) => {

			console.log(err)
		})
}

function getSongList() {
	fetch(getSongs).then(response => response.json())
		.then(data => {
			Object.assign(userdata, data)
			chrome.storage.sync.set({ "dockeruser": userdata })
			setupStreams()
		}).catch((err) => {

			console.log(err)
		})
}

