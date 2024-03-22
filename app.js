let open = document.querySelector("#open");
let close = document.querySelector("#close");
let links = document.querySelector(".links");
let nav = document.querySelector("nav");

open.onclick = function(){
    menuBarOpen()
}
close.onclick = function(){
    menuBarClose()
}

function menuBarOpen(){
    open.style.display = "none";
    close.style.display = "block";
    links.style.display="flex";
    nav.style.height = "50vh";
}
function menuBarClose(){
    open.style.display = "block";
    close.style.display = "none";
    links.style.display="none";
    nav.style.height = "7vh";
}