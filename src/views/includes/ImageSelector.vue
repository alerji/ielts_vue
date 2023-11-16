<template>
    <div>
        <div>
            <div class="form-group">

                <div class="form__img" v-on:click="open_file_selector()">
                    <label >{{label}}</label>
                    <input v-show="false"
                           ref="file_selector"
                           v-on:change="handleFileUpload"
                            name="form__img-upload" type="file" accept=".png, .jpg, .jpeg, .srt, .webp,.mp4,.m4v">
                    <div >
                        <img
                                class="form__img"
                                height="100px"
                                width="100px"
                                :src="previewImage"
                                v-if="previewImage"
                        />
                    </div>

                </div>
            </div>
        </div>


    </div>
</template>

<script>

    export default {
        name: 'ImageSelector',

        inheritAttrs: false,
        components: {},
        props: {
            label: String,
            resolotion: String,
            previewImage:String,
        },
        data() {
            return {
                file:null,

            }
        },
        computed: {},
        mounted() {

        },
        methods: {
            handleFileUpload(e) {

                console.log("handle upload")
                var self = this;
                var myfile = e.target.files[0];
                if (myfile == null) {
                    return
                }
                // Vue.set(self.gallery_images,self.selected_file_index,{preview:URL.createObjectURL(myfile),file:myfile,id:0,is_new:true,has_file:true} );
                // Vue.set(self.files,self.selected_file_index, myfile);
                // self.files[self.selected_file_index] = myfile;
                // self.file = myfile
                // self.previewImage = JSON.parse(JSON.stringify(URL.createObjectURL(myfile)));
                console.log("image",self.previewImage)
                // this.$emit('previewImage', URL.createObjectURL(myfile))
              this.$emit('update:previewImage', URL.createObjectURL(myfile))

              console.log("image",self.previewImage)

                e.target.value = null;
                e.target.files = null;
                this.$emit('imagefile', myfile)
                // this.$emit('update:gallery_files', self.files)
                // this.gallery_images.push({preview:'/img/upload_placeholder.svg',file:null,id:0,is_new:true,has_file:false})

            },
            open_file_selector() {
                this.$refs.file_selector.click()
            },
        },


    }
</script>
