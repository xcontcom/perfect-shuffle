let ar = [];
let drawar = [];
let itarations=8;

function getRandomDrawar() {
	return [
		[Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)],
		[Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)]
	];
}

function updateDropdownsFromDrawar() {
	const dm = document.getElementsByName("drawmode");
	dm[0].value = drawar[0][0];
	dm[1].value = drawar[0][1];
	dm[2].value = drawar[1][0];
	dm[3].value = drawar[1][1];
}

function updateConsole() {
	document.getElementById('console-log0').innerText = drawar.join(', ');
}

function init() {
	ar = [[true, false], [false, false]];
	drawar = getRandomDrawar();
	updateDropdownsFromDrawar();
	updateConsole();
	radiochenged();
}

function generateNewFractal() {
	drawar = getRandomDrawar();
	updateDropdownsFromDrawar();
	updateConsole();
	radiochenged();
}

function changeDrawMode() {
	const dm = document.getElementsByName("drawmode");
	drawar[0][0] = Number(dm[0].value);
	drawar[0][1] = Number(dm[1].value);
	drawar[1][0] = Number(dm[2].value);
	drawar[1][1] = Number(dm[3].value);
	updateConsole();
	radiochenged();
}

function radiochenged() {
	const arri = document.getElementsByName("arri");
	ar = [
		[arri[0].checked, arri[2].checked],
		[arri[1].checked, arri[3].checked]
	];
	const mono = permutationMono();
	const rgb = permutationRGB();
	const grey = permutationGrey();
	drawMonochrome(mono);
	drawRGB(rgb);
	drawGrey(grey);
}

function permutationMono() {
	let temp = [];
	let currentArray = ar.slice();
	for (let i = 0; i < itarations; i++) {
		const len = currentArray.length;
		temp = [];
		for (let x = 0; x < len; x++) {
			temp[x * 2] = [];
			temp[x * 2 + 1] = [];
			for (let y = 0; y < len; y++) {
				temp[x * 2][y * 2] = switchdrawMono(drawar[0][0], x, y, len, currentArray);
				temp[x * 2 + 1][y * 2] = switchdrawMono(drawar[0][1], x, y, len, currentArray);
				temp[x * 2][y * 2 + 1] = switchdrawMono(drawar[1][0], x, y, len, currentArray);
				temp[x * 2 + 1][y * 2 + 1] = switchdrawMono(drawar[1][1], x, y, len, currentArray);
			}
		}
		currentArray = temp.slice();
	}
	return currentArray;
}

function permutationRGB() {
	let temp = [];
	let currentArray = ar.slice();
	for (let i = 0; i < itarations; i++) {
		const len = currentArray.length;
		temp = [];
		for (let x = 0; x < len; x++) {
			temp[x * 2] = [];
			temp[x * 2 + 1] = [];
			for (let y = 0; y < len; y++) {
				temp[x * 2][y * 2] = switchdrawRGB(drawar[0][0], x, y, len, currentArray);
				temp[x * 2 + 1][y * 2] = switchdrawRGB(drawar[0][1], x, y, len, currentArray);
				temp[x * 2][y * 2 + 1] = switchdrawRGB(drawar[1][0], x, y, len, currentArray);
				temp[x * 2 + 1][y * 2 + 1] = switchdrawRGB(drawar[1][1], x, y, len, currentArray);
			}
		}
		currentArray = temp.slice();
	}
	return currentArray;
}

function permutationGrey() {
	let temp = [];
	let currentArray = ar.slice();
	for (let i = 0; i < itarations; i++) {
		const len = currentArray.length;
		temp = [];
		for (let x = 0; x < len; x++) {
			temp[x * 2] = [];
			temp[x * 2 + 1] = [];
			for (let y = 0; y < len; y++) {
				temp[x * 2][y * 2] = switchdrawGrey(drawar[0][0], x, y, len, currentArray);
				temp[x * 2 + 1][y * 2] = switchdrawGrey(drawar[0][1], x, y, len, currentArray);
				temp[x * 2][y * 2 + 1] = switchdrawGrey(drawar[1][0], x, y, len, currentArray);
				temp[x * 2 + 1][y * 2 + 1] = switchdrawGrey(drawar[1][1], x, y, len, currentArray);
			}
		}
		currentArray = temp.slice();
	}
	return currentArray;
}

function drawMonochrome(array) {
	const canvas = document.getElementById('monoCanvas');
	const ctx = canvas.getContext('2d');
	const size = array.length;
	canvas.width = canvas.height = size;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, size, size);
	ctx.fillStyle = 'white';
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			if (array[x][y]) ctx.fillRect(x, y, 1, 1);
		}
	}
}

function drawRGB(array) {
	const canvas = document.getElementById('rgbCanvas');
	const ctx = canvas.getContext('2d');
	const size = array.length;
	canvas.width = canvas.height = size;
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, size, size);
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const val = array[x][y];
			ctx.fillStyle =
				val === 0 ? 'rgb(255,0,0)' :
				val === 1 ? 'rgb(0,255,0)' :
				'rgb(0,0,255)';
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

