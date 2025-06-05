var ar = [];
var drawar = [];
var fractal3D = [];
var iter = 7; // results in 2^6 = 64 slices

var sizeCof=2;

// ---------------- Init ----------------
function init() {
	ar = [
		[[true, false], [false, false]],
		[[false, false], [false, false]]
	];

	// Randomize 8 transformation rules
	drawar = [[[0, 0], [0, 0]], [[0, 0], [0, 0]]];
	for (let z = 0; z < 2; z++) {
		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 2; x++) {
				let value = Math.floor(Math.random() * 16);
				drawar[z][y][x] = value;
				let sel = document.getElementById(`r-${z}${y}${x}`);
				if (sel) sel.value = value;
			}
		}
	}

	document.getElementById('console-log0').innerHTML = JSON.stringify(drawar);
	fractal3D = permutation3D(iter);
	drawSlice(0);
}

// ---------------- 3D Permutation ----------------
function permutation3D(iter) {
	let current = ar.map(x => x.map(y => y.slice()));

	for (let i = 0; i < iter; i++) {
		let len = current.length;
		let next = new Array(len * 2);
		for (let x = 0; x < len * 2; x++) {
			next[x] = new Array(len * 2);
			for (let y = 0; y < len * 2; y++) {
				next[x][y] = new Array(len * 2);
			}
		}

		for (let x = 0; x < len; x++) {
			for (let y = 0; y < len; y++) {
				for (let z = 0; z < len; z++) {
					for (let dx = 0; dx < 2; dx++) {
						for (let dy = 0; dy < 2; dy++) {
							for (let dz = 0; dz < 2; dz++) {
								let tx = x * 2 + dx;
								let ty = y * 2 + dy;
								let tz = z * 2 + dz;
								let mode = drawar[dz][dy][dx];
								next[tx][ty][tz] = switchdraw(mode, x, y, z, len, current);
							}
						}
					}
				}
			}
		}

		current = next;
	}

	return current;
}

// ---------------- Draw Z-slice ----------------
function drawSlice(z) {
	let array2D = fractal3D.map(col => col.map(row => row[z]));
	let size = array2D.length;
	let canvas = document.getElementById('myCanvas');
	let ctx = canvas.getContext('2d');
	canvas.width = size*sizeCof;
	canvas.height = size*sizeCof;

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, size*sizeCof, size*sizeCof);

	ctx.fillStyle = 'white';
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			if (array2D[x][y]) {
				ctx.fillRect(x*sizeCof, y*sizeCof, 1*sizeCof, 1*sizeCof);
			}
		}
	}
}

// ---------------- Transformations ----------------
function switchdraw(mode, x, y, z, len, ar) {
	switch (mode) {
		case 0: return ar[x][y][z];
		case 1: return ar[x][y][len - 1 - z];
		case 2: return ar[x][len - 1 - y][len - 1 - z];
		case 3: return ar[x][len - 1 - y][z];
		case 4: return ar[len - 1 - x][len - 1 - y][z];
		case 5: return ar[len - 1 - x][y][z];
		case 6: return ar[len - 1 - x][y][len - 1 - z];
		case 7: return ar[len - 1 - x][len - 1 - y][len - 1 - z];
		case 8: return !ar[x][y][z];
		case 9: return !ar[x][y][len - 1 - z];
		case 10: return !ar[x][len - 1 - y][len - 1 - z];
		case 11: return !ar[x][len - 1 - y][z];
		case 12: return !ar[len - 1 - x][len - 1 - y][z];
		case 13: return !ar[len - 1 - x][y][z];
		case 14: return !ar[len - 1 - x][y][len - 1 - z];
		case 15: return !ar[len - 1 - x][len - 1 - y][len - 1 - z];
		default: return ar[x][y][z];
	}
}

// ---------------- UI Events ----------------
function updateSlicer(val) {
	document.getElementById('slicer-value').textContent = val;
	drawSlice(parseInt(val));
}

function updateDrawar() {
	for (let z = 0; z < 2; z++) {
		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 2; x++) {
				let sel = document.getElementById(`r-${z}${y}${x}`);
				drawar[z][y][x] = parseInt(sel.value);
			}
		}
	}
	document.getElementById('console-log0').innerHTML = JSON.stringify(drawar);
	fractal3D = permutation3D(iter);
	drawSlice(parseInt(document.getElementById('slicer').value));
}

function randomizeDrawar() {
	for (let z = 0; z < 2; z++) {
		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 2; x++) {
				let value = Math.floor(Math.random() * 16);
				drawar[z][y][x] = value;
				document.getElementById(`r-${z}${y}${x}`).value = value;
			}
		}
	}
	document.getElementById('console-log0').innerHTML = JSON.stringify(drawar);
	fractal3D = permutation3D(iter);
	drawSlice(parseInt(document.getElementById('slicer').value));
}