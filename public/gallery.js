var win =$(window);
win.resize(function(){
    resizeImages();
});
$(document).ready(function(argument) {
    resizeImages()
});
console.log($('.image-resize').width())
function resizeImages() {
    var mWidth = $('.image-resize').width();
    $('.image-resize').height(mWidth);
    // noinspection JSAnnotator
    $('.img-container').width(mWidth-10);
    // noinspection JSAnnotator
    $('.img-container').height(mWidth-10);
    $('.image-crop').each(function (index, img) {
        var $this = $(this);
        // console.log("height: ",$this.height(),"width: ", $this.width());
        $this.on('load',function() {
            $this.width($('.image-crop')[index].naturalWidth);
            $this.height($('.image-crop')[index].naturalHeight);
            resizeOneImage($this,mWidth,index);
        });
        resizeOneImage($this,mWidth,index);  
    });
}
function resizeOneImage($this,mWidth,index){
    var flag = 0 ;
    if ($this.height() / $this.width() <= 1) {//landscape , vertical
        clearVertical($this,mWidth);
        flag =1;
        console.log("clearing vertically : "+index);
        console.log("after vertically:","width: "+$this.width());
        console.log("height: "+$this.height());
    }
    else {//horizontal height bigger than width
        flag = 2;
        clearHorizontal($this,mWidth);
    }
    setTimeout(function(){
        if ($this.height() + $this.width() < (mWidth -10)*2){
            switch(flag){
                case 1:
                    clearVertical($this,mWidth);
                    break;
                case 2:
                    clearHorizontal($this,mWidth);
                    break;
            }
        }
    },5000);
}
function clearHorizontal($this,mWidth){
    var currentHeight = $this.height() * (mWidth / $this.width());
    $this.css({
        width: '100%',
        height: 'auto',
        position: 'absolute',
        top: (-((currentHeight - mWidth) / 2)) + "px",
        right: 0
    });
}
function clearVertical($this,mWidth){
    var currentWidth = $this.width() * (mWidth / $this.height());
    $this.css({
        height: '100%',
        width: 'auto',
        position: 'relative',
        left: (-((currentWidth - mWidth) / 2)) + "px"
    });
}

var bgColor = $(".img-container").css("background-color");
$(".img-container").css("background-color","#ffffff");
setTimeout(function(){
    $(".image-crop").fadeIn(300);
    setTimeout(function() {
        $(".img-container").css("background-color",bgColor);
    },1500);
},500);

var imgs = $('.img-container');
var images = $('.image-crop').map(function() {
    return $(this).attr('src');
}).get();
imgs.each(function (index) {
    $(this).on('click',function () {
        var srcList =images;
        var orderedList = [];
        orderedList = srcList.slice(index);
        orderedList =  orderedList.concat(srcList.slice(0,index));
        SimpleLightbox.open({
            items: orderedList
        });
    })
});
