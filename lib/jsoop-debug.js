/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function () {
    "use strict";

    var toString = Object.prototype.toString,
        JSoop = {},
        EmptyClass = function () {};

    //CONSTANTS
    JSoop.GLOBAL   = (new Function('return this'))();

    JSoop.getValue = function () {
        var args = Array.prototype.slice.call(arguments, 0),
            value = args[0],
            scope, myArgs;

        if (!JSoop.isFunction(value)) {
            return value;
        }

        scope = args[1] || JSoop.GLOBAL;
        myArgs = args[2] || [];

        return value.apply(scope, args);
    };

    JSoop.STRING   = 1;
    JSoop.ARRAY    = 2;
    JSoop.NUMBER   = 3;
    JSoop.OBJECT   = 4;
    JSoop.ELEMENT  = 5;
    JSoop.BOOL     = 6;
    JSoop.FUNCTION = 7;

    //Methods
    JSoop.is = function (obj, type) {
        if (JSoop.isString(type)) {
            return JSoop.instanceOf(obj, type);
        }

        switch (type) {
        case JSoop.BOOL:
            return JSoop.isBool(obj);
        case JSoop.STRING:
            return JSoop.isString(obj);
        case JSoop.ARRAY:
            return JSoop.isArray(obj);
        case JSoop.NUMBER:
            return JSoop.isNumber(obj);
        case JSoop.OBJECT:
            return JSoop.isObject(obj);
        case JSoop.ELEMENT:
            return JSoop.isElement(obj);
        case JSoop.FUNCTION:
            return JSoop.isFunction(obj);
        default:
            return false;
        }
    };

    JSoop.isString = function (obj) {
        return typeof obj === 'string';
    };

    JSoop.isArray = function (obj) {
        return toString.call(obj) === '[object Array]';
    };

    JSoop.isBool = function (obj) {
        return typeof obj === 'boolean';
    };

    JSoop.isDate = function (obj) {
        return toString.call(obj) === '[object Date]';
    };

    JSoop.isNumber = function (obj) {
        return typeof obj === 'number';
    };

    JSoop.isObject = function (obj) {
        return obj instanceof Object && obj.constructor === Object;
    };

    JSoop.isElement = function (obj) {
        return obj ? obj.nodeType === 1 : false;
    };

    JSoop.isFunction = function (obj) {
        return toString.call(obj) === '[object Function]';
    };

    JSoop.isPrimitive = function (obj) {
        var type = typeof obj;

        return type === 'string' || type === 'number' || type === 'boolean';
    };

    JSoop.isRegExp = function (obj) {
        return toString.call(obj) === '[object RegExp]';
    };

    JSoop.instanceOf = function (obj, type) {
        if (JSoop.isString(type)) {
            type = JSoop.objectQuery(type);
        }

        return obj instanceof type;
    };

    JSoop.namespace = function (path) {
        var parts = path.split('.'),
            obj = JSoop.GLOBAL,
            i,
            length;

        for (i = 0, length = parts.length; i < length; i = i + 1) {
            if (obj[parts[i]] === undefined) {
                obj[parts[i]] = {};
            }

            obj = obj[parts[i]];
        }

        return obj;
    };

    JSoop.emptyFn = function () {};

    JSoop.log = (function () {
        var console = JSoop.GLOBAL.console;

        if (console) {
            try{
                return console.log.apply(console, arguments);
            }catch(e){
                return console.log(arguments);
            }
        }

        return JSoop.emptyFn;
    }());

    JSoop.chain = function (obj) {
        var newObj;

        EmptyClass.prototype = obj;

        newObj = new EmptyClass();

        EmptyClass.prototype = null;

        return newObj;
    };

    JSoop.GLOBAL.JSoop = JSoop;
}());