/*
function drawGrey(array) {
	const canvas = document.getElementById('greyCanvas');
	const ctx = canvas.getContext('2d');
	const size = array.length;
	canvas.width = canvas.height = size;

	// Step 1: Find min and max
	let min = Infinity, max = -Infinity;
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const v = array[x][y];
			if (v < min) min = v;
			if (v > max) max = v;
		}
	}
	const range = max - min || 1; // avoid div by 0

	// Step 2: Normalize and draw
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const val = array[x][y];
			const norm = Math.floor(((val - min) / range) * 255);
			ctx.fillStyle = `rgb(${norm},${norm},${norm})`;
			ctx.fillRect(x, y, 1, 1);
		}
	}
}
*/

let greyMode = 'grayscale'; // or 'slice'
let slicerThreshold = 0;

function updateSlicer(value) {
	slicerThreshold = Number(value);
	const grey = permutationGrey();
	drawGrey(grey);
}

function toggleGreyMode(checkbox) {
	greyMode = checkbox.checked ? 'slice' : 'grayscale';
	const grey = permutationGrey();
	drawGrey(grey);
}

function drawGrey(array) {
	const canvas = document.getElementById('greyCanvas');
	const ctx = canvas.getContext('2d');
	const size = array.length;
	canvas.width = canvas.height = size;

	// Step 1: Find min and max
	let min = Infinity, max = -Infinity;
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const v = array[x][y];
			if (v < min) min = v;
			if (v > max) max = v;
		}
	}
	const range = max - min || 1;

	// Update slicer range and label
	const slicerInput = document.getElementById('slicer');
	if (slicerInput) {
		slicerInput.min = min;
		slicerInput.max = max;
		if (slicerThreshold < min) slicerThreshold = min;
		if (slicerThreshold > max) slicerThreshold = max;
	}

	// Step 2: Draw
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const val = array[x][y];
			if (greyMode === 'grayscale') {
				const norm = Math.floor(((val - min) / range) * 255);
				ctx.fillStyle = `rgb(${norm},${norm},${norm})`;
			} else {
				ctx.fillStyle = val == slicerThreshold ? 'white' : 'black';
			}
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

function switchdrawMono(drawarray, x, y, len, ar) {
	switch (Number(drawarray)) {
		case 0: return ar[x][y];
		case 1: return ar[x][len - 1 - y];
		case 2: return ar[len - 1 - x][len - 1 - y];
		case 3: return ar[len - 1 - x][y];
		case 4: return ar[y][x];
		case 5: return ar[len - 1 - y][x];
		case 6: return ar[len - 1 - y][len - 1 - x];
		case 7: return ar[y][len - 1 - x];
		case 8: return !ar[x][y];
		case 9: return !ar[x][len - 1 - y];
		case 10: return !ar[len - 1 - x][len - 1 - y];
		case 11: return !ar[len - 1 - x][y];
		case 12: return !ar[y][x];
		case 13: return !ar[len - 1 - y][x];
		case 14: return !ar[len - 1 - y][len - 1 - x];
		case 15: return !ar[y][len - 1 - x];
		default: return ar[x][y];
	}
}

function switchdrawRGB(drawarray, x, y, len, ar) {
	let a, b;
	switch (drawarray & 15) {
		case 0:  a = ar[x][y]; break;
		case 1:  a = ar[x][len - 1 - y]; break;
		case 2:  a = ar[len - 1 - x][len - 1 - y]; break;
		case 3:  a = ar[len - 1 - x][y]; break;
		case 4:  a = ar[y][x]; break;
		case 5:  a = ar[len - 1 - y][x]; break;
		case 6:  a = ar[len - 1 - y][len - 1 - x]; break;
		case 7:  a = ar[y][len - 1 - x]; break;
		case 8:  a = ar[x][y]; break;
		case 9:  a = ar[x][len - 1 - y]; break;
		case 10: a = ar[len - 1 - x][len - 1 - y]; break;
		case 11: a = ar[len - 1 - x][y]; break;
		case 12: a = ar[y][x]; break;
		case 13: a = ar[len - 1 - y][x]; break;
		case 14: a = ar[len - 1 - y][len - 1 - x]; break;
		case 15: a = ar[y][len - 1 - x]; break;
		default: a = 0; break;
	}
	
	if (drawarray < 8) {
		return a;
	} else {
		return a === 2 ? 0 : a + 1;
	}
}


function switchdrawGrey(drawarray, x, y, len, ar) {
	let a, b;
	switch (drawarray & 15) {
		case 0:  a = ar[x][y]; break;
		case 1:  a = ar[x][len - 1 - y]; break;
		case 2:  a = ar[len - 1 - x][len - 1 - y]; break;
		case 3:  a = ar[len - 1 - x][y]; break;
		case 4:  a = ar[y][x]; break;
		case 5:  a = ar[len - 1 - y][x]; break;
		case 6:  a = ar[len - 1 - y][len - 1 - x]; break;
		case 7:  a = ar[y][len - 1 - x]; break;
		case 8:  a = ar[x][y]; break;
		case 9:  a = ar[x][len - 1 - y]; break;
		case 10: a = ar[len - 1 - x][len - 1 - y]; break;
		case 11: a = ar[len - 1 - x][y]; break;
		case 12: a = ar[y][x]; break;
		case 13: a = ar[len - 1 - y][x]; break;
		case 14: a = ar[len - 1 - y][len - 1 - x]; break;
		case 15: a = ar[y][len - 1 - x]; break;
		default: a = 0; break;
	}

	if (drawarray < 8) {
		a++;
	}
	return a;
}