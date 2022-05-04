const fs = require('fs')
const makeArrayFromTextFile = (path) => {
	const text = fs.readFileSync(path, 'utf-8');
	const arr = text.trim().split('\n');
	return arr.map( (element) => element.split(' ').map((el) => parseInt(el)));

}

function  fordFulkerson (iArr) {
	let arr = iArr.map((array) => {
		return array.slice();
	});

	let maxFlow = [];
	let paths = [];
	let limit = 0;
	while(pathFinder(arr) && limit < 25){
		limit++;

		console.log(`Ітерація №${limit}################################################`);
		console.log(`Пошук шляху від 0 до ${arr.length - 1}`);

		let path = pathFinder(arr);
		console.log(path);

		let minEdge = {
			coordinates: [],
			value: Infinity,
			i: 0
		}

		for (let i = 0; i < path.length; i++) {
			if(arr[path[i][0]][path[i][1]] < minEdge.value){
				minEdge.coordinates = [path[i][0], path[i][1]];
				minEdge.value = arr[path[i][0]][path[i][1]];
				minEdge.i = i;
			}
		}

		console.log(minEdge);

		for (let i = 0; i < path.length; i++) {
			if(i == minEdge.i) arr[path[i][0]][path[i][1]] = 0;
			else arr[path[i][0]][path[i][1]] -= minEdge.value;
		}


		maxFlow.push(minEdge.value);
		paths.push(path);

		console.log('Знайдений шлях: ');
		let pathStr = '';
		for (let i = 0; i < path.length; i++) {
			if(i == path.length - 1) pathStr += `(${path[i][0]})=>(${path[i][1]})`;
			else pathStr += `(${path[i][0]})=>`;
		}
		console.log(pathStr);
		console.log(`Мінімальне ребро: (${minEdge.coordinates[0]},${minEdge.coordinates[1]}) = ${minEdge.value}`);
		console.log(`\nНова матриця: \n${printMatrix(arr)}`);
	}


	console.log(`\nЗнайдені шляхи:\n`);
	let pathStr1 = '';
	for (let i = 0; i < paths.length; i++) {
		for (let j = 0; j < paths[i].length; j++) {
			if(j == paths[i].length - 1) pathStr1 += `(${paths[i][j][0]})=>(${paths[i][j][1]})\n`;
			else pathStr1 += `(${paths[i][j][0]})=>`;
		}
		console.log(pathStr1)
		console.log(`\nмінімальне ребро = ${maxFlow[i]}\n`);
	}

	console.log(`\nМаксимум:\n`);

	for (let i = 0; i < maxFlow.length; i++) {
		if(i == maxFlow.length - 1) console.log(`${maxFlow[i]}`);
		else console.log(`${maxFlow[i]} + `);
	}

	console.log(` = ${maxFlow.reduce((a, b) => a + b, 0)}`);

	console.log(...maxFlow);
	console.log(paths);


	function pathFinder (a){
		let path = [];
		let edgeList = [];
		for (let i = 0; i < a.length; i++) {
			for (let j = 0; j < a[i].length; j++) {
				if(a[i][j] != 0) edgeList.push({coordinates:[i,j], value:a[i][j]});
			}
		}

		if(edgeList.findIndex(val => val.coordinates[0] == 0) == -1) return 0;
		path.push(edgeList[edgeList.findIndex(val => val.coordinates[0] == 0)].coordinates);

		while(edgeList.findIndex(val => val.coordinates[0] == path[path.length - 1][1]) != -1){
			console.log(`Найдено наступну: ${edgeList[edgeList.findIndex(val => val.coordinates[0] == path[path.length - 1][1])].coordinates}`);
			path.push(edgeList[edgeList.findIndex(val => val.coordinates[0] == path[path.length - 1][1])].coordinates);
			edgeList.splice(edgeList.findIndex(val => val.coordinates == path[path.length - 1]), 1);
			console.log(`Оновлені дуги: \n`);
			console.log(edgeList);
			if(edgeList.findIndex(val => val.coordinates[0] == path[path.length - 1][1]) == -1 && path[path.length - 1][1] != a.length - 1){
				path.splice(path.length - 1);
			}
		}

		if(path[path.length - 1][1] == a.length - 1) return path;
		else{
			console.log("Не шлях.");
			a[path[path.length - 1][0]][path[path.length - 1][1]] = 0
			return pathFinder(a);
		}
	}

}

(function run () {
	let arr = makeArrayFromTextFile('l4-1.txt');
	let n = arr.shift();
	console.log('Введена матриця:', arr);
	fordFulkerson(arr);
})()


function printMatrix(arr){
	let output = "";
	for (let i = 0; i < arr.length; i++) {
		output += "["
		for (let j = 0; j < arr[i].length; j++) {
			if(arr[i][j] < 10) output += `${arr[i][j]}   `;
			else if(arr[i][j] < 100) output += `${arr[i][j]}  `;
			else output += `${arr[i][j]} `;
		}
		output += "]\n"
	}
	return output;
}

