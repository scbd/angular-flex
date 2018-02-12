(function(ng) { //'use strict';

    if(!ng) { try { ng = require('angular'); } catch(e) {} }
    if(!ng)   throw 'angular not loaded/defined';

    if(define)  define([], function() { return ng; });
    else module.exports = ng;

    if(ng.defineModule) return;

    var ng_module = ng.module.bind(ng);
    var ng_bootstrap = ng.bootstrap.bind(ng);
    var ng_$injector;

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

                module.run = run_wrapper(module.run);

            })(module);
        }

        return module;
    };

    //============================================================
    //
    //
    //============================================================
    ng.bootstrap = function(target, modules) {
        
        ng.module(modules[0]).run(['$injector', function($injector) { 
            ng_$injector = $injector; 
        }]);
        
        ng_bootstrap(target, modules);
    }

    //============================================================
    //
    //
    //============================================================
    function run_wrapper(runner) {
        
        return function(fn) {
            
            if(ng_$injector)  {
                ng_$injector.invoke(fn);
                return this; 
            }
            
            return runner.call(this, fn);
        }
    }

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

        return modules;
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

    return ng;

})(window && window.angular);
