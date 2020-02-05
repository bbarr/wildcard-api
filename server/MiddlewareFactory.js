const assert = require('@brillout/assert');
const autoLoadEndpointFiles = require('./autoLoadEndpointFiles');
const wilcardApi_ = require('@wildcard-api/server');

module.exports = MiddlewareFactory;

function MiddlewareFactory(ServerAdapter, opts) {
  return (
    (wrappersOrContextGetter, {__INTERNAL__wildcardApiHolder}={}) => {
      let { contextGetter, responseHandler } = typeof wrappersOrContextGetter === 'function' ?
        { contextGetter: wrappersOrContextGetter } :
        wrappersOrContextGetter
      return (
        ServerAdapter(
          [ async (requestObject, {requestProps}) => {
            const wildcardApi = __INTERNAL__wildcardApiHolder ? __INTERNAL__wildcardApiHolder.wildcardApi : wilcardApi_;
            if( !__INTERNAL__wildcardApiHolder && Object.keys(wildcardApi.endpoints).length===0 ){
              autoLoadEndpointFiles();
            }
            /*
            assert.usage(
              contextGetter,
              'You need to pass a context getter to the Wildcard middleware.',
            );
            */
            let context;
            if( contextGetter ){
              context = await contextGetter(requestObject);
              assert.usage(
                context,
                'Your context getter should return an object but it returns `'+context+'`.',
              );
              assert.usage(
                context instanceof Object,
                {context},
                'Your context getter should return an object but it returns `context.constructor==='+context.constructor.name+'`.',
              );
            }
            const responseProps = await wildcardApi.getApiHttpResponse(requestProps, context);
            let responseHandlerValue
            if( responseHandler ){
              responseHandlerValue = await responseHandler(responseProps)
              assert.usage(
                typeof responseHandlerValue === 'undefined',
                'Your response handler should not return anything'
              );
            }
            return responseProps;
          } ],
          opts,
        )
      );
    }
  );
}
