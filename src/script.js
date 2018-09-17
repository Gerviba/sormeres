'use strict';

var minZ = 10000;
var trigger = 9.86;
var calibrated = false;
var calibrating = false;
var gravity = 0;
var tempTrigger = 0;
var localminZ = 10000;
var showingDebug = false;

function onInit() {
	if (window.DeviceMotionEvent != undefined) {
		window.ondevicemotion = function(e) {
			
			let xComp = e.accelerationIncludingGravity.x;
			let yComp = e.accelerationIncludingGravity.y;
			let zComp = e.accelerationIncludingGravity.z;
			
			if (Math.abs(zComp) < minZ)
				minZ = Math.abs(zComp);
			
			gravity = zComp;
			
			printToScreen(xComp, yComp, zComp);
			
			if (zComp < trigger && started.waitingFor && !started.isIt)
				startTimer();
			else if (zComp < trigger && started.isIt)
				stopTimer();
			
			if (calibrating && zComp < localminZ)
				localminZ = zComp;
		}
	}
	document.getElementById("trigger").value = trigger;
	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
             .register('./sw.js')
             .then(function() { console.log('Service Worker Registered'); });
	}
}

function printToScreen(x, y, z) {
	document.getElementById("debug").innerHTML = "X: " + x + "<br/>" + 
		"Y: " + y + "<br/>" + 
		"Z: " + z + "<br/>" +
		"minZ: " + minZ + "<br/>" +
		"gravity: " + gravity + "<br/>" +
		"localmin: " + localminZ + "<br/>" +
		"trigger: " + trigger;
}

function showDebug() {
	showingDebug = !showingDebug;
	document.getElementById("debug-menu").style.display = showingDebug ? 'block' : 'none';
}

function calibrate() {
	calibrated = true;
	if (calibrating)
		return;
	calibrating = true;
	localminZ = 10000;
	document.getElementById("calibrate").innerHTML = 'Kalibrálás folyamatban';
	setTimeout(finalizeLocalMin, 2000);
}

function finalizeLocalMin() {
	calibrating = false;
	trigger = localminZ - 0.05;
	
	document.getElementById("trigger").value = trigger;
	document.getElementById("calibrate").innerHTML = "Kész";
	setTimeout(() => {
		document.getElementById("calibrate").innerHTML = "Kalibrálás";
	}, 1000);
}

function setTrigger() {
	trigger = Number(document.getElementById("trigger").value);
}

/* APP */

var started = {
	isIt: false,
	at: 0,
	waitingFor: false
};

function performAction() {
	if (!started.waitingFor)
		startWaiting();
	else
		stopTimer();
}

function startWaiting() {
	document.getElementById("action").innerHTML = "Várakozás";
	setTimeout(function() {
		started.waitingFor = true;
	}, 1000);
}

function startTimer() {
	started.at = Date.now();
	started.isIt = true;
	drawTimer();
	document.getElementById("action").innerHTML = "Elindítva";
}

function stopTimer() {
	if (Date.now() - started.at < 500)
		return;
	started.isIt = false;
	started.waitingFor = false;
	document.getElementById("action").innerHTML = "Indítás";
}

function drawTimer() {
	let time = Date.now() - started.at;
	let min = Math.floor(time / 60000);
	let sec = Math.floor(time / 1000) % 60;
	let ms = time % 1000;
	drowActual(min, sec, ms);
	if (started.isIt) 
		window.requestAnimationFrame(drawTimer);
}

function drowActual(min, sec, ms) {
	document.getElementById("min").innerHTML = min;
	document.getElementById("sec").innerHTML = sec < 10 ? ("0" + sec) : sec;
	document.getElementById("ms").innerHTML = ms < 100 ? ("0" + ms) : (ms < 10 ? ("00" + ms) : ms);
}