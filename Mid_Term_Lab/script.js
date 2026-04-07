var i = 0;
window.onload = function() {
    var hamburger = document.getElementsByClassName("hamburger")[0];
    hamburger.addEventListener("click", function() {
        i++;
        if(i%2 == 0 ){
            var menu_list = document.getElementsByClassName("menu-ul")[0];
            menu_list.classList.add("show");
        }
        else{
            var menu_list = document.getElementsByClassName("menu-ul")[0];
            menu_list.classList.remove("show");
        }
        i = i%2;
        
    });
}