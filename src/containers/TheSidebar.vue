<template>


    <CSidebar
        fixed
        :minimize="minimize"
        :show="show"
        @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
    >
        <CSidebarBrand class="d-md-down-none" to="/">
            پنل مدیریت
        </CSidebarBrand>
        <CRenderFunction flat :content-to-render="nav"/>
        <CSidebarMinimizer
            class="d-md-down-none"
            @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
        />

    </CSidebar>

</template>

<script>
    import axios from 'axios'

    export default {
        name: 'TheSidebar',


        data () {
            return {
                //minimize: false,
                nav: [],
                //show: true,
                buffor: [],
            }
        },components:{

        },

        computed: {
            show () {
                return this.$store.state.sidebarShow
            },
            minimize () {
                return this.$store.state.sidebarMinimize
            }
        },
        methods: {
            dropdown(data){
                let result = {
                    _name: 'CSidebarNavDropdown',
                    name: data['name'],
                    route: data['href'],
                    icon: data['icon'],
                    _children: [],
                };
                for(let i=0; i<data['elements'].length; i++){
                    if(data['elements'][i]['slug'] == 'dropdown'){
                        result._children.push( this.dropdown(data['elements'][i]) );
                    }else{
                        result._children.push(
                            {
                                _name:  'CSidebarNavItem',
                                name:   data['elements'][i]['name'],
                                to:     data['elements'][i]['href'],
                                icon:   data['elements'][i]['icon']
                            }
                        );
                    }
                }
                return result;
            },
            rebuildData(data){
                this.buffor = [{
                    _name: 'CSidebarNav',
                    _children: []
                }];
                for(let k=0; k<data.length; k++){
                    switch(data[k]['slug']){
                        case 'link':
                            if(data[k]['href'].indexOf('http') !== -1){
                                this.buffor[0]._children.push(
                                    {
                                        _name: 'CSidebarNavItem',
                                        name: data[k]['name'],
                                        href: data[k]['href'],
                                        icon: data[k]['icon'],
                                        target: '_blank'
                                    }
                                );
                            }else{
                                this.buffor[0]._children.push(
                                    {
                                        _name: 'CSidebarNavItem',
                                        name: data[k]['name'],
                                        to:   data[k]['href'],
                                        icon: data[k]['icon'],
                                    }
                                );
                            }
                            break;
                        case 'title':
                            this.buffor[0]._children.push(
                                {
                                    _name: 'CSidebarNavTitle',
                                    _children: [data[k]['name']]
                                }
                            );
                            break;
                        case 'dropdown':
                            this.buffor[0]._children.push( this.dropdown(data[k]) );
                            break;
                    }
                }
                return this.buffor;
            },
            get_sidebar() {


                let self = this;
                const formData = new FormData()
                let url;

                url = "/api/admin/get_sidebars";

                formData.append('token', localStorage.getItem('token'))

                // formData.append('image', this.file);
                // formData.append('name', this.name);
                // formData.append('mobile', this.mobile);
                // formData.append('email', this.email);
                // formData.append('password', this.password);
                // formData.append('is_admin', 1);
                // formData.append('role_group', this.selected_group);
                // formData.append('roles', self.$refs.permissions);
                axios.post(url, formData, {}).then((res) => {
                    console.log(res);

                    self.nav = self.rebuildData(res.data.sidebar);

                    self.$store.commit('set', ['user_name', res.data.user_name]);
                    self.$store.commit('set', ['user_image', res.data.user_image]);
                    self.$store.commit('set', ['user_permissions', res.data.permissions]);
                    // console.log("user name is2 "+self.$store.commit('get', ['user_name', res.data.user_name]));
                    // self.child_nav = [{
                    //     _name: 'CSidebarNavItem',
                    //     name: 'Colors',
                    //     to: '/dashboard/theme/colors',
                    //     icon: 'cil-drop'
                    // }];

                }).catch(function (error) {
                    self.message = 'Incorrect E-mail or password';
                    self.showMessage = true;
                    console.log(error);
                });

            }

        },
        mounted () {
            // this.$root.$on('toggle-sidebar', () => {
            //     const sidebarOpened = this.show === true || this.show === 'responsive'
            //     this.show = sidebarOpened ? false : 'responsive'
            // });
            // this.$root.$on('toggle-sidebar-mobile', () => {
            //     const sidebarClosed = this.show === 'responsive' || this.show === false
            //     this.show = sidebarClosed ? true : 'responsive'
            // });
           this.get_sidebar();
            // let self = this;
            // axios.get(   '/api/menu?token=' + localStorage.getItem("api_token") )
            //     .then(function (response) {
            //         self.nav = self.rebuildData(response.data);
            //     }).catch(function (error) {
            //     console.log(error);
            //     self.$router.push({ path: '/login' });
            // });
        }
    }
</script>
