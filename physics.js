// Global abatement container
var PHYSICS = {}; 


PHYSICS.makeSubjectToGravity = function (that, secrets) { 
	that = that || {};
	secrets = secrets || {}; 
	var gravityConstant = secrets.gravityConstant || 9.81;
	
	var updateVelocityWithGravity = function () {
		
		// Ensure that the object's velocity can be changed. If not, 
		// make it so. (Although perhaps it's better to throw an 
		// exception.)
		//if (!(this.hasOwnProperty('setVelocity'))) {
			//GEOMETRY.makeMalleable(this); 
		//}
		if (this.hasOwnProperty('setVelocity')) {
			var y_velocity = this.getVelocity()['y'] || 0;
			this.setVelocity('y', velocity + gravityConstant);
		}
		return this;
	};
	
	that.updateVelocityWithGravity = updateVelocityWithGravity;
	that.gravityConstant = gravityConstant;
	return that;
};


PHYSICS.makeCollideable = function (that, secrets) {
	var that = that || GEOMETRY.createCanvasObject(null, secrets);
	var secrets =  secrets || {};
	
	var boundaries = that.setUpBoundaries().boundaries;
	
	
	var checkCollision = function (collisionTarget) {
		var intersect_x = (boundaries['right'] >= 
								collisionTarget.boundaries['left']) && 
							(boundaries['left'] <= 
								collisionTarget.boundaries['right']);
		var intersect_y = (boundaries['bottom'] >= 
								collisionTarget.boundaries['top']) && 
							(boundaries['top'] <= 
								collisionTarget.boundaries['bottom']);

		if (intersect_x && intersect_y) {
			this.collisionPosition = {
					'x': this.getPosition()['x'],
					'y': this.getPosition()['y']
			};
			return this;
		}


//	line intersection
//		normalize to corner of rectangle
//		line formed by: f(t) = t * <x0, y0> + (1 - t) * <x1, y1>
//		(vertical) line formed by: f'(t) = t * <0, 0> + (1 - t) * <1, 0> 
//		(horizontal) line formed by: f''(t) = t * <0, 0> + (1 - t) * <0, 1> 
//		

		else {
			return false;
		}
	}; 
	
	// We pass an array of coordinates indicating the axis along which 
	// the collision object was approached. 
	var bounce = function (coords) {
		if (this.hasOwnProperty('setVelocity')) {
			if (!(jQuery.isArray(coords))) { 
				coords = [coords];
			}
			var i = coords.length; 
			while (i--) {
				var velocity = this.getVelocity().coords[i] || 0;
				this.setVelocity(coords[i], -velocity); 
			}
		}
		return this;
	};
	
	
	var collide = function (collisionTarget, collideEffect, collideEffectArgs) {
		if (checkCollision(collisionTarget)) {
			collideEffect(collideEffectArgs);
		}
		return this;
	};
	
	
	that.boundaries = boundaries;
	
	that.bounce = bounce;
	that.checkCollision = checkCollision; 
	that.collide = collide; 
		
	return that;
};


PHYSICS.makeMoveable = function (that, secrets) {
	var that = that || GEOMETRY.createCanvasObject(null, secrets);
	var secrets =  secrets || {};
	
	var updatePosition = function () {
		this.position = {
			'new': {
				'x': that.getPosition()['x'] + that.getVelocity(),
				'y': that.getPosition()['y'] + that.getVelocity()
			}, 
			'old': {
				'x': that.getPosition()['x'],
				'y': that.getPosition()['y']
			}
		}; 
		return this;	
	};
	
	var move = function () {
		positions = updatePosition();
		// redraw elements
	};
	
	// Pass an object literal specifying the conditions to check for and 
	// the callbacks to enact if they are triggered.
	var moveUntilStop = function (conditionObj) {
		var that = this;
		var moveBall = function(){
			move();		
			jQuery.each(conditionObj, function (condition, callback) {
				if (condition){
					return callback; 
				}
			});
			setTimeout(moveBall, 100); 
		};
		setTimeout(moveBall, 100);
		return this;
	}; 
	
	
	var triggerEffectAndContinueMoving = function (effect, args, conditionObj) {
		effect.apply(this, args); 
		moveUntilStop(conditionObj);
		return this;
	}; 
	
	that.move = move;
	that.moveUntilStop = moveUntilStop;
	that.triggerEffectAndContinueMoving = triggerEffectAndContinueMoving;
	return that; 
};			



PHYSICS.makePhysicalObject = function (that, secrets) { 
	that = that || GEOMETRY.createCanvasObject(null, secrets);
	GEOMETRY.makeMalleable(that);
	PHYSICS.makeSubjectToGravity(that);
	PHYSICS.makeCollideable(that);
	PHYSICS.makeMoveable(that);
	return that;
};


