const fs = require('fs')

const makeArrayFromTextFile = (path) => {
	console.log(__dirname)
	const text = fs.readFileSync(__dirname + '/' + path, 'utf-8');
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
				allLinks.push([[city, name].sort().join(''), weight]);
			}
		});
	}

	function findOddNodes() {
		return [...formattedList].filter(([k, v]) => v.length % 2 === 1);
	}

	function getPairs(oddNodes, start) {
		let result = [];

		let pairPool = oddNodes.filter(el => el[0] !== start);
		pairPool.forEach((node, i, self) => {
			// console.log(node);
			result.push({
				pairStart: [start, node[0]],
				pairEnd: self.filter(el => el[0] !== node[0]).map(el => el[0])
			});
		});
		return result;
	}

	function shortestPathBfs(startNode, stopNode) {
		const previous = new Map();
		const visited = new Set();
		const queue = [];
		queue.push({ node: startNode, dist: 0 });
		visited.add(startNode);
		// console.log('check #1')
		// console.dir({queue, visited, startNode, stopNode});

		while (queue.length > 0) {
			const { node, dist } = queue.shift();
			if (node === stopNode) return { shortestDistance: dist, previous };

			for (let neighbour of formattedList.get(node)) {

				if (!visited.has(neighbour.name)) {
					previous.set(neighbour.name, node);
					queue.push({ node: neighbour.name, dist: dist + neighbour.weight });
					visited.add(neighbour.name);
				}
				// console.log('previous', previous);
			}
		}
		return { shortestDistance: -1, previous };
	}

	function getLinksByName(updatedLinks, name) {
		return updatedLinks.filter(path => path[0].includes(name));
	}

	function eulerianPath(updatedLinks, start) {
		// console.log(updatedLinks, start);
		let currPath = [];
		let circuit = [];
		let sumWeight = 0;

		currPath.push(start);
		let currentNode = start;
		while(currPath.length > 0) {
			// Якщо є ще ребро якесь
			if (updatedLinks.length > 0)
			{
				// Закидаємо вершину в шлях
				currPath.push(currentNode);

				// Шукаємо наступну вершину з шляхів
				let adjacentNodes = getLinksByName(updatedLinks, currentNode);
				console.log('Cусіди:', adjacentNodes);
				let nextNode = adjacentNodes.reduce((res, element) => {
					if(element[1] < res[1] && !element[0].includes(start)) {
						res = [element[0], element[1]];
					} else if (element[0].includes(start) && (adjacentNodes.length === 1 || adjacentNodes.every(el => el[0].includes(start)))) {
						res = [element[0], element[1]];
					}
					return res;

				}, ['', 1000000]);
				console.log('Вибираємо', nextNode);

				// Видаляємо ребро
				let index = updatedLinks.findIndex((element) => element[0] === nextNode[0]);
				updatedLinks.splice(index, 1);

				// Рухаємось на наступну вершину
				currentNode = nextNode[0].replace(currentNode, '')
			}

			else
			{
				circuit.push(currentNode);
				currentNode = currPath.pop();
			}
		}

		// Друкуємо шлях
		let res = circuit.reverse().join('->');
		console.log('Шлях листоноші:' ,res);
		return res;
	}

	let adjacencyList = makeArrayFromTextFile('l2-1.txt');

	// Дістаємо число вершин з вхідних даних
	const nodeQuantity = adjacencyList.shift();

	// Створили масив міст (назви це букви)
	const nodes = generateAlphabet().slice(0, nodeQuantity);

	const formattedList = new Map();
	const allLinks = [];
	let filteredLinks = [];
	let updateLinks = [];

	// Створення і форматування даних під задачу.
	nodes.forEach(city => addNode(city));
	adjacencyList.forEach((row, index) => formatAlliedNodes(index, row));
	filteredLinks = Array.from(new Set(allLinks.map(JSON.stringify)), JSON.parse);
	updateLinks = filteredLinks;
	let totalWeight = filteredLinks.reduce((sum, el) => sum + el[1], 0);

	console.log('Відформатовані дані про граф: ', formattedList);
	console.log('Всі ребра без повторів: ', filteredLinks);

	let oddNodes = findOddNodes();
	let start = oddNodes[0][0];
	let pairs = getPairs(oddNodes, start);

	let pairPaths = [];
	let record = 10000;
	let chosenPair = {};
	pairs.forEach((pair) => {
		let pathStart = shortestPathBfs(pair.pairStart[0], pair.pairStart[1]);
		let pathEnd = shortestPathBfs(pair.pairEnd[0], pair.pairEnd[1]);
		let sumWeight = pathStart.shortestDistance + pathEnd.shortestDistance;
		if(sumWeight < record) {
			record = sumWeight;
			chosenPair = {
				pair: [
					[pair.pairStart[0], pair.pairStart[1], pathStart.shortestDistance],
					[pair.pairEnd[0], pair.pairEnd[1], pathEnd.shortestDistance]
				], sumWeight
			};
		}

		pairPaths.push({
			start:{path: pair.pairStart.join('<->'), bfs: pathStart.shortestDistance},
			end:{path: pair.pairEnd.join('<->'), bfs: pathEnd.shortestDistance}
		});
	});
	console.log('Непарні вершини: ', oddNodes.map(row => row[0]));
	console.log('Пари непарних вершин: ', pairs);
	console.log('Значення шляхів у парах непарних вершин', pairPaths);
	console.log('Вибрана оптимальна пара:', chosenPair);
	console.log('Загальний шлях (повторювані дуги + всі дуги):', chosenPair.sumWeight + totalWeight);

	chosenPair.pair.forEach(pair => {
		updateLinks.push([pair[0] + pair[1], pair[2]]);
	})
	console.log('Оновлено дуги (добавлено повторювані)', updateLinks)

	let res = eulerianPath(updateLinks, start);
	console.log('Результат виконання програми: ', res);
})()


