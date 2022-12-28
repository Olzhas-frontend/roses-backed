export function toggleCatalogFilter() {
	const catalogFilterToggleIcon = document.querySelector('.catalog-filter__toggle');
	const catalogFilterBtn = document.querySelector('.catalog-filter__btn');

	if (catalogFilterToggleIcon) {
		catalogFilterToggleIcon.addEventListener('click', (e) => {
			const self = e.target;
			const parent = self.closest('.catalog-filter');
			parent.classList.toggle('catalog-filter--open');
			self.classList.toggle('active');
		});
	}

	if (catalogFilterBtn) {
		catalogFilterBtn.addEventListener('click', () => {
			const filterPropItems = document.querySelector('.catalog-filter__items--props');
			[...filterPropItems.children].slice(7).forEach((el) => {
				el.classList.toggle('active');
			});
		});
	}
}
