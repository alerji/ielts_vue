import Vue from 'vue'
import Router from 'vue-router'
import axios from "axios";
import OrderList from "../views/orders/OrderList";
import OrderInfo from "../views/orders/OrderInfo";
import Redirect from "../views/redirect/Redirect";
import Sources from "@/views/products/Sources.vue";
import AddOrder from "@/views/orders/AddOrder";
import CustomerList from "@/views/users/CustomerList.vue";
import CustomerDetail from "@/views/users/CustomerDetail.vue";
// axios.defaults.headers.post['Authorization'] = localStorage.getItem('token');
// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard');
const CategoryList = () => import('@/views/category/CategoryList');
const PermissionGroup = () => import('@/views/permissions/PermissionGroups');
const AdminList = () => import('@/views/users/AdminList');
const UserList = () => import('@/views/users/UserList');
const AddUser = () => import('@/views/users/AddUser');
const EditUser = () => import('@/views/users/EditUser');
const UserProfile = () => import('@/views/users/UserProfile');

const Sliders = () => import('@/views/slider/Sliders');
const SliderImages = () => import('@/views/slider/SliderImages');

const Menus = () => import('@/views/menus/Menus');
const SectionList = () => import('@/views/display/home/SectionList');
const SectionRows = () => import('@/views/display/home/SectionRows');


const AddNews = () => import('@/views/news/AddNews');

const MyNews = () => import('@/views/news/MyNews');

const TagsList = () => import('@/views/tags/TagsList');
const KeywordsList = () => import('@/views/keywords/KeywordsList');

const CommentsList = () => import('@/views/comments/CommentsList');

//Products
const AddProduct = () => import('@/views/products/AddProduct');
const ProductTagsList = () => import('@/views/products/ProductTagsList');
const ProductKeywordsList = () => import('@/views/products/ProductKeywordsList');

const ProductCommentsList = () => import('@/views/products/ProductCommentsList');
const ProductList = () => import('@/views/products/ProductList');
const ProductCategoryList = () => import('@/views/products/ProductCategoryList');

const ProductPropertyTemplateList = () => import('@/views/products/properties/ProductPropertyTemplateList');
const ProductPropertyTemplateGroupList = () => import('@/views/products/properties/ProductPropertyTemplateGroupList');
const ProductPropertyTemplateGroupItemList = () => import('@/views/products/properties/ProductPropertyTemplateGroupItemsList');

const CategoryPropertyList = () => import('@/views/products/category_property/CategoryPropertyList');
const CategoryPropertyValues = () => import('@/views/products/category_property/CategoryPropertyValues');
const AddPropertyToCategory = () => import('@/views/products/category_property/AddPropertyToCategory');


// Views - Notifications
const Settings = () => import('@/views/pages/Settings');

// Views - Pages
const Page404 = () => import('@/views/pages/Page404');
const Page500 = () => import('@/views/pages/Page500');
const Login = () => import('@/views/pages/Login');
const Register = () => import('@/views/pages/Register');

// Users
const EditNews = () => import('@/views/news/AddNews');
const NewsList = () => import('@/views/news/NewsList');

Vue.use(Router);

let router = new Router({
    mode: 'history', // https://router.vuejs.org/api/#mode
    linkActiveClass: 'active',
    scrollBehavior: () => ({y: 0}),
    routes: configRoutes(),

});
export default router