//This is needed because method.caller is not available in strict mode.
(function () {
    JSoop.error = function () {
        //BUG FIX:
        //Gecko rendering engine doesn't seem to reparse the scope. arguments fixes this. Unknown reason.
        var nArgs = arguments,
            error = nArgs[0],
            method = JSoop.error.caller;

        if (JSoop.isString(error)) {
            error = {
                level: 'error',
                msg: error,
                stack: true
            };
        }

        if (method) {
            if (method.$name) {
                error.sourceMethod = method.$name;
            }

            if (method.$owner) {
                error.sourceClass = method.$owner.$className;
            }
        }

        if (JSoop.throwErrors !== false) {
            JSoop.log(error);
        }

        throw new Error(error.msg);
    };
}());

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var ArrayProto = Array.prototype,
        JSoopArray = JSoop.util.Array = {};

    JSoopArray.toArray = function (obj) {
        if (!JSoop.isArray(obj)) {
            return [obj];
        }

        return obj;
    };

    JSoopArray.each = function (arr, fn, scope) {
        if (!scope) {
            scope = JSoop.GLOBAL;
        }

        if (!JSoop.isArray(arr)) {
            return fn.call(scope, arr, 0, [arr]);
        }

        var i, length;

        for (i = 0, length = arr.length; i < length; i = i + 1) {
            if (fn.call(scope, arr[i], i, arr) === false) {
                return false;
            }
        }

        return true;
    };

    if (ArrayProto.indexOf) {
        JSoopArray.indexOf = function (arr, searchElement, fromIndex) {
            return arr.indexOf(searchElement, fromIndex);
        };
    } else {
        //Taken from Mozilla Array.prototype.indexOf Polyfill
        JSoopArray.indexOf = function (arr, searchElement, fromIndex) {
            var k, O, len, n;

            // 1. Let O be the result of calling ToObject passing
            //    the this value as the argument.
            if (arr == null) {
                throw new TypeError('"arr" is null or not defined');
            }

            O = Object(arr);

            // 2. Let lenValue be the result of calling the Get
            //    internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            len = O.length >>> 0;

            // 4. If len is 0, return -1.
            if (len === 0) {
                return -1;
            }

            // 5. If argument fromIndex was passed let n be
            //    ToInteger(fromIndex); else let n be 0.
            n = +fromIndex || 0;

            if (Math.abs(n) === Infinity) {
                n = 0;
            }

            // 6. If n >= len, return -1.
            if (n >= len) {
                return -1;
            }

            // 7. If n >= 0, then Let k be n.
            // 8. Else, n<0, Let k be len - abs(n).
            //    If k is less than 0, then let k be 0.
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            // 9. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the
                //    HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                //    i.  Let elementK be the result of calling the Get
                //        internal method of O with the argument ToString(k).
                //   ii.  Let same be the result of applying the
                //        Strict Equality Comparison Algorithm to
                //        searchElement and elementK.
                //  iii.  If same is true, return k.
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k = k + 1;
            }

            return -1;
        };
    }

    JSoop.toArray = JSoopArray.toArray;
    JSoop.each = JSoopArray.each;
}());

(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopObject = JSoop.util.Object = {};

    JSoopObject.clone = (function () {
        var clone = function (value) {
            var obj, i, length;

            if (JSoop.isPrimitive(value)) {
                return value;
            }

            if (JSoop.isArray(value)) {
                obj = [];

                for (i = 0, length = value.length; i < length; i = i + 1) {
                    obj.push(clone(value[i]));
                }

                return obj;
            }

            if (JSoop.isObject(value)) {
                obj = {};

                for (i in value) {
                    if (value.hasOwnProperty(i)) {
                        obj[i] = clone(value[i]);
                    }
                }

                return obj;
            }

            return value;
        };

        return clone;
    }());

    JSoopObject.query = function (path, root) {
        var parts = path.split('.'),
            i,
            length;

        root = root || JSoop.GLOBAL;

        for (i = 0, length = parts.length; i < length; i = i + 1) {
            if (root[parts[i]] === undefined) {
                return undefined;
            }

            root = root[parts[i]];
        }

        return root;
    };

    JSoopObject.apply = function (target, source) {
        var key;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }

        return target;
    };

    JSoopObject.applyIf = function (target, source) {
        var key;

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                if (!target.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    JSoopObject.iterate = function (obj, fn, scope) {
        var hasConstructor = false;

        if (!JSoop.isObject(obj)) {
            return false;
        }

        var key;

        if (!scope) {
            scope = JSoop.GLOBAL;
        }

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === 'constructor') {
                    hasConstructor = true;
                }

                if (fn.call(scope, obj[key], key, obj) === false) {
                    return false;
                }
            }
        }


        //IE8 doesn't find 'constructor' as a valid key as such we need to do it manually
        if (!hasConstructor && obj.hasOwnProperty('constructor')) {
            if (fn.call(scope, obj.constructor, 'constructor', obj) === false) {
                return false;
            }
        }

        return true;
    };

    JSoop.clone = JSoopObject.clone;
    JSoop.objectQuery = JSoopObject.query;
    JSoop.apply = JSoopObject.apply;
    JSoop.applyIf = JSoopObject.applyIf;
    JSoop.iterate = JSoopObject.iterate;
}());

