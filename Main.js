const parallax = document.getElementById("parallax");

window.addEventListener("scroll", function (){
	let offset = window.pageYOffset;
	console.log(parallax.style);
	parallax.style.backgroundPositionY = offset * .5 + "px" ;
})
