import { RouterView, createRouter, createWebHistory } from "vue-router/dist/vue-router";
import { h } from 'vue'
import { useUserStore } from "./utils/userStore";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', name: 'Login', component: () => import('./components/Login.vue') },
        { path: '/register', component: () => import('./components/Register.vue') },
        { path: '/forgetPassword', component: () => import('./components/ForgetPassword.vue') },
        { path: '/home', component: () => import('./components/home.vue') },
        { path: '/videoPlay', component: () => import('./components/subcomponents/VideoPlay.vue') },
        { path: '/history', component: () => import('./components/PersonalCenter/subcomponents/History.vue') },
        { path: '/videoUpload', component: () => import('./components/subcomponents/VideoUpload.vue') },
        {
            path: '/index', name: 'index', component: () => import('./components/Index.vue'), redirect: '/index/videoList', children: [
                {
                    path: 'videoList',
                    component: { render: () => h(RouterView) },
                    children: [{
                        path: '',
                        component: () => import('./components/subcomponents/VideoList.vue')
                    }]
                },
                {
                    path: 'recommend',
                    component: { render: () => h(RouterView) },
                    children: [
                        {
                            path: '',
                            component: () => import('./components/subcomponents/Recommend.vue')
                        }
                    ]
                },
                {
                    path: `search/:searchText?`,
                    component: { render: () => h(RouterView) },
                    children: [
                        {
                            path: '',
                            component: () => import('./components/subcomponents/Search.vue')
                        }
                    ]
                },
                {
                    path: 'memberZone',
                    component: { render: () => h(RouterView) },
                    children: [{
                        path: '',
                        component: () => import('./components/subcomponents/MemberZone.vue')
                    }]
                },
                {
                    path: 'freeZone',
                    component: { render: () => h(RouterView) },
                    children: [{
                        path: '',
                        component: () => import('./components/subcomponents/FreeZone.vue')
                    }]
                },

            ]
        },
        {
            path: '/personalCenterIndex', name: 'personalCenterIndex', component: () => import('./components/PersonalCenter/PersonalCenterIndex.vue'),
            meta: { requireAuth: true, requiredRoles: ['ROLE_USER', 'ROLE_VIP', 'ROLE_ADMIN'] },
            redirect: '/personalCenterIndex/basicInformation', children: [
                {
                    path: 'basicInformation',
                    component: { render: () => h(RouterView) },
                    children: [
                        {
                            path: '',
                            component: () => import('./components/PersonalCenter/subcomponents/BasicInformation.vue')
                        }
                    ]
                },
                {
                    path: 'infoEditor',
                    component: { render: () => h(RouterView) },
                    children: [
                        {
                            path: '',
                            component: () => import('./components/PersonalCenter/subcomponents/InfoEditor.vue')
                        }
                    ]
                },
                {
                    path: 'securityCenter',
                    component: { render: () => h(RouterView) },
                    children: [
                        {
                            path: '',
                            component: () => import('./components/PersonalCenter/subcomponents/SecurityCenter.vue')
                        }
                    ]
                },
                {
                    path: 'uploadRecord',
                    component: { render: () => h(RouterView) },
                    children: [
                        {
                            path: '',
                            component: () => import('./components/PersonalCenter/subcomponents/UploadRecord.vue')
                        }
                    ]
                },
                {
                    path: 'history',
                    component: { render: () => h(RouterView) },
                    children: [
                        {
                            path: '',
                            component: () => import('./components/PersonalCenter/subcomponents/History.vue')
                        }
                    ]
                }
            ]
        },


        {
            path: '/admin', name: 'Admin', component: () => import('./components/Admin/Index.vue'), meta: { requireAuth: true, requiredRoles: ['ROLE_ADMIN'] }, redirect: '/Admin/User',
            children: [
                {
                    path: 'User', name: 'User',
                    component: { render: () => h(RouterView) },
                    component: () => import('./components/Admin/SubComponents/User.vue')
                },
                {
                    path: 'AddUser', name: 'AddUser',
                    component: { render: () => h(RouterView) },
                    component: () => import('./components/Admin/SubComponents/AddUser.vue')
                },
                {
                    path: 'Video', name: 'Video',
                    component: { render: () => h(RouterView) },
                    component: () => import('./components/Admin/SubComponents/Video.vue')
                },
                {
                    path: 'Check', name: 'Check',
                    component: { render: () => h(RouterView) },
                    component: () => import('./components/Admin/SubComponents/Check.vue')
                },

                {
                    path: 'Security', name: 'Security',
                    component: { render: () => h(RouterView) },
                    component: () => import('./components/Admin/SubComponents/Security.vue')
                },

            ]
        }

    ]
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    userStore.restoreState();
    const isLoggedIn = userStore.isLoggedIn
    const requiredRoles = to.meta.requiredRoles || []

    if (to.meta.requireAuth && !isLoggedIn) {
        next({ name: 'Login' })
    } else if (requiredRoles.length > 0 && !requiredRoles.some(role => userStore.roles.includes(role))) {
        next({ name: 'index' })
    } else {
        next()
    }


    // if (to.path === ('/') || to.path === ('/login') || to.path === ('/register') || to.path === ('/forgetPassword') || to.path === ('/index') || to.path == ("/home")) {
    //     return next()
    // }

    // next()
})
export default router