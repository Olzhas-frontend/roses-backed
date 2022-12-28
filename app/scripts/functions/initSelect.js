import { ItcCustomSelect } from '../vendor/ItcCustomSelect';

export const sortselect = new ItcCustomSelect('#select-1', {
	name: 'sort',
	targetValue: 'По популярности',
	options: [
		['asc', 'По алфавиту'],
		['По популярности', 'По популярности'],
		['desс', 'По убыванию цены'],
		['asc', 'По возрастанию цены'],
	],
});
