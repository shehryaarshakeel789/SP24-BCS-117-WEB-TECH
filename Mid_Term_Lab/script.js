var i = 0;
var j =0;
window.onload = function() {
    var hamburger = document.getElementsByClassName("hamburger")[0];
    $(".modal-close").on("click", closeModal);
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
    $.get("https://fakestoreapi.com/products?limit=4", function (products) {
        var container = $("#product-container").empty();
        products.forEach(function (p) {
            container.append(
                '<div class="product-card">' +
                    '<img src="' + p.image + '">' +
                    '<p class="product-title">' + p.title + '</p>' +
                    '<p>$' + p.price.toFixed(2) + '</p>' +
                    '<button class="quick-view">Quick View</button>' +
                '</div>'
            );
            $(".quick-view").on("click", function() {
                openModal(p);
            });
        });
    });
}
 
function openModal(p) {
    $("#modal-img").attr("src", p.image);
    $("#modal-title").text(p.title);
    $("#modal-desc").text(p.description);
    $("#modal-rating").text("Rating: " + p.rating.rate + "/5 (" + p.rating.count + " reviews)");
    $("#modal-overlay").show();
}
 
function closeModal() {
    $("#modal-overlay").hide();
}
 