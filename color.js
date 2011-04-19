// Global abatement container
var COLOR = {}; 

// Radial gradient using the given list of colors.
COLOR.radialGradient = function (colors, x, y, radius, steps) { 
	steps = steps || 300;
	
    var step = function(colors, i, n) {
		var l = colors.length - 1,
			a = 1.0 * i/n *l,
			a = Math.min(a + 0, l),
			b = Math.min(a + 1, l),
			base = 1.0 * n/l * a,
			d = (i-base) / (n/l),		
			r = colors[a]['r'] * (1-d) + colors[b]['r'] * d,
			g = colors[a]['g'] * (1-d) + colors[b]['g'] * d,
			b = colors[a]['b'] * (1-d) + colors[b]['b'] * d;
		//return {
		//		'r': r,
		//		'g': g,
		//		'b': b
		//};
		return [r, g, b];
	}
	
    for (var i; i <= steps.length; i += 1) {
		var rgbArray = step(colors, i, steps); 
        ctxt.fillStyle = vsprintf('rgb(%s, %s, %s)', rgbArray);
        ctxt.arc(x+i, y+i, radius - i * 2, Math.PI * 180, true);  
	}
};


// Create rgb string with random values between 0 and 255.
// Relies on the open-source implementation of sprintf found in 
// 'sprintf-0.7-beta1.js' by Alexandru Marasteanu.
COLOR.getRandomColor = function () {
	var styleArray = [];
	for (var i = 0; i < 3; i++) {
		var randomValue = Math.floor(Math.random() * 256);
		styleArray.push(randomValue);
	}
	return vsprintf('rgb(%s, %s, %s)', styleArray);
};


// Draw 10 semi transparent rectangles inside a given rectangle with 
// position x, y and size w, h.
COLOR.gradateRectColor = function (ctx, parent_x, parent_y, parent_w, parent_h) {
	for (var i=0;i<10;i++){
		ctx.fillStyle = 'rgba(255,255,255,'+(i+1)/10+')';
		var border = Math.max(.05 * parent_w, .05 * parent_h);
		var child_w = (parent_w - (2 * border)) * .1;  
		var child_h = (parent_h - (2 * border)) * .90;
		var child_x = border + (i * child_w) + parent_x;
		var child_y = border + parent_y;
		ctx.fillRect(child_x, child_y, child_w, child_h);
	}
};


COLOR.gradateCircleColor = function (ctx, parent_x, parent_y, parent_radius) {
	//Draw border
	ctx.fillStyle = 'rgba(255,255,255,.5)';
	ctx.beginPath();		
	ctx.arc(parent_x, parent_y, parent_radius * .9, 0, Math.PI*2, true);
	ctx.fill();

	//Draw highlight
	ctx.lineWidth = 7;
	ctx.strokeStyle = 'rgb(255,255,255)';
	ctx.beginPath();		
	ctx.arc(parent_x, parent_y, parent_radius * .8, 0, 1.5 * Math.PI, true);
	ctx.stroke();
};
