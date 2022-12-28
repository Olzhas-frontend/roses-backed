export function checkValueIsEmpty(value) {
	return value === null || value.match(/^ *$/) !== null;
}
