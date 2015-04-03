function TouchTo(el, minLength, one) {
    minLength = minLength || 5;
    el = document;
    
    var startX, startY,
        __self = this,
        onmove = false;

    el.addEventListener('touchstart', function(e) {
        var te = e.touches[0];
        if (te) {
            onmove = false;
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        }
    });
    el.addEventListener('touchmove', function(e) {
        var te = e.touches[0];
        if (!te) {return;}
        if (one && onmove) {return;}

        var diffX = te.pageX - startX,
            diffY = te.pageY - startY,
            createEvent = function (type) {
                var ev;
                try {
                    if (window.CustomEvent) {
                        ev = new CustomEvent(type);
                    } else if ( window.Event ) {
                        ev = new Event(type);
                    } else {
                        ev =  document.createEvent('Event');
                        ev.initEvent(type, true, true);
                    }
                } catch(e) {
                    ev = {type:type};
                }
                ev.originEvent = e;
                ev.diffX = diffX;
                ev.diffY = diffY;
                return ev;
            },
            type;
        if ( Math.abs(diffX) >= Math.abs(diffY) ) {
            if ( diffX <= -minLength ) {
                type = 'moveleft';
                onmove = true;
                __self.fire(type, createEvent(type));
            } else if (diffX >= minLength) {
                type = 'moveright';
                onmove = true;
                __self.fire(type, createEvent(type));
            }
        } else {
            if ( diffY <= -minLength ) {
                type = 'moveup';
                onmove = true;
                __self.fire(type, createEvent(type));
            } else if (diffY >= minLength) {
                type = 'movedown';
                onmove = true;
                __self.fire(type, createEvent(type));
            }
        }
    });
    el.addEventListener('touchend', function() {
        onmove = false;
    });
    this.onmoveleft = [];
    this.onmoveright = [];
    this.onmoveup = [];
    this.onmovedown = [];
};

TouchTo.prototype.isArray = function (o) {
    return '[object Array]' === Object.prototype.toString.call(o);
};
TouchTo.prototype.isFunction = function (o) {
    return '[object Function]' === Object.prototype.toString.call(o);
};
TouchTo.prototype.on = function on(types, fn) {
    if (!types) {return;}
    var evs = types.split(' '),
        __self = this;

    if (__self.isFunction(fn)) {
        evs.forEach(function(ev) {
            var eventHub = __self['on'+ev];
            if (eventHub && __self.isArray(eventHub)) {
                eventHub.push(fn);
            }
        });
    };
};
TouchTo.prototype.fire = function fire(types, event) {

    if (!types) {return;}
    var evs = types.split(' '),
        __self = this;
    if (evs.length > 1) {
      evs.forEach(function(ev) {
          fire(ev);
      });
  } else if (evs.length === 1) {
    var eventHub = __self['on'+evs];
    if (eventHub && __self.isArray(eventHub)) {
        eventHub.forEach(function(handler) {
            handler.call(event.originEvent.target, event);
        });
    }
  }
};
TouchTo.prototype.remove = function remove(types, fn) {
    if (!types) {return;}
    var evs = types.split(' '),
        __self = this;

    evs.forEach(function(ev) {
        var eventHub = __self['on'+ev];
        if (eventHub && __self.isArray(eventHub)) {
            if (__self.isFunction(fn)) {
                if ( eventHub.indexOf(fn) >= 0 ) {
                    eventHub.splice(eventHub.indexOf(fn),1);
                } else {
                    eventHub = [];
                }
            }
        }
    });
};

if (typeof module !== 'undefuned') {
    module.exports = TouchTo;
};