function highlightActive(i){
    var lis =$('.navbar-right li');
    lis.each(function(index) {
        if (index === lis.length -1 - i){
            $(this).addClass('active');
        }else
        $(this).removeClass('active');
    });
}
console.log('whas inside nav.js!')
