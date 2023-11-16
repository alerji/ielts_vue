<template>
    <div>
        <CRow>
            <CCol sm="12">
                <CCard>
                    <CCardHeader>
                        <strong>ثبت خبر</strong>
                        <div class="card-header-actions">
                            <a
                                href="https://coreui.io/vue/docs/components/form-components"
                                class="card-header-action"
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <small class="text-muted"></small>
                            </a>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol sm="4">
                                <CInput
                                    v-model="title"

                                    label="عنوان خبر"
                                    placeholder="عنوان"
                                    vertical
                                />
                            </CCol>
                            <CCol sm="4">
                                <CInput
                                        v-model="seo_title"

                                        label="متا عنوان"

                                />

                            </CCol>
                            <CCol sm="4" v-if="1==0">
                                <CInput
                                        v-model="favorite_url"
                                        label="لینک خبر"

                                        placeholder="لینک"
                                />

                            </CCol>
                        </CRow>
                        <CRow>

                        </CRow>
                        <CRow>
                            <CCol sm="12">
                                <ckeditor
                                    v-model="editorData"
                                    :editor-url="editorUrl"
                                ></ckeditor>


                            </CCol>
                        </CRow>
                        <CRow>

                        </CRow>
                        <CRow>
                            <CCol sm="12">
                                <CTextarea
                                    v-model="seo_summary"

                                    label="سئو توضیحات"

                                />

                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol sm="4">

                                <treeselect
                                    v-model="value_tags"
                                    :multiple="true"
                                    :async="true"
                                    :load-options="load_tags"
                                    placeholder="انتخاب برچسب ها"
                                    :normalizer="normalizer_tags"
                                />


                            </CCol>
                            <CCol sm="4">
                                <treeselect
                                        v-model="value_keywords"
                                        :multiple="true"
                                        :async="true"
                                        :load-options="load_keywords"
                                        placeholder="انتخاب کلمات کلیدی"
                                        :normalizer="normalizer_keywords"
                                />


                            </CCol>
                            <CCol sm="4">
                                    <treeselect
                                            v-model="value_category"
                                            :multiple="true"
                                            :normalizer="normalizer_category"

                                            :options="options_category"
                                            placeholder="دسته بندی خبر را انتخاب کنید"
                                    />


                            </CCol>
                        </CRow>
                        <br>

                        <CRow>
                            <label>تصویر خبر</label>
<br>
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



                        </CRow>

                        <CRow>
                            <CCol sm="12">


                            </CCol>

                        </CRow>
                    </CCardBody>
                    <CCardFooter>
                        <CButton v-if="status_form==0" @click="login()" type="submit" ref="submit_form" size="sm" color="primary">
                            <CIcon name="cil-check-circle"/>
                            ثبت خبر
                        </CButton>
                        <CButton v-if="status_form!=0" @click="login()" type="submit" ref="submit_form" size="sm" color="primary">
                            <CIcon name="cil-check-circle"/>
                            ویرایش خبر
                        </CButton>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>

        <CCardBody>

        </CCardBody>


    </div>

</template>

