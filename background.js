const url = "localhost:5000/api/stream/getuser"
const userdata = {
	username,
	password,
	playList: []
}
/*
* get username and password
*		# make http request to the server to collect the username and password for one account
*		# read values from document for now
*/

chrome.runtime.onInstalled.addListener(() => {

})



function setup(params) {
	fetch(url).then((resp) => {

		resp.body.
		chrome.storage.sync.set(userdata)
	}).catch((err) => {

	})
}



/*
* store username and password
*/

// pick random times to play song on url

// check if the user is logged in

// stream 6 times a day on each link

// keep track of streams

// click play when opening up platform
