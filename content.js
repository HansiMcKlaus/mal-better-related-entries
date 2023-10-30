// Init
let sorting = "Default";
createSortingSelection();
update();

function createSortingSelection() {
	// Get element for Related Anime/Manga
	const relatedAnimeText = Array.from(document.querySelectorAll('h2'))
		.find(el => el.textContent === "Related Anime");

	const relatedMangaText = Array.from(document.querySelectorAll('h2'))
		.find(el => el.textContent == "EditRelated Manga");

	// Determine if on Anime or Manga page
	let relatedEntriesHeader
	if (relatedAnimeText || relatedMangaText) {
		relatedEntriesHeader = relatedAnimeText ? relatedAnimeText : relatedMangaText;
	} else {
		return;
	}

	// Create Container for selection text and selection element
	const selectionContainer = document.createElement("span");
	selectionContainer.style.fontSize = "11px";
	selectionContainer.style.fontWeight = "400";
	relatedEntriesHeader.appendChild(selectionContainer);
	selectionContainer.style.marginLeft = "8px";
	selectionContainer.textContent = "Sort by:";

	// Create selection element
	const sortSelect = document.createElement("select");
	sortSelect.addEventListener("change", function() { sorting = sortSelect.value, update() });
	sortSelect.setAttribute("id", "sortSelect");
	selectionContainer.appendChild(sortSelect);
	sortSelect.style.marginLeft = "4px";
	sortSelect.classList.add("inputtext");

	// Create ID option
	const sortID = document.createElement("option");
	sortID.setAttribute("value", "ID");
	sortID.setAttribute("selected", "selected");
	sortID.appendChild(document.createTextNode("ID"));

	// Create Title option
	const sortTitle = document.createElement("option");
	sortTitle.setAttribute("value", "Title");
	// sortTitle.setAttribute("selected", "selected");
	sortTitle.appendChild(document.createTextNode("Title"));

	// Add options to selection element
	sortSelect.appendChild(sortID);
	sortSelect.appendChild(sortTitle);

	// Set sorting to default selected option
	sorting = sortSelect.value;
}

function update() {
	// Get table for related entries
	let relatedAnime = document.getElementsByClassName("anime_detail_related_anime")[0];

	if (relatedAnime) {
		// Get table
		let relatedTable = relatedAnime.children[0].cloneNode(true);

		// Change table
		relatedTable = changeTable(relatedTable);

		// Replace old table body with new one
		relatedAnime.children[0].replaceWith(relatedTable);
	}
}

function changeTable(table) {
	// Loop through every relation section
	for (var i = 0; i < table.children.length; i++) {
		// Get links for each entry in current section
		let entries = table.children[i].children[1].children;

		// Remove added <br> tags on sorting change
		for (const entry of entries) {
			if (entry.tagName == "BR") {
				entry.remove();
			}
		}

		// Create an array of links for each entry in current section and sort them
		let links = Array.from(entries);
		links = sortLinks(links);

		// Create a new element to replace the old table cell
		const newEntries = document.createElement("td");
		newEntries.style.width = "100%";
		newEntries.classList.add("borderClass");

	// Add each entry to cell as a child, followed by a line break, remove last redundant line break
		for (var j = 0; j < links.length; j++) {
			newEntries.appendChild(links[j]);
			newEntries.appendChild(document.createElement("br"));
		}
		if (newEntries.lastChild.tagName == "BR") {
			newEntries.lastChild.remove();
		}

		// Replace old cell with new one
		table.children[i].children[1].replaceWith(newEntries);
	}

	return table;
}

function sortLinks(links) {
	let unsorted = {};

	// Sort by Name
	if (sorting == "Title") {
		for (var l = 0; l < links.length; l++) {
			const title = links[l].innerHTML
			unsorted[title] = links[l]
		}

		let sorted = Object.keys(unsorted).sort().reduce(
			(obj, key) => {
				obj[key] = unsorted[key];
				return obj;
			},
			{}
		);
		links = Object.values(sorted);
	}

	// Sort by ID
	if (sorting == "ID") {
		for (var l = 0; l < links.length; l++) {
			let id = links[l].href;
			id = id.split("/")[4];
			unsorted[id] = links[l];
		}

		let sorted = Object.keys(unsorted).sort().reduce(
			(obj, key) => {
				obj[key] = unsorted[key];
				return obj;
			},
			{}
		);
		links = Object.values(sorted);
	}

	return links
}
