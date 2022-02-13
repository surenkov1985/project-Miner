let bombIndex = [];
let bomb = Number($(".numbBomb").val());
let number = Number($(".numbCell").val());
let gameArray = getRandomArr(number, bomb);
let width = "width, `${50 * number}px`";
let height = "height, `${25 * number}px`";
let openCell = 0;

$(".win").hide();

function newGame() {
	bomb = Number($(".numbBomb").val());
	number = Number($(".numbCell").val());
	openCell = 0;
	bombIndex = [];
	if ($(".cell").hasClass("flag")) {
		$(".cell").removeClass("flag");
	}
	if ($(".cell").hasClass("cool")) {
		$(".cell").removeClass("cool");
	}
	if ($(".cell").hasClass("boom")) {
		$(".cell").removeClass("boom");
	}
	if ($(".win").hasClass("close")) {
		$(".win").removeClass("close");
	}
	$(".open").css("width", `0`);
	$(".open").css("height", `0`);

	gameArray = getRandomArr(number, bomb);
	renderCell(gameArray);
}

renderCell(gameArray);

function gameOver() {
	bomb = Number($(".numbBomb").val());
	number = Number($(".numbCell").val());

	$(".win").toggleClass("close");
	$(".win").css("transform", "opasity(1)");

	$(".win").show();
}

$(".new-game").click(function () {
	newGame();
	$(".win").hide();
});

// /////////////////////////////////////////////////////////////////////
function getRandomArr(number = 4, numbBomb = 1) {
	let arr = [];
	let array = [];
	let arrLength = Math.pow(number, 2);
	$("#container").css("width", `${50 * number + 20}px`);
	$("#container").css("height", `${50 * number + 100}px`);

	for (let y = 0; y < arrLength; y++) {
		array.push(y < numbBomb ? 9 : 0);
	}

	array.sort(() => Math.random() - 0.5);

	for (let i = 1; i <= number; i++) {
		let str = [];

		for (let j = 0; j < number; j++) {
			str.push(array.pop());
			if (str[j] === 9) {
				bombIndex.push([i - 1, j]);
			}
		}

		arr.push(str);
	}
	return arr;
}

function renderCell(arr) {
	const cont = $("#content");
	const lineBlock = `<div class="line"></div>`;

	const cellDiv = `<div class="cell"></div>`;

	cont.empty();

	for (let y = 0; y < arr.length; y++) {
		const line = $(lineBlock);

		for (let x = 0; x < arr[y].length; x++) {
			const cell = $(cellDiv);

			cell.attr("row", y);
			cell.attr("col", x);

			line.append(cell);
		}

		cont.append(line);
	}
}

function checkArray(x, y) {
	let arr = [];

	for (let i = x > 0 ? x - 1 : x; i <= x + 1; i++) {
		let str = [];

		for (let z = y > 0 ? y - 1 : y; z <= y + 1; z++) {
			console.log(i, z);
			str.push(gameArray[i][z]);
		}
		arr.push(str);
	}

	return arr;
}

function countBombs(row, col) {
	if (row < 0 || row >= gameArray.length) return;
	if (col < 0 || col >= gameArray[0].length) return;
	if (gameArray[row] && gameArray[row][col] !== 0) return;

	let count = 0;

	let upRow = row - 1;
	let downRow = row + 1;
	let leftCol = col - 1;
	let rightCol = col + 1;

	if (gameArray[upRow]) {
		if (gameArray[upRow][leftCol] === 9) count++;
		if (gameArray[upRow][col] === 9) count++;
		if (gameArray[upRow][rightCol] === 9) count++;
	}

	if (gameArray[row]) {
		if (gameArray[row][leftCol] === 9) count++;
		if (gameArray[row][rightCol] === 9) count++;
	}

	if (gameArray[downRow]) {
		if (gameArray[downRow][leftCol] === 9) count++;
		if (gameArray[downRow][col] === 9) count++;
		if (gameArray[downRow][rightCol] === 9) count++;
	}

	const cellDiv = $('.cell[row="' + row + '"][col="' + col + '"]');

	cellDiv.addClass("cool");
	openCell++;

	if (count === 0) {
		gameArray[row][col] = -1;

		countBombs(upRow, col);
		countBombs(row, rightCol);
		countBombs(downRow, col);
		countBombs(row, leftCol);
	} else {
		gameArray[row][col] = count;

		cellDiv.text(count);

		if (count === 1) {
			cellDiv.css("color", "#0804f1");
		} else if (count === 2) {
			cellDiv.css("color", "#048000");
		} else if (count === 3) {
			cellDiv.css("color", "#f8050b");
		}
	}

	return count;
}

// ///////////////////////////////////////////////////////// Обработка нажатий на клетку
$("#content").on("click", ".cell", function (eventData) {
	let row = $(eventData.target).attr("row");
	let col = $(eventData.target).attr("col");

	row = Number(row);
	col = Number(col);

	if (!$(eventData.target).hasClass("flag")) {
		if (gameArray[row][col] === 9) {
			$(eventData.target).addClass("cool");
			$(eventData.target).addClass("boom");

			gameOver();
		} else {
			countBombs(row, col);
		}
		if (openCell + bomb === Math.pow(number, 2)) {
			for (let [row, col] of bombIndex) {
				$(`.cell[row="${row}"][col="${col}"]`).addClass("boom");
			}

			setTimeout(gameOver, 500);
		}
	}
});

$(document).bind("contextmenu", function (e) {
	return false;
});

$("#content").contextmenu(function (eventData) {
	$(eventData.target).toggleClass("flag");
});
