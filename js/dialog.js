/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-11 11:09:21
 * @version $Id$
 */

;(function($){
	var Dialog = function(config){
		var _this_ = this;
		//默认参数配置
		this.config = {
			//对话框的宽，高
			width:"auto",
			height:"auto",
			//对话框的类型
			type:"waiting",
			//按钮配置
			buttons:null,
			//弹出框延迟多久关闭
			delay:null,
			//对话框的提示信息
			message:null,
			//对话框这罩层透明度
			maskOpacity:null,
			//延时关闭的回调函数
			delayCallback:null,
			//是否需要动画效果
			animate:false,
			//指定遮罩层点击是否关闭
			maskClose:false,
			effect:false
		}
		//默认参数扩展
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config);
		}else{
			this.isConfig = true;
		}
		//创建基本的DOM
		this.body = $("body");
		//创建遮罩层
		this.mask = $('<div class="g-dialog-container"></div>');
		//创建弹出框
		this.win = $('<div class="dialog-window"></div>');
		//创建弹出框头部
		this.winHeader = $('<div class="dialog-header"></div>');
		//创建头部提示框提示图层
		this.winHeaderIcon = $('<div></div>');
		//创建提示信息
		this.winContent = $('<div class="dialog-body"></div>');
		//创建弹出框按钮组
		this.winFooter = $('<div class="dialog-footer"></div>');
		//渲染DOM
		this.creat();

	}

	//记录弹窗层级
	Dialog.zIndex = 10000;
	Dialog.prototype = {
		//创建弹出框
		creat : function(){
			var _this_ = this;
			config = this.config;
			mask = this.mask;
			win = this.win;
			header = this.winHeader;
			headerIcon = this.winHeaderIcon;
			content = this.winContent;
			footer = this.winFooter;
			body = this.body;
			//增加弹框的层级
			Dialog.zIndex++;

			this.mask.css("zIndex",Dialog.zIndex);

			//如果没有传递任何配置参数
			//就弹出一个等待的图表形式弹框
			if(this.isConfig){

				win.append(header.append(headerIcon.addClass("waiting")));
				if(config.effect){
					this.animate();
				}
				mask.append(win);
				body.append(mask);
			}else{
			//根据配置参数创建相应的弹框
				header.append(headerIcon.addClass(config.type));
				win.append(header);
				//如果传了文本信息
				if(config.message){
					win.append(content.html(config.message));
				}
				//按钮组
				if(config.buttons){
					this.creatButtons(footer,config.buttons);
					win.append(footer);
				}

				//插入到页面
				mask.append(win);
				body.append(mask);

				//设置对话框的宽高
				if(config.width != "auto"){
					win.width(config.width);
				}
				if(config.height != "auto"){
					win.height(config.height);
				}

				//对话框遮罩层透明度maskOpacity
				if(config.maskOpacity){
					mask.css({"backgroundColor":"rgba(0,0,0,"+config.maskOpacity+")"});
				}

				//设置弹出框后多久关闭
				if(config.delay && config.delay != 0){
					window.setTimeout(function(){
						_this_.close();
						//执行延时的回调函数
						config.delayCallback && config.delayCallback();
					},config.delay);
				}

				if(config.effect){
					this.animate();
				}

				//指定遮罩层点击是否关闭
				if(config.maskClose){
					mask.click(function(){
						_this_.close();
					});
				}
			}

		},
		//根据配置参数的buttons创建按钮方法
		creatButtons : function(footer,buttons){
			var _this_ = this;
			$(buttons).each(function(i){
				var type = this.type ? " class='"+this.type+"'": " ";
				var btnText = this.text?this.text:"按钮"+(++i);
				var callback = this.callback ? this.callback : null;
				var button  = $("<button"+type+">"+btnText+"</button>");
				footer.append(button);
				if(callback){

					button.click(function(e){
						var isClose = callback();
						if(isClose != false){
							_this_.close();
						}
						e.stopPropagation();

					})
				}else{
					button.click(function(e){
						_this_.close();
						e.stopPropagation();
					})
				}
			});
		},
		close : function(){
			this.mask.remove();
		},
		//定义一个动画函数
		animate : function(){
			var _this_ = this;
			this.win.css({"-webkit-transform":"scale(0,0)"});
			window.setTimeout(function(){

				_this_.win.css({"-webkit-transform":"scale(1,1)"});
			},100)
		}
	};
	
	$.dialog = function(config){
		return new Dialog(config);
	}
})(Zepto);
