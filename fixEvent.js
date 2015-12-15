(function(){
	function fixEvent(event){
		function returnTrue(){return true;}	
		function returnFalse(){return false;}
		if(!event || !event.stopPropagation){
			var old = event || window.event; //确定event来源，作为老的event对象
			event = {};	//清空event
			for(var prop in old){
				event[prop] = old[prop];  //赋值属性
			}
			if(!event.target){
				event.target = event.srcElement || document;
			}//修复 来源

			event.relatedTarget = event.formElement === event.target ? event.toElement : event.fromElement;//修复目标

			event.preventDefault = function(){
				event.returnValue = false;//取消事件处理
				event.isDefaultPrevented = returnTrue;
			};//修复 默认事件

			event.isDefaultPrevented = returnFalse;//是否调用过 阻止默认事件；

			event.stopPropagation = function(){	//这个 和下面的阻止事件监听 不同之处在于 阻止冒泡 不会 取消监听 本身，下面的 即 包括本身
				event.cancelBubble = true;//取消事件冒泡
				event.isPropagationStopped = returnTrue; //是否调用过 冒泡事件
			};//修复 冒泡

			event.isPropagationStopped = returnFalse//是否调用过 阻止冒泡

			//防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理
			event.stopImmediatePropagation = function(){
				this.isImmediatePropagationStopped = returnTrue;
				this.stopPropagation();
			};

			event.isImmediatePropagationStopped = returnFalse;

			/**
			 * 修复pageX
			 * @param  {[type]} event.clientX !             [description]
			 * @return {[type]}               [description]
			 */
			if(event.clientX != null){
				var doc = document.documentElement,body = document.body;
				event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
				event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
			}

			//修复按键
			event.which = event.event.charCode || event.keyCode;

			// 修复鼠标
			//0 left 1 middle 2 right
			if(event.button != null){
				event.button = (event.button & 1 ? 0 : (event.button & 4 ? 1 :(event.button & 2 ? 2 : 0)));
			}

		}
		return event;
	}
})()