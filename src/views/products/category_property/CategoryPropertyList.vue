<template>
    <div>
        <CRow>
            <CCol sm="6">
                <CCard>
                    <CCardHeader>
                        <strong>ثبت خصوصیت محصولات</strong>
                        <div class="card-header-actions">
                            <a
                                    href="https://coreui.io/vue/docs/components/form-components"
                                    class="card-header-action"
                                    rel="noreferrer noopener"
                                    target="_blank"
                            >
                            </a>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol sm="12">
                                <CInput
                                        v-model="name"

                                        label="نام خصوصیت"
                                />
                            </CCol>
                        </CRow>


                    </CCardBody>
                    <CCardFooter>
                        <CButton
                                @click="login()"
                                type="submit" ref="submit_form" size="sm" color="primary">
                            <CIcon name="cil-check-circle"/>
                            ثبت خصوصیت
                        </CButton>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>

        <CCardBody>
            <CDataTable
                    :items="items"
                    :fields="fields"

                    :items-per-page="20"
                    hover
                    sorter
                    pagination
            >
                <template #ردیف="{item}">

                    <td>
                        <p class="text-muted">{{item.row_id+1}}</p>

                    </td>

                </template>
                <template #نام="{item}">

                    <td>
                        <p class="text-muted">{{item.name}}</p>

                    </td>

                </template>


                <template #عملیات="{item}">
                    <td class="py-2">
                        <CButton
                                color="primary"
                                variant="outline"
                                square
                                size="sm"
                                @click="goSubCategories(item)"
                        >مقادیر الگو
                        </CButton>
                        <CButton
                                color="warning"
                                variant="outline"
                                square
                                size="sm"
                                @click="editDetails(item)"
                        >ویرایش
                        </CButton>
                        <CButton
                                color="danger"
                                variant="outline"
                                square
                                size="sm"
                                @click="delete_dialog(item)"
                        >حذف
                        </CButton>
                    </td>
                </template>


            </CDataTable>
        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";
    import {bus} from "../../../main";

    var items = [];

    const fields = [
        {key: 'ردیف', _style: 'width:10%'},
        {key: 'نام', _style: 'width:10%'},

        {key: 'عملیات', _style: 'width:40%;'},


    ];


    export default {
        name: 'Login',
        data() {
            return {
                name: '',
                file: '',
                color: '',
                previewImage: '',
                description: '',
                items: items.map((item, row_id) => {
                    return {...item, row_id}
                }),
                fields,
                details: [],
                collapseDuration: 0,
                status_form: 0
            }
        }, mounted() {
            bus.$on('delete_confirm', (data) => {
                // alert(data);
                if (data == 'true') {
                    this.delete_item();

                } else {
                    this.status_form = 0;
                }
            });
            this.get_categories();
        }, watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            }
        },
        methods: {
            get_style(color) {
                return {
                    myStyle: {
                        backgroundColor: color
                    }
                }
            },
            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = item.title;

                this.status_form = item.id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            get_categories() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/admin/category/get-properties', {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items = content_cats.data.map((item, row_id) => {
                        return {...item, row_id}
                    }),
                        fields;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            },
            goRegister() {
                this.$router.push({path: 'register'});
            },
            goSubCategories(item) {

                this.$router.push({path: '/dashboard/products/property-values/' + item.id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            login() {


                let self = this;
                const formData = new FormData()
                let url;
                if (this.status_form == 0) {
                    url = "/api/admin/category/insert-property";
                } else {
                    url = "/api/admin/category/update-property";
                    formData.append('id', this.status_form)

                }

                formData.append('name', this.name);

                axios.post(url, formData, {}).then((res) => {
                    console.log(res)


                    if (this.status_form == 0) {
                        self.name = '';

                        self.get_categories();
                    } else {
                        self.status_form = 0;
                        self.name = '';

                        self.get_categories();
                    }

                })

                    // axios.post(  '/admin/category', {
                    //     name: self.name,
                    //     description: self.description,
                    //     image: self.image,
                    //     cat: 0,
                    // }).then(function (response) {
                    //     self.name = '';
                    //     self.description = '';
                    //     // localStorage.setItem("api_token", response.data.access_token);
                    //     // self.$router.push({ path: 'notes' });
                    // })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });

            },
            delete_dialog(item) {
                this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], 'delete_confirm');


                this.status_form = item.id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            delete_item() {


                let self = this;
                const formData = new FormData()
                let url;
                url = "/api/admin/product_property-template/delete";


                formData.append('id', this.status_form);

                axios.post(url, formData, {}).then((res) => {
                    console.log(res);
                    if (res.data.error == 1) {
                        this.$root.modal_component.show_danger_modal('خطا', res.data.msg);

                    } else {
                        this.$root.modal_component.show_success_modal('تایید', res.data.msg);

                    }
                    self.status_form = 0;

                    self.get_categories();


                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },


        }
    }


</script>