router.beforeEach((to, from, next) => {
    console.log("before each" + " token is " + localStorage.getItem('token'));
    // console.log("before each"+next);
    if (to.path == '/') {
        //  window.location.href = '/home';
    }


    if (to.matched.some(record => record.meta.requiresAuth)) {
        console.log("validate requiresAuth");

        if (localStorage.getItem('token') == null || localStorage.getItem('token') == '') {
            console.log("validate is null");

            next({
                path: 'dashboard/login',
                params: {nextUrl: to.fullPath}
            })
        } else {
             validate_user(next, to);


            // let user = JSON.parse(localStorage.getItem('user'))
            // if(to.matched.some(record => record.meta.is_admin)) {
            //     if(user.is_admin == 1){
            //         next()
            //     }
            //     else{
            //         next({ name: 'userboard'})
            //     }
            // }else {
            //     next()
            // }
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        // if(localStorage.getItem('jwt') == null){
        next()
        // }
        // else{
        //     next({ name: 'userboard'})
        // }
    } else {
        next()
    }
});

function configRoutes() {
    return [
        {
            path: '/',
            redirect: '/dashboard',

            name: 'پنل مدیریت',
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/dashboard',
            // redirect: '/dashboard',
            name: 'خانه',
            meta: {
                requiresAuth: true
            },
            component: TheContainer,
            children: [
                {
                    path: 'dashboard',
                    name: 'پنل مدیریت',
                    component: Dashboard,
                    meta: {
                        requiresAuth: true,
                    }
                },

                {
                    path: 'users',
                    name: 'کاربران',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                        requiresRole: "edit_admins"
                    },
                    children:[
                        {
                            path: 'permission-groups',
                            name: 'گروه های دسترسی',
                            props: true,
                            component: PermissionGroup,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_admins"
                            }
                        },
                        {
                            path: 'admins',
                            name: 'مدیران',
                            props: true,
                            component: AdminList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_admins"
                            }
                        }, {
                            path: 'admins',
                            name: 'کاربران',
                            props: true,
                            component: UserList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_admins"
                            }
                        }, {
                            path: 'customers',
                            name: 'مشتریان',
                            props: true,
                            component: CustomerList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_admins"
                            }
                        }, {
                            path: 'user-detail/:id',
                            name: 'اطلاعات مشتری',
                            props: true,
                            component: CustomerDetail,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_admins"
                            }
                        }, {
                            path: 'add-user',
                            name: 'افزودن کاربر',
                            props: true,
                            component: AddUser,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_users"
                            }
                        }, {
                            path: 'edit-user/:user_id',
                            name: 'ویرایش کاربر',
                            props: true,
                            component: EditUser,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_users"
                            }
                        },
                        {
                            path: 'profile',
                            name: 'پروفایل',
                            props: true,
                            component: UserProfile,
                            meta: {
                                requiresAuth: true,

                            }
                        },
                    ]
                },

                //*************************************************
                {
                    path: 'products',
                    name: 'محصولات',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                        requiresRole: "insert_product"
                    },
                    children:[
                        {
                            path: 'list',
                            name: 'لیست محصولات',
                            props: true,
                            component: ProductList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_product"
                            }
                        },{
                            path: 'list/:cat_id',
                            name: 'لیست محصولات',
                            props: true,
                            component: ProductList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_product"
                            }
                        },
                        {
                            path: 'sources/:id',
                            name: 'منابع',
                            props: true,
                            component: Sources,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_product"
                            }
                        },
                        {
                            path: 'create',
                            name: 'افزودن محصول',
                            props: true,
                            component: AddProduct,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_product"
                            }
                        }, {
                            path: 'edit/:product_id',
                            name: 'ویرایش محصول',
                            props: true,
                            component: AddProduct,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_product"
                            }
                        }, {
                            path: 'category/:cat_id',
                            name: 'دسته بندی کالا ها',
                            props: true,
                            component: ProductCategoryList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_product_category"
                            }
                        }, {
                            path: 'tags',
                            name: 'برچسب محصولات',
                            props: true,
                            component: ProductTagsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_product_tags"
                            }
                        }, {
                            path: 'keywords',
                            name: 'کلمات کلیدی محصولات',
                            props: true,
                            component: ProductKeywordsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_product_keywords"
                            }
                        },{
                            path: 'comments',
                            name: 'دیدگاه محصولات',
                            props: true,
                            component: ProductCommentsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "verify_product_comments"
                            }
                        },{
                            path: 'property-templates',
                            name: 'الگو ویژگی محصولات',
                            props: true,
                            component: ProductPropertyTemplateList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_property"
                            }
                        },{
                            path: 'property-groups/:temp_id',
                            name: 'گروه ویژگی محصولات',
                            props: true,
                            component: ProductPropertyTemplateGroupList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_property"
                            }
                        },{
                            path: 'property-items/:group_id',
                            name: 'ایتم ویژگی محصولات',
                            props: true,
                            component: ProductPropertyTemplateGroupItemList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_property"
                            }
                        },{
                            path: 'category-properties',
                            name: 'خصوصیات محصولات',
                            props: true,
                            component: CategoryPropertyList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_property"
                            }
                        },{
                            path: 'property-values/:property_id',
                            name: 'مقادیر خصوصیت',
                            props: true,
                            component: CategoryPropertyValues,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_property"
                            }
                        },{
                            path: 'category-properties/:cat_id',
                            name: 'خصوصیت دسته بندی',
                            props: true,
                            component: AddPropertyToCategory,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "product_property"
                            }
                        },
                    ]
                },
                {
                    path: '/dashboard/settings',
                    name: 'تنظیمات',
                    component: Settings,
                    props: true,
                    meta: {
                        requiresAuth: true,
                        requiresRole: "edit_settings"
                    }
                },

                //*************************************************
                //*************************************************
                //*************************************************
                //*************************************************

                {
                    path: 'news',
                    name: 'خبر',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                        requiresRole: "insert_post"
                    },
                    children:[
                        {
                            path: 'categories/:cat_id',
                            name: 'دسته بندی',
                            props: true,
                            component: CategoryList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_category"

                            }
                        },
                        {
                            path: 'add-news',
                            name: 'افزودن خبر',
                            props: true,
                            component: AddNews,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_post"
                            }
                        },{
                            path: 'edit-news/:post_id',
                            name: 'ویرایش خبر',
                            props: true,
                            component: EditNews,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_post"
                            }
                        }, {
                            path: 'all-news',
                            name: 'همه اخبار',
                            props: true,
                            component: NewsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "verify_post"
                            }
                        }, {
                            path: 'tags',
                            name: 'برچسب ها',
                            props: true,
                            component: TagsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_tags"
                            }
                        }, {
                            path: 'keywords',
                            name: 'کلمات کلیدی',
                            props: true,
                            component: KeywordsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_keywords"
                            }
                        }, {
                            path: 'comments',
                            name: 'دیدگاه ها',
                            props: true,
                            component: CommentsList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "verify_comments"
                            }
                        }, {
                            path: 'my-news',
                            name: 'خبر های من',
                            props: true,
                            component: MyNews,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "insert_post"
                            }
                        },
                    ]
                },
                //****************************************
                {
                    path: '/dashboard/display',
                    name: 'نمایش',
                    props: true,
                    component: {render (c){return c('router-view')}},

                    meta: {
                        requiresAuth: true,
                        requiresRole: "ui_settings"
                    },
                    children:[
                        {
                            path: 'redirect',
                            name: 'ریدایرکت',
                            props: true,
                            component: Redirect,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "ui_settings"
                            }
                        },
                        {
                            path: 'slider-images/:slider_id',
                            name: 'تصاویر اسلایدر',
                            props: true,
                            component: SliderImages,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "ui_settings"
                            }
                        },
                        {
                            path: 'home-ui',
                            name: 'بخش',
                            props: true,
                            component: SectionList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "ui_settings"
                            }
                        }, {
                            path: 'section-rows/:section_id',
                            name: 'سطرهای بخش',
                            props: true,
                            component: SectionRows,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "ui_settings"
                            }
                        },  {
                            path: 'menus/:menu_id',
                            name: 'منو',
                            props: true,
                            component: Menus,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "ui_settings"
                            }
                        }, {
                            path: 'settings',
                            name: 'تنظیمات',
                            props: true,
                            component: Menus,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_settings"
                            }
                        },{
                            path: 'settings',
                            name: 'تصاویر صفحه اول',
                            props: true,
                            component: Menus,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_settings"
                            }
                        },
                    ]
                },
                //******************************************
                //*************************************************
                {
                    path: 'orders',
                    name: 'سفارشات',
                    props: true,
                    component: {render (c){return c('router-view')}},
                    meta: {
                        requiresAuth: true,
                        requiresRole: "edit_settings"
                    },
                    children:[
                        {
                            path: 'list',
                            name: 'لیست سفارشات',
                            props: true,
                            component: OrderList,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_settings"
                            }
                        }, {
                            path: 'info/:order_id',
                            name: 'اطلاعات سفارش',
                            props: true,
                            component: OrderInfo,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_settings"
                            }
                        }, {
                            path: 'add-order',
                            name: 'افزودن سفارش',
                            props: true,
                            component: AddOrder,
                            meta: {
                                requiresAuth: true,
                                requiresRole: "edit_settings"
                            }
                        },

                    ]
                },

                //*************************************************


            ]
        },
        {
            path: 'dashboard/pages',
            redirect: '/pages/404',
            name: 'Pages',
            component: {
                render(c) {
                    return c('router-view')
                }
            },
            children: [
                {
                    path: '/dashboard/404',
                    name: 'Page404',
                    component: Page404
                },
                {
                    path: '500',
                    name: 'Page500',
                    component: Page500
                },
                {
                    path: '/dashboard/login',
                    name: 'Login',
                    component: Login
                },

                {
                    path: '/register',
                    name: 'Register',
                    component: Register
                }
            ]
        }
    ]
}

function validate_user(next, to) {
    let self = this;
    const formData = new FormData()
    let url;
    url = "/api/admin/validate-token";

    formData.append('token', localStorage.getItem('token'))

    axios.post(url, formData,{}).then((res) => {
        console.log("validate token is " + res.data);


        if (res.data.validate) {
            console.log("validate is true");
            let meta_role = to.meta.requiresRole;
            // console.log("user name is "+ this.user_permissions.includes("edit_settings"));
            if (meta_role == null) {
                console.log("requiresRole is null");
                next();

            } else {
                console.log("requiresRole is " + meta_role);
                let permissions = res.data.permissions;
                if (permissions.includes(meta_role)) {
                    console.log("user has permissions ");
                    next();

                } else {
                    next({
                        path: '/dashboard/404',
                        params: {nextUrl: to.fullPath}
                    });
                }

            }

        } else {
            console.log("validate is false");

            next({
                path: '/dashboard/login',
            })
        }
        // return res.data;
    }).catch(function (error) {
            next({
                path: '/dashboard/login',
            })
            console.log(error);
        });

}

