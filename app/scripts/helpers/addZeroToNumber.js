export function addZeroToNumber(number) {
	return number.toString().length === 1 ? `${number}.0` : number;
}