(function () {
    "use strict";

    JSoop.namespace('JSoop.util');

    var JSoopFunction = JSoop.util.Function = {};

    JSoopFunction.bind = function (fn, scope) {
        return function () {
            fn.apply(scope, arguments);
        };
    };

    JSoop.bind = JSoopFunction.bind;
}());

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function () {
    var Loader = function () {};

    JSoop.apply(Loader.prototype, {
        filesLoaded: {},
        paths: {},
        addPath: function (alias, path) {
            Loader.paths[alias] = path;
        },
        onFileLoaded: function (url) {
            Loader.filesLoaded[url] = true;
        },
        require: function (cls) {
            var className, fn, path, i, length;

            cls = JSoop.toArray(cls);

            for (i = 0, length = cls.length; i < length; i = i + 1) {
                className = cls[i];
                fn = JSoop.objectQuery(className);

                if (!fn) {
                    JSoop.log('Loading ' + className);

                    path = Loader.getPathFromClassName(className);
                    Loader.loadScriptFile(path, Loader.onFileLoaded, JSoop.error, true);

                    fn = JSoop.objectQuery(className);

                    if (!fn) {
                        JSoop.error('Class "' + className + '" is not defined');
                    }
                }
            }
        },
        getPathFromClassName: function (className) {
            var parts = className.split('.'),
                namespace = parts.shift();

            return Loader.paths[namespace] + parts.join('/') + '.js';
        },
        loadScriptFile: function (url, onLoad, onError, sync) {
            if (Loader.filesLoaded[url]) {
                return Loader;
            }

            Loader.loadFile(url, function (url, response) {
                eval(response);

                (onLoad || JSoop.emptyFn).call(Loader, response);
            }, onError, sync);
        },
        loadFile: function (url, onLoad, onError, sync) {
            sync = true; //force sync for now

            if (sync) {
                Loader.loadFileSync(url, onLoad, onError);
            } else {
                Loader.loadFileAsync(url, onLoad, onError);
            }
        },
        loadFileSync: function (url, onLoad, onError) {
            var isCrossOriginRestricted = false,
                scope = Loader,
                xhr, status;

            if (typeof XMLHttpRequest != 'undefined') {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }

            try {
                xhr.open('GET', url, false);
                xhr.send(null);
            } catch (e) {
                isCrossOriginRestricted = true;
            }

            onLoad = onLoad || JSoop.emptyFn;
            onError = onError || JSoop.emptyFn;

            status = (xhr.status === 1223) ? 204 :
                (xhr.status === 0 && ((self.location || {}).protocol == 'file:' || (self.location || {}).protocol == 'ionp:')) ? 200 : xhr.status;

            isCrossOriginRestricted = isCrossOriginRestricted || (status === 0);

            if (isCrossOriginRestricted) {
                onError.call(Loader, [
                    'Failed loading synchronously via XHR: "' + url + '"; It\'s likely that the file is either ',
                    'being loaded from a different domain or from the local file system whereby cross origin ',
                    'requests are not allowed due to security reasons.'
                ].join(''));
            } else if ((status >= 200 && status < 300) || (status === 304)) {
                onLoad.call(scope, url, xhr.responseText);
            } else {
                onError.call(Loader, 'Failed loading synchronously via XHR: "' + url + '"; please verify that the file exists. XHR status code: ' + status);
            }

            // Prevent potential IE memory leak
            xhr = null;
        }
    });

    Loader = JSoop.Loader = new Loader();
}());

