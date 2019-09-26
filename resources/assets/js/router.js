// Dependencies
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

function lazyLoad(view){
    return() => import(`./views/${view}.vue`)
}

const routes = [
    {
        path: '/',
        name: 'home',
        component: lazyLoad('Home')
    },
    {
        path: '/login',
        name: 'login',
        component: lazyLoad('Login')
    },
    {
        path: '/register',
        name: 'register',
        component: lazyLoad('Register')
    },
    {
        path: '/products/:id',
        name: 'single-products',
        component: lazyLoad('SingleProduct')
    },
    {
        path: '/confirmation',
        name: 'confirmation',
        component: lazyLoad('Confirmation')
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: lazyLoad('Checkout'),
        props: (route) => ({pid : route.query.pid})
    },
    {
        path: '/dashboard',
        name: 'userboard',
        component: lazyLoad('UserBoard'),
        meta: {
            requiresAuth: true,
            is_user : true
        }
    },
    {
        path: '/admin/:page',
        name: 'admin-pages',
        component: lazyLoad('Admin'),
        meta: {
            requiresAuth: true,
            is_admin : true
        }
    },
    {
        path: '/admin',
        name: 'admin',
        component: lazyLoad('Admin'),
        meta: {
            requiresAuth: true,
            is_admin : true
        }
    },
];

const router = new VueRouter({
    mode: 'history',
    routes
});

/*
    We use beforeEach to check the routes that require authentication before you can access them.
    For those routes, we check if the user is authenticated.
    If the user isn’t, we send them to the login page.
    If the user is authenticated, we check if the route is restricted to admin users or regular users.
    We redirect each user to the right place based on which access level they have.
*/
router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            let user = JSON.parse(localStorage.getItem('user'))
            if(to.matched.some(record => record.meta.is_admin)) {
                if(user.is_admin == 1){
                    next()
                }
                else{
                    next({ name: 'userboard'})
                }
            }
            else if(to.matched.some(record => record.meta.is_user)) {
                if(user.is_admin == 0){
                    next()
                }
                else{
                    next({ name: 'admin'})
                }
            }
            next()
        }
    } else {
        next()
    }
});

export default router;
