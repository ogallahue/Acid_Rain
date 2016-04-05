
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, .1)';
var DepColor = 'rgba(100, 100, 0, .1)';
var max = 500; //30
var drops = [];
var txt = document.getElementById("content");
var OutsideCount = 0;

function random(min, max) {
    return Math.random() * (max - min) + min;
}


function O() {}

O.prototype = {
	init: function() {

		this.x = random(0, w);
		this.y = 0;
		this.rand = random (500,200);

		this.w = 2;
		this.h = 1;
		this.vw = 3;
		this.vh = 1;

		// this.hit = random(h * .6, h * .9);
		// this.vy = this.hit / 360;
		// this.size = this.vy*1.8;

		
		this.hit = random(h * .6, h * .9);
		this.vy = this.hit / 175;
		this.size = random(this.vy*.9,this.vy);
		

		this.scarler = (h-this.hit) / h * 15;
		this.a = 1;
		this.va = .96;// larger number measn smaller ripple
		// this.bet = (this.hit/300) * 255

		this.color = 'hsl(' + this.rand +', 100%, 50%)'; //Drop Color
	},
	draw: function() {
		if (this.y >= this.hit) {
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

			ctx.strokeStyle = 'hsla('+ this.rand +', 100%, 50%, '+this.a+')'; // The ripple color 
			ctx.stroke();
			ctx.closePath();
			
		} else {
			ctx.fillStyle = this.color;
			ctx.strokeStyle = this.color;
			ctx.beginPath();
			//ctx.fillRect(this.x, this.y, this.size, this.size * 5);
			ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
		this.update();
	},
	update: function() {
		if(this.y < this.hit){
			this.y += this.vy;
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
			}, j * 200) // This term * j; Lower term means more drops on screen. 
		}(i));
	}
}


function anim() {

	// ctx.font = "30px Arial";
	// ctx.fillStyle = "red";
	// ctx.fillText("width:" + ctx.measureText(txt).width, 625, 70);

	ctx.beginPath();
	ctx.fillStyle = clearColor;
	ctx.fillRect(0,0,w,h);
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(150,150);
	ctx.lineTo(300,300);
	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.stroke();
	ctx.closePath();



	// ctx.fillStyle = DepColor;
	// ctx.fillRect(625,70,170,70);



	for(var i in drops){
		drops[i].draw();
	}
	requestAnimationFrame(anim);
}


window.addEventListener("resize", resize);

setup();
anim();