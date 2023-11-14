<template>
    <div>
        <CRow>
            <CCol sm="12">
                <CCard>
                    <CCardHeader>
                        <strong>ثبت دسته بندی</strong>
                        <div class="card-header-actions">
                            <a
                                    href="https://coreui.io/vue/docs/components/form-components"
                                    class="card-header-action"
                                    rel="noreferrer noopener"
                                    target="_blank"
                            >
                                <small class="text-muted">دسته اصلی</small>
                            </a>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol sm="4">
                                <CInput
                                        v-model="name"
                                        horizontal
                                        label="نام دسته"
                                        placeholder="نام دسته"
                                />
                            </CCol>
                            <CCol sm="4">
                                <CTextarea
                                        v-model="description"

                                        label="توضیحات دسته"
                                        placeholder="توضیحات"
                                        horizontal
                                        rows="4"
                                />

                            </CCol>
                            <CCol sm="4">
                                <CInput
                                        label="رنگ دسته"
                                        type="color" v-model="color" value="#000000"/>

                            </CCol>
                        </CRow>


                        <CRow>
                            <label> لوگو دسته بندی سایز 500x500 پیکسل
                            </label>
                            <CCol sm="6">

                                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
                            </CCol>
                            <CCol sm="6">
                                <CImg height="250px"
                                      width="250px"
                                      v-model="previewImage"
                                      v-if="previewImage" :src="previewImage"
                                />
                            </CCol>
                        </CRow>

                        <CRow>
                            <label> بنر دسته بندی
                            </label>
                            <CCol sm="6">
                                <input type="file" id="file_header" ref="file_header"
                                       v-on:change="handleFileUpload_header()"/>
                            </CCol>

                            <CCol sm="6">

                                <CImg height="250px"
                                      width="250px"
                                      v-model="previewImage_header"
                                      v-if="previewImage_header" :src="previewImage_header"
                                />
                            </CCol>
                        </CRow>



                    </CCardBody>
                    <CCardFooter>
                        <CButton
                                @click="login()"
                                type="submit" ref="submit_form" size="sm" color="primary">
                            <CIcon name="cil-check-circle"/>
                            ثبت دسته
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

                <template #توضیحات="{item}">

                    <td>
                        <p class="text-muted">{{item.description}}</p>

                    </td>

                </template>

                <template #رنگ="{item}">

                    <td>
                        <div :style="get_style(item.color)" :color="item.color">
                            {{item.color}}
                        </div>
                    </td>

                </template>
                <template #زبان="{item}">

                    <td>
                        <div v-for="language in $root.languages" :key="language.id">
                            <CImg :src="language.image"/>
                        </div>
                    </td>

                </template>

                <template #تصویر="{item}">


                    <td>
                        <CImg width="50px" height="50px" v-bind:src="item.image"/>
                    </td>

                </template>

                <template #عملیات="{item,index}">
                    <td class="py-2">
                        <CButton
                                color="primary"
                                variant="outline"
                                square
                                size="sm"
                                @click="editDetails(item)"
                        >ویرایش
                        </CButton>
                        <CButton
                                color="primary"
                                variant="outline"
                                square
                                size="sm"
                                @click="goSubCategories(item)"
                        >زیر دسته ها
                        </CButton>
                        <CButton
                                color="primary"
                                variant="outline"
                                square
                                size="sm"
                                @click="goProperties(item)"
                        >خصوصیت ها
                        </CButton>
                    </td>
                </template>


            </CDataTable>
        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";

    var items = [];

    const fields = [
        {key: 'ردیف', _style: 'width:10%'},
        {key: 'نام', _style: 'width:10%'},
        {key: 'توضیحات', _style: 'width:20%'},
        {key: 'رنگ', _style: 'width:10%;'},
        {key: 'زبان', _style: 'width:10%;'},
        {key: 'تصویر', _style: 'width:10%;'},
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
                file_header: '',
                previewImage_header: '',
                description: '',
                items: items.map((item, id) => {
                    return {...item, id}
                }),
                fields,
                details: [],
                collapseDuration: 0,
                status_form: 0,
                language_rel_id: 0,
                language_id: 1,
            }
        }, mounted() {
            this.get_categories();
        }, watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            }
        },
        methods: {
            get_style(color) {
                return {
                    backgroundColor: color

                }
            },
            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = item.name;
                this.color = item.color;
                this.description = item.description;
                this.previewImage = item.image;
                this.previewImage_header = item.header_image;

                this.status_form = item.cat_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            get_categories() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/admin/subcategories/' + this.$route.params.cat_id, {}).then(function (response) {
                    console.log("cats is " + response.data.orders);
                    console.log("cats is " + items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items = content_cats.orders.map((item, row_id) => {
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
            goSubCategories(item) {

                this.$router.push({path: '/dashboard/categories/' + item.cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },

            handleFileUpload() {
                this.file = this.$refs.file.files[0];
                var input = event.target;
                // Ensure that you have a file before attempting to read it
                if (input.files && input.files[0]) {
                    // create a new FileReader to read this image and convert to base64 format
                    var reader = new FileReader();
                    // Define a callback function to run, when FileReader finishes its job
                    reader.onload = (e) => {
                        // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                        // Read image as base64 and set to imageData
                        this.previewImage = e.target.result;
                    }
                    // Start the reader job - read file as a data url (base64 format)
                    reader.readAsDataURL(input.files[0]);
                }
            },
            handleFileUpload_header() {
                this.file_header = this.$refs.file_header.files[0];
                var input = event.target;
                // Ensure that you have a file before attempting to read it
                if (input.files && input.files[0]) {
                    // create a new FileReader to read this image and convert to base64 format
                    var reader = new FileReader();
                    // Define a callback function to run, when FileReader finishes its job
                    reader.onload = (e) => {
                        // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                        // Read image as base64 and set to imageData
                        this.previewImage_header = e.target.result;
                    }
                    // Start the reader job - read file as a data url (base64 format)
                    reader.readAsDataURL(input.files[0]);
                }
            },
            login() {


                let self = this;
                const formData = new FormData()
                let url;
                if (this.status_form == 0) {
                    url = "/api/admin/category";
                } else {
                    url = "/api/admin/category/update";
                    formData.append('cat_id', this.status_form)

                }

                formData.append('image', this.file);
                formData.append('image_header', this.file_header);

                formData.append('name', this.name);
                formData.append('color', this.color);
                formData.append('cat', this.$route.params.cat_id);
                formData.append('description', this.description);
                formData.append('language_id', this.language_id);
                axios.post(url, formData, {}).then((res) => {
                    console.log(res)


                    if (this.status_form == 0) {
                        url = "/api/admin/category";
                        self.name = '';
                        self.color = '';
                        self.description = '';
                        self.previewImage = '';
                        self.previewImage_header = '';

                        // self.language_id = 1;
                        // self.language_rel_id = 0;
                        self.get_categories();
                    } else {
                        self.status_form = 0;
                        self.name = '';
                        self.color = '';
                        self.description = '';
                        self.previewImage = '';
                        self.previewImage_header = '';

                        // self.language_id = 1;
                        // self.language_rel_id = 0;
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

        }
    }


</script>
