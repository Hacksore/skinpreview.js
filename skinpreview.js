/*
	A canvas Minecraft skin renderer
	Project link: https://github.com/Hacksore/skinpreview.js
*/
function SkinPreview(options) {
	var self = this;
	var s = 1;
	var skinImage = new Image();
	var skinLoaded = false;
	var capeloaded = false;
	var capeEnabled = false;
	var errorImage = new Image();	
	var canvas = document.createElement('canvas');
	var context = canvas.getContext("2d");
	var _can = document.createElement('canvas');
	var _ctx = _can.getContext("2d");

	canvas.id = "skin-preview";	
	_can.width = 64;
	_can.height = 32;
	

	this.user = "";		
	this.cape = new Image();

	this.drawSkinFront = function(){	
		var parts = {
			head: [skinImage, 8, 8, 8, 8, 4, 0, 8, 8],
			body: [skinImage, 20, 20, 8, 12, 4, 8, 8, 12],
			leftleg: [skinImage, 4, 20, 4, 12, 4, 20, 4, 12],
			leftarm: [skinImage, 44, 20, 4, 12, 0, 8, 4, 12],
			rightleg: [_can, 56, 20, 4, 12, 8, 20, 4, 12],
			rightarm: [_can, 16, 20, 4, 12, 12, 8, 4, 12]
		};		
		this.drawSkin(parts);
	}	
	
	
	this.drawSkinBack = function(){		
		var parts = {
			head: [skinImage, 24, 8, 8, 8, 4, 0, 8, 8],
			body: [skinImage, 32, 20, 8, 12, 4, 8, 8, 12],			
			rightarm: [skinImage, 52, 20, 4, 12, 12, 8, 4, 12],
			rightleg: [skinImage, 12, 20, 4, 12, 8, 20, 4, 12],	
			leftleg: [_can, 48, 20, 4, 12, 4, 20, 4, 12],
			leftarm: [_can, 8, 20, 4, 12, 0, 8, 4, 12]
			
		};	
		this.drawSkin(parts);
	}
	
	this.drawSkin = function(parts){
		if(!skinLoaded) { return; }		
		context.imageSmoothingEnabled = false;
		context.mozImageSmoothingEnabled = false;
		context.oImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.clearRect(0, 0, canvas.width, canvas.height);

		//draw parts
		for(var i in parts){		
			var v = parts[i];	
			context.drawImage(v[0], v[1], v[2], v[3], v[4], v[5]*s, v[6]*s, v[7]*s, v[8]*s);			
		}
	}
		
	this.setScale = function(scale){		
		s = scale;
		canvas.width = 16 * s;
		canvas.height = 32 * s;
		this.drawSkinFront();
	}
	
	this.setSkin = function(user){	
		capeloaded = false;
		skinImage = new Image();
		skinImage.src = "https://s3.amazonaws.com/MinecraftSkins/" + user+ ".png";
		skinImage.onload = function(){
			skinLoaded = true;
			_ctx.scale(-1, 1);
			_ctx.drawImage(skinImage, -64, 0);
			_ctx.scale(-1, 1);
			self.drawSkinFront();
	
		}
		skinImage.onerror = function(){
			skinLoaded = true;
			skinImage = errorImage;
			_ctx.scale(-1, 1);
			_ctx.drawImage(skinImage, -64, 0);
			_ctx.scale(-1, 1);
			self.drawSkinFront();
		}
		this.getCape(user);
	}	

	this.getCape = function(user){
		this.cape.src = "https://s3.amazonaws.com/MinecraftCloaks/" + user + ".png";
		this.cape.onload = function(){
			capeloaded = true;
			
		}
		this.cape.onerror = function(){
			capeloaded = false;		
		}
	}
	
	this.drawCape = function(){
		if(!capeEnabled){ return; }
		if(!capeloaded){ return; }
		if(this.cape == null){ return; }

		var w = 12;
		var h = 17;
		context.drawImage(this.cape, 0, 0, w, h, s * 2, s * 8, s * w, s * h);
	}
	
	canvas.onmouseover = function(){
		self.drawSkinBack()
		self.drawCape();
	}

	canvas.onmouseleave = function(){
		self.drawSkinFront();
	}	
	
	canvas.oncontextmenu = function(e){	
		e.preventDefault();		
		if(!capeloaded){ return; }
		capeEnabled = !capeEnabled;
		self.drawSkinBack();
		self.drawCape();	
	}

	this.init = function(){	
		var _opts = {
			scale: 20,
			skin: "Hacksore",
			cape: false,
			div: "test",
			className: "",
			prefix: "<div>",
			suffix: "</div>",
			default_skin: "char.png"
			
		};
		for(var i in _opts){
			if(options[i] == null){
				options[i] = _opts[i];
			}
		}

		capeEnabled = options.cape;

		errorImage.src = options.default_skin;
		errorImage.onload = function() {
		}			
		
		this.setScale(options.scale);
		this.setSkin(options.skin);
		this.user = options.skin;		
			
		canvas.className = options.className		
		
		options.prefix = options.prefix.replace("{:username}", this.user);		
		var el = $(options.prefix+options.suffix).html(canvas);
		$("#"+options.div).append(el);
	}	

	this.init();
	
}