(function () {
    "use strict";

    var Base = JSoop.Base = function () {},
        create = Object.create || function (obj) {
            var newObj;

            EmptyClass.prototype = obj;

            newObj = new EmptyClass();

            EmptyClass.prototype = null;

            return newObj;
        };

    Base.prototype = {
        $className: 'JSoop.Base',
        $class: Base,
        $isClass: true,

        constructor: function () {
            return this;
        },

        init: JSoop.emptyFn,

        addMember: function (name, member) {
            var me = this;

            if (JSoop.isFunction(member)) {
                me.prototype.addMethod.call(me, name, member);
            } else {
                me.prototype.addProperty.call(me, name, member);
            }
        },

        addMethod: function (name, method) {
            var me = this,
                prototype = me.prototype,
                parent = prototype[name];

            if (method !== JSoop.emptyFn) {
                method.$owner = me;
                method.$name = name;

                if (parent) {
                    method.$parent = parent;
                }

                method.displayName = me.$className + '::' + name;
            }

            prototype[name] = method;
        },

        addProperty: function (name, property) {
            this.prototype[name] = property;
        },

        alias: function (method, aliases) {
            var me = this,
                prototype = me.prototype;

            aliases = JSoop.toArray(aliases);

            JSoop.each(aliases, function (alias) {
                if (JSoop.isString(alias)) {
                    alias = {
                        name: alias
                    };
                }

                JSoop.applyIf(alias, {
                    root: prototype
                });

                if (JSoop.isString(alias.root)) {
                    alias.root = JSoop.objectQuery(alias.root);
                }

                alias.root[alias.name] = prototype[method];
            });
        },

        extend: function (parentClassName) {
            var parentClass = parentClassName;

            if (JSoop.isString(parentClass)) {
                parentClass = JSoop.objectQuery(parentClass);
            }

            if (!parentClass) {
                JSoop.error(parentClassName + ' is not defined');
            }

            var me = this,
                key;

            me.prototype = create(parentClass.prototype);

            me.superClass = me.prototype.superClass = parentClass;

            if (!parentClass.prototype.$isClass) {
                for (key in Base.prototype) {
                    if (Base.prototype.hasOwnProperty(key) && key !== 'constructor') {
                        me.prototype[key] = Base.prototype[key];
                    }
                }
            }

            me.prototype.$class = me;
        }
    };
}());

//This is needed because method.caller is not available in strict mode.
(function () {
    JSoop.Base.prototype.callParent = function (args) {
        var me = this,
            //BUG FIX: Gecko rendering engine doesn't seem to reparse the scope. arguments fixes this. Unknown reason.
            tmpArgs = arguments,
            method = me.callParent.caller;

        if (method !== null && !method.$owner) {
            if (!method.caller) {
                JSoop.error('Unable to locate method for callParent to execute.');
            }

            method = method.caller;
        }

        if (!method.$owner) {
            JSoop.error('Unable to resolve method for callParent. Make sure all methods are added using JSoop.define.');
        }

        if (!method.$parent) {
            JSoop.error('No parent method "' + method.$name + '" was found.');
        }

        return method.$parent.apply(this, args || []);
    }
}());

