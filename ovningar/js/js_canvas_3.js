function makeCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.lineWidth = 20;
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
}

function getRect(ctx, x, y, length, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, length, height);
}
function drawLine(ctx, x, y, length, width, color) {
    ctx.beginPath();          
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x, y);
    ctx.lineTo(x+length, y);
    ctx.lineTo(x, y+length);
    ctx.stroke();
}