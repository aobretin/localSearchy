function LocalSearchy() {
	this.searchURL = undefined;
	this.hidden = undefined;
	this.deletableContainer = undefined;
	this.deleteButton = undefined;
	this.deleteAllButton = undefined;
	this.deleteHintBox = undefined;
	this.hintBox = undefined;
	this.searchEngineContainer = undefined;
	this.searchSelect = undefined;

	this.permitedStoredItems = 50;

	this.searchEngines = {
						 'Google': 'https://www.google.com/#q=',
						 'Yahoo': 'https://search.yahoo.com/search/?p=',
						 'Bing': 'https://www.bing.com/search?q=',
						 'DuckDuckGo': 'https://duckduckgo.com/?q='
						};

	this.init = function() {
		var self = this;

		this.createInput();
		this.createHintBox();
		this.createDeleteContainer();
		this.createSearchSelect();

		this.hidden.value = '';
		this.hidden.classList.remove('hide');

		document.body.onkeydown = function(event) {
			self.keyboardActions();
		}

		this.hidden.oninput = function() {
			self.findSameSearches(this.value);
		}

		window.onkeydown = function(event) {
			self.selectFromDropDown();
		}

		this.hintBox.addEventListener('mouseover', function() {
			self.mouseSelectHint('.search-hint');
		});

		this.deleteBox();
		this.searchEngineBox(this.searchEngines);
	}

	this.createInput = function() {
		this.hidden = document.createElement('input');
		this.hidden.setAttribute('type', 'text');
		this.hidden.setAttribute('class', 'hide');
		this.hidden.setAttribute('id', 'hidden_search');
		this.hidden.setAttribute('tabindex', 0);
		document.body.appendChild(this.hidden);

		this.hidden = document.querySelector('#hidden_search');
		this.hidden.focus();
	}

	this.createDeleteContainer = function() {
		this.deletableContainer = document.createElement('div');
		this.deletableContainer.setAttribute('class', 'deletable-container');
		document.body.appendChild(this.deletableContainer);

		this.deleteButton = document.createElement('button');
		this.deleteButton.setAttribute('id', 'delete');
		this.deleteButton.innerText = 'delete selected values';
		this.deleteButton.setAttribute('disabled', true);
		this.deletableContainer.appendChild(this.deleteButton);

		this.deleteHintBox = document.createElement('select');
		this.deleteHintBox.setAttribute('class', 'deletable-hints-box');
		this.deletableContainer.appendChild(this.deleteHintBox);

		this.deleteAllButton = document.createElement('button');
		this.deleteAllButton.setAttribute('id', 'delete_all');
		this.deleteAllButton.innerText = 'delete all values';
		this.deletableContainer.appendChild(this.deleteAllButton);

		this.deletableContainer = document.querySelector('.deletable-container');
		this.deleteButton = document.querySelector('#delete');
		this.deleteHintBox = document.querySelector('.deletable-hints-box');
		this.deleteAllButton = document.querySelector('#delete_all');
	}

	this.createHintBox = function() {
		this.hintBox = document.createElement('div');
		this.hintBox.setAttribute('class', 'recent-searches-hints');
		document.body.appendChild(this.hintBox);

		this.hintBox = document.querySelector('.recent-searches-hints');
	}

	this.createSearchSelect = function() {
		this.searchEngineContainer = document.createElement('div');
		this.searchEngineContainer.setAttribute('class', 'select-container');
		document.body.appendChild(this.searchEngineContainer);

		this.searchSelect = document.createElement('select');
		this.searchSelect.setAttribute('class', 'choose-search-engine');
		this.searchEngineContainer.appendChild(this.searchSelect);

		this.searchEngineContainer = document.querySelector('.select-container');
		this.searchSelect = document.querySelector('.choose-search-engine');
	}

	this.addRecentSearchValue = function(searchTerm) {
		var recentSearches = [];
		var recentArray = [];
		var oldSearches = [];

		recentSearches.push(searchTerm.toLocaleLowerCase());

		oldSearches = JSON.parse(localStorage.getItem('recentArray'));

		for (var i = 0; i < oldSearches.length; i++) {
			recentSearches.push(oldSearches[i]);

			if (searchTerm === oldSearches[i].toLocaleLowerCase()) {
				return false;
			}

			if (oldSearches.length > this.permitedStoredItems) {
				oldSearches.splice(oldSearches.length - 1, 1);
			}
		}

		localStorage.setItem('recentArray', JSON.stringify(recentSearches));
	}

	this.findSameSearches = function(inputValue) {
		var regEx = new RegExp(inputValue);

		if (!localStorage.getItem('recentArray')) {
	        localStorage.setItem('recentArray', '[]');
	        recentArray = [];
	    } else {
	        recentArray = JSON.parse(localStorage.getItem('recentArray'));
	    }


	    this.hintBox.style.opacity = 0;
	    this.hintBox.innerHTML = '';

	    if (this.hidden.value === '') return false;

	    for (var i = 0; i < recentArray.length; i++) {
	    	if (regEx.test(recentArray[i])) {
	    		this.hintBox.style.opacity = 1;
	    		recentArray[i] = recentArray[i].replace(inputValue, '<span class="highlight">' + inputValue + '</span>');
	    		this.hintBox.innerHTML += '<span class="search-hint">' + recentArray[i] + '</span>';
	    	} 
	    }

	    if (this.hintBox.childNodes.length > 7) {
	    	this.hintBox.style.height = 250 + 'px';
	    	this.hintBox.style.overflowY = 'auto';
	    	this.hintBox.style.overflowX = 'hidden';
	    } else {
	    	this.hintBox.style.height = 'auto';
	    	this.hintBox.style.overflow = 'visible';
	    }
	}

	this.selectFromDropDown = function() {
		var self = this;
		var searchHints = document.querySelectorAll('.search-hint');
		var overSearchhints = document.querySelectorAll('.over');
		var hintBoxHeight = parseInt(self.hintBox.style.height, 10);
		var hintHTML, hintType, dir;

		function checkIfHintIsOutOfRange(direction) {
			if (direction === 'down') {
				if (overSearchhints[0].nextSibling !== null) {
					hintType = overSearchhints[0].nextSibling;

					if (hintType.getBoundingClientRect().top - self.hintBox.getBoundingClientRect().top > hintBoxHeight) {
						self.hintBox.scrollTop = self.hintBox.scrollTop + hintType.offsetHeight;
					}
				} else {
					self.hintBox.scrollTop = 0;
				}
			} else if (direction === 'up') {
				if (overSearchhints[0].previousSibling !== null) {
					hintType = overSearchhints[0].previousSibling;

					if (hintType.getBoundingClientRect().top - self.hintBox.getBoundingClientRect().top < hintBoxHeight) {
						self.hintBox.scrollTop = self.hintBox.scrollTop - hintType.offsetHeight;
					} 
				} else {
					self.hintBox.scrollTop = self.hintBox.offsetHeight;
				}
			}
		}

    	if (event.keyCode === 40) {
    		dir = 'down';

			if (overSearchhints.length === 0)  {
				hintHTML = searchHints[0].innerText;
				searchHints[0].classList.add('over');
			} else {
				overSearchhints[0].classList.remove('over');
				if (overSearchhints[0].nextSibling !== null) {
					hintHTML = overSearchhints[0].nextSibling.innerText;
					overSearchhints[0].nextSibling.classList.add('over');
    				checkIfHintIsOutOfRange(dir);
				} else {
					hintHTML = searchHints[0].innerText;
					searchHints[0].classList.add('over');
    				checkIfHintIsOutOfRange(dir);
				}
			}
			this.hidden.value = hintHTML.toLocaleLowerCase();
    	} else if (event.keyCode === 38) {
    		dir = 'up';

    		if (overSearchhints.length === 0)  {
				hintHTML = searchHints[searchHints.length - 1].innerText;
				searchHints[searchHints.length - 1].classList.add('over');
				self.hintBox.scrollTop = self.hintBox.offsetHeight;
			} else {
				overSearchhints[0].classList.remove('over');
				if (overSearchhints[0].previousSibling !== null) {
					hintHTML = overSearchhints[0].previousSibling.innerText;
					overSearchhints[0].previousSibling.classList.add('over');
    				checkIfHintIsOutOfRange(dir);
				} else {
					hintHTML = searchHints[searchHints.length - 1].innerText;
					searchHints[searchHints.length - 1].classList.add('over');
    				checkIfHintIsOutOfRange(dir);
				}
			}
			this.hidden.value = hintHTML.toLocaleLowerCase();
    	}
	}

	this.mouseSelectHint = function(hintMessage) {
		var hintMessages = document.querySelectorAll(hintMessage);

		for (var i = 0; i < hintMessages.length; i++) {
			hintMessages[i].classList.remove('over');

			hintMessages[i].addEventListener('mouseenter', function() {
				this.classList.add('over');
				this.hidden.value = this.innerText.toLocaleLowerCase();
			});
		}
	}

	this.deleteBox = function() {
		var self = this;
		var recentOption, recentArray, DOMfragment, hintsToBeDeleted;
		var hintsIndexes;
		var toBeDeletedHints = [];
		var deletableIndexes = [];

		function deleteSearches(deletableArray) {
			self.deleteButton.addEventListener('click', function() {
				for (var i = 0; i < deletableArray.length; i++) {
					if (deletableArray[i] === recentArray[i]) {
						deletableIndexes.push(i);
					}
				}
				deletableIndexes.sort().reverse();

				for (var i = 0; i < deletableIndexes.length; i++) {
	    			recentArray.splice(deletableIndexes[i], 1);
				}
		    	self.hidden.value = '';
	    		self.hintBox.innerHTML = '';
		    	self.hintBox.style.opacity = 0;
				localStorage.setItem('recentArray', JSON.stringify(recentArray));
				
    			formSelectBox();
			});

			self.deleteAllButton.addEventListener('click', function() {
				self.hidden.value = '';
	    		self.hintBox.innerHTML = '';
		    	self.hintBox.style.opacity = 0;
				localStorage.setItem('recentArray', '[]');
				
    			formSelectBox();
			});
		}

		function formSelectBox() {
			DOMfragment = document.createDocumentFragment();
			self.deleteHintBox.innerHTML = '';

			if (!localStorage.getItem('recentArray')) {
				localStorage.setItem('recentArray', '[]');
	        	recentArray = [];
		    } else {
		        recentArray = JSON.parse(localStorage.getItem('recentArray'));
		    }

		    if (recentArray.length < 1) {
		    	recentOption = document.createElement('option');
		    	self.deleteHintBox.setAttribute('size', 2);
		        recentOption.innerText = 'Sorry, no recent search terms found.';
		        self.deleteHintBox.appendChild(recentOption);
		        self.deleteButton.setAttribute('disabled', true);
		        self.deleteAllButton.setAttribute('disabled', true);
		        return false;
		    }

		    for (var i = 0; i < recentArray.length; i++) {
		    	recentOption = document.createElement('option');
		    	recentOption.innerText = recentArray[i];
		    	recentOption.value = i + 1;
		    	self.deleteHintBox.setAttribute('size', i + 2);
		    	DOMfragment.appendChild(recentOption);

		    	recentOption.addEventListener('click', function() {
		    		if (!this.classList.contains('clicked')) {
		    			this.classList.add('clicked');
		    		} else {
		    			this.classList.remove('clicked');
		    		}

					hintsToBeDeleted = document.querySelectorAll('.clicked');
		    		if (hintsToBeDeleted.length > 0) {
		    			self.deleteButton.removeAttribute('disabled');
		    		} else {
		        		self.deleteButton.setAttribute('disabled', true);
		    		}

		    		hintsIndexes = self.deleteHintBox.selectedOptions[0].index;

		    		if (toBeDeletedHints.indexOf(hintsIndexes) !== hintsIndexes) {
		    			toBeDeletedHints[hintsIndexes] = self.deleteHintBox.selectedOptions[0].innerHTML;
		    		}	
		    	});
		    }

		    self.deleteHintBox.appendChild(DOMfragment);
		}

	    formSelectBox();
	    deleteSearches(toBeDeletedHints);
	}

	this.searchEngineBox = function(searchEnginesArray) {
		var self = this;
		var searchOption, DOMfragment, searchEngineChoice;

		function selectSearchEngine() {
			self.searchURL = self.searchSelect.selectedOptions[0].value;
			self.hidden.setAttribute('placeholder', 'Search ' + self.searchSelect.selectedOptions[0].innerHTML + ' for...');

			localStorage.setItem('searchEngineChoice', JSON.stringify(self.searchSelect.selectedOptions[0].innerHTML));
		}

		function populateSearchEngine() {
			for (searchEngine in searchEnginesArray) {
				searchOption = document.createElement('option');
				searchOption.innerText = searchEngine;
				searchOption.value = searchEnginesArray[searchEngine];
				if (searchEngine === searchEngineChoice) {
					searchOption.setAttribute('selected', 'selected');
				}
				DOMfragment.appendChild(searchOption);
			}
			self.searchSelect.appendChild(DOMfragment);
		}

		DOMfragment = document.createDocumentFragment();

		if (!localStorage.getItem('searchEngineChoice')) {
        	populateSearchEngine();
			selectSearchEngine();
			localStorage.setItem('searchEngineChoice', JSON.stringify(Object.keys(searchEnginesArray)[0]));
        	searchEngineChoice = Object.keys(searchEnginesArray)[0];
	    } else {
	        searchEngineChoice = JSON.parse(localStorage.getItem('searchEngineChoice'));
	        populateSearchEngine();
			selectSearchEngine();
	    }

		self.searchSelect.addEventListener('change', selectSearchEngine);
	}

	this.keyboardActions = function() {
		switch(event.keyCode) {
			case 13:
				if (document.activeElement === this.hidden) {
					this.addRecentSearchValue(this.hidden.value);
					window.location = this.searchURL + this.hidden.value
				}
				break;
			case 9:
				event.preventDefault();
				if (!this.hidden.classList.contains('hide')) {
					this.hidden.classList.add('hide');
					this.hidden.setAttribute('disabled', true);
		    		this.hintBox.style.opacity = 0;
				} else {
					this.hidden.classList.remove('hide');
		    		this.hidden.value = '';
					this.hidden.removeAttribute('disabled');
					this.hidden.focus();
				}
				break;
			case 27:
				this.hidden.value = '';
	    		this.hintBox.style.opacity = 0;
	    		break;
	    	case 68:
	    		if (!this.deletableContainer.classList.contains('shown') && document.activeElement !== this.hidden) {
					this.deletableContainer.classList.add('shown');
				} else {
					this.deletableContainer.classList.remove('shown');
				}
				break;
			case 83:
				if (!this.searchEngineContainer.classList.contains('shown') && document.activeElement !== this.hidden) {
					this.searchEngineContainer.classList.add('shown');
				} else {
					this.searchEngineContainer.classList.remove('shown');
				}
				break;
		}
	}
	this.init();
}