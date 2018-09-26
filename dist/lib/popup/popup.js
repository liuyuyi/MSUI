window.Popup=function(d){var _instance=null,_progressInstance=null,doc=d.body;doc.clientWidth,doc.clientHeight;function Dialog(){this.title="标题",this.content="内容",this.btns=[{name:"确定",ac:function(){}},{name:"取消",ac:function(){}}],this.type="alert",this.hasTitle=!0,this.timeout=500,this.dialogWrapper=null,this.mask=null,this.fadeTime=250,this.fadeInTime=0,this.hasDialog=!1,this.loadingText="正在加载",this.hasLoadingText=!1,this.spinNumber=8,this.loadingRadius=18,this.startAngle=90,this.spinMargin=2}function Progress(){Dialog.call(this),this.percent=0,this.text="正在更新程序",this.innerBar=null}function _getInstance(){return _instance||(_instance=new Dialog),_instance}return Dialog.prototype={_createMask:function(){var _this=this;this.mask||(this.mask=document.createElement("div"),this.mask.className="ui-mask fade",doc.appendChild(this.mask),setTimeout(function(){_this.mask.className="ui-mask fade in"},this.fadeInTime))},_removeMask:function(){var _this=this;this.mask&&(this.mask.className="ui-mask fade",setTimeout(function(){_this.mask.remove(),_this.mask=null},this.fadeTime))},_createWrapper:function(){this.dialogWrapper||(this.dialogWrapper=document.createElement("div"))},_removeWrapper:function(){var _this=this;this.dialogWrapper&&("toast"===this.type?this.dialogWrapper.className="ui-dialog ui-toast fade":"loading"===this.type?this.dialogWrapper.className="ui-dialog ui-loading fade":"progress"===this.type?this.dialogWrapper.className="ui-dialog ui-progress fade":this.dialogWrapper.className="ui-dialog fade",setTimeout(function(){_this.dialogWrapper.remove(),_this.dialogWrapper=null,_this.hasDialog=!1},this.fadeTime))},_createTitle:function(){var title=document.createElement("div");return title.className="ui-title",title.textContent=this.title,title},_createContent:function(){var content=document.createElement("div");return content.className="ui-content",content.textContent=this.content,content},_createBtns:function(){var buttons=document.createElement("div"),_this=this;return buttons.className="ui-btns",this.btns&&this.btns.forEach(function(btn,index){var link=document.createElement("a");link.href="javascript:void(0)",link.textContent=btn.name,buttons.appendChild(link),link.addEventListener("click",function(){_this.close(),btn.ac&&btn.ac()})}),buttons},_createLoadingText:function(){var text=document.createElement("div");return text.className="ui-text",text.textContent=this.loadingText,text},_createLoadingContent:function(){var content=document.createElement("div"),lineSpin=document.createElement("div"),deltaAngle=360/this.spinNumber;content.className="ui-content",this.hasLoadingText||(content.style.height="86px",content.style.borderRadius="5px"),lineSpin.className="ui-line-spin",lineSpin.style.width=2*this.loadingRadius+2*this.spinMargin+"px",lineSpin.style.height=2*this.loadingRadius+2*this.spinMargin+"px";for(var i=0;i<this.spinNumber;i++){var div=document.createElement("div"),angle=this.startAngle+i*-deltaAngle,rotateAngle=i*deltaAngle,p=2*Math.PI*(angle/360);div.style.top=this.loadingRadius*(1-Math.sin(p))+"px",div.style.left=this.loadingRadius*(1+Math.cos(p))+"px",div.style.transform="rotate("+rotateAngle+"deg)",div.style.WebkitTransform="rotate("+rotateAngle+"deg)",div.style.MozTransform="rotate("+rotateAngle+"deg)",div.style.msTransform="rotate("+rotateAngle+"deg)",div.style.OTransform="rotate("+rotateAngle+"deg)",lineSpin.appendChild(div)}return content.appendChild(lineSpin),content},_renderDialog:function(){switch(this._createWrapper(),this.type){case"confirm":this.dialogWrapper.className="ui-dialog fade";var title,btns,_this=this;content=this._createContent(),btns=this._createBtns(),this.hasTitle&&(title=this._createTitle(),this.dialogWrapper.appendChild(title)),this.dialogWrapper.appendChild(content),this.dialogWrapper.appendChild(btns),doc.appendChild(this.dialogWrapper),setTimeout(function(){_this.dialogWrapper.className="ui-dialog fade in"},this.fadeInTime);break;case"toast":this.dialogWrapper.className="ui-dialog ui-toast fade";var content=this._createContent();_this=this;this.dialogWrapper.appendChild(content),doc.appendChild(this.dialogWrapper),setTimeout(function(){_this.dialogWrapper.className="ui-dialog ui-toast fade in"},this.fadeInTime),setTimeout(function(){_this.close()},this.timeout);break;case"loading":this.dialogWrapper.className="ui-dialog ui-loading fade";var text;_this=this;content=this._createLoadingContent(),this.hasLoadingText&&(text=this._createLoadingText(),this.dialogWrapper.appendChild(text)),this.dialogWrapper.appendChild(content),doc.appendChild(this.dialogWrapper),setTimeout(function(){_this.dialogWrapper.className="ui-dialog ui-loading fade in"},this.fadeInTime)}},confirm:function(){var args=arguments&&arguments[0],length=args&&args.length;3===length?(this.title=args[0],this.content=args[1],this.btns=args[2],this.hasTitle=!0):2===length?(this.content=args[0],this.btns=args[1],this.hasTitle=!1):(this.hasTitle=!1,this.content=args[0],this.btns=[{name:"确定"}]),this.type="confirm",this._create()},toast:function(){var args=arguments&&arguments[0],length=args&&args.length;2===length?(this.content=args[0],this.timeout=args[1]):1===length&&(this.content=args[0]),this.type="toast",this.hasDialog||this._create(),this.hasDialog=!0},showLoading:function(){var args=arguments&&arguments[0];1===(args&&args.length)&&(this.loadingText=args[0],this.hasLoadingText=!0),this.type="loading",this._create()},_create:function(){this._createMask(),this._renderDialog()},close:function(){this._removeMask(),this._removeWrapper(),_progressInstance=_instance=null}},function(subClass,superClass){function F(){}F.prototype=superClass.prototype,subClass.prototype=new F,subClass.prototype.constructor=subClass}(Progress,Dialog),Progress.prototype._createProgressText=function(){var text=document.createElement("div");return text.className="ui-text",text.textContent=this.text,text},Progress.prototype._createProgressContent=function(){var content=document.createElement("div"),outer=document.createElement("div"),inner=document.createElement("div");return content.className="ui-content",outer.className="ui-outer",inner.className="ui-inner",outer.appendChild(inner),content.appendChild(outer),this.innerBar=inner,content},Progress.prototype.init=function(){var text,content,_this=this;this._createMask(),this._createWrapper(),this.dialogWrapper.className="ui-dialog ui-progress fade",text=this._createProgressText(),content=this._createProgressContent(),this.dialogWrapper.appendChild(text),this.dialogWrapper.appendChild(content),doc.appendChild(this.dialogWrapper),setTimeout(function(){_this.dialogWrapper.className="ui-dialog ui-progress fade in"},this.fadeInTime)},Progress.prototype.create=function(){var args=arguments&&arguments[0];return 1===(args&&args.length)&&(this.text=args[0]),this.type="progress",this.init(),this},Progress.prototype.update=function(percent){100===this.percent&&this.close(),this.percent=percent,this.innerBar.style.width=percent+"%"},Progress.prototype.closeBar=function(){this.percent=0,this.close()},{alert:function(){return _getInstance().confirm(arguments)},confirm:function(){return _getInstance().confirm(arguments)},toast:function(){return _getInstance().toast(arguments)},showLoading:function(){return _getInstance().showLoading(arguments)},progress:function(){return(_progressInstance||(_progressInstance=new Progress),_progressInstance).create(arguments)},close:function(){return _getInstance().close()}}}(document);