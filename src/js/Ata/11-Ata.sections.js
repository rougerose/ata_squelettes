Ata.sections = (function () {
	function animatePageSections(pageSectionsEls) {
		let sectionClass = Ata.config.sections.sectionsStateClass;
		setTimeout(() => {
			for (let i = 0; i < pageSectionsEls.length; i++) {
				const sectionEl = pageSectionsEls[i];
				sectionEl.classList.add(sectionClass);
			}
		}, 800);
	}
	return {
		animatePageSections: animatePageSections,
	};
})();
