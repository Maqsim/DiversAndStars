function Star(x, y, rate) {
    var me = this;
    me.id = Math.random(10).toString().substr(2, 5);
    me.x = x;
    me.y = y;
    me.rate = parseInt(rate);
    me.image = new Image();
    if (me.rate>=1 && me.rate<=10) me.image.src = "images/star"+me.rate+".png";
    me.width = me.image.width;
    me.height = me.image.height;
    me.status = "down";

    me.stop = function(){
        clearInterval(me.dropping);
    }

    me.parentTo = function(diver){
        me.move(diver);
    }

    me.move = function(action){
        me.stop();
        me.dropping = setInterval(function(){
            if(typeof action == 'object'){
                var diver = action;
                if(diver.hands == "left"){
                    me.x = diver.x-me.image.width+10;
                    me.y = diver.y+15;
                } else if (diver.hands == "right") {
                    me.x = diver.x+diver.image.width - 10;
                    me.y = diver.y+15;
                } else {
                    me.x = diver.x+30;
                    me.y = diver.y-20;
                }
            } else {
                if (me.y >= canvas.height - config.bottomHeight + Math.floor(Math.random()*30) - 43) {
                    me.stop();
                    me.isDropped = true;
                }
                me.y+=2;
            }
        }, 26);
    }

    me.draw = function(){
        starsrc.drawImage(me.image, me.x, me.y);
    }
	
	// исполняемый код
    me.move();
	starsCount++;
}