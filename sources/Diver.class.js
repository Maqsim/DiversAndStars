//class Diver
function Diver(){
    var me = this; //для получение доступа с любой области видимости и замкнутости
    me.image = new Image(); //картинка водолаза
    me.width = 66; 
    me.height = 63;
    me.id = Math.random(10).toString().substr(2, 5); //генерируем ID водолаза
    me.x = config.cablePosition - Math.round(me.width/2); //определяем начальные x
    me.y = config.skyHeigth-15; //и y
    me.balon = config.balon; // объем балона
    me.balonUse = 50; //миллилитров в секунду
    me.inWater = true;
    me.stars = []; //карман водолаза
    me.scope = canvas.width / 6; //область видимости (1/3 -- общая), влево и вправо
    me.status = "down"; //текущий статус водолаза
    me.isBusy = true;
    me.lockRepeat = false; //вспомогательное свойство
    me.radio = []; //стек сообщений радио
	//остановки, которые должен совершить водолаз
    me.stops={
        '1': {
            position: (canvas.height - config.bottomHeight - config.skyHeigth)*0.3,
            time: 5000
        }, 
        '2': {
            position: (canvas.height - config.bottomHeight - config.skyHeigth)*0.6,
            time: 10000
        },
        '3': {
            position: (canvas.height - config.bottomHeight - config.skyHeigth)*0.8,
            time: 15000
        }
    }
	//определяем, общее время остановок водолаза при подьеме
    me.secondsToUp = 0;
    for (i in me.stops) {
        me.secondsToUp += me.stops[i].time;
    };
    me.speed = config.diverSpeed || 20; //px per second 

	//каждую секунду водолаз...
    setInterval(function(){
        me.sayText = me.radio.shift(); //переверяет сообщение в стеке и говорит, если есть
        if(me.inWater) { //если в воде, то
            me.checkBalon(); //проверяем состояние балона  учетом оценок в руках
            me.balon -= me.balonUse; //отнимаем "законные" 50 мл кислорода
        }
    }, 1000);

	//остановка анимации
    me.stop = function(){
        clearInterval(me.moving);
    }
	//выбрасываем звезды из рук
    me.drop = function(num){
        if(me.y >= canvas.height - config.bottomHeight - me.height - 20){
			if(me.inQueue || me.focusStar || me.stars.length) me.say(" Бросаю всё");
			if(me.inQueue){
				me.inQueue.status = 'found';
				me.inQueue = null;
			}
			if(me.focusStar){
				me.focusStar.status = 'found';
				me.focusStar = null;
			}
            for (var i = me.stars.length - 1; i >= 0; i--) {
				me.balonUse -= me.stars[i].rate;
                me.stars[i].status = 'found';
                me.stars[i].move();
                me.stars.pop();
            }; 
        }
    }
	//метод, который осуществляет перемещение
    me.walk = function(way, pattern){
        if (me.way != way) {
            me.stop();
            if(!way) {
                if(me.x + me.image.width + me.scope >= canvas.width) way = "left";
                else if(me.x - me.scope <= 0) way = 'right';
                else way = (Math.round(Math.random()))?"left":"right";
            } else {
                if (typeof way == 'object') me.say("     Забираю");
                else if (way == 'filling' && pattern == true) me.say("  На заправку");
                else if (way == 'putting' && pattern == true && me.y >= canvas.height - config.bottomHeight - me.height - 20) {
                    me.say("  Плыву домой");
                }
            }

            if(!pattern) {
                me.way = way;
                if(me.way == 'right' || me.way == 'left') me.hands = me.way;
                if(me.way == 'right' || me.way == 'left' || me.way == 'down' || me.way == 'up'){
					switch(me.way){
						case 'right': me.image = application.images.diverR;
							break;
						case 'left': me.image = application.images.diverL;
							break;
						case 'up': case 'down': me.image = application.images.diverU;
							break;
					}
				}
            }
            var lockRepeat = false;
            me.moving = setInterval(function(){
                //patterns for mooving
                if(way == "putting" && pattern == true && me.stars.length > 0){
                    me.isBusy = true;
                    if((me.x + Math.round(me.width/2)) < config.cablePosition){
                        me.x++;
                        me.hands = 'right';
                        me.image = application.images.diverR
                    } else if((me.x + Math.round(me.width/2)) > config.cablePosition) {
						me.x--; me.hands = 'left';
						me.image = application.images.diverL
                    } else {
                        if(me.y >= canvas.height - config.bottomHeight - me.height - 20) {
                            if(!me.lockRepeat) {
                                me.balon -= 50; //из условия (для балласта)
                                for (var i = me.stars.length - 1; i >= 0; i--) {
                                    me.balon -= me.stars[i].rate * 50;
                                };
                            } me.lockRepeat = true; //выполняем один раз, хоть он и в цикле
                        }
                        me.hands = 'up';
                        me.way = 'up';
                        me.image = application.images.diverU
						if(me.y <= config.skyHeigth-31) {alert('putting'); me.walk('filling', true);}
                        if(me.y <= config.skyHeigth) {
                            me.stop();
                            for (var i = me.stars.length - 1; i >= 0; i--) {
                                var id = application.find(me.stars[i].id);
                                me.balonUse -= me.stars[i].rate;
                                objects.splice(id, 1);
                                starsOnShip.push(me.stars.pop());
                                starsCount--;

                            }
                            if (me.balon < config.balon / 2) me.walk("filling", true);
                            else me.walk("down");
                        } else me.y--;
                    }
                } else if(way == "filling" && pattern == true) {
                    me.goToFilling = true;
                    me.isBusy = true;
                    if((me.x + Math.round(me.width/2)) < config.cablePosition){
                        me.x++;
                        me.hands = 'right';
                        me.image = application.images.diverR
                    } else if((me.x + Math.round(me.width/2)) > config.cablePosition) {
                        me.x--;
                        me.hands = 'left';
                        me.image = application.images.diverL
                    } else {
                        if(me.y >= canvas.height - config.bottomHeight - me.height - 20) {
                            if(!me.lockRepeat) {
                                me.balon -= 50; //из условия (для балласта)
                                for (var i = me.stars.length - 1; i >= 0; i--) {
                                    me.balon -= me.stars[i].rate * 50;
                                };
                            } me.lockRepeat = true; //выполняем один раз, хоть он и в цикле
                        }
                        me.hands = 'up';
                        me.way = 'up';
                        me.image = application.images.diverU
						if(me.y <= config.skyHeigth-31) {me.walk('filling', true);}
                        if(me.y <= config.skyHeigth-30) {
                            me.stop();
                            //заправка
                            me.inWater = false;
                            if(!isCompressorBusy){
                                isCompressorBusy = true;
                                me.filling = setInterval(function(){
                                    if (me.balon + config.fillingSpeed < config.balon){
                                        me.balon += config.fillingSpeed
                                    } else {
                                        me.balon = config.balon;
                                        me.goToFilling = false;
                                        me.walk("down");
                                        isCompressorBusy = false;
                                        clearInterval(me.filling); 
                                    }
                                },1000); 
                            } else {
                                me.walk('filling', true);
                            }
                        } else me.y--;
                    }
                } else if(way == "delete" && pattern == true) {
					if(!me.stars.length) me.drop();
                    me.isBusy = true;
					me.status = 'deleting';
                    if((me.x + Math.round(me.width/2)) < config.cablePosition){
                        me.x++;
                        me.hands = 'right';
                        me.image = application.images.diverR
                    } else if((me.x + Math.round(me.width/2)) > config.cablePosition) {
                        me.x--;
                        me.hands = 'left';
                        me.image = application.images.diverL
                    } else {
                        if(me.y >= canvas.height - config.bottomHeight - me.height - 20) {
                            if(!me.lockRepeat) {
                                me.balon -= 50; //из условия (для балласта)
                                for (var i = me.stars.length - 1; i >= 0; i--) {
                                    me.balon -= me.stars[i].rate * 50;
                                };
                            } me.lockRepeat = true; //выполняем один раз, хоть он и в цикле
                        }
                        me.hands = 'up';
                        me.way = 'up';
                        me.image = application.images.diverU
						if(me.y <= config.skyHeigth) {
                            for (var i = me.stars.length - 1; i >= 0; i--) {
                                var id = application.find(me.stars[i].id);
                                me.balonUse -= me.stars[i].rate;
                                objects.splice(id, 1);
                                starsOnShip.push(me.stars.pop());
                                starsCount--;
                            }
                        }
						if(me.y <= config.skyHeigth-30) {
						  if(!me.lockDeleteRepeat) {
							diversCount--;
                            me.stop();
							me.inWater = false;
							objects.splice(application.find(me.id), 1);
						 } me.lockDeleteRepeat=true;
                        } else me.y--;
                    }
                } else if(typeof way == "object" && pattern == true) {
                    var star = way;
                    if(star.status == "found" || star.status == "waiting") {
                        star.status = "waiting";
                        me.focusStar = star;
                        me.isWaiting = true;
                        if((me.x - Math.round(star.width/2) + me.width) < star.x){
                            me.x++;
                            me.hands = 'right';
                            me.image = application.images.diverR
                        } else if((me.x - Math.round(star.width/2)) > star.x ) {
                            me.x--;
                            me.hands = 'left';
                            me.image = application.images.diverL
                        } else {
                            if(star.isDropped){
                                star.parentTo(me);
                                delete me.focusStar;
                                me.stars.push(star);
                                if(!lockRepeat) me.balonUse += star.rate;
                                lockRepeat = true;  
                                me.isWaiting = false;
                                star.status = "locked";
                                star.isDropped = false;
                                if (me.stars.length<config.maxStarsOnHands && !me.inQueue) me.walk();
                                else if(me.inQueue) {
                                    me.walk(me.inQueue, true);
                                    delete me.inQueue;
                                }
                                else me.walk("putting", true);
                            }
                        }
                    } else me.walk()
                } else {
                    if(me.way == "right") {
                        me.isBusy = false;
                        if(me.x + me.image.width + me.scope >= canvas.width) me.walk("left");
                        me.x++;
                    } else if(me.way == "left") {
                        me.isBusy = false;
                        if(me.x - me.scope <= 0) me.walk("right");
                        me.x--;
                    } else if(me.way == "up") {
						if(me.y <= config.skyHeigth-31) {me.walk('filling', true);}
                        //me.y;
                    } else if(me.way == "down") {
                        if(me.y > config.skyHeigth-50) {
                            me.inWater = true;
                            for(i in me.stops){
                                stop = me.stops[i];
                                stop.was = false;
                            }
                        }
                        if(me.y >= canvas.height - config.bottomHeight - me.height - 20) {
                            me.isBusy = false;
                            me.walk();
                        }
                        me.y++;
                    } else {
                        me.walk(me.way, false);
                    }
                }

                for(i in me.stops) {
                    var stop = me.stops[i.toString()];
                    if(canvas.height-config.bottomHeight - me.y>=stop.position && me.way == 'up'){
                        if(!stop.was) {
                            me.stop();
                            stop.was = true;
                            me.lastSayText = null;
                            me.say("Надо отдохнуть ");
                            setTimeout(function(){
                                me.walk(way, pattern);
                            },stop.time);
                        }
                    }
                }
            }, 1000 / (me.speed))
        }
    }
	
	//проверка состояние балона
    me.checkBalon = function() {
        me.distance = Math.abs(me.x+parseInt(me.width/2) - config.cablePosition);
        me.timeToCable = me.distance / me.speed;
        me.mlToCable = me.timeToCable * me.balonUse; //сколько милилитров до троса
        me.mlFromCableToShip = me.secondsToUp/1000 * me.balonUse;
        me.mlToShip = parseInt(me.mlToCable) + parseInt(me.mlFromCableToShip)+50;
        me.withStars = 0; 
        // сумируем все паузы (3) при подьеме по времени
        for (var i = me.stars.length - 1; i >= 0; i--) {
            me.withStars += me.stars[i].rate * 50;
        };
        me.withStars += parseInt(me.y / me.speed) * me.balonUse;
        me.mlToShipWithStars = me.mlToShip + me.withStars;
        if(!me.goToFilling){
            if(me.balon-me.mlToShip <= me.mlToShip) {
				me.walk('filling', true);
				me.isBusy = true;
				me.say("Мало кислорода");
                me.drop();
            }
            else if(me.stars.length && me.balon-me.mlToShipWithStars <= me.mlToShipWithStars){
				me.isBusy = true;
                me.walk('putting', true);
            }
        }
    }

	//метод отрисовки дайвера
    me.draw = function() {
        if(me.sayText) {
            rc.drawImage(application.images.hint, me.x - application.images.hint.width, me.y - application.images.hint.height);
            rc.fillText(me.sayText,  me.x - application.images.hint.width + 7, me.y - application.images.hint.height + 34);
        }
        if(config.debugInfo){
            rc.fillText(me.balon+":"+me.balonUse+":"+me.stars.length,  me.x, me.y-4);  
            rc.beginPath();
            rc.moveTo(me.x + me.width + me.scope, 0);
            rc.lineTo(me.x + me.width + me.scope, canvas.height);
            rc.moveTo(me.x - me.scope, 0);
            rc.lineTo(me.x - me.scope, canvas.height);
            if(me.focusStar) {
                rc.moveTo(me.x+parseInt(me.image.width/2), me.y+parseInt(me.image.height/2));
                rc.lineTo(me.focusStar.x+parseInt(me.focusStar.image.width/2), me.focusStar.y + parseInt(me.focusStar.image.height/2));
            }
            if(me.inQueue){
                rc.moveTo(me.x+parseInt(me.image.width/2), me.y+parseInt(me.image.height/2));
                rc.lineTo(me.inQueue.x+parseInt(me.inQueue.image.width/2), me.inQueue.y + parseInt(me.inQueue.image.height/2));
            }
            rc.stroke();
        }
        rc.drawImage(me.image, me.x, me.y);
    }

	//говорим в радио
    me.say = function(text){
        if(me.lastSayText != text){
            me.radio.push(text);
            me.lastSayText = text;
        }
    }	

	// исполняемый код
    diversCount++; //при создании обьекта добавляем к чисслу водолазов 1
    me.walk('down'); //и опускаем водолаза на поиски
}