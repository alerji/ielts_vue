<template>

  <div class="product-list" v-if="user_detail.user!=null">
    <CCard>
      <CCardHeader>
        <strong>
          اطلاعات مشتری
        </strong>

      </CCardHeader>

      <CCardBody class="">
        <CRow>
          <CCol col="4">
            {{ user_detail.user.name }}
          </CCol>
          <CCol col="4">
            {{ user_detail.user.phone }}
          </CCol>
        </CRow>
        <CRow>
          <CCol col="6">
            سفارشات
            <CDataTableFixed
                class="mb-0 table-outline"
                hover
                striped

                :items="user_detail.orders"
                :fields="fields_orders"
                head-color="light"
                no-sorting
            >
              <template #created_at="{item}">
                <td>
                  <p>{{ get_date_time(item.created_at) }}</p>
                </td>
              </template>


              <template #total_price="{item,index}">
                <td class="py-2">
                  <p>{{get_currency(item.total_price)}}</p>
                </td>
              </template>
              <template #product="{item,index}">
                <td class="py-2">
                  <p>{{item.products[0].product.product_title}}</p>
                </td>
              </template>

              <template #operation="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="goRegister(item)"
                  >
                    <CIcon name="eye" size="sm"/>
                  </CButton>

                </td>
              </template>

            </CDataTableFixed>

          </CCol>
          <CCol col="6">

            لاگین ها
            <CDataTableFixed
                class="mb-0 table-outline"
                hover
                striped

                :items="user_detail.logins"
                :fields="fields_logins"
                head-color="light"
                no-sorting
            >

              <template #row="{item,index}">
                <td>
                  <p>{{ index+1 }}</p>
                </td>
              </template>

              <template #created_at="{item}">
                <td>
                  <p>{{ get_date_time(item.created_at) }}</p>
                </td>
              </template>
              <template #operation="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="goRegister(item)"
                  >
                    <CIcon name="eye" size="sm"/>
                  </CButton>

                </td>
              </template>

            </CDataTableFixed>
          </CCol>
          <CCol col="6">
            نمایش دوره
            <CDataTableFixed
                class="mb-0 table-outline"
                hover
                striped

                :items="user_detail.product_views"
                :fields="fields_view"
                head-color="light"
                no-sorting
            >
              <template #created_at="{item}">
                <td>
                  <p>{{ get_date_time(item.created_at) }}</p>
                </td>
              </template>

              <template #row="{item,index}">
                <td>
                  <p>{{ index+1 }}</p>
                </td>
              </template>


              <template #product_title="{item}">
                <td>
                  <p>{{ (item.product.product_title) }}</p>
                </td>
              </template>
              <template #episode_name="{item}">
                <td>
                  <p>{{ (item.episode.name) }}</p>
                </td>
              </template>

            </CDataTableFixed>
          </CCol>
          <CCol col="6">
            مقدار زمان نمایش دوره
            <CDataTableFixed
                class="mb-0 table-outline"
                hover
                striped

                :items="user_detail.view_duration"
                :fields="fields_duration"
                head-color="light"
                no-sorting
            >
              <template #created_at="{item}">
                <td>
                  <p>{{ get_date_time(item.created_at) }}</p>
                </td>
              </template>
              <template #duration_sum="{item}">
                <td>
                  <p>{{ duration_to_time_string(item.duration_sum) }}</p>
                </td>
              </template>
              <template #operation="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="goRegister(item)"
                  >
                    <CIcon name="eye" size="sm"/>
                  </CButton>

                </td>
              </template>

            </CDataTableFixed>
          </CCol>
        </CRow>



      </CCardBody>
    </CCard>


  </div>

</template>

<script>
import axios from "axios";
import {bus} from "../../main";


export default {
  name: 'Login',
  components: {
    // Use the <ckeditor> component in this view.
    // ckeditor: CKEditor.component
  },
  data() {
    return {
      user_detail: {},
      delete_tag: new Date() + "_delete_confirm",
      edit_row: null,
      edit_flag: false,
      edit_product_weight: '',
      name: '',
      product_weight: null,
      items_tags: [],
      items_tags_title: null,
      items_tags_id: 1,
      edit_items_tags_id: 0,
      product_weight_id: 1,
      edit_product_weight_id: 0,
      productId: null,
      file: '',
      color: '',
      weightModal: false,
      previewImage: '',
      description: '',
      weights: null,
      fields_orders: [
        {key: 'id', label: '#', _classes: 'text-center'},
        {key: 'product', label: 'محصول'},
        {key: 'total_price', label: 'قیمت'},
        {key: 'created_at', label: 'تاریخ', _classes: 'text-center'},
      ],
      fields_logins: [
        {key: 'row', label: '#', _classes: 'text-center'},
        {key: 'ip', label: 'ای پی کاربر'},
        {key: 'created_at', label: 'زمان لاگین', _classes: 'text-center'},
      ],
      fields_view: [
        {key: 'row', label: '#', _classes: 'text-center'},
        {key: 'product_title', label: 'درس'},
        {key: 'episode_name', label: 'قسمت'},
        {key: 'created_at', label: 'تاریخ بازدید', _classes: 'text-center'},
      ],
      fields_duration: [
        {key: 'product_title', label: 'درس'},
        {key: 'name', label: 'قسمت'},
        {key: 'duration_sum', label: 'مجموع زمان'},
      ],


      items_status: [],
      items: [],

      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  },
  mounted() {
    console.log("process is " + process.env.VUE_APP_BASE_URL);

    this.get_news();

  },
  watch: {
    '$route.params.cat_id': function (id) {
      this.get_categories();
    },


  },
  methods: {
    duration_to_time_string(time){
      var sec_num = parseInt(time, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return +hours+ ":" +minutes+':'+seconds;

    },
    editDetails(item, index) {
      this.$router.push({path: "/dashboard/products/edit/" + item.post_id});

    },
    go_show_product(item) {
      window.open(process.env.VUE_APP_BASE_URL + "products/" + item.slug, "_blank");

    },
    get_news() {
      var self = this;

      var formData = new FormData();
      formData.append("id", this.$route.params.id)
      axios.post('/api/admin/users/get_customer_info', formData, {}).then(function (response) {

        var contents = response.data;


        self.user_detail = contents;

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    goRegister(item) {
      console.log("item clicked", item)
      this.$router.push({path: '/dashboard/user/user-detail/' + item.id});
    },
    goAddNews() {
      this.$router.push({path: '/dashboard/products/create'});
    },

  }
}


</script>
