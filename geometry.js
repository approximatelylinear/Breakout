// Global abatement container
var GEOMETRY = {}; 


GEOMETRY.geometricObject = {
	shape: '', 
	position : {
		x: 0, 
		y: 0
	},
	size : {
		x: 0, 
		y: 0,
		radius: {
			x: 0, 
			y: 0
		}
	},								
	velocity: {
		x: 0,
		y: 0,
	}, 
}; // end GEOMETRY.geometricObject



GEOMETRY.initGeometricObject = function (that, secrets) {
	var that = that || {};
	var secrets = secrets || Object.beget(GEOMETRY.geometricObject);

	var getShape = function () {
		return secrets.shape;
	};	
	
	var getPosition = function () {
		return secrets.position;
	}; 
	
	var getSize = function () {
		return secrets.size;
	};		
	
	var getVelocity = function () {
		return secrets.velocity;
	};
	
	var setShape = function (shape) {
		this.shape = shape;
		return this;
	};	
	
		
	// Getters
	that.getShape = getShape;
	that.getPosition = getPosition;
	that.getSize = getSize;
	that.getVelocity = getVelocity;
	
	return that;
}; // end GEOMETRY.initGeometricObject



// Add setters to manipulate geometric properties
GEOMETRY.makeMalleable = function (that, secrets) {
	var that = that || {};
	var secrets = secrets || Object.beget(GEOMETRY.initGeometricObject);
	
	
	// Pass a string indicating a shape. Defaults to creating a rectangle. 
	var setShape = function (shape) {
		shape = shape || 'rect'; 
		this.shape = shape;
		return this;
	};	
	
	// Pass an object {coord_val: val} 
	//		e.g. setPosition({'x': 10, 'y': 10})
	// or a string identifying a coordinate and the value to assign it
	// 		e.g. setPosition('x', 10) 
	var setPosition = function (coord, value) {
		coord = coord || { 'x':0, 'y':0};
		UTILITIES.attrSetter.apply(this, ['position', coord, value]); 
		return this;
	}; 

	// Pass an object {coord_val: val} 
	//		e.g. setHeightWidth({'x': 10, 'y': 10})
	// or a string identifying a coordinate and the value to assign it
	// 		e.g. setHeightWidth('x', 10) 	
	var setHeightWidth = function (coord, value) {
		coord = coord || { 'x':0, 'y':0 };
		UTILITIES.attrSetter.apply(this, ['size', coord, value]); 
		return this;
	};		

	// Pass an object {coord_val: val} 
	//		e.g. setRadius({'x': 10, 'y': 10})
	// or a string identifying a coordinate and the value to assign it
	// 		e.g. setRadius('x', 10) 	
	var setRadius = function (coord, value) {
		coord = coord || { 'x':0, 'y':0 };
		UTILITIES.attrSetter.apply(this, ['size'['radius'], coord, value]); 
		return this;
	};
	
	// Pass an object {coord_val: val} 
	//		e.g. setVelocity({'x': 10, 'y': 10})
	// or a string identifying a coordinate and the value to assign it
	// 		e.g. setVelocity('x', 10) 			
	var setVelocity = function (coord, value) {
		coord = coord || { 'x':0, 'y':0 };
		UTILITIES.attrSetter.apply(this, ['velocity', coord, value]); 
		return this;
	};
	
	// Setters
	that.setShape = setShape;
	that.setPosition = setPosition;
	that.setHeightWidth = setHeightWidth;
	that.setRadius = setRadius;
	that.setVelocity = setVelocity;
		
	return that;	
	
};


// Relies on raphael.js
GEOMETRY.createSVGObject = function (that, secrets) {
	var that = that || GEOMETRY.initGeometricObject(null, secrets);
	var secrets =  secrets || {};
	
	var create = function (rphlCanvas) {
			this.obj = rphlCanvas[that.getShape()]();					
			this.obj.attr({
				cx: that.getPosition()['x'],
				cy: that.getPosition()['y'], 					
				x: that.getPosition()['x'],
				y: that.getPosition()['y'], 		
				r: that.getSize()['radius']['x'],			
				rx: that.getSize()['radius']['x'],
				ry: that.getSize()['radius']['y'],
				width: that.getSize()['x'],
				height: that.getSize()['y'],
			});			
			
			return this;
	};
	
	var draw = function (object, stroke, fill) {
		this.obj = object;
		this.obj.attr({
			stroke: stroke, 
			fill: fill
		});
		return this;
	};
	
	
	that.create = create;
	that.draw = draw; 
	
	return that;
}; // end GEOMETRY.createSVGObject


