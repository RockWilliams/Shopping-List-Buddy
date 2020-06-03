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

let bodyData = {name:'', products: []};

$("#add-list").on('click', function(){
    $('#list').append($('<li></li>').text($('option:selected').text()));
    let objectId = $('option:selected').val();
    console.log(objectId);
    bodyData.products.push(objectId);
    console.log(bodyData);
    $('option:selected').remove();
});

//!!!!!!!!!!
// ask instructors about 
// !!!!!!!!!!!


// $('add-list').on('click', function(){
//     let objectId = this.val();
//     console.log(objectId);
//     bodyData.products.push();
//     console.log(bodydata);       
// });
const pageId = $('#store-id').text();
console.log(pageId);

$('#final').on('click', function(){
    bodyData.name = $('#name').val();
    $.ajax({method: "POST", url: `/store/${pageId}`, contentType: "application/json", data: JSON.stringify(bodyData), success: function(res){
        window.location.href = `/store/${pageId}`;
    }});
});


