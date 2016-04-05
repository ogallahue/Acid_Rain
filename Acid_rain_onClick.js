
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, .1)';
var DepColor = 'rgba(100, 100, 0, .1)';
var max = 200; //30
var drops = [];
var txt = document.getElementById("content");
var OutsideCount = 0;
var lines = [];
var Bounce_dictionary={}; //x["Key"] = "Value";

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function contains(list, needle){
   for (i in list) {
       if (list[i] == needle) return true;
   }
   return false;
}



function lineBoundary(sx,sy,ex,ey){
	var Y_slope = (sy-ey);
	var X_slope = (sx-ex);
	var slope = ((sy-ey)/(sx-ex));
	var xcord = sx;
	var ycord = sy;

	if(slope == -1){

		while(ycord > ey){
			xcord -= slope;
			ycord += slope;
			Bounce_dictionary[xcord] = ycord;
			lines.push( {xcord,ycord,slope} );
		}
		
	}else{

		while(xcord < ex){
			xcord += slope;
			ycord += slope;
			Bounce_dictionary[xcord] = ycord;
			lines.push( {xcord,ycord,slope} )
		}
}
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

		this.hit = random(h * .6, h * .9);
		this.vy = this.hit / 200;
		this.vx = 0;
		this.size = this.hit/200;

		this.bounce_Cord = Bounce_dictionary[Math.floor(200)];

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

			for (var i=0;i<lines.length;i++) {
			   var point = lines[i];
			   var xcord = point.xcord;
			   var ycord = point.ycord;
			   var slope = point.slope;

			   if(Math.floor(this.x) == xcord && (Math.floor(this.y)+1 == ycord || Math.floor(this.y)+2 == ycord)){
			   		if (slope == -1){
			   			this.vx = -1;
			   			this.vy = -this.vy*.9;
			   		}
			   		if (slope == 1){
			   			this.vx = 1;
			   			this.vy = -this.vy*.9;
			   		}
					

			   }

			}

			if (this.vy < this.size/1.8) {
				this.vy += .04;
			}


			if(this.vx > 0){
				this.vx -=.003;
			} 
			if(this.vx<0){
				this.vx +=.003;
			}

			
			
		this.y += this.vy;
		this.x += this.vx


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

	// ctx.font = "30px Arial";
	// ctx.fillStyle = "red";
	// ctx.fillText("width:" + ctx.measureText(txt).width, 625, 70);

	ctx.beginPath();
	ctx.fillStyle = clearColor;
	ctx.fillRect(0,0,w,h);
	ctx.closePath();

	ctx.beginPath();
	// ctx.moveTo(150,150);
	// ctx.lineTo(300,300);
	ctx.moveTo(150,150);
	ctx.lineTo(200,200);
	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	// ctx.moveTo(150,150);
	// ctx.lineTo(300,300);
	ctx.moveTo(w-150,150);
	ctx.lineTo(w-300,300);
	ctx.strokeStyle = "rgb(255,255,255)";
	ctx.stroke();
	ctx.closePath();

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



	// ctx.fillStyle = DepColor;
	// ctx.fillRect(625,70,170,70);



	for(var i in drops){
		drops[i].draw();
	}
	requestAnimationFrame(anim);
}


window.addEventListener("resize", resize);

document.addEventListener("click", function(){
	var o = new O();
	o.init();
	drops.push(o);
	
});

anim();
setup();
lineBoundary(w-300,300,w-150,150);
lineBoundary(145,145,200,200);

// for (var i=0;i<lines.length;i++) {
// 	var point = lines[i];
// 	var xcord = point.xcord;
// 	var ycord = point.ycord;
// 	var slope = point.slope;
// 	console.log(xcord,ycord,slope);
// }
console.log(Bounce_dictionary[200]);



