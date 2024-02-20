<template>
    <CContainer class="d-flex content-center min-vh-100">
          <CRow>
            <CCol>
              <CCardGroup>
                <CCard class="p-4">
                  <CCardBody>
                    <CForm v-on:keyup.enter="login()">
                      <img  width="120px" height="auto" src="/img/panel_icon.png"/>
                      <h4 class="mt-3">ورود</h4>
                      <CInput
                          placeholder="نام کاربری"
                          v-model="user"
                      >
                        <template #prepend-content>
                          <CIcon name="cil-user"/>
                        </template>
                      </CInput>
                      <CInput
                          placeholder="رمز عبور"
                          type="password"
                          v-model="pass"
                      >
                        <template #prepend-content>
                          <CIcon name="cil-lock-locked"/>
                        </template>
                      </CInput>
                      <CRow>
                        <CCol col="12" class="text-center">


                          <CButton color="primary" v-on:click="login()" class="px-4">
                            <CSpinner v-if="loading" size="sm"/>
                            ورود
                          </CButton>
                          <CRow class="mt-3">

                            <label @click="forgot_password_modal=true">فراموشی رمز عبور</label>
                          </CRow>
                        </CCol>
                        <CCol col="6" class="text-right">
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        <Modals ref="modal"/>

    </CContainer>

</template>


<script>
    import axios from "axios";
    import Modals from "../includes/Modals";

    export default {
        name: 'Login',
        data() {
            return {
                user: '',
                pass: ''
            }
        },
        components: {
             Modals
        },mounted() {
          // this.custom_data()
        },
        methods: {

            goRegister() {

                // this.$root.loading_component.loading = true;
                // this.$router.push({path: '/register'});
            },
            login() {


                let self = this;
                const formData = new FormData()
                let url = "/api/admin/login";

                formData.append('user', this.user)
                formData.append('pass', this.pass)

                axios.post(url, formData).then((res) => {
                    console.log(res)
                  if(res.data.error==1){
                      this.$refs.modal.show_danger_modal('خطا',res.data.msg);

                  }else{

                      localStorage.setItem('token',res.data.token);
                      this.$router.push({ path: '/dashboard'});

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
            // custom_data() {
            //
            //
            //     let self = this;
            //     const formData = new FormData()
            //     let url;
            //     url = "https://bilbordz.com/api/admin/category";
            //
            //
            //     formData.append('pic_1', this.file);
            //
            //     formData.append('name', 'salam');
            //     formData.append('color', '#ffffff');
            //     formData.append('cat', 0);
            //
            //     axios.post(url, formData, {}).then((res) => {
            //         console.log(res)
            //
            //
            //         if (this.status_form == 0) {
            //             self.name = '';
            //             self.color = '';
            //             self.description = '';
            //             self.previewImage = '';
            //             self.previewImage_header = '';
            //
            //             // self.language_id = 1;
            //             // self.language_rel_id = 0;
            //             self.get_categories();
            //         } else {
            //             self.status_form = 0;
            //             self.name = '';
            //             self.color = '';
            //             self.description = '';
            //             self.previewImage = '';
            //             self.previewImage_header = '';
            //
            //             // self.language_id = 1;
            //             // self.language_rel_id = 0;
            //             self.get_categories();
            //         }
            //
            //     })
            //
            //         // axios.post(  '/admin/category', {
            //         //     name: self.name,
            //         //     description: self.description,
            //         //     image: self.image,
            //         //     cat: 0,
            //         // }).then(function (response) {
            //         //     self.name = '';
            //         //     self.description = '';
            //         //     // localStorage.setItem("api_token", response.data.access_token);
            //         //     // self.$router.push({ path: 'notes' });
            //         // })
            //         .catch(function (error) {
            //             self.message = 'Incorrect E-mail or password';
            //             self.showMessage = true;
            //             console.log(error);
            //         });
            //
            // }

        }
    }


</script>
