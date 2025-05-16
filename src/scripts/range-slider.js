document.querySelectorAll(`.range-slider`).forEach(elem => {
	const recalcProgress = () => {
		const min = parseFloat(elem.getAttribute("min"));
		const max = parseFloat(elem.getAttribute("max"));
		elem.style.setProperty("--progress", `${(elem.value - min) / (max - min) * 100}%`);
	};
	recalcProgress();
	elem.addEventListener("input", recalcProgress);
});