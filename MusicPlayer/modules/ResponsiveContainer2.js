define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/window",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class"
], function(declare, arrayUtil, win, _Container, _WidgetBase, domConstruct, domAttr, domClass){

	// module:
	//		my/ResponsiveContainer
	
	return declare([_WidgetBase, _Container], {
		
		VIEW_ATTRIBUTE_NAME: "data-dojo-view",
		_overlay: null,
		_content: null,
		_style: null,
		_nbContentView: 0,
		
		
		_views: {},
		
		mainView: "view1",
		
		startup: function(){
			this.inherited(arguments);
			
			var children = this.domNode.children;
			for (var i=0; i < children.length; i++){
				if (domAttr.has(children[i], this.VIEW_ATTRIBUTE_NAME)){
					this._views[children[i].id] = children[i].cloneNode(true);
				} 
			}
			for (var view in this._views) {
				if(this._views.hasOwnProperty(view)){
					domConstruct.destroy(view);
				}
			}
			
			
			this._content = domConstruct.place("<div id='content'></div>", this.domNode, "first");
			this._overlay = domConstruct.place("<div id='overlay'></div>", this.domNode, "first");
			this._style = domConstruct.place("<style></style>", this.domNode, "first");
			
			this.display(this.mainView, "content");
			this.resize();
		},
		
		display: function(view, /* String: content|overlay */ pane){
			var domNodeView = this._views[view].cloneNode(true);
			//domClass.add(domNodeView, "view");
			
			if(pane === "content"){
				this._nbContentView++;
				this._style.innerHTML = ".view {" +
										"	width: " + 100/this._nbContentView + "%" +
										"}";
				
				if (this._nbContentView >= 2){
					this._style.innerHTML += "@media (max-width: 800px) and (min-width: 401px) {" + 
											"	.view {" + 
											"		display:none;" +
											"	}" +
										
											"	#content .view:nth-last-child(-n+2){" +
											"		display:block;" + 
											"		width:50%!important;" +
											"	}" +
											"}" +
											
											"@media (max-width: 400px) {" +
											"	.view {" +
											"		display:none;" +
											"		border:none;" +
											"	}" +
											
											"	#content .view:last-child{" +
											"		display:block;" + 
											"		width:100%!important;" +
											"	}" +
											"}";
				}
				
				this._content.appendChild(domNodeView);
			}
		},
		
		resize: function(){
			this.inherited(arguments);
			win.body().style.height= (win.global.innerHeight || win.doc.documentElement.clientHeight)+"px";
		}
	});
});