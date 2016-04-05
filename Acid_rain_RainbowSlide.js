
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, .1)';
var DepColor = 'rgba(100, 100, 0, .1)';
var max = 500; //500
var drops = [];
var txt = document.getElementById("content");
var OutsideCount = 0;
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function count(){
	if(OutsideCount >= w){
		OutsideCount = 0;
		return OutsideCount
	}

	OutsideCount +=1;
	return OutsideCount; 
}

function O() {}

O.prototype = {
	init: function() {

		this.x = random(0, w);
		this.y = 0;
		this.rand = random (500,200);
		//this.color = 'hsl(' + this.rand +', 100%, 50%)'; //Drop Color
		this.w = 2;
		this.h = 1;
		this.vw = 3;
		this.vh = 1;

		this.xy = 0;
		this.vy = random(1,3);
		this.size = this.vy;

		this.hit = random(h * .6, h * .9); //h=752
		this.scarler = (this.hit / h) * 15;


		this.a = 1;
		this.va = .96;// larger number measn smaller ripple
		// this.bet = (this.hit/300) * 255
		this.count = count();
		this.bet = ((this.count-this.x) /w) * 360
		
		this.color = 'hsl(' + this.bet +', 100%, 50%)'; //Drop Color
	},
	draw: function() {
		if (this.y > this.hit) {
			ctx.beginPath();
			ctx.moveTo(this.x, this.y - this.h / this.scarler);

			ctx.bezierCurveTo(
				this.x + this.w / this.scarler, this.y - this.h / this.scarler,
				this.x + this.w / this.scarler, this.y + this.h / this.scarler,
				this.x, this.y + this.h / this.scarler);

			ctx.bezierCurveTo(
				this.x - this.w / this.scarler, this.y + this.h / this.scarler,
				this.x - this.w / this.scarler, this.y - this.h / this.scarler,
				this.x, this.y - this.h / this.scarler);

			ctx.strokeStyle = 'hsla('+ this.bet +', 100%, 50%, '+this.a+')'; // The ripple color 
			ctx.stroke();
			ctx.closePath();
			
		} else {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.size, this.size * 5);

			// ctx.fillStyle = this.color;
			// ctx.beginPath();
			// //ctx.fillRect(this.x, this.y, this.size, this.size * 5);
			// ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
			// ctx.fill();
			// ctx.closePath();
		}
		this.update();
	},
	update: function() {
		if(this.y < this.hit){
			this.y += this.vy;
			this.x += this.xy;

			// if (this.x >150 && this.x<300) {
			// 	if(this.x <= this.y){
			// 		this.vy = -this.vy*.5;
			// 		this.xy += random(1,1.3); //.6	

			// 	}
			// }

			// if(this.xy > 0){
			// 	this.xy -=random(0,0.005);
			// } 
			// if (this.vy < this.size/1.8) {
			// 	this.vy += random(.06,.08);
			// }

		} else {
			if(this.a > .03){
				this.w += this.vw;
				this.h += this.vh;
				if(this.w > 100){
					this.a *= this.va;
					this.vw *= .98;
					this.vh *= .98;
				}
			} else {
				this.init();
			}
		}
		
	}
}

function resize(){
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
}

function setup(){
	for(var i = 0; i < max; i++){
		(function(j){
			setTimeout(function(){
				var o = new O();
				o.init();
				drops.push(o);
			}, j * 5) // This term * j; Lower term means more drops on screen. 
		}(i));
	}
}


function anim() {

	// ctx.font = "30px Arial";
	// ctx.fillStyle = "red";
	// ctx.fillText("width:" + ctx.measureText(txt).width, 625, 70);

	ctx.fillStyle = clearColor;
	ctx.fillRect(0,0,w,h);

	// ctx.beginPath();
	// ctx.moveTo(150,150);
	// ctx.lineTo(300,300);
	// ctx.strokeStyle = "rgb(255,255,255)";
	// ctx.stroke();
	// ctx.closePath();



	for(var i in drops){
		drops[i].draw();
	}
	requestAnimationFrame(anim);
}


window.addEventListener("resize", resize);

setup();
anim();