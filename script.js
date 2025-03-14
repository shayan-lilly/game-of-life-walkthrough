/* filepath: /workspaces/game-of-life-walkthrough/script.js */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const cellRadius = 2;
const colors = ['#9be9a8', '#40c463', '#30a14e', '#216e39'];
let rows, cols, grid;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rows = Math.floor(canvas.height / cellSize);
    cols = Math.floor(canvas.width / cellSize);
    grid = createGrid(rows, cols);
}

function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            drawCell(row, col);
        }
    }
}

function drawCell(row, col) {
    ctx.beginPath();
    ctx.arc(
        col * cellSize + cellSize / 2,
        row * cellSize + cellSize / 2,
        cellSize / 2 - cellRadius,
        0,
        2 * Math.PI
    );
    const neighbors = countNeighbors(row, col);
    ctx.fillStyle = grid[row][col] ? colors[Math.min(neighbors, colors.length - 1)] : 'white';
    ctx.fill();
    ctx.stroke();
}

function updateGrid() {
    const newGrid = createGrid(rows, cols);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(row, col);
            newGrid[row][col] = shouldCellLive(grid[row][col], neighbors) ? 1 : 0;
        }
    }
    grid = newGrid;
}

function shouldCellLive(isAlive, neighbors) {
    return isAlive ? neighbors === 2 || neighbors === 3 : neighbors === 3;
}

/**
 * Counts the number of live neighbors around a given cell in the grid.
 *
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {number} The number of live neighbors around the cell.
 */
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (isValidCell(newRow, newCol)) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

function isValidCell(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
}

function gameLoop() {
    updateGrid();
    drawGrid();
    setTimeout(gameLoop, 500);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
gameLoop();