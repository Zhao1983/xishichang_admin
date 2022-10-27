import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const constantRoutes = [
    // 로그인페지
    {
        path: '/login',
        component: () =>
            import('@/views/login/index'),
        hidden: true
    },
    // 404페지
    {
        path: '/404',
        component: () =>
            import('@/views/404'),
        hidden: true
    },
    //
    {
        path: '*',
        redirect: '/404',
        hidden: true
    },
    // 첫페지
    {
        path: '/',
        component: Layout,
        redirect: '/welcome',
        children: [{
            path: 'welcome',
            name: 'Welcome',
            component: () =>
                import('@/views/welcome/index'),
            meta: {
                title: '欢迎',
                affix: true
            },
            hidden: true
        }]
    },
    // 통계관리
    {
        path: '/statistics',
        component: Layout,
        redirect: '/statistics/statistics',
        name: 'Statistics',
        alwaysShow: true,
        meta: {
            title: '统计管理',
            icon: 'dashboard'
        },
        children: [{
            'path': 'statistics',
            component: () => import('@/views/statistics/statistics'),
            name: 'statistics',
            meta: {
                title: '统计',
                icon: 'example'
            }
        },
        {
            'path': 'search_statistics',
            component: () => import('@/views/statistics/search_statistics'),
            name: 'search_statistics',
            meta: {
                title: '关键字统计',
                icon: 'example'
            }
        },
        {
            'path': 'deliverytime_statistics',
            component: () => import('@/views/statistics/deliverytime_statistics'),
            name: 'deliverytime_statistics',
            meta: {
                title: '时效统计',
                icon: 'example'
            }
        },
        {
            'path': 'province_statistics',
            component: () =>
                import('@/views/statistics/province_statistics'),
            name: 'province_statistics',
            meta: {
                title: '地区统计',
                icon: 'example'
            }
        }
        ]
    },
    // 회원관리
    {
        path: '/member',
        component: Layout,
        redirect: '/member_list',
        children: [{
            path: 'member_list',
            name: 'member_list',
            component: () =>
                import('@/views/member/member_list'),
            meta: {
                title: '会员管理',
                icon: 'user'
            }
        }]
    },
    // 상품관리
    {
        path: '/product',
        component: Layout,
        redirect: '/product/product_list',
        name: 'Product',
        alwaysShow: true,
        meta: {
            title: '商品管理',
            icon: 'theme'
        },
        children: [{
            'path': 'product_list',
            component: () =>
                import('@/views/product/product_list'),
            name: 'product_list',
            meta: {
                title: '商品列表',
                icon: 'example'
            }
        },
        {
            'path': 'product_register',
            component: () =>
                import('@/views/product/product_register'),
            name: 'product_register',
            meta: {
                title: '新增商品',
                icon: 'example'
            }
        },
        {
            'path': 'product_detail/:id',
            component: () =>
                import('@/views/product/product_detail'),
            name: 'product_detail',
            meta: {
                title: '商品详情',
                noCache: true,
                activeMenu: '/product/product_list'
            },
            hidden: true
        },
        {
            'path': 'batch_product_detail',
            component: () =>
                import('@/views/product/batch_product_detail'),
            name: 'batch_product_detail',
            meta: {
                title: '批量编辑',
                noCache: true,
                activeMenu: '/product/product_list'
            },
            hidden: true
        }
        ]
    },
    // 점포관리
    {
        path: '/shop',
        component: Layout,
        redirect: '/shop/shop_list',
        name: 'Shop',
        alwaysShow: true,
        meta: {
            title: '商户管理',
            icon: 'component'
        },
        children: [{
            'path': 'shop_list',
            component: () =>
                import('@/views/shop/shop_list'),
            name: 'shop_list',
            meta: {
                title: '商户列表',
                icon: 'example'
            }
        },
        {
            'path': 'shop_register',
            component: () =>
                import('@/views/shop/shop_register'),
            name: 'shop_register',
            meta: {
                title: '新增商户',
                icon: 'example'
            }
        },
        {
            'path': 'shop_detail/:id',
            component: () =>
                import('@/views/shop/shop_detail'),
            name: 'shop_detail',
            meta: {
                title: '商户详情',
                noCache: true,
                activeMenu: '/shop/shop_list'
            },
            hidden: true
        },
        {
            'path': 'batch_shop/:id',
            component: () =>
                import('@/views/shop/batch_shop'),
            name: 'batch_shop',
            meta: {
                title: '商户批量编辑',
                noCache: true,
                activeMenu: '/shop/shop_list'
            },
            hidden: true
        },
        {
            'path': 'batch_shop_detail/:id/:subid',
            component: () =>
                import('@/views/shop/batch_shop_detail'),
            name: 'batch_shop_detail',
            meta: {
                title: '商品批量编辑',
                noCache: true,
                activeMenu: '/shop/shop_list'
            },
            hidden: true
        },
        {
            'path': 'batch_shop_product/:id',
            component: () =>
                import('@/views/shop/batch_shop_product'),
            name: 'batch_shop_product',
            meta: {
                title: '新增商品',
                noCache: true,
                activeMenu: '/shop/shop_list'
            },
            hidden: true
        }
        ]
    },
    // 분류관리
    {
        path: '/category',
        component: Layout,
        redirect: '/category_list',
        children: [{
            path: 'category_list',
            name: 'category_list',
            component: () =>
                import('@/views/category/category_list'),
            meta: {
                title: '分类列表',
                icon: 'tree-table'
            }
        },
        {
            'path': 'category_detail/:id/:subid',
            component: () =>
                import('@/views/category/category_detail'),
            name: 'category_detail',
            meta: {
                title: '分类详情',
                noCache: true,
                activeMenu: '/category/category_list'
            },
            hidden: true
        }
        ]
    },
    // 결산관리
    {
        path: '/settlement',
        component: Layout,
        redirect: '/settlement_list',
        children: [{
            path: 'settlement_list',
            name: 'settlement_list',
            component: () =>
                import('@/views/settlement/settlement_list'),
            meta: {
                title: '结算管理',
                icon: 'table'
            }
        }]
    },
    // 광고관리
    {
        path: '/advert',
        component: Layout,
        redirect: '/advert/advert_list',
        name: 'Advert',
        alwaysShow: true,
        meta: {
            title: '广告管理',
            icon: 'star'
        },
        children: [{
            'path': 'advert_list',
            component: () =>
                import('@/views/advert/advert_list'),
            name: 'advert_list',
            meta: {
                title: '广告列表',
                icon: 'example'
            }
        },
        {
            'path': 'advert_register',
            component: () =>
                import('@/views/advert/advert_register'),
            name: 'advert_register',
            meta: {
                title: '新增广告',
                icon: 'example'
            }
        },
        {
            'path': 'advert_detail/:id',
            component: () =>
                import('@/views/advert/advert_detail'),
            name: 'advert_detail',
            meta: {
                title: '广告详情',
                noCache: true,
                activeMenu: '/advert/advert_list'
            },
            hidden: true
        }
        ]
    },
    // 주문관리
    {
        path: '/order',
        component: Layout,
        redirect: '/order/order_list',
        name: 'Order',
        alwaysShow: true,
        meta: {
            title: '订单管理',
            icon: 'documentation'
        },
        children: [{
            'path': 'order_list',
            component: () =>
                import('@/views/order/order_list'),
            name: 'order_list',
            meta: {
                title: '订单列表',
                icon: 'example'
            }
        },
        {
            'path': 'order_pay',
            component: () =>
                import('@/views/order/order_pay'),
            name: 'order_pay',
            meta: {
                title: '发货监控',
                icon: 'example'
            }
        },
        {
            'path': 'order_warning',
            component: () => import('@/views/order/order_warning'),
            name: 'order_warning',
            meta: {
                title: '异常快递',
                icon: 'example'
            }
        },
        {
            'path': 'duty_status',
            component: () => import('@/views/duty/duty_status'),
            name: 'duty_status',
            meta: {
                title: '值班人员',
                icon: 'example'
            }
        },
        {
            'path': 'order_detail/:id',
            component: () =>
                import('@/views/order/order_detail'),
            name: 'order_detail',
            meta: {
                title: '订单详情',
                noCache: true,
                activeMenu: '/order/order_list'
            },
            hidden: true
        }
        ]
    },
    // 이벤트관리
    {
        path: '/event',
        component: Layout,
        redirect: '/event/event_list',
        name: 'Event',
        alwaysShow: true,
        meta: {
            title: '活动管理',
            icon: 'guide'
        },
        children: [{
            'path': 'event_list',
            component: () =>
                import('@/views/event/event_list'),
            name: 'event_list',
            meta: {
                title: '活动列表',
                icon: 'example'
            }
        },
        {
            'path': 'event_register',
            component: () =>
                import('@/views/event/event_register'),
            name: 'event_register',
            meta: {
                title: '新增活动',
                icon: 'example'
            }
        },
        {
            'path': 'event_detail/:id',
            component: () =>
                import('@/views/event/event_detail'),
            name: 'event_detail',
            meta: {
                title: '活动详情',
                noCache: true,
                activeMenu: '/event/event_list'
            },
            hidden: true
        },
        {
            'path': 'event_product/:id',
            component: () =>
                import('@/views/event/event_product'),
            name: 'event_product',
            meta: {
                title: '活动商品',
                noCache: true,
                activeMenu: '/event/event_list'
            },
            hidden: true
        }
        ]
    },
    //주제관리
    {
        path: '/topic',
        component: Layout,
        redirect: '/topic/topic_list',
        name: 'Topic',
        alwaysShow: true,
        meta: {
            title: '专题管理',
            icon: 'excel'
        },
        children: [{
            'path': 'topic_list',
            component: () =>
                import('@/views/topic/topic_list'),
            name: 'topic_list',
            meta: {
                title: '专题列表',
                icon: 'example'
            }
        },
        {
            'path': 'topic_register',
            component: () =>
                import('@/views/topic/topic_register'),
            name: 'topic_register',
            meta: {
                title: '新增专题',
                icon: 'example'
            }
        },
        {
            'path': 'topic_detail/:id',
            component: () =>
                import('@/views/topic/topic_detail'),
            name: 'topic_detail',
            meta: {
                title: '专题详情',
                noCache: true,
                activeMenu: '/topic/topic_list'
            },
            hidden: true
        }
        ]
    },
    //배송관리
    {
        path: '/shipping',
        component: Layout,
        redirect: '/shipping/shipping_detail',
        children: [{
            path: 'shipping_detail',
            name: 'shipping_detail',
            component: () =>
                import('@/views/shipping/shipping_detail'),
            meta: {
                title: '配送管理',
                icon: 'shopping'
            }
        },
        {
            'path': 'company_update',
            component: () =>
                import('@/views/shipping/company_update'),
            name: 'company_update',
            meta: {
                title: '配送管理',
                noCache: true,
                activeMenu: '/shipping/shipping_detail'
            },
            hidden: true
        },
        {
            'path': 'company_add',
            component: () =>
                import('@/views/shipping/company_add'),
            name: 'company_add',
            meta: {
                title: '配送管理',
                noCache: true,
                activeMenu: '/shipping/shipping_detail'
            },
            hidden: true
        },
        {
            'path': 'running_setting',
            component: () =>
                import('@/views/shipping/running_setting'),
            name: 'running_setting',
            meta: {
                title: '配送管理',
                noCache: true,
                activeMenu: '/shipping/shipping_detail'
            },
            hidden: true
        }
        ]
    },
    //설정
    {
        path: '/setting',
        component: Layout,
        redirect: '/setting',
        children: [{
            path: 'setting',
            name: 'setting',
            component: () =>
                import('@/views/setting/setting'),
            meta: {
                title: '商城设置',
                icon: 'form'
            }
        }]
    },
    // 권한설정
    {
        path: '/permission',
        component: Layout,
        redirect: '/admin_permission',
        children: [{
            path: 'admin_permission',
            name: 'admin_permission',
            component: () =>
                import('@/views/permission/admin_permission'),
            meta: {
                title: '工作人员',
                icon: 'lock'
            }
        }]
    },
    // 시스템로그
    {
        path: '/syslog',
        component: Layout,
        redirect: '/syslog',
        children: [{
            path: 'syslog',
            name: 'syslog',
            component: () =>
                import('@/views/syslog/syslog'),
            meta: {
                title: '系统日志',
                icon: 'icon'
            }
        }]
    },
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router