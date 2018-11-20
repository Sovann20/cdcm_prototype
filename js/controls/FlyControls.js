/**
 * @author James Baicoianu / http://www.baicoianu.com/
 * ----
 * Control updates by Jacob Perin
 */

//This value is subject to change
var _fuel = 10002;

THREE.FlyControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	// API

	this.movementSpeed = 1.0;
	this.rollSpeed = 0.005;

	this.dragToLook = false;
	this.autoForward = false;

	// disable default target object behavior

	// internals

	this.tmpQuaternion = new THREE.Quaternion();

	this.mouseStatus = 0;

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );


	this.cntrlState = document.getElementById('control-info-state');
	this.cntrlBtn = document.getElementById('contol-info-button');
    
    // Shows the status of the fuel.
    this.fuelState = document.getElementById('fuel-info-state');

	// Pitch, Yaw active
	this.qState = 0;

	// Roll active
	this.eState = 0;

	this.keydown = function ( event ) {

		if ( event.altKey ) {

			return;

		}

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

			case 87: /*W*/ 
				if (this.qState) {
					this.moveState.pitchUp = 1;
					this.cntrlBtn.innerHTML = '<b>W</b>: Pitch up';
				} else if (this.eState) {
					// Nothing
				} else {
					this.moveState.forward = 1;
					this.cntrlBtn.innerHTML = '<b>W</b>: Move forward';
				}
				break;
			case 83: /*S*/
				if (this.qState) {
					this.moveState.pitchDown = 1;
					this.cntrlBtn.innerHTML = '<b>S</b>: Pitch down';
				} else if (this.eState) {
					// Nothing
				} else {
					this.moveState.back = 1;
					this.cntrlBtn.innerHTML = '<b>S</b>: Move backward';
				}
				break;

			case 65: /*A*/
				if (this.qState) {
					this.moveState.yawLeft = 1;
					this.cntrlBtn.innerHTML = '<b>A</b>: Yaw left';
				} else if (this.eState) {
					this.moveState.rollLeft = 1;
					this.cntrlBtn.innerHTML = '<b>A</b>: Roll left';
				} else {
					this.moveState.left = 1;
					this.cntrlBtn.innerHTML = '<b>A</b>: Move left';
				}
				break;
			case 68: /*D*/ 
				if (this.qState) {
					this.moveState.yawRight = 1;
					this.cntrlBtn.innerHTML = '<b>D</b>: Yaw right';
				} else if (this.eState) {
					this.moveState.rollRight = 1;
					this.cntrlBtn.innerHTML = '<b>A</b>: Roll right';
				} else {
					this.moveState.right = 1;
					this.cntrlBtn.innerHTML = '<b>D</b>: Move right';
				}				
				break;

			case 81: /*Q*/
				if (this.qState) {
					this.qState = 0;
					this.cntrlState.innerHTML = 'DEFAULT (2D Plane Movement)';
				} else {
					this.eState = 0;
					this.qState = 1;
					this.cntrlState.innerHTML = 'Pitch/Yaw Mode';
				}
				break;
			case 69: /*E*/
				if (this.eState) {
					this.eState = 0;
					this.cntrlState.innerHTML = 'DEFAULT (2D Plane Movement)';
				} else {
					this.qState = 0;
					this.eState = 1;
					this.cntrlState.innerHTML = 'Roll Mode';
				}
				break;
		}

        if(_fuel > 0) {
		    this.updateMovementVector();
		    this.updateRotationVector();
        } 
       
	};

	this.keyup = function ( event ) {

		this.cntrlBtn.innerHTML = "";

		switch ( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

			case 87: /*W*/ 
				if (this.qState) {
					this.moveState.pitchUp = 0;
				} else if (this.eState) {
					// Nothing
				} else {
					this.moveState.forward = 0;
				}
				break;
			case 83: /*S*/
				if (this.qState) {
					this.moveState.pitchDown = 0;
				} else if (this.eState) {
					// Nothing
				} else {
					this.moveState.back = 0;
				}
				break;
				
			case 65: /*A*/
				if (this.qState) {
					this.moveState.yawLeft = 0;
				} else if (this.eState) {
					this.moveState.rollLeft = 0;
				} else {
					this.moveState.left = 0;
				}
				break;
			case 68: /*D*/ 
				if (this.qState) {
					this.moveState.yawRight = 0;
				} else if (this.eState) {
					this.moveState.rollRight = 0;
				} else {
					this.moveState.right = 0;
				}				
				break;
		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

	this.update = function ( delta ) {

		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;

		this.object.translateX( this.moveVector.x * moveMult );
		this.object.translateY( this.moveVector.y * moveMult );
		this.object.translateZ( this.moveVector.z * moveMult );

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.object.quaternion.multiply( this.tmpQuaternion );

		// expose the rotation vector for convenience
		this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );


	};

	this.updateMovementVector = function () {

		var forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;

		this.moveVector.x = ( - this.moveState.left + this.moveState.right );
		this.moveVector.y = ( - this.moveState.down + this.moveState.up );
		this.moveVector.z = ( - forward + this.moveState.back );

   		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );
        
        //Decreases fuel
        fuelDegradation();
	};

	this.updateRotationVector = function () {

		this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( - this.moveState.yawRight + this.moveState.yawLeft );
		this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );
        
        //Decreases fuel
        fuelDegradation();
	};

	this.getContainerDimensions = function () {

		if ( this.domElement != document ) {

			return {
				size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
			};

		} else {

			return {
				size: [ window.innerWidth, window.innerHeight ],
				offset: [ 0, 0 ]
			};

		}

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function () {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );

		window.removeEventListener( 'keydown', _keydown, false );
		window.removeEventListener( 'keyup', _keyup, false );

	};

	var _keydown = bind( this, this.keydown );
	var _keyup = bind( this, this.keyup );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );

	window.addEventListener( 'keydown', _keydown, false );
	window.addEventListener( 'keyup', _keyup, false );

	this.updateMovementVector();
	this.updateRotationVector();
};

//Decrements the fuel and updates the status
function fuelDegradation() {
    _fuel--;
    //console.log(_fuel);
    var currentPercent = Math.floor((_fuel/10000)*100);
    if(_fuel >= 7500) {
        document.getElementById('fuel-info-bar').style.color = "green";
        document.getElementById('fuel-info-state').innerHTML = "Fuel level: "+currentPercent+"%";
    }
    else if(_fuel >= 5000) { 
        //yellow - halfway
        document.getElementById('fuel-info-bar').style.color = "yellow";
        document.getElementById('fuel-info-bar').className = "fas fa-thermometer-half";
        document.getElementById('fuel-info-state').innerHTML = "Fuel level: "+currentPercent+"%";
    }
    else if(_fuel >= 1) {
        //red - critical
        document.getElementById('fuel-info-bar').style.color = "red";
        document.getElementById('fuel-info-bar').className = "fas fa-thermometer-empty";
        document.getElementById('fuel-info-state').innerHTML = "Fuel level low: "+currentPercent+"%";
    } 
    else {
        document.getElementById('fuel-info-bar').style.color = "red";
        document.getElementById('fuel-info-bar').className = "fas fa-thermometer-empty";
        document.getElementById('fuel-info-state').innerHTML = "Fuel is empty.";
    }

};



