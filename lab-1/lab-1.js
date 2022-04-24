const fs = require('fs')

const makeArrayFromTextFile = (path) => {
	const text = fs.readFileSync(path, 'utf-8');
	const arr = text.trim().split('\n');
	console.log("Вхідні дані (перед parseInt()):");
	console.dir(arr);
	return arr.map( (element) => element.split(' ').map((el) => parseInt(el)));
}

const  generateAlphabet = (capital = false) => {
	return [...Array(26)].map((_, i) => String.fromCharCode(i + (capital ? 65 : 97)));
}

(function run() {
	let adjacencyList = makeArrayFromTextFile('l1-1.txt');

	// Дістаємо число вершин з вхідних даних
	const nodeQuantity = adjacencyList.shift();
	console.log('adjacencyList', adjacencyList);

	// Створили масив міст (назви це букви)
	const cities = generateAlphabet().slice(0, nodeQuantity);
	console.log('cities', cities);

	const formattedList = new Map();

	// Добавлення вершини
	function addNode(city) {
		formattedList.set(city, []);
	}

	// Форматування інцидентних вершин
	function formatAlliedNodes(cityIndex, routes) {
		let city = String.fromCharCode(cityIndex + 97);
		routes.forEach((weight, i) => {
			let name = String.fromCharCode(i + 97);
			if(weight !== 0) {
				formattedList.get(city).push({name, weight});
			}
		});
	}

	function primaAlgorythm(start) {
		const visited = new Set();
		let foundNodes = [start];
		visited.add(start);
		let weightSum = 0;

		while(foundNodes.length < nodeQuantity) {
			const city = foundNodes.reduce((prev, curr) => {
				return (prev.weight > curr.weight) ? prev : curr;
			});
			if(visited.has(city.name)){
				return;
			}
			let alliedNodes = formattedList.get(city);
			let selectedNode = alliedNodes.reduce((prev, curr) => {
				return (prev.weight > curr.weight) ? prev : curr;
			})
			visited.add(selectedNode.name);
			foundNodes.push(selectedNode.name);
			console.log(city);
		}
	}

	// Створення і форматування даних під задачу.
	cities.forEach(city => addNode(city));
	adjacencyList.forEach((row, index) => formatAlliedNodes(index, row));
	console.log('Відформатовані дані:', formattedList);

	primaAlgorythm('a');
})()
