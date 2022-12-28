function removeFromSS(name) {
	sessionStorage.removeItem(name);
}

function addToSS(name, data) {
	sessionStorage.setItem(name, data);
}

function getFromSS(name) {
	if (sessionStorage.getItem(name)) {
		const data = sessionStorage.getItem(name);
		return data;
	}
}

export { removeFromSS, addToSS, getFromSS };
