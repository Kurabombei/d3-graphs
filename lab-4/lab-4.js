const fs = require('fs')

const makeArrayFromTextFile = (path) => {
	const text = fs.readFileSync(path, 'utf-8');
	const arr = text.trim().split('\n');
	return arr.map( (element) => element.split(' ').map((el) => parseInt(el)));
}

const  generateAlphabet = (capital = false) => {
	return [...Array(26)].map((_, i) => String.fromCharCode(i + (capital ? 65 : 97)));
}

(function run() {
	let result = '';
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

	function findMaxAdjacent(alliedNodes, visited) {
		if(alliedNodes.length === 0) return;
		let selectedNode = alliedNodes.reduce((prev, curr) => (prev.weight < curr.weight) ? prev : curr);
		if(visited.has(selectedNode.name)) {
			return findMaxAdjacent(alliedNodes.filter(node => node !== selectedNode), visited);
		}
		console.log('Найдена вершина:', selectedNode);
		let selectedOrigin = formattedList.get(selectedNode.name).find(city => city.weight === selectedNode.weight);
		console.log(`До покриваючого дерева добавлено ребро: ${selectedOrigin.name}->${selectedNode.name} з вагою ${selectedOrigin.weight}`);

		result += `${selectedOrigin.name}->${selectedNode.name}(${selectedOrigin.weight}); `
		return selectedNode;
	}

	function primaAlgorithm(start) {
		const visited = new Set();
		visited.add(start);

		let foundNodes = [start], weightSum = 0, n = 1;

		// Перший крок
		let alliedNodes = formattedList.get(start);
		let unreachedRoutes = [...alliedNodes];

		while(foundNodes.length < nodeQuantity) {
			console.log('Відвідані вершини:', visited);
			let foundNode = findMaxAdjacent(unreachedRoutes, visited);
			visited.add(foundNode.name);
			foundNodes.push(foundNode.name);
			unreachedRoutes = [...unreachedRoutes, ...formattedList.get(foundNode.name)];

			weightSum += foundNode.weight;
			console.log('Сумарна вага ребер остового дерева: ', weightSum);
		}
		return result;
	}

	let adjacencyList = makeArrayFromTextFile('l1-1.txt');

	// Дістаємо число вершин з вхідних даних
	const nodeQuantity = adjacencyList.shift();

	// Створили масив міст (назви це букви)
	const cities = generateAlphabet().slice(0, nodeQuantity);

	const formattedList = new Map();

	// Створення і форматування даних під задачу.
	cities.forEach(city => addNode(city));
	adjacencyList.forEach((row, index) => formatAlliedNodes(index, row));
	console.log('Відформатовані дані про граф: ', formattedList);

	let res = primaAlgorithm('a');
	console.log('Результат виконання програми: ', res);
})()
