console.defaultLog = console.log.bind(console);
console.logs = [];
console.log = function () {
	// default &  console.log()
	console.defaultLog.apply(console, arguments);
	// new & array data
	console.logs.push(Array.from(arguments));
}

enterCliked = false;
while (true) {

	console.logs.forEach((obj) => {
		if (obj[0] == "title= Welcome to Google Chrome" && !enterCliked) {
			document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: false, cancelable: false, composed: false, key: '', keyCode: '13', location: 0 }));
			document.dispatchEvent(new KeyboardEvent("keyup", { bubbles: false, cancelable: false, composed: false, key: '', keyCode: '13', location: 0 }));
			enterCliked = true;
		}
		if (obj[0] == "title= Untitled - Google Chrome") {
			text = location.href;
			url.lastIndexOf(":");
			let result = text.substr(text.lastIndexOf(":") + 1, 4);
			let url = text.substr(0, text.lastIndexOf(":") + 1) + (Number(result) + 1);
			location.href = url;
		}
	})
}