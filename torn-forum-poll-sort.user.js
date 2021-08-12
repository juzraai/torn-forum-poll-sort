// ==UserScript==
// @name         Torn Forum Poll Sort
// @version      1.1.0
// @description  Sorts forum poll options by vote on TORN.
// @author       juzraai
// @license      MIT
// @namespace    https://juzraai.github.io/
// @updateURL    https://raw.githubusercontent.com/juzraai/torn-forum-poll-sort/main/torn-forum-poll-sort.user.js
// @downloadURL  https://raw.githubusercontent.com/juzraai/torn-forum-poll-sort/main/torn-forum-poll-sort.user.js
// @supportURL   https://github.com/juzraai/torn-forum-poll-sort/issues
// @match        https://www.torn.com/forums.php*
// @grant        none
// ==/UserScript==

(function () {
	'use strict';
	window.tfpsi = window.setInterval(add, 500);
})();

function add() {
	const ul = document.querySelector('.forums-vote-wrap ul');
	const submit = document.querySelector('.forums-vote-wrap input[type=submit]');
	if (!ul || submit) return;

	const btn = document.createElement('a');
	btn.setAttribute('href', 'javascript:void(0)');
	btn.innerText = 'Sort options by vote!'
	btn.style.fontWeight = 'bold';
	btn.addEventListener('click', sortVotes, false);

	const li = document.createElement('li');
	li.classList.add('sort');
	li.style.textAlign = 'right';
	li.append(btn);
	ul.prepend(li);

	window.clearInterval(window.tfpsi);
}

function sortVotes() {
	const ul = document.querySelector('.forums-vote-wrap ul');
	let lis = ul.querySelectorAll('li:not(.sort):not(.title)');
	let max = 0;
	let min = null;
	[...lis].forEach(li => {
		li.remove();
		const v = parseVotes(li)
		max = Math.max(v, max);
		min = Math.min(v, min || v)
	});
	lis = [...lis].sort((a, b) => parseVotes(b) - parseVotes(a));
	lis.forEach((li, i) => {
		li.querySelector('.percents').innerHTML += ` #${i + 1}`;
		li.querySelector('.progress').style.width = (100 * (parseVotes(li) - min) / (max - min)) + '%';
		ul.append(li)
	});
}

function parseVotes(li) {
	const t = li.querySelector('.percents').innerText;
	const v = t.split('(')[1].split(' votes')[0];
	return parseInt(v);
}