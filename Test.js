var Bounce_dictionary={}; 


var t = 5;
var slope = 3;
var w = 7;
// Bounce_dictionary[4] = {t,slope};
var r = Bounce_dictionary[4] = {w,t};
if(Bounce_dictionary[4]){
	console.log("HERE");
}
Bounce_dictionary[4] = [{t,slope}];
Bounce_dictionary[7] = [{t,slope}];
Bounce_dictionary[3] = [{t,slope}];

slope = 0.01;
var crap = {t,slope};
Bounce_dictionary[4].push(crap);

console.log(Bounce_dictionary[4][1].slope);
console.log("-------------------");

slope = 0.03;
if(Bounce_dictionary[4]){
	Bounce_dictionary[4].push({t,slope});
}

var count = 0;
var i;

for (i in Bounce_dictionary) {
	console.log(Bounce_dictionary[i]);
    for (y in Bounce_dictionary[i]) {
        console.log(Bounce_dictionary[i][y])
    }
}
console.log("-------------------");

var bounce_Cord = Bounce_dictionary[4];
for (i in bounce_Cord){
	console.log(bounce_Cord[i].slope)

}
