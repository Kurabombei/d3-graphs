/** Красивий варіант з візуалізацією але без штучно вказаних ваг дуг (оскільки не найдено варіанту
 * швидко намалювати ребра на правильних відстанях, можна переглянути тут:
 *
 *
 *
 * **/

const fs = require('fs')

const makeArrayFromTextFile = (path) => {
	console.log(__dirname)
	const text = fs.readFileSync(__dirname + '/' + path, 'utf-8');
	const arr = text.trim().split('\n');
	return arr.map( (element) => element.split(' ').map((el) => parseInt(el)));
}

const swap = (a, i, j) => {
	let temp = a[i];
	a[i] = a[j];
	a[j] = temp;
}
const factorial = (n) => {
	if (n === 1) {
		return 1;
	} else {
		return n * factorial(n - 1);
	}
}

(function run() {
	let nodes = [];
	let totalNodes = 6;

	let order = [];
	let adjacencyList;

	let totalPermutations;
	let count = 0;


	let recordDistance;
	let bestEver;

	function preload() {
		adjacencyList = makeArrayFromTextFile('l3-1.txt');

	}

	function setup() {
		totalNodes = adjacencyList.shift();
		for (let i = 0; i < totalNodes; i++) {
			let v = createVector(width/5 + random(width/1.5), random(height / 2));
			nodes[i] = v;
			order[i] = i;
		}

		let d = calcDistance(nodes, order);
		recordDistance = d;
		bestEver = order.slice();

		totalPermutations = factorial(totalNodes);
		console.log(totalPermutations);

	}

	function print() {
		// background(55);
		// // frameRate(5);
		// fill(255);
		// for (let i = 0; i < nodes.length; i++) {
		// 	ellipse(nodes[i].x, nodes[i].y, 8, 8);
		// 	fill(240);
		// 	textAlign(CENTER);
		// 	text(String.fromCharCode(i + 97), nodes[i].x, nodes[i].y - 8 - 5);
		// }
		//
		// stroke(55, 100, 255);
		// strokeWeight(4);
		// noFill();
		// beginShape();
		// for (let i = 0; i < order.length; i++) {
		// 	let n = bestEver[i];
		// 	vertex(nodes[n].x, nodes[n].y);
		// }
		// endShape();
		//
		//
		//
		// translate(0, height / 2);
		// for (let i = 0; i < order.length; i++) {
		// 	let n = order[i];
		// 	ellipse(nodes[n].x, nodes[n].y, 4, 4);
		// 	fill(240);
		// 	textAlign(CENTER);
		// 	text(String.fromCharCode(i + 97), nodes[i].x, nodes[i].y - 8 - 5);
		// }
		//
		// stroke(255);
		// strokeWeight(1);
		// noFill();
		// beginShape();
		// for (let i = 0; i < order.length; i++) {
		// 	let n = order[i];
		// 	vertex(nodes[n].x, nodes[n].y);
		// }
		// endShape();

		let d = calcDistance(nodes, order);
		if (d < recordDistance) {
			recordDistance = d;
			bestEver = order.slice();
		}

		let s = '';
		for (let i = 0; i < order.length; i++) {
		  s += order[i];
		}
		console.log('Шлях: ', s);
		let percent = 100 * (count / totalPermutations);
		console.log(percent + "% виконано");

		nextOrder();


	}

	function calcDistance(points, order) {
		let sum = 0;
		for (let i = 0; i < order.length - 1; i++) {
			let cityAIndex = order[i];
			let cityA = points[cityAIndex];
			let cityBIndex = order[i + 1];
			let cityB = points[cityBIndex];
			// взяти з матриці інцидентності
			let d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
			sum += d;
		}
		return sum;
	}

	function nextOrder() {
		count++;

		// Крок перший лексографічного алгоритму
		// https://www.quora.com/How-would-you-explain-an-algorithm-that-generates-permutations-using-lexicographic-ordering
		let largestI = -1;
		for (let i = 0; i < order.length - 1; i++) {
			if (order[i] < order[i + 1]) {
				largestI = i;
			}
		}
		if (largestI == -1) {
			noLoop();
			console.log('finished');
		}

		// Крок 2
		let largestJ = -1;
		for (let j = 0; j < order.length; j++) {
			if (order[largestI] < order[j]) {
				largestJ = j;
			}
		}

		// Крок 3
		swap(order, largestI, largestJ);

		// Крок 4: Робимо reverse для largestI + 1
		let endArray = order.splice(largestI + 1);
		endArray.reverse();
		order = order.concat(endArray);
	}

	preload();
	setup();
	print();
})()