GEOMETRY.createCanvasObject = function (that, secrets) {
	var that = that || GEOMETRY.initGeometricObject(null, secrets);
	var secrets =  secrets || {};
		
	var setUpShape = function (fillStyle) {
		
		this.drawRoutines = {
			'clear': ['clearRect', []],
			'path': '',
			'arc': '',
			'stroke': '',
			'fill': '', 
		};
		
		this.fillStyle = fillStyle;
		this.position = that.getPosition();
		this.size = that.getSize();
		this.shape = that.getShape();
		this.velocity = that.getVelocity();
		
		switch (this.shape) {
			case 'rect': 
				this.drawRoutines = {
					'clear': ['clearRect', [this.position['x'], 
											this.position['y'], 
											this.size['x'], 
											this.size['y']]],
					'fill': ['fillRect', [this.position['x'], 
											this.position['y'], 
											this.size['x'], 
											this.size['y']]],
					'stroke': ['strokeRect', [this.position['x'], 
											this.position['y'], 
											this.size['x'], 
											this.size['y']]]
				};
				break;
			
			case 'circ': 
				this.drawRoutines = {
					'clear': ['clearRect', 
								[(this.position['x'] - 
									this.size['radius']['x'] * 2), 
								(this.position['y'] - 
									this.size['radius']['y'] * 2), 
								this.size['radius']['x'] * 4, 
								this.size['radius']['y'] * 4]],
					'path': ['beginPath', []],
					'arc': ['arc', [this.position['x'], 
									this.position['y'], 
									this.size['radius']['x'], 
									0, 
									Math.PI*2, 
									true]],
					'fill': ['fill', []], 
					'stroke': ['stroke', []],
				};
				break;
			
			case 'line':
				//this.drawRoutines = {
					//'clear': 'clearRect',
					//'fill': '', 
					//'stroke': ''
				//};
				break;
				
			default:
				break;
		}
			
		return this;
	};
	

	var setUpBoundaries = function() {
		this.position = that.getPosition();
		this.size = that.getSize();
		this.shape = that.getShape();
		
		this.boundaries = {
			'top': 0, 
			'bottom': 0, 
			'left': 0,
			'right': 0
		}; 
		switch (this.shape) {
			case 'rect':
				this.boundaries = {
					'top': this.position.y,
					'bottom': this.size.y + this.position.y,
					'left': this.position.x,
					'right': this.size.x + this.position.x
				};
				break;

			case 'circ': 
				this.boundaries = {
					'top': (this.position['y'] - 
										this.size['radius']['y']),
					'bottom': (this.position['y'] + 
										this.size['radius']['y']), 
					'left': (this.position['x'] - 
										this.size['radius']['x']), 
					'right': (this.position['x'] - 
										this.size['radius']['x'])
				};
				break;
			case 'line':
				break;
			default: 
				break;
		}
		return this;
	};
	
	
	that.setUpShape = setUpShape;
	that.setUpBoundaries = setUpBoundaries;
	
	return that;
}; // end GEOMETRY.createCanvasObject



GEOMETRY.makeCanvasObjectDrawable = function (that, secrets) {
	var that = that || GEOMETRY.createCanvasObject(null, secrets);
	var secrets =  secrets || {};
	var canvasContext = secrets.canvasContext || {}; 
	 
	var draw = function() {
		canvasContext.fillStyle = this.fillStyle; 
		for (var routine in this.drawRoutines) { 
			canvasContext[this.drawRoutines[routine][0]]
							  .apply(canvasContext,  
									this.drawRoutines[routine][1]);	
		}
		return this;
	};

	that.canvasContext = canvasContext;
	that.draw = draw; 
	return that;
}; // end GEOMETRY.makeCanvasObjectDrawable




GEOMETRY.createBall = function (context) {
	var that = GEOMETRY.createCanvasObject(null, {shape: 'circ', 
		position : {
			x: 125, 
			y: 95
		},
		size : {
			x: 0, 
			y: 0,
			radius: {
				x: 5, 
				y: 5
			}
		},								
		velocity: {
			x: 0,
			y: 0,
		}}); 	
	
	that.shape = that.setUpShape(UTILITIES.getRandomColor());
	that.boundaries = that.setUpBoundaries();
	GEOMETRY.makeCanvasObjectDrawable(that, {'canvasContext': context});
	that.draw();
	return that;
};


GEOMETRY.createBlock = function (context) {
	var that = GEOMETRY.createCanvasObject(null, {shape: 'rect', 
		position : {
			x: 100, 
			y: 100
		},
		size : {
			x: 50, 
			y: 25,
			radius: {
				x: 0, 
				y: 0
			}
		},								
		velocity: {
			x: 0,
			y: 0,
		}}); 
	
	that.shape = that.setUpShape(UTILITIES.getRandomColor());
	that.boundaries = that.setUpBoundaries();
	GEOMETRY.makeCanvasObjectDrawable(that, {'canvasContext': context});
	that.draw();
	return that;	
};



////---------------------- Bezier-curve utilities ------------------------
////----------------------------------------------------------------------


