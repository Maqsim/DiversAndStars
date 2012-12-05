var bg, canvas, starsLayer, alga;

application = {
	init: function(){
		//СЛОИ
		//фон
		bg = document.createElement('canvas'); 
		bg.style.position = 'fixed'; 
		bg.style.top = '0px'; 
		bg.style.left = '0px';  
		bg.style.zIndex = '0'
		bg.style.maxHeight = 1100;
		bg.width = document.body.offsetWidth+16; 
		bg.height = (window.innerHeight>350 && window.innerHeight<1100)?window.innerHeight:((window.innerHeight<350)?350:1100);
		document.body.insertBefore(bg, document.body.firstChild);
		bgrc = bg.getContext("2d");

		//водолазы
		canvas = document.createElement('canvas'); 
		 canvas.style.position = 'fixed'; 
		 canvas.style.top = '0px'; 
		 canvas.style.left = '0px';  
		 canvas.style.zIndex = '1'
		 canvas.style.maxHeight = 1100;
		 canvas.width = document.body.offsetWidth+16; 
		 canvas.height = (window.innerHeight>350 && window.innerHeight<1100)?window.innerHeight:((window.innerHeight<350)?350:1100);
		document.body.insertBefore(canvas, document.body.firstChild);
		rc = canvas.getContext("2d");

		//звезды
		 starsLayer = document.createElement('canvas'); 
		 starsLayer.style.position = 'fixed'; 
		 starsLayer.style.top = '0px'; 
		 starsLayer.style.left = '0px';  
		 starsLayer.style.zIndex = '2'
		 starsLayer.style.maxHeight = 1100;
		 starsLayer.width = document.body.offsetWidth+16; 
		 starsLayer.height = (window.innerHeight>350 && window.innerHeight<1100)?window.innerHeight:((window.innerHeight<350)?350:1100);
		document.body.insertBefore(starsLayer, document.body.firstChild);
		starsrc = starsLayer.getContext("2d");

		//водоросли
		 alga = document.createElement('canvas'); 
		 alga.style.position = 'fixed'; 
		 alga.style.top = '0px'; 
		 alga.style.left = '0px';  
		 alga.style.zIndex = '3'
		 alga.style.maxHeight = 1100;
		 alga.width = document.body.offsetWidth+16; 
		 alga.height = (window.innerHeight>350 && window.innerHeight<1100)?window.innerHeight:((window.innerHeight<350)?350:1100);
		document.body.insertBefore(alga, document.body.firstChild);
		algarc = alga.getContext("2d");
		
		document.onkeydown = function (e) {
			e = e || window.event;
			if (e.keyCode === 13) {
				objects.unshift(new Diver());
				return false;
			} else if (e.keyCode === 32) {
				config.debugInfo = true;
				return false;
			} else if (e.keyCode === 46) {
				if(diversCount) {
					for (var i = 0; i <= diversCount-1 ; i++) {
						var diver = objects[i];
						if(diver.status != "deleting") {
							diver.walk('delete', true);
							break;
						}
					}
					return false;
				}
			}
		}

		document.onkeyup = function (e) {
			e = e || window.event;
			if (e.keyCode === 32) {
				config.debugInfo = false;
				return false;
			}
		}

		 document.onmousedown = function(e) {
			e = e || window.event;
			if (e.pageX || e.pageY) {
					x = e.pageX;
					y = e.pageY;
			}
			else if (e.clientX || e.clientY) {
					x = e.clientX + document.body.scrollLeft
							+ document.documentElement.scrollLeft;
					y = e.clientY + document.body.scrollTop
							+ document.documentElement.scrollTop;
			}
			if (y > config.skyHeigth && y < canvas.height - config.bottomHeight - 22 && x > 23 && x < canvas.width-23) {
				objects.push(new Star(x - 23, y - 22, Math.ceil(10*Math.random())));
			}
		 }

		application.images.diverR.src = 'images/diver-right.png';
		application.images.diverL.src = 'images/diver-left.png';
		application.images.diverU.src = 'images/diver-up.png';
		application.images.water.src = 'images/water2.png';
		application.images.bottom.src = 'images/bottom.png';
		application.images.sky.src = 'images/sky.png';
		application.images.sun.src = 'images/sun.png';
		application.images.island.src = 'images/island.png';
		application.images.waves.src = 'images/waves.png';
		application.images.ship.src = 'images/ship2.png';
		application.images.cable.src = 'images/cable.png';
		application.images.hint.src = 'images/hint.png';
		application.images.stars.src = 'images/ship-load.png';
		application.images.alga1.src = 'images/alga1.png';
		application.images.alga2.src = 'images/alga2.png';
		application.images.alga3.src = 'images/alga3.png';

		application.images.diverR.onload = function() {this.loaded=true}
		application.images.diverL.onload = function() {this.loaded=true}
		application.images.diverU.onload = function() {this.loaded=true}
		application.images.water.onload = function() {this.loaded=true}
		application.images.bottom.onload = function() {this.loaded=true}
		application.images.sky.onload = function() {this.loaded=true}
		application.images.sun.onload = function() {this.loaded=true}
		application.images.island.onload = function() {this.loaded=true}
		application.images.waves.onload = function() {this.loaded=true}
		application.images.ship.onload = function() {this.loaded=true}
		application.images.cable.onload = function() {this.loaded=true}
		application.images.hint.onload = function() {this.loaded=true}
		application.images.stars.onload = function() {this.loaded=true}
		application.images.alga1.onload = function() {this.loaded=true}
		application.images.alga2.onload = function() {this.loaded=true}
		application.images.alga3.onload = function() {this.loaded=true}
		
		application.isReady(application.start);
	},
	
	images: {
		diverR: new Image(),
		diverL: new Image(),
		diverU: new Image(),
		water: new Image(),
		bottom: new Image(),
		sky: new Image(),
		sun: new Image(),
		island: new Image(),
		waves: new Image(),
		ship: new Image(),
		cable: new Image(),
		hint: new Image(),
		stars: new Image(),
		alga1: new Image(),
		alga2: new Image(),
		alga3: new Image()
	},
		
	isReady: function(callback){
		var isReady = setInterval(function(){
			for (i in application.images) {
				if (!application.images[i].loaded) {
					application.isReady = false;
					break;
				} else application.isReady = true;
			};
			if (application.isReady){
				clearInterval(isReady);
				callback();
			} 
		},50)
	},
	
	start: function(){
		objects.unshift(new Diver());//добавляем в массив глобальных обьектов только что созданного водолаза
		application.buidWorld(); // рендерим мир
		setInterval(function(){
			rc.clearRect(0, 0, canvas.width, canvas.height);
			starsrc.clearRect(0, 0, canvas.width, canvas.height);
				for (var i = 0; i < objects.length; i++) {
					objects[i].draw();
				}
		}, config.fps);
		application.addAlga();

		//скорость поиска происходит при каждом перемещении любого дайвера
		setInterval(function(){
			application.searchStars();
		},1000/config.diverSpeed+10)
	},
	
	addAlga: function(){
		algarc.drawImage(application.images.alga1, 20, canvas.height-80);
		algarc.drawImage(application.images.alga3, parseInt(canvas.width / 3)-30, canvas.height-70);
		algarc.drawImage(application.images.alga2, canvas.width-application.images.alga2.width-30, canvas.height-90);
	},
	
	buidWorld: function(){
        document.body.style.background='#EFD794';
        rc.lineWidth = 1;
        rc.font = "11px Tahoma";
        rc.fillStyle = "#0C2F54";
        var currentX = 0;

        //небо
        while(currentX <= canvas.width){                                     //
            bgrc.drawImage(application.images.sky, currentX, 0);             // ХАК, ПОЗВОЛЯЮЩИЙ ЗАМЕНИТЬ createPattern
            currentX += application.images.sky.width;                        //
        }
		
        //солнце
        bgrc.drawImage(application.images.sun, 80, config.skyHeigth- 110);

        //остров
        bgrc.drawImage(application.images.island, 170, config.skyHeigth - application.images.island.height);
		
		currentX = 0;
        while(currentX <= canvas.width){
            bgrc.drawImage(application.images.waves, currentX, config.skyHeigth-10);
            currentX += application.images.waves.width;
        }
		
		bgrc.drawImage(application.images.ship, config.cablePosition - application.images.ship.width + 47, config.skyHeigth - 70);
		
        //море
        currentX = 0;
        while(currentX <= canvas.width){
            bgrc.drawImage(application.images.water, currentX, config.skyHeigth+20);
            currentX += application.images.water.width;
        }
        //дно
        currentX = 0;
        while(currentX <= canvas.width){
            bgrc.drawImage(application.images.bottom, currentX, canvas.height-80);
            currentX += application.images.bottom.width;
        }

        //трос
        bgrc.drawImage(application.images.cable,
	            0, config.skyHeigth + Math.abs(application.images.cable.height - canvas.height),
                application.images.cable.width, application.images.cable.height - (config.skyHeigth + Math.abs(application.images.cable.height - canvas.height)),
                config.cablePosition - (application.images.cable.width/2) + 6, config.skyHeigth+28, 
                application.images.cable.width-10, application.images.cable.height - (config.skyHeigth + Math.abs(application.images.cable.height - canvas.height)+30)
	        );
    },
	
	searchStars: function(){
		if(starsCount) {
			for (var i = 0; i <= starsCount-1 ; i++) {
				var star = objects[objects.length-i-1];
				if((application.inScope(star) && star.status != "locked" && star.status != "waiting") || star.status == "found") {
					star.status = "found";
					if(diver = application.whoWillPickUp(star)) {
						//когда у водолаза есть место еще на одну звезду и очередь пуста, то добавляем в о чередь
						if(diver.isWaiting && !diver.inQueue && diver.stars.length<config.maxStarsOnHands-1 && diver.focusStar) {
							diver.inQueue=star;
							star.status = "waiting";
							diver.isBusy = true;
							diver.say('И вторую тоже');
						} else {
							diver.walk(star, true);
						}
					}
				}
			}
		}
	},
	
	inScope: function(star){
		if(starsCount) {
			for (var i = 0; i <= diversCount-1 ; i++) {
				var diver = objects[i];
				if(star.x + star.image.width > diver.x - diver.scope && star.x < diver.x + diver.width + diver.scope) {
					if (diver.isBusy && diver.isWaiting && diversCount>1 && star.status!='found' && star.status!='locked' && star.status!='waiting') {
						diver.say('   Вижу звезду');
						//diver.say('Заберите кто-то');
					}
					return true;
				}
			}
		}
		return false;
	},
	
	whoWillPickUp:function(star){
		var divers = [];
		//ищем всех доступных дайверов
		for (var i = 0; i <= diversCount-1 ; i++) {
			var diver = objects[i];
			if(!diver.isBusy && (diver.stars.length<config.maxStarsOnHands && !diver.focusStar || diver.stars.length<config.maxStarsOnHands-1 && diver.focusStar)) {
				divers.push(diver);
			}
		}
		//ищем того, кто ближе к звезде
		minDistance = divers[0];
		minDistanceWithOne = null;
		for (var i = divers.length - 1; i >= 1; i--) {
			if(Math.abs(star.x + Math.round(star.width/2) - (divers[i].x + Math.round(diver.image.width/2))) < Math.round(minDistance.image.width)){
				if (divers[i].stars.length>0) minDistanceWithOne = divers[i];
				else minDistance = divers[i];
			}
		};
		//отправляем за звездой того, кто уже имеет одну звезду иначе - любого
		//return (minDistanceWithOne)?minDistanceWithOne:minDistance;
		return minDistance;
	},
	
	//утилита поиска обьектов в массиве, по их ID
	find: function(id) {
		for (var i = 0; i <= objects.length-1; i++) {
			if (objects[i].id == id.toString()) return i;
		}
		return -1;
	}
}