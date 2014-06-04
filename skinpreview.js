/*
	A canvas Minecraft skin renderer
	Project link: https://github.com/Hacksore/skinpreview.js
*/

(function ($) {
	'use strict';

	function SkinPreview() {
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
		var options = {};
		_can.width = 64;a
		_can.height = 32;
			
		this.cape = new Image();

		this.drawHead = function(){
			context.imageSmoothingEnabled = false;
			context.mozImageSmoothingEnabled = false;
			context.oImageSmoothingEnabled = false;
			context.webkitImageSmoothingEnabled = false;
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(skinImage, 8, 8, 8, 8, 0, 0, s*8, s*8);
			
		}
		this.drawHat = function(){
			context.imageSmoothingEnabled = false;
			context.mozImageSmoothingEnabled = false;
			context.oImageSmoothingEnabled = false;
			context.webkitImageSmoothingEnabled = false;
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(skinImage, 40, 8, 8, 8, 0, 0, s*8, s*8);
			
		}
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
		
			if(options.imagePath != null){
				skinImage.src = options.imagePath +user+ ".png" 
			}
			else if(options.imageUrl != null){
				skinImage.src = options.imageUrl; 	
			}
			else{
				skinImage.src = "https://s3.amazonaws.com/MinecraftSkins/" +user+ ".png";
			}
			skinImage.onload = function(){
				skinLoaded = true;
				_ctx.scale(-1, 1);
				_ctx.drawImage(skinImage, -64, 0);
				_ctx.scale(-1, 1);

				if(options.head){
					canvas.width = 8 * s;
					canvas.height = 8 * s;
					self.drawHead();
					self.drawHat();
					return;
				}	
				self.drawSkinFront();
		
			}
			skinImage.onerror = function(){
				skinLoaded = true;
				skinImage = errorImage;
				_ctx.scale(-1, 1);
				_ctx.drawImage(skinImage, -64, 0);
				_ctx.scale(-1, 1);
				if(options.head){
					canvas.width = 8 * s;
					canvas.height = 8 * s;
					self.drawHead();
					self.drawHat();
					return;
				}	
				self.drawSkinFront();
			}

			if(options.cape && !options.head && !options.capeOverride){
				this.getCape(user);
			}
		}	

		this.getCape = function(user){
			this.cape.src = options.capePath != null ? options.capePath +user+ ".png" : "https://s3.amazonaws.com/MinecraftCloaks/" + user + ".png";
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
			if(options.head){ return; }
			self.drawSkinBack()
			self.drawCape();
		}

		canvas.onmouseleave = function(){
			if(options.head){ return; }
			self.drawSkinFront();
		}	
		
		canvas.oncontextmenu = function(e){	
			if(options.head){ return; }
			if(!options.cape){ return; }		
			if(!capeloaded){ return; }

			e.preventDefault();
			capeEnabled = !capeEnabled;
			self.drawSkinBack();
			self.drawCape();	
		}

		this.init = function(ele, _options){	
			options = _options;
	
			capeEnabled = options.cape;

			errorImage.src = options.default_skin;
			errorImage.onload = function() {}			
			
			this.setScale(options.scale);
			this.setSkin(options.skin);
					
			canvas.className = options.className		

			$(ele).append(canvas);
		}	
		
	}

	$.fn.skinPreview = function (options) {
		this.each(function () {
			var defaults = {
				scale: 4,
				head: false,
				cape: false,
				capePath: null,
				capeOverride: $(this).attr('data-cape'),
				imagePath: null,
				className: "",
				default_skin: "char.png",
				skin: $(this).attr('data-player'),  
				imageUrl: $(this).attr('data-url')  
			};
	 
			var sp = new SkinPreview();
			sp.init(this, $.extend(defaults, options));
		});
	};
			
} (window.jQuery));