////------------- Make a Bezier Object from standard parameters ----------
GEOMETRY.objectifyBezierCurve = function (startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY) {
	var curve = {
		'start': {
			'x': startX, 
			'y': startY, 
		}, 
		'cp1': {
			'x': cp1X, 
			'y': cp1Y
		}, 
		'cp2': {
			'x': cp2X, 
			'y': cp2Y		
		}, 
		'end': {
			'x': endX, 
			'y': endY		
		} 
	}; 
	return curve; 
}; 



////--------- Draw a Bezier curve from Bezier Object information ---------
GEOMETRY.drawBezierCurveObject = function (bezierObject) {
	context.beginPath(); 
	// Lift and move the pen
	context.moveTo(bezierObject['start']['x'], bezierObject['start']['y']); 
	
	// Draw the curve 
	context.bezierCurveTo(bezierObject['cp1']['x'], bezierObject['cp1']['y'], 
						bezierObject['cp2']['x'], bezierObject['cp2']['y'], 
						bezierObject['end']['x'], bezierObject['end']['y']); 
	context.stroke(); 
	// return nothing...It's all side-effects.
}; 




////------------ Find the point at t percent of a cubic Bezier -----------
// From Wikipedia: 
//	cubicBezier(proportion) = (1 - proportion)^3 * startPt + 
		// 3 * (1 - proportion)^2 * proportion * cp1 + 
		// 3 * (1 - proportion) * proportion^2 * cp2 + 
		// proportion^3 * endPt
// @param -proportion- : a number in [0, 1]
// @param -bezierObject-: an object containing at least -start-, 
//		-cp1-, -cp2- and -end- 
GEOMETRY.getPointInCubicBezier = function (proportion, bezierObject) {	
	proportion = proportion || 0.0; 
	bezierObject = bezierObject || {
		'start': {
			'x': 0, 
			'y': 0, 
		}, 
		'cp1': {
			'x': 0, 
			'y': 0
		}, 
		'cp2': {
			'x': 0, 
			'y': 0		
		}, 
		'end': {
			'x': 0, 
			'y': 0		
		} 
	}; 
	
	var start = bezierObject['start'], 
		cp1 = bezierObject['cp1'], 
		cp2 = bezierObject['cp2'], 
		end = bezierObject['end'];
						
	var scaledStart = {
		'x': Math.pow(1 - proportion, 3) * start['x'],
		'y': Math.pow(1 - proportion, 3) * start['y']
	};
	
	var scaledCp1 = {
		'x': 3 * Math.pow(1 - proportion, 2) * proportion * cp1['x'],
		'y': 3 * Math.pow(1 - proportion, 2) * proportion * cp1['y']
	};	
	
	var scaledCp2 = {
		'x': 3 * (1 - proportion) * Math.pow(proportion, 2) * cp2['x'],
		'y': 3 * (1 - proportion) * Math.pow(proportion, 2) * cp2['y']
	};	

	var scaledEnd = {
		'x': Math.pow(proportion, 3) * end['x'],
		'y': Math.pow(proportion, 3) * end['y']
	};
	
	var scaledPoint = {
		'x': scaledStart['x'] + scaledCp1['x'] + scaledCp2['x'] + scaledEnd['x'], 
		'y': scaledStart['y'] + scaledCp1['y'] + scaledCp2['y'] + scaledEnd['y'], 
	};

	context.beginPath();
	
	// Check path...
	// context.fillRect(scaledPoint['x'], scaledPoint['y'], 10, 10);	
	
	return scaledPoint;  
};


////---------------- Get the length of a cubic Bezier -------------------
// Divide a curve into piecewise-linear components, measure each
// one (i.e. get the 2-norm), and return the sum. 
// @param -bezierObject-: an object containing at least -start-, 
//		-cp1-, -cp2- and -end-
// @param -integer- : an integer indicating the number of piecewise-components
// 		to divide the curve into.  
GEOMETRY.getCubicBezierLength = function (bezierObject, steps) { 
	
	var start = bezierObject['start'], 
		cp1 = bezierObject['cp1'], 
		cp2 = bezierObject['cp2'], 
		end = bezierObject['end'], 
		curveProportion, 
		currentPoint, 
		previousPoint = {
			'x': 0, 
			'y': 0
		}, 
		curveLength = 0.0;
		 
	steps = steps || 10; 
		
	for (var i = 1; i <= steps; i += 1) {
		curveProportion = i / steps; 
		currentPoint = UTILITIES.getPointInCubicBezier(curveProportion, bezierObject); 
		//console.log('currentPointX: ' + currentPoint['x'] + ' currentPointY: ' + currentPoint['y']); 
		if (i > 0) {
			var diffPoint = {
				'x': currentPoint['x'] - previousPoint['x'],
				'y': currentPoint['y'] - previousPoint['y']
			};
			curveLength += Math.sqrt(Math.pow(diffPoint['x'], 2) +  
								Math.pow(diffPoint['y'], 2)); 
		}
		previousPoint = currentPoint;   		
	}; 
	return curveLength; 
}; 
