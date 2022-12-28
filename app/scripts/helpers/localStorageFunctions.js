function removeFromLS(name) {
	if (localStorage.getItem(name)) {
		localStorage.removeItem(name);
	}
}

function addToLS(name, data) {
	if (!localStorage.getItem(name)) {
		localStorage.setItem(name, data);
	}
	return data;
}

function getFromLS(name) {
	if (localStorage.getItem(name)) {
		const data = localStorage.getItem(name);

		return data;
	}
}

export { removeFromLS, addToLS, getFromLS };