(function () {
    "use strict";

    var makeConstructor = function () {
            function constructor () {
                return this.constructor.apply(this, arguments) || null;
            }

            return constructor;
        },
        reservedKeys = {
            $class: true,
            $className: true,
            superClass: true
        },
        classCache = {},
        BP = JSoop.Base.prototype,
        ClassManager = JSoop.ClassManager = {},
        initMixin = function (mixin, args) {
            var me = this;

            if (!args) {
                args = [];
            }

            me.mixins[mixin].prototype.constructor.apply(me, args);
        };

    JSoop.apply(ClassManager, {
        set: function (className, cls) {
            classCache[className] = cls;

            var namespace = className.split('.');

            className = namespace.pop();

            if (namespace.length > 0) {
                namespace = JSoop.namespace(namespace.join('.'));
            } else {
                namespace = JSoop.GLOBAL;
            }

            namespace[className] = cls;
        },

        getInstantiator: function (length) {
            var me = this,
                args,
                i;

            me.instantiators = me.instantiators || [];

            if (!me.instantiators[length]) {
                args = [];

                for (i = 0; i < length; i = i + 1) {
                    args.push('a[' + i + ']');
                }

                me.instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ');');
            }

            return me.instantiators[length];
        },

        instantiate: function () {
            var me = this,
                args = Array.prototype.slice.call(arguments, 0),
                className = args.shift(),
                cls = className;

            if (JSoop.isString(cls)) {
                cls = classCache[className];
            }

            if (!cls) {
                cls = JSoop.objectQuery(className);

                if (cls) {
                    classCache[className] = cls;
                }
            }

            if (!cls) {
                JSoop.error('"' + className + '" is not defined');
            }

            return me.getInstantiator(args.length)(cls, args);
        },

        get: function (name) {
            var Cls = name;

            if (JSoop.isString(Cls)) {
                Cls = JSoop.objectQuery(Cls);
            } else if (name.$isClass) {
                Cls = name;
                name = Cls.prototype.$className;
            }

            if (!Cls) {
                JSoop.error(name + ' is not defined');
            }

            return Cls;
        },

        /*---------------------------------------------------------------------------------------------------*
         * Used to Create Classes
         *---------------------------------------------------------------------------------------------------*/
        preprocessors: {},
        defaultPreprocessors: [],

        postProcessors: {},
        defaultPostProcessors: [],

        create: function (className, data, onCreated) {
            if (classCache[className]) {
                JSoop.error('A class named "' + className + '" is already defined');

                return;
            }

            if (JSoop.isFunction(data)) {
                data = data();
            }

            JSoop.applyIf(data, {
                extend: 'JSoop.Base'
            });

            var Cls = makeConstructor(),
                requires;

            requires = JSoop.toArray(data.requires || []);
            requires.push(data.extend);

            JSoop.Loader.require(requires);

            delete data.requires;

            onCreated = ClassManager.createPostProcessor(className, data, onCreated);

            ClassManager.process(Cls, data, onCreated);
        },

        createPostProcessor: function (className, data, onCreated) {
            onCreated = onCreated || JSoop.emptyFn;

            return function (Cls) {
                var postProcessors = ClassManager.defaultPostProcessors,
                    length = postProcessors.length,
                    i = 0,
                    postProcessor,
                    ret;

                for (; i < length; i = i + 1) {
                    postProcessor = postProcessors[i];

                    if (JSoop.isString(postProcessor)) {
                        postProcessor = ClassManager.postProcessors[postProcessor];
                    }

                    ret = postProcessor.call(Cls, className, Cls, data);

                    if (ret !== undefined) {
                        Cls = ret;
                    }
                }

                onCreated.call(Cls, Cls);
            };
        },

        addPreprocessor: function (name, fn, pos) {
            var defaultPreprocessors = ClassManager.defaultPreprocessors;

            ClassManager.preprocessors[name] = fn;

            if (pos !== undefined) {
                defaultPreprocessors.splice(pos, 0, name);
            } else {
                defaultPreprocessors.push(name);
            }
        },

        addPostProcessor: function (name, fn, pos) {
            var defaultPostProcessors = ClassManager.defaultPostProcessors;

            ClassManager.postProcessors[name] = fn;

            if (pos !== undefined) {
                defaultPostProcessors.splice(pos, 0, name);
            } else {
                defaultPostProcessors.push(name);
            }
        },

        onBeforeCreated: function (data, hooks) {
            var me = this,
                foundConstructor = false,
                key;

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    if (key === 'constructor') {
                        foundConstructor = true;
                    }

                    BP.addMember.call(me, key, data[key]);
                }
            }

            //IE8 doesn't find 'constructor' as a valid key as such we need to do it manually
            if (!foundConstructor && data.hasOwnProperty('constructor')) {
                BP.addMember.call(me, 'constructor', data.constructor);
            }

            hooks.onCreated.call(me, me);
        },

        process: function (Cls, data, onCreated) {
            var preprocessors = data.preprocessors || ClassManager.defaultPreprocessors,
                preprocessStack = [],
                hooks = {
                    onBeforeCreated: ClassManager.onBeforeCreated
                },
                length = preprocessors.length,
                i = 0,
                preprocessor;

            delete data.preprocessors;

            for (; i < length; i = i + 1) {
                preprocessor = preprocessors[i];

                if (JSoop.isString(preprocessor)) {
                    preprocessor = ClassManager.preprocessors[preprocessor];
                }

                preprocessStack.push(preprocessor);
            }

            hooks.onCreated = onCreated || JSoop.emptyFn;
            hooks.preprocessors = preprocessStack;

            ClassManager.doProcess(Cls, data, hooks);
        },

        doProcess: function (Cls, data, hooks) {
            var preprocessors = hooks.preprocessors,
                preprocessor = preprocessors.shift();

            for (; preprocessor; preprocessor = preprocessors.shift()) {
                preprocessor(Cls, data, hooks);
            }

            hooks.onBeforeCreated.call(Cls, data, hooks);
        },

        extend: function (parent) {
            var me = this,
                parentPrototype = parent.prototype,
                prototype, basePrototype, key;

            prototype = me.prototype = JSoop.chain(parentPrototype);

            if (!prototype.$isClass) {
                basePrototype = JSoop.Base.prototype;

                for (key in basePrototype) {
                    if (basePrototype.hasOwnProperty(key)) {
                        prototype[key] = basePrototype[key];
                    }
                }
            }

            prototype.$class = me;
            prototype.superClass = parent;

            prototype.constructor = parentPrototype.constructor;

            if (parent.onExtended) {
                prototype.onExtended = parent.onExtended.slice();
            }
        },

        mixin: function (name, mixin, data, hooks) {
            var me = this,
                prototype = me.prototype,
                key, fn, mixinPrototype, mixinName;

            if (!prototype.mixins) {
                prototype.mixins = {};
            }

            if (JSoop.isString(mixin)) {
                mixinName = mixin;
                mixin = JSoop.objectQuery(mixin);

                if (!mixin) {
                    JSoop.error('Mixin "' + mixinName + '" is not defined');
                }
            }

            mixinPrototype = mixin.prototype;

            for (key in mixinPrototype) {
                if (mixinPrototype.hasOwnProperty(key) && !prototype[key] && key !== 'onMixedIn') {
                    prototype[key] = mixinPrototype[key];
                }
            }

            if (mixinPrototype.onMixedIn) {
                mixinPrototype.onMixedIn.call(me, data, hooks);
            }

            prototype.mixins[name] = mixin;
        },

        onExtended: function (fn) {
            var me = this.prototype;

            if (!me.onExtended) {
                me.onExtended = [];
            }

            me.onExtended.push(fn);
        },

        triggerExtended: function (data, hooks) {
            var me = this.prototype,
                i = 0,
                length = (me.onExtended)? me.onExtended.length : 0;

            for (; i < length; i = i + 1) {
                me.onExtended[i].call(me, data, hooks);
            }
        }
    });

    /*
     * Preprocessors
     */

    ClassManager.addPreprocessor('extend', function (Cls, data, hooks) {
        var parentClass = JSoop.ClassManager.get(data.extend);

        delete data.extend;

        ClassManager.extend.call(Cls, parentClass);

        if (data.onExtended) {
            ClassManager.onExtended.call(Cls, data.onExtended);

            delete data.onExtended;
        }

        ClassManager.triggerExtended.call(Cls, data, hooks);
    });

    ClassManager.addPreprocessor('mixin', function (Cls, data, hooks) {
        var mixins = data.mixins,
            key;

        delete data.mixins;

        if (mixins) {
            if (Cls.prototype.mixins) {
                JSoop.applyIf(mixins, Cls.prototype.mixins);
            }

            for (key in mixins) {
                if (mixins.hasOwnProperty(key)) {
                    ClassManager.mixin.call(Cls, key, mixins[key], data, hooks);
                }
            }

            Cls.prototype.initMixin = initMixin;
        }
    });

    /*
     * Post Processors
     */

    ClassManager.addPostProcessor('fnAlias', function (className, Cls, data) {
        var aliases = data.fnAlias || {},
            key;

        delete data.fnAlias;

        for (key in aliases) {
            if (aliases.hasOwnProperty(key)) {
                BP.alias.call(Cls, key, aliases[key]);
            }
        }
    });
    ClassManager.addPostProcessor('singleton', function (className, Cls, data) {
        if (data.singleton) {
            return new Cls();
        }
    });
    ClassManager.addPostProcessor('statics', function (className, Cls, data) {
        var statics = data.statics || {},
            key;

        delete data.statics;

        for (key in statics) {
            if (statics.hasOwnProperty(key)) {
                Cls[key] = statics[key];
            }
        }
    });
    ClassManager.addPostProcessor('set', function (className, Cls, data) {
        var prototype = (Cls.prototype)? Cls.prototype : Cls.$class.prototype;

        prototype.$className = className;

        ClassManager.set(className, Cls);
    });
    ClassManager.addPostProcessor('alias', function (className, Cls, data) {
        var alias = data.alias || [],
            i = 0,
            length;

        delete data.alias;

        if (!alias) {
            return;
        }

        alias = JSoop.toArray(alias);

        for (length = alias.length; i < length; i = i + 1) {
            classCache[alias[i]] = Cls;
        }
    });

    JSoop.define = function () {
        ClassManager.create.apply(ClassManager, arguments);
    };

    JSoop.create = function () {
        return ClassManager.instantiate.apply(ClassManager, arguments);
    };
}());

