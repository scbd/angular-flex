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

                        module.filter     = warnDuplicate('filter',     $filterProvider.register);
                        module.provider   = warnDuplicate('provider',   $provide.provider);
                        module.factory    = warnDuplicate('factory',    $provide.factory);
                        module.value      = warnDuplicate('value',      $provide.value);
                        module.controller = warnDuplicate('controller', $controllerProvider.register);
                        module.directive  = warnDuplicate('directive',  $compileProvider.directive);

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
            console.log("Predefine module", moduleName);

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


    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    var NoDuplicateStores = {};

    function warnDuplicate(store, handlerFn)
    {
        NoDuplicateStores[store] = {};

        return function(name, a, b, c, d, e, f, g, h, i, j)
        {
            if(NoDuplicateStores[store][name]!==undefined) {

                console.warn('Duplicate:', store, name);

                return NoDuplicateStores[store][name];
            }

            NoDuplicateStores[store][name] = handlerFn(name, a, b, c, d, e, f, g, h, i, j) || null;

            return NoDuplicateStores[store][name];
        };
    }

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////


})(window.angular);
