console.log("hello there");
$('option').on('click', function(){
    console.log("help")
});



//source for the following code http://jsfiddle.net/UziTech/cjjg68dr/114/
$("option").mousedown(function(element){
    element.preventDefault();

    let select = this;
    let scroll = select.scrollTop;

    element.target.selected = !element.target.selected;

    setTimeout(function(){select.scrollTop = scroll;}, 0);

    $(select).focus();
}).mousemove(function(element){element.preventDefault()});

let bodyData = {name:'', products: [], quantity: []};

let height = 100;

let $heightCheck = $("main").height();
console.log($heightCheck);

$("#add-list").on('click', function(){
    if($("option:selected").text() !== ""){
        console.log($heightCheck);
        if(height < $("main").height()){
            height = height + 43;
            if(height > $("main").height()){
                height = $("main").height() - 20;
            }
            $("#list-div").height(`${height}px`);
            $('#list').append($('<li class="list-product"></li>')
            .append($('<span></span>')
            .text($('option:selected').text()))
            .append($('<span class="num"></span>')
            .text("x" + $('#quantity').val())));
            $("#list").append($('<hr class="hr" style="width:100%">'));
            let quantityNum = $('#quantity').val();
            let objectId = $('option:selected').val();
            console.log(objectId);
            bodyData.quantity.push(quantityNum);
            bodyData.products.push(objectId);
            console.log(bodyData);
            $('#quantity').val('');
            $('option:selected').remove();
        };
    }
});

console.log($("list-div").attr("height"));

const pageId = $('#store-id').text();
console.log(pageId);

$('#final').on('click', function(){
    bodyData.name = $('#name').val();
    $.ajax({method: "POST", url: `/store/${pageId}`, contentType: "application/json", data: JSON.stringify(bodyData), success: function(res){
        window.location.href = `/store/${pageId}`;
    }});
});


$('.products-list').mouseover(function(){
    console.log('working');
    console.log($(this).children('.product-details'));
    $(this).children('.product-details').css('display', 'inline');
}).mouseout(function(){
    $(this).children('.product-details').css('display', 'none');
});