/*
The MIT License (MIT)

Copyright (c) 2014 Richard Cook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function () {
    "use strict";

    var eventOptions = {
            single: true,
            scope: true
        },
        JSoopEvent = function () {
            this.listeners = [];
        };

    JSoop.apply(JSoopEvent.prototype, {
        addListener: function (listener) {
            var me = this;

            listener = me.initListener(listener);

            me.listeners.push(listener);
        },

        initListener: function (listener) {
            var me = this;

            listener.callFn = listener.fn;

            if (listener.single) {
                listener.callFn = me.createSingle(listener);
            }

            if (listener.scope) {
                listener.callFn = me.createScope(listener);
            }

            return listener;
        },

        createSingle: function (listener) {
            var me = this,
                callFn = listener.callFn;

            return function () {
                var ret = callFn.apply(this, arguments);

                me.removeListener(listener.fn);

                return ret;
            };
        },

        createScope: function (listener) {
            var callFn = listener.callFn;

            return function () {
                return callFn.apply(listener.scope, arguments);
            };
        },

        removeListener: function (fn) {
            var me = this,
                i,
                length;

            for (i = 0, length = me.listeners.length; i < length; i = i + 1) {
                if (me.listeners[i].fn === fn) {
                    me.listeners.splice(i, 1);

                    return;
                }
            }
        },

        removeAllListeners: function () {
            this.listeners = [];
        },

        fire: function () {
            var me = this,
                listeners = me.listeners.slice(),
                i,
                length;

            for (i = 0, length = listeners.length; i < length; i = i + 1) {
                if (listeners[i].callFn.apply(this, arguments) === false) {
                    return false;
                }
            }
        }
    });

    JSoop.define('JSoop.mixins.Observable', {
        isObservable: true,

        fnAlias: {
            addListener: 'on',
            removeListener: ['un', 'off'],

            addManagedListener: 'mon',
            removeManagedListener: ['mun', 'moff']
        },

        constructor: function () {
            var me = this;

            if (me.listeners) {
                me.on(me.listeners);
            }
        },

        addEvents: function () {
            var me = this,
                i,
                length;

            me.events = me.events || {};

            for (i = 0, length = arguments.length; i < length; i = i + 1) {
                if (!me.events[arguments[i]]) {
                    me.events[arguments[i]] = new JSoopEvent();
                }
            }
        },

        addListener: function (ename, callback, scope, options) {
            var me = this,
                listeners = ename,
                defaultOptions = {},
                listener,
                key;

            if (!JSoop.isObject(listeners)) {
                listeners = {
                    ename: listeners,
                    fn: callback,
                    scope: scope
                };
            }

            if (listeners.ename) {
                if (options) {
                    JSoop.apply(listeners, options);
                }

                if (!me.hasEvent(listeners.ename)) {
                    me.addEvents(listeners.ename);
                }

                me.events[listeners.ename].addListener(listeners);
            } else {
                //Find the default options
                for (key in listeners) {
                    if (listeners.hasOwnProperty(key) && eventOptions.hasOwnProperty(key)) {
                        defaultOptions[key] = listeners[key];
                    }
                }

                //Add the listeners
                for (key in listeners) {
                    if (listeners.hasOwnProperty(key) && !eventOptions.hasOwnProperty(key)) {
                        listener = listeners[key];

                        if (JSoop.isObject(listener)) {
                            listener.ename = key;
                        } else if (JSoop.isFunction(listener)) {
                            listener = {
                                ename: key,
                                fn: listener
                            };
                        }

                        JSoop.applyIf(listener, defaultOptions);

                        me.addListener(listener);
                    }
                }
            }
        },
        hasEvent: function (ename) {
            return (this.events || {}).hasOwnProperty(ename);
        },
        removeListener: function (ename, fn) {
            var me = this;

            if (!me.hasEvent(ename)) {
                return;
            }

            me.events[ename].removeListener(fn);
        },
        removeAllListeners: function (ename) {
            var me = this,
                key;

            if (!ename) {
                for (key in me.events) {
                    if (me.events.hasOwnProperty(key)) {
                        me.events[key].removeAllListeners();
                    }
                }

                return;
            }

            if (!me.hasEvent(ename)) {
                return;
            }

            me.events[ename].removeAllListeners();
        },
        getNativeMethodName: function (ename) {
            var parts = ename.split(/([^a-z0-9])/i),
                name = 'on';

            JSoop.each(parts, function (part) {
                if ((/[a-z0-9]/i).test(part)) {
                    name = name + part.substr(0, 1).toUpperCase() + part.substr(1);
                }
            });

            return name;
        },
        fireEvent: function () {
            var me = this,
                args = Array.prototype.slice.call(arguments, 0),
                ename = args.shift(),
                nativeCallbackName;

            if (me.eventsSuspended) {
                return;
            }

            me.nativeCallbackCache = me.nativeCallbackCache || {};

            if (!me.nativeCallbackCache[ename]) {
                me.nativeCallbackCache[ename] = me.getNativeMethodName(ename);
            }

            nativeCallbackName = me.nativeCallbackCache[ename];

            if (me[nativeCallbackName] && JSoop.isFunction(me[nativeCallbackName])) {
                if (me[nativeCallbackName].apply(me, args) === false) {
                    return false;
                }
            }

            if (!me.hasEvent(ename)) {
                return;
            }

            return me.events[ename].fire.apply(me.events[ename], args);
        },
        addManagedListener: function (observable, ename, fn, scope, options) {
            var me = this,
                managedListeners = me.managedListeners = me.managedListeners || [];

            managedListeners.push({
                observable: observable,
                ename: ename,
                fn: fn
            });

            observable.on(ename, fn, scope, options);
        },
        removeManagedListener: function (observable, ename, fn) {
            var me = this,
                managedListeners = (me.managedListeners)? me.managedListeners.slice() : [],
                i, length;

            for (i = 0, length = managedListeners.length; i < length; i = i + 1) {
                me.removeManagedListenerItem(false, managedListeners[i], observable, ename, fn);
            }
        },
        removeManagedListenerItem: function (clear, listener, observable, ename, fn) {
            var me = this,
                managedListeners = me.managedListeners || [];

            if (clear || (listener.observable === observable && (!ename || listener.ename === ename) && (!fn || listener.fn === fn))) {
                listener.observable.un(listener.ename, listener.fn);

                managedListeners.splice(JSoop.util.Array.indexOf(managedListeners, listener), 1);
            }
        },

        removeAllManagedListeners: function () {
            var me = this,
                managedListeners = me.managedListeners ? me.managedListeners.slice() : [],
                i, length;

            for (i = 0, length = managedListeners.length; i < length; i = i + 1) {
                me.removeManagedListenerItem(true, managedListeners[i]);
            }
        },

        suspendEvents: function () {
            var me = this;

            me.eventsSuspended = true;
        },

        resumeEvents: function () {
            var me = this;

            me.eventsSuspended = false;
        }
    });
}());

(function () {
    "use strict";

    JSoop.define('JSoop.mixins.Configurable', {
        isConfigurable: true,

        constructor: function (config) {
            var me = this;

            me.initConfig(config || {});
            me.checkRequired();
        },

        initConfig: function (config) {
            var me = this,
                protoConfig = me.config || {},
                defaults = protoConfig.defaults || {},
                currentProto = me.$class.prototype;

            if (!config) {
                config = {};
            }

            me.originalConfig = config;

            //todo: this needs to be cached for performance reasons
            while (defaults) {
                JSoop.applyIf(config || {}, JSoop.clone(defaults));

                if (currentProto.superClass) {
                    currentProto = currentProto.superClass.prototype;

                    if (currentProto.config) {
                        defaults = currentProto.config.defaults;
                    } else {
                        defaults = false;
                    }
                } else {
                    defaults = false;
                }
            }

            JSoop.apply(me, config);
        },

        checkRequired: function () {
            var me = this,
                protoConfig = me.config || {},
                required = protoConfig.required || [],
                missing = [];

            //todo: this needs to climb the prototype chain to find inherited required config
            JSoop.each(required, function (key) {
                if (me[key] === undefined) {
                    missing.push(key);
                }
            });

            if (missing.length > 0) {
                JSoop.error(me.$className + ' missing required config keys "' + missing.join(', ') + '"');
            }
        }
    });
}());

(function () {
    "use strict";

    JSoop.define('JSoop.mixins.PluginManager', {
        isPluginManager: true,

        constructor: function () {
            var me = this,
                plugins = me.plugins || {};

            me.plugins = {};

            JSoop.iterate(plugins, function (plugin, key) {
                if (JSoop.isString(plugin)) {
                    plugin = {
                        type: plugin
                    };
                } else {
                    plugin = JSoop.clone(plugin);
                }

                plugin.owner = me;

                me.plugins[key] = JSoop.create(plugin.type, plugin);
            });
        },

        destroyPlugins: function () {
            var me = this;

            JSoop.iterate(me.plugins, function (plugin, key) {
                if (plugin.destroy) {
                    plugin.destroy();
                }
            });

            me.plugins = {};
        }
    });
}());

