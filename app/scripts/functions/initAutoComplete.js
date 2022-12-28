import searchClient from '../apisServices/algoliaClient';

import { createLocalStorageRecentSearchesPlugin, refine } from '@algolia/autocomplete-plugin-recent-searches';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
	key: 'RECENT_SEARCH',
	limit: 3,

	transformSource({ source }) {
		return {
			...source,
			onSelect({ setIsOpen }) {
				setIsOpen(true);
			},
			templates: {
				item(params) {
					console.log(params);
					const { item, html } = params;
					return html`<span data-autocomplete-id="${item.id}" class="aa-ItemLink" href="">
						${source.templates.item(params).props.children}
					</span>`;
				},
			},
		};
	},
});
export const reviewAutocomplte = autocomplete({
	container: '#autocomplete',
	placeholder: 'Название букета на сайте*',
	plugins: [recentSearchesPlugin],
	getSources({ query }) {
		return [
			{
				sourceId: 'products',
				getItems() {
					return getAlgoliaResults({
						searchClient,
						queries: [
							{
								indexName: 'products',
								query,
							},
						],
					});
				},
				templates: {
					noResults() {
						return 'Нет результатов';
					},
					item({ item, components, html }) {
						return html`<div class="aa-ItemWrapper">
							<div data-autocomplete-id="${item.id}" class="aa-ItemContent">
								<div class="aa-ItemIcon aa-ItemIcon--alignTop">
									<img src="${item.images.main}" alt="${item.title}" width="40" height="40" />
								</div>
								<div class="aa-ItemContentBody">
									<div class="aa-ItemContentTitle">
										${components.Highlight({
											hit: item,
											attribute: 'title',
										})}
									</div>
								</div>
							</div>
						</div>`;
					},
				},
				onSelect: function (event) {
					const { id: selectedID, title } = event.item;
					event.setQuery(title);
					const autocompleteInput = document.getElementById('autocomplete-0-input');
					const id = event.item.id;
					autocompleteInput.dataset.productId = id;
				},
			},
		];
	},
});