<script>
    import axios from "axios";
    import CKEditor from 'ckeditor4-vue';

    // import CKEditor from '@ckeditor/ckeditor5-vue';
    Vue.use(CKEditor);


    // import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    // import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    //
    // // import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
    //
    // import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
    // import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
    // import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
    // // import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
    // import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
    // // import ImageUploaderPlugin from '@ckeditor/ckeditor5-image/src/imageupload';
    // import AlignmentPlugin from '@ckeditor/ckeditor5-alignment/src/alignment';     // <--- ADDED
    // ClassicEditor
    //     .create( document.querySelector( '#editor' ), {
    //         plugins: [ EssentialsPlugin, ParagraphPlugin, BoldPlugin, ItalicPlugin ,AlignmentPlugin],     // <--- MODIFIED
    //         toolbar: [ 'bold', 'italic','heading', '|', 'bulletedList', 'numberedList', 'alignment', 'undo', 'redo'],
    //
    //
    //         alignment: {
    //             options: [ 'left', 'right' ]
    //         },
    //     } )
    //     .then( editor => {
    //         console.log( 'Editor was initialized', editor );
    //     } )
    //     .catch( error => {
    //         console.error( error.stack );
    //     } );
    import Vue from "vue";

    import Treeselect from '@riophae/vue-treeselect'
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    var items_role = [];

    const fields_role = [
        {key: 'نام', _style: 'width:20%'},
        {key: 'دسترسی', _style: 'width:20%'},


    ];
    var items_group = [];


    const fields_group = [
        {key: 'نام', _style: 'width:20%'},
        {key: 'دسترسی', _style: 'width:20%'},


    ];
    import {ASYNC_SEARCH} from '@riophae/vue-treeselect'

    const simulateAsyncOperation = fn => {
        setTimeout(fn, 2000)
    }

    export default {
        name: 'Login',
        components: {
            Treeselect,
            ckeditor: CKEditor.component
        },
        data() {

            return {
                editorUrl: "https://furnishium.com/ckeditor/ckeditor.js",

                value_category: [],
                value_tags: [],
                value_keywords: [],
                // define options
                image_upload: '',
                options_category: [{
                    cat_id: 'a',
                    name: 'a',
                    subcategories: [{
                        cat_id: 'aa',
                        name: 'aa',
                    }, {
                        cat_id: 'ab',
                        name: 'ab',
                    }],

                }, {
                    cat_id: 'b',
                    name: 'b',
                }, {
                    cat_id: 'c',
                    name: 'c',
                }],
                normalizer_category(node) {
                    return {
                        id: node.cat_id,
                        label: node.name,
                        children: node.subcategories,
                    }
                },
                load_keywords({action, searchQuery, callback}) {

                    if (action === ASYNC_SEARCH) {
                        simulateAsyncOperation(() => {
                            let options;
                            axios.post('/api/admin/search-keywords', {
                                search: searchQuery,

                            }).then(function (response) {
                                options = response.data;
                                callback(null, options);
                                // localStorage.setItem("api_token", response.data.access_token);
                                // self.$router.push({ path: 'notes' });
                            })
                                .catch(function (error) {
                                    self.message = 'Incorrect E-mail or password';
                                    self.showMessage = true;
                                    console.log(error);
                                });


                            //  const options = this.get_keywords(searchQuery);
                            // const options = [1, 2, 3, 4, 5].map(i => ({
                            //     id: `${searchQuery}-${i}`,
                            //     name: `${searchQuery}-${i}`,
                            // }))

                        })
                    }
                },
                normalizer_keywords(node) {
                    return {
                        id: node.keyword_title,
                        label: node.keyword_title,
                    }
                },
                load_tags({action, searchQuery, callback}) {

                    if (action === ASYNC_SEARCH) {
                        simulateAsyncOperation(() => {
                            let options;
                            axios.post('/api/admin/search-tags', {
                                search: searchQuery,

                            }).then(function (response) {
                                options = response.data;
                                callback(null, options);
                                // localStorage.setItem("api_token", response.data.access_token);
                                // self.$router.push({ path: 'notes' });
                            })
                                .catch(function (error) {
                                    self.message = 'Incorrect E-mail or password';
                                    self.showMessage = true;
                                    console.log(error);
                                });


                            //  const options = this.get_keywords(searchQuery);
                            // const options = [1, 2, 3, 4, 5].map(i => ({
                            //     id: `${searchQuery}-${i}`,
                            //     name: `${searchQuery}-${i}`,
                            // }))

                        })
                    }
                },
                normalizer_tags(node) {
                    return {
                        id: node.tag_title,
                        label: node.tag_title,
                    }
                },
                // editor: ClassicEditor,
                editorData: '',
                editorConfig: {
                    extraPlugins: [
                        // AlignmentPlugin,
                        // ImageUploaderPlugin,
                        // EasyImage,
                        // EssentialsPlugin,
                        // BoldPlugin,
                        // ItalicPlugin,
                        // LinkPlugin,
                        // ParagraphPlugin
                    ],
                    // plugins: [
                    //     Alignment,
                    //     // EssentialsPlugin,
                    //     BoldPlugin,
                    //     ItalicPlugin,
                    //     LinkPlugin,
                    //     ParagraphPlugin,
                    //     // ImageUploaderPlugin,
                    //     // EasyImage
                    //     // ImageUploaderPlugin
                    //     // EssentialsPlugin,
                    //     // BoldPlugin,
                    //     // ItalicPlugin,
                    //     // LinkPlugin,
                    //     // ParagraphPlugin
                    // ],
                    // alignment: {
                    //     options: [ 'left', 'right' ]
                    // },
                    // toolbar: {
                    //     items: [
                    //         'heading',
                    //         '|',
                    //         'bold',
                    //         'italic',
                    //         // 'link',
                    //         'bulletedList',
                    //         'numberedList',
                    //         'imageUpload',
                    //         'blockQuote',
                    //         'undo',
                    //         'redo',
                    //     ]
                    // },
                    // image: {
                    //     toolbar: [
                    //         'imageStyle:full',
                    //         'imageStyle:side',
                    //         '|',
                    //         'imageTextAlternative'
                    //     ]
                    // },
                    language: 'fa'
                    // The configuration of the editor.
                },
                title: '',
                favorite_url: '',
                seo_title: '',
                summary: '',
                seo_summary: '',
                tags: '',
                keywords: '',
                file: '',

                previewImage: '',
                image: '',
                group_items: items_group.map((item, id) => {
                    return {...item, id}
                }),
                fields_group,
                role_items: items_role.map((item, id) => {
                    return {...item, id}
                }),
                fields_role,
                details: [],
                collapseDuration: 0,
                status_form: 0,
                options: [
                    {text: 'One', value: 'A'},
                    {text: 'Two', value: 'B'},
                    {text: 'Three', value: 'C'}
                ]
            }
        },
        mounted() {
            this.get_categories();
            this.get_roles();
            if (this.$route.params.post_id != null) {
                this.status_form = this.$route.params.post_id;
                this.get_post_info();
            }
        }, watch: {
            '$route.params.post_id': function (id) {
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
                this.name = this.items[item.id].name
                this.color = this.items[item.id].color
                this.description = this.items[item.id].description
                this.previewImage = this.items[item.id].image
                this.status_form = this.items[item.id].cat_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },
            get_categories() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);

                axios.get('/api/all-categories', {}).then(function (response) {
                    // console.log("cats is "+response.data.groups);
                    // console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.options_category = content_cats.data;
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
            get_keywords(search) {
                var self = this;
                axios.post('/api/admin/search-keywords', {
                    search: search,

                }).then(function (response) {
                    return response.data
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });


            },
            get_post_info() {
                var self = this;
                axios.get('/api/admin/post_info/'+self.status_form, {
                    params: {
                        // post_id:self.status_form,
                    },
                    headers: {
                        Authorization:localStorage.getItem("token"),
                    }
                }).then(function (response) {
                    var post_data =  response.data;

                    self.previewImage = post_data.post.image;
                    post_data.post.categories.forEach((val)=>{
                        self.value_category.push(val.cat_id);
                    });
                    post_data.post.tags.forEach((val)=>{
                        self.value_tags.push(val.name);
                    });
                    post_data.post.keywords.forEach((val)=>{
                        self.value_keywords.push(val.name);
                    });
                    // self.value_category = post_data.post.categories;
                    //  self.options_=post_data.post.tags;
                     // self.value_keywords=post_data.post.keywords;
                    self.title=post_data.post.title;
                    self.favorite_url=post_data.post.favorite_url;
                    self.editorData=post_data.post.summary;
                    self.seo_summary=post_data.post.meta_description;
                    self.seo_title=post_data.post.seo_title;

                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                }).catch(function (error) {
                        self.message = 'Incorrect E-mail or password';
                        self.showMessage = true;
                        console.log(error);
                    });


            },
            goRegister() {
                this.$router.push({path: 'register'});
            },
            goSubCategories(item, index) {

                this.$router.push({path: '/categories/' + this.items[index].cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            get_roles() {
                var self = this;
                console.log("route id " + this.$route.params.cat_id);
              var formData = new FormData();

                axios.post('/api/admin/roles',formData, {}).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.role_items = content_cats.permissions.map((item, id) => {
                        return {...item, id}
                    }),
                        fields_role;
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
            login() {
if(this.value_category.length==0){
 alert('دسته بندی را وارد کنید');
 return false;
}

                let self = this;
                const formData = new FormData()
                let url;
                if (self.status_form == 0) {
                    url = "/api/admin/post";
                } else {
                    url = "/api/admin/post/update";
                    formData.append('post_id', this.status_form)

                }

                formData.append('token', localStorage.getItem('token'))
                formData.append('post_image', this.file)
                formData.append('form_post_cat_list', this.value_category)
                formData.append('form_post_tags', this.value_tags)
                formData.append('form_post_keywords', this.value_keywords)
                formData.append('form_post_name', this.title)
                formData.append('form_post_url', this.favorite_url)
                formData.append('form_post_text', this.editorData)
                formData.append('form_post_meta_desc', this.seo_summary)
                formData.append('form_post_meta_title', this.seo_title)
                // formData.append('is_admin', 1)
                // formData.append('role_group', this.selected_group)
                // formData.append('roles', self.$refs.permissions)
                axios.post(url, formData, {}).then((res) => {
                    console.log(res)
self.$root.modal_component.show_api_response_modals(res);
if(self.status_form==0){
    self.name = '';
    self.mobile = '';
    self.email = '';
    self.description = '';
    self.password = '';
    self.selected_group = '0';
    self.permissions = [];
}

                }).catch(function (error) {
                    self.message = 'Incorrect E-mail or password';
                    self.showMessage = true;
                    console.log(error);
                });

            }
        }
    }


</script>
<style>

</style>
