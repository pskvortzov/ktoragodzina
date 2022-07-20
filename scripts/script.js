"use strict";

const time = document.querySelector('#time');
const click = document.querySelector('#click');
const buttons = document.querySelector('#buttons');

let currentTime, alternativeTime, speechStartTime, speechEndTime;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.interimResults = true;
recognition.maxAlternatives = 10;
recognition.lang = 'pl-PL';

recognition.addEventListener('result', parseResults);
recognition.addEventListener('audiostart', () => speechStartTime = currentTime);
recognition.addEventListener('audioend', wrongAnswer)
recognition.addEventListener('end', recognition.start);

document.querySelectorAll('#buttons button')
	.forEach(element => element.addEventListener('click', pressButton));

setupStyles();

function pressButton(event) {
	recognition.start();

	getRandomTime();

	buttons.classList.remove('visible');
	buttons.classList.add('hidden');

	buttons.addEventListener('transitionend', () => {
		buttons.style.display = 'none';
		time.style.display = 'block';
		time.style.transition = 'all .4s';
		time.style.opacity = 1;
	});
}

function parseResults(event) {
	let parsedResults;

	[...event.results].forEach(result => {
		[...result].forEach(alternative => {
			parsedResults = alternative.transcript;
		});
	});

	if(parsedResults === currentTime || parsedResults === alternativeTime) {
		correctAnswer();
	}
}

function setupStyles() {
	buttons.style.transition = 'all .4s';

	buttons.classList.remove('hidden');
	buttons.classList.add('visible');

	document.querySelector('#createdby a').style.transition = 'all .4s';
}

function getRandomTime() {
	const randomHour = Math.floor(Math.random() * 24);
	const randomMinute = Math.floor(Math.random() * 60);

	currentTime = `${randomHour}:${randomMinute < 10 ? '0' : ''}${randomMinute}`;
	alternativeTime = randomHour > 12 ? `${randomHour % 12}:${randomMinute < 10 ? '0' : ''}${randomMinute}` : currentTime;

	speechEndTime = currentTime;

	time.innerHTML = currentTime;
}

function correctAnswer() {
	recognition.abort();
	click.play();

	getRandomTime();
}

function wrongAnswer() {
	if (speechStartTime === speechEndTime) {
		time.classList.add('wrong');
		setTimeout(() => time.classList.remove('wrong'), 300);
	}
}