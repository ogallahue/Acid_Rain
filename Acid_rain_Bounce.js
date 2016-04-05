
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, .1)';
var max = 30; //30
var drops = [];
var txt = document.getElementById("content");
var OutsideCount = 0;
var lines = [];
var Bounce_dictionary={}; 


function random(min, max) {
    return Math.random() * (max - min) + min;
}

function lineBoundary(sx,sy,ex,ey){
	var slope = ((sy-ey)/(sx-ex));
	var xcord = sx;
	var ycord = sy;

	if(slope < 0){
		while(ycord > ey){
			xcord -= slope;
			ycord += slope;

			Bounce_dictionary[xcord] = {ycord,slope};
		}
	}else{

		while(xcord < ex){
			xcord += slope;
			ycord += slope;

			Bounce_dictionary[xcord] = {ycord,slope};
			// lines.push( {xcord,ycord,slope} )
		}
	}
}
function circleBoundary(cX,cY,r){
	
	for (var a = Math.PI*.5; a <= Math.PI*1.5; a+=.001) {
		var slope = -(Math.cos(a)/Math.sin(a))
		xcord = Math.floor(cX + r * Math.cos(a))
		ycord = Math.floor(cY + r * Math.sin(a))
		Bounce_dictionary[xcord] = {ycord,slope};
	}

	for (var a = Math.PI*2.5; a >= Math.PI*1.5; a-=.001) {
		var slope = -(Math.cos(a)/Math.sin(a))
		xcord = Math.floor(cX + r * Math.cos(a))
		ycord = Math.floor(cY + r * Math.sin(a))
		Bounce_dictionary[xcord] = {ycord,slope};
	}
}

function drawBumper(x_start,y_start,x_end,y_end){
	ctx.beginPath();
	ctx.moveTo(x_start,y_start);
	ctx.lineTo(x_end,y_end);
	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.stroke();
	ctx.closePath();
	lineBoundary(x_start,y_start,x_end,y_end);
}
function drawCircle(cX,cY,r){
	ctx.beginPath();
	ctx.arc(cX,cY,r,0,2*Math.PI);
	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.stroke();
	ctx.closePath();
	circleBoundary(cX,cY,r);
}


function O() {}

O.prototype = {
	init: function() {

		// this.x = random(0, w);
		this.x = random(300,550)
		this.y = 0;
		this.rand_Color = random (500,200);

		this.w = 2;
		this.h = 1;
		this.vw = 3;
		this.vh = 1;

		this.hit = random(h * .6, h * .9);
		this.vy = this.hit / 200;
		this.vx = 0;
		this.size = this.hit/200;

		
		this.bounce_Cord = Bounce_dictionary[Math.floor(this.x)];
		if(!this.bounce_Cord) this.bounce_Cord = Bounce_dictionary[Math.floor(this.x)];
		if(this.bounce_Cord) this.bounce_direction = this.bounce_Cord.slope;


		this.scarler = (h-this.hit) / h * 15;
		this.a = 1;
		this.va = .96;// larger number measn smaller ripple
		// this.bet = (this.hit/300) * 255

		this.color = 'hsl(' + this.rand_Color +', 100%, 50%)'; //Drop Color
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

			ctx.strokeStyle = 'hsla('+ this.rand_Color +', 100%, 50%, '+this.a+')'; // The ripple color 
			ctx.stroke();
			ctx.closePath();
			
		} else {
			
			ctx.fillStyle = this.color;
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
			
			if(this.bounce_Cord){ 
				this.bounce_direction = this.bounce_Cord.slope;
				if(this.bounce_Cord.ycord-2 < this.y && this.bounce_Cord.ycord+2 > this.y  ){
			   		if (this.bounce_direction <= 0){
			   			this.vx = -1;
			   			this.vy = -this.vy*.9;
			   			// console.log("bounce Left");
			   		}
			   		if (this.bounce_direction >= 0){
			   			this.vx = 1;
			   			this.vy = -this.vy*.9;
			   			// console.log("bounce Right");
			   		}
				}
			}

			if(this.vy<this.size/1.5) this.vy += .05;
			if(this.vx>0) this.vx -=.005; //>0.01
			if(this.vx<0) this.vx +=.005;

		this.bounce_Cord = Bounce_dictionary[Math.floor(this.x)];
		this.y += this.vy;
		this.x += this.vx;
		this.vy+=.01;


		} else {
			if(this.a > .03){
				this.w += this.vw;
				this.h += this.vh;
				if(this.w > 100){
					this.a *= this.va;
					this.vw *= .98;
					this.vh *= .98;
				}
			} 
			else {
				
				this.init();
			}
		}
		
	}
}

function resize(){
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
	Bounce_dictionary = {};

}

function setup(){
	for(var i = 0; i < max; i++){
		(function(j){
			setTimeout(function(){
				var o = new O();
				o.init();
				drops.push(o);
			}, j * 100) // This term * j; Lower term means more drops on screen. 
		}(i));
	}
}


function anim() {

	ctx.beginPath();
	ctx.fillStyle = clearColor;
	ctx.fillRect(0,0,w,h);
	ctx.closePath();

	// drawBumper(150,150,200,200);
	// drawBumper(w-200,200,w-150,150);
	// drawBumper(w-300,300,w-215,215);

	// drawCircle(w/2,h/2,50);
	ctx.beginPath();
	ctx.font = "50px Arial";
	ctx.fillStyle = "#000099";
	var name = "Owen"
	ctx.fillText(name, w/3, h/5);
	var gap = ctx.measureText(name).width;
	ctx.fillText(" Gallahue", w/3+gap, h/5)
	ctx.closePath();

	drawCircle(w/3 + gap*1.51,h/5-14,14); // a1
	drawCircle(w/3 + gap*1.9,h/5-14,14); // a2
	drawCircle(w/3 + gap*2.54,h/5-14,14); // e2

	drawCircle(w/3 + 90,h/5-14,15); // e1
	drawCircle(w/3+20,h/5-20,20); // O


	
// 885

	// ctx.beginPath();
	// ctx.strokeStyle = "rgb(255,0,255)";
	// // ctx.moveTo(w-50,150);
	// for (var i=0;i<lines.length;i++) {
	// 	var point = lines[i];
	// 	var xcord = point.xcord;
	// 	var ycord = point.ycord;
	// 	ctx.lineTo(xcord,ycord);
	// 	ctx.stroke();
	// }
	// ctx.closePath();

	for(var i in drops){
		drops[i].draw();
	}
	requestAnimationFrame(anim);
}


window.addEventListener("resize", resize);

anim();
setup();

console.log(Bounce_dictionary);







