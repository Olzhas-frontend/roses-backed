export function getAutheErrorKey(str) {
	return str.match(/\(([^)]+)\)/)[1];
}
