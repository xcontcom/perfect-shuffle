var ar = [];
var drawar = [];
var fractal3D = [];
var iter = 7;

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
				let value = Math.floor(Math.random() * 255);
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

	let min = Infinity, max = -Infinity;
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const v = array2D[x][y];
			if (v < min) min = v;
			if (v > max) max = v;
		}
	}
	const range = (max - min) || 1;
	

	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			const val = array2D[x][y];
			const norm = Math.floor(((val - min) / range) * 255);
			ctx.fillStyle = `rgb(${norm},${norm},${norm})`;
			ctx.fillRect(x*sizeCof, y*sizeCof, 1*sizeCof, 1*sizeCof);
		}
	}
}

function switchdraw(mode, x, y, z, len, ar) {
    let x_new = x, y_new = y, z_new = z;

    // Extract rotation parameters
    const rotAxis = (mode >> 4) & 3; // Bits 4-5: 0=none, 1=x, 2=y, 3=z
    const rotAngle = (mode >> 6) & 3; // Bits 6-7: 0=0°, 1=90°, 2=180°, 3=270°

    // Apply rotation
    if (rotAxis !== 0 && rotAngle !== 0) {
        for (let i = 0; i < rotAngle; i++) {
            let temp;
            if (rotAxis === 1) { // X-axis rotation
                temp = y_new;
                y_new = len - 1 - z_new;
                z_new = temp;
            } else if (rotAxis === 2) { // Y-axis rotation
                temp = x_new;
                x_new = z_new;
                z_new = len - 1 - temp;
            } else if (rotAxis === 3) { // Z-axis rotation
                temp = x_new;
                x_new = len - 1 - y_new;
                y_new = temp;
            }
        }
    }

    // Apply flip based on mode & 15
    let a;
    switch (mode & 15) {
        case 0: a = ar[x_new][y_new][z_new]; break;
        case 1: a = ar[x_new][y_new][len - 1 - z_new]; break;
        case 2: a = ar[x_new][len - 1 - y_new][len - 1 - z_new]; break;
        case 3: a = ar[x_new][len - 1 - y_new][z_new]; break;
        case 4: a = ar[len - 1 - x_new][len - 1 - y_new][z_new]; break;
        case 5: a = ar[len - 1 - x_new][y_new][z_new]; break;
        case 6: a = ar[len - 1 - x_new][y_new][len - 1 - z_new]; break;
        case 7: a = ar[len - 1 - x_new][len - 1 - y_new][len - 1 - z_new]; break;
        case 8: a = ar[x_new][y_new][z_new]; break;
        case 9: a = ar[x_new][y_new][len - 1 - z_new]; break;
        case 10: a = ar[x_new][len - 1 - y_new][len - 1 - z_new]; break;
        case 11: a = ar[x_new][len - 1 - y_new][z_new]; break;
        case 12: a = ar[len - 1 - x_new][len - 1 - y_new][z_new]; break;
        case 13: a = ar[len - 1 - x_new][y_new][z_new]; break;
        case 14: a = ar[len - 1 - x_new][y_new][len - 1 - z_new]; break;
        case 15: a = ar[len - 1 - x_new][len - 1 - y_new][len - 1 - z_new]; break;
        default: a = ar[x_new][y_new][z_new]; break;
    }
	
	if (!(mode & 8)) a++;
	return a;
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
				let value = Math.floor(Math.random() * 255);
				drawar[z][y][x] = value;
				document.getElementById(`r-${z}${y}${x}`).value = value;
			}
		}
	}
	document.getElementById('console-log0').innerHTML = JSON.stringify(drawar);
	fractal3D = permutation3D(iter);
	drawSlice(parseInt(document.getElementById('slicer').value));
}