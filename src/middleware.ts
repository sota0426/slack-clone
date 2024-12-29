import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
  } from "@convex-dev/auth/nextjs/server";
   
   
  export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {

    const isAuthenticated = await convexAuth.isAuthenticated();
    const isPublicPage = createRouteMatcher(["/auth"])
  
    if( !isPublicPage(request) && !isAuthenticated){
        return nextjsMiddlewareRedirect(request,"/auth");
    }

    if (isPublicPage(request) && isAuthenticated ){
        return nextjsMiddlewareRedirect(request,"/");
    }

});
    
  export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  };