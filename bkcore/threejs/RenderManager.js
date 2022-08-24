

var bkcore = bkcore || {};
bkcore.threejs = bkcore.threejs || {};

(function(w){
	var perfNow;
	var perfNowNames = ['now', 'webkitNow', 'msNow', 'mozNow'];
	if(!!w['performance']) for(var i = 0; i < perfNowNames.length; ++i)
	{
		var n = perfNowNames[i];
		if(!!w['performance'][n])
		{
			perfNow = function(){return w['performance'][n]()};
			break;
		}
	}
	if(!perfNow)
	{
		perfNow = Date.now;
	}
	w.perfNow = perfNow;
})(window);

bkcore.threejs.RenderManager = function(renderer)
{
	this.renderer = renderer;
	this.time = window.perfNow();

	this.renders = {};
	this.current = {};
	this.size = 0;

	this.defaultRenderMethod = function(delta, renderer)
	{
		renderer.render(this.scene, this.camera);
	};
};

bkcore.threejs.RenderManager.prototype.add = function(id, scene, camera, render, objects)
{
	render = render || this.defaultRenderMethod;
	objects = objects || {};

	this.renders[id] = {
		id: id,
		scene: scene, 
		camera: camera, 
		render: render, 
		objects: objects
	};

	if(this.size == 0) this.current = this.renders[id];

	this.size++;
};

bkcore.threejs.RenderManager.prototype.get = function(id)
{
	return this.renders[id];
};

bkcore.threejs.RenderManager.prototype.remove = function(id)
{
	if(id in this.renders)
	{
		delete this.renders[id];
		this.size--;
	}
};

bkcore.threejs.RenderManager.prototype.renderCurrent = function()
{
	if(this.current && this.current.render)
	{
		var now = window.perfNow();
		var delta = now - this.time;
		this.time = now;

		this.current.render.call(this.current, delta, this.renderer);
	}
	else console.warn('RenderManager: No current render defined.');
};

bkcore.threejs.RenderManager.prototype.setCurrent = function(id)
{
	if(id in this.renders)
	{
		this.current = this.renders[id];
	}
	else console.warn('RenderManager: Render "'+id+'" not found.');
};