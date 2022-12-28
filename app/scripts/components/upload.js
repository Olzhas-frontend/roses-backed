function formatBytes(bytes, decimals = 2) {
	if (!+bytes) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const createEl = (tag, classes = [], content) => {
	const node = document.createElement(tag);

	if (classes.length) node.classList.add(...classes);
	if (classes.length) node.textContent = content;
	return node;
};

const noop = () => {};

export function upload(selector, options = {}) {
	let files = [];
	const onUpload = options.onUpload ?? noop;
	const input = document.querySelector(selector);
	const preview = createEl('div', ['preview']);
	const openBtn = createEl('button', ['btn-file'], 'Открыть');
	const uploadBtn = createEl('button', ['btn-file', 'primary'], 'Загрузить');
	uploadBtn.style.display = 'none';

	if (options.multi) {
		input.setAttribute('multiple', true);
	}

	if (options.acceptExtensions && Array.isArray(options.acceptExtensions)) {
		input.setAttribute('accept', options.acceptExtensions.join(','));
	}

	input.insertAdjacentElement('afterend', preview);
	input.insertAdjacentElement('afterend', uploadBtn);
	input.insertAdjacentElement('afterend', openBtn);

	const triggerInput = () => input.click();
	const changeHandler = (e) => {
		if (!e.target.files.length) return;

		files = Array.from(e.target.files);

		preview.innerHTML = '';
		uploadBtn.style.display = 'inline';
		files.forEach((file) => {
			if (!file.type.match('image')) return;

			const reader = new FileReader();

			reader.onload = (e) => {
				const src = e.target.result;
				preview.insertAdjacentHTML(
					'afterbegin',
					`
					<div class="preview-image">
						<div class="preview-remove" data-name=${file.name}>&times;</div>
						<img src="${src}" alt="${file.name}" />
						<div class="preview-info">
							<span>${file.name}</span>
							${formatBytes(file.size)}
						</div>
					</div>
				`
				);
			};

			reader.readAsDataURL(file);
		});
	};

	const removeImage = (e) => {
		if (!e.target.dataset.name) return;
		const { name } = e.target.dataset;
		files = files.filter((file) => file.name !== name);

		if (!files.length) uploadBtn.style.display = 'none';

		const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image');
		block.classList.add('removing');
		setTimeout(() => block.remove(), 300);
	};

	const clearEl = (el) => {
		el.style.bottom = '4px';
		el.innerHTML = '<div class="preview-info-progress"></div>';
	};

	const uploadHandler = () => {
		preview.querySelectorAll('.preview-remove').forEach((el) => el.remove());
		const previewInfo = preview.querySelectorAll('.preview-info');
		previewInfo.forEach(clearEl);
		onUpload(files, previewInfo);
	};

	openBtn.addEventListener('click', triggerInput);
	input.addEventListener('change', changeHandler);
	preview.addEventListener('click', removeImage);
	uploadBtn.addEventListener('click', uploadHandler);
}
