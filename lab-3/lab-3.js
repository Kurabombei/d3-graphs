/** Красивий варіант з візуалізацією але без штучно вказаних ваг дуг (оскільки не найдено варіанту
 * швидко намалювати ребра на правильних відстанях, можна переглянути тут:
 * https://editor.p5js.org/Kurabombei/sketches/M1ZpPmHiq
	 * На p5.js робочий лексографічний метод перебору, а тут незакінчений метод гілок та меж)
 * **/

class Node {
	constructor(id, parentId, weight) {
		this.id = id;
		this.parent = parentId;
		this.weight = weight;

		// this.lowerBound = lowerB();
		this.path = [];
		this.children = [];
	}

}

class SpaceTree {
	constructor(root, quantity) {
		this.root = root;
		this.quantity = quantity;
	}
}

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
	let spaceTree;
	let nodes = [];
	let totalNodes = 6;

	let order = [];
	let adjacencyList = [[]];

	let totalPermutations;
	let count = 0;


	let recordDistance;
	let bestEver;

	function preload() {
		adjacencyList = makeArrayFromTextFile('l3-1.txt');
		totalNodes = adjacencyList.shift();
		let root = new Node(1, 1, 0);
		spaceTree = new SpaceTree(root, totalNodes);


	}

	function setup() {
		console.log('Початкова матриця: ', adjacencyList);

		// Додаю нескінченність на діагоналі
		let arrCopy = adjacencyList.map((row, i) => {
			return row.map((el, j) => (i === j) ? Infinity : el);
		});
		console.log(arrCopy);

		for (let i = 0; i < totalNodes; i++) {
			// let node = new Node(String.fromCharCode(i + 97));
			nodes[i] = String.fromCharCode(i + 97);
			// order[i] = i;
		}
		
		let limit = 0;
		while(limit < 25) {
			limit++;
			adjacencyList.forEach((row, i) => {
				row.forEach((el, j) => {
					if(el !== 0) {
						let node = new Node(j, i)
					}
				})
			})
		}

		// let d = calcDistance(nodes, order);
		// recordDistance = d;
		// bestEver = order.slice();
		//
		// totalPermutations = factorial(totalNodes);
		// console.log(totalPermutations);

	}
	//
	// function minColRowDel (arr){
	//
	// 	let tempArr = arr.slice();
	//
	// 	let minRow = [];
	// 	let minCol = [];
	//
	// 	for (let i = 0; i < tempArr.length; i++) {
	// 		minRow.push(100000);
	// 		for (let j = 0; j < tempArr[i].length; j++) {
	// 			if(tempArr[i][j] < minRow[i]) minRow[i] = tempArr[i][j];
	// 		}
	// 	}
	//
	// 	console.log(`minRow: ${minRow}`);
	//
	//
	// 	for (let i = 0; i < tempArr.length; i++) {
	// 		for (let j = 0; j < tempArr[i].length; j++) {
	// 			tempArr[i][j] -= minRow[i];
	// 		}
	// 	}
	//
	// 	console.log(tempArr);
	//
	// 	for (let i = 0; i < tempArr.length; i++) {
	// 		minCol.push(100000);
	// 		for (let j = 0; j < tempArr[i].length; j++) {
	// 			if(tempArr[j][i] < minCol[i]) minCol[i] = tempArr[j][i];
	// 		}
	// 	}
	//
	// 	console.log(`minCol: ${minCol}`);
	//
	// 	for (let i = 0; i < tempArr.length; i++) {
	// 		for (let j = 0; j < tempArr[i].length; j++) {
	// 			tempArr[j][i] -= minCol[i];
	// 		}
	// 	}
	//
	// 	return [tempArr, minRow, minCol];
	// }

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

		console.log(nodes);
		// let res = minColRowDel(adjacencyList)[0];
		// let minRow = minColRowDel(adjacencyList)[1];
		// let minCol = minColRowDel(adjacencyList)[2];
		// console.log(res);
		// console.log(minRow);
		// console.log(minCol);
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
		
	}

	preload();
	setup();
	print();
})()

