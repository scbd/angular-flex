(function(ng) { 'use strict';

    if(!ng)             throw 'angular not loaded/defined';
    if(ng.defineModule) return;
    if(define)          define(ng);

    var ng_module = ng.module.bind(ng);

    //============================================================
    //
    //
    //============================================================
    ng.module = function(moduleName, deps) {

        if(deps===undefined)
            return ng_module(moduleName);

        var module = null;

        try
        {
            module = ng_module(moduleName);
        }
        catch(e)
        {
            module = ng_module(moduleName, deps);

            (function(module) {

                module.config(['$controllerProvider', '$compileProvider', '$provide', '$filterProvider',
                       function($controllerProvider,   $compileProvider,   $provide,   $filterProvider) {

                        // Allow dynamic registration

                        module.filter     = warnDuplicate('filter',     wrap($filterProvider, $filterProvider.register, module));
                        module.provider   = warnDuplicate('provider',   wrap($provide, $provide.provider, module));
                        module.factory    = warnDuplicate('factory',    wrap($provide, $provide.factory, module));
                        module.value      = warnDuplicate('value',      wrap($provide, $provide.value, module));
                        module.controller = warnDuplicate('controller', wrap($controllerProvider, $controllerProvider.register, module));
                        module.directive  = warnDuplicate('directive',  wrap($compileProvider, $compileProvider.directive, module));
                    }
                ]);

            })(module);
        }

        return module;
    };

    //============================================================
    //
    //
    //============================================================
    ng.defineModule = function(moduleName) {

		try
		{
			return ng.module(moduleName);
		}
		catch(e)
		{
			return ng.module(moduleName, []);
		}
	};

    //============================================================
    //
    //
    //============================================================
    ng.defineModules = function(modules) {

        for(var i=0; i<modules.length; ++i)
            ng.defineModule(modules[i]);
	};

    //============================================================
    //
    //
    //============================================================
    function wrap(_this, handlerFn, module)
    {
        return function()
        {
            handlerFn.apply(_this, Array.prototype.slice.call(arguments));

            return module;
        };
    }

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    var NoDuplicateStores = {};

    function warnDuplicate(store, handlerFn)
    {
        NoDuplicateStores[store] = {};

        return function(name)
        {
            if(NoDuplicateStores[store][name]!==undefined) {

                console.warn('Duplicate:', store, name);

                return NoDuplicateStores[store][name];
            }

            NoDuplicateStores[store][name] = handlerFn.apply(null, Array.prototype.slice.call(arguments));

            return NoDuplicateStores[store][name];
        };
    }

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////


})(window.angular);
