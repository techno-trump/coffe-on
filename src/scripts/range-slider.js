document.querySelectorAll(`[data-component*=":range-slider:"]`).forEach(root => {
	const input = root.matches("input") ? root : root.querySelector("input");
	const current = root.querySelector(`[data-elem="range-slider.current"]`);
	const recalcProgress = () => {
		const min = parseFloat(input.getAttribute("min"));
		const max = parseFloat(input.getAttribute("max"));
		current.textContent = input.value;
		root.style.setProperty("--progress", `${(input.value - min) / (max - min) * 100}%`);
		root.style.setProperty("--raw-progress", `${(input.value - min) / (max - min)}`);
	};
	recalcProgress();
	input.addEventListener("input", recalcProgress);
});