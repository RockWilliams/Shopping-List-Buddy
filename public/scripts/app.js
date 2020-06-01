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

$("option").on('click', function(){
    $('#list').append($('<li></li>').text(this.text));
    console.log($('#list').length);
});

for(let i = 0; i < $('#list').length; i++){

}