<template>
    <el-dialog v-model="dialogVisible" width="30%">
        <span>
            <el-upload class="upload-demo" ref="upload" drag :action="server_url" multiple :auto-upload="false" :limit="1"
                :on-success="handleFilUploadSuccess" :on-remove="handleRemove">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drag the file here, or <em>click here to upload the file</em>
                </div>

            </el-upload>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleUpload">Confirm</el-button>
        </span>
    </el-dialog>
</template>

<script>

let loading
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        server_url: {
            type: String
        }
    },
    data() {
        return {}
    },

    computed: {},

    watch: {
        dialogVisible(newDialogVisible, oldDialogVisible) {
            if (!newDialogVisible) this.$emit('disapper')
        }
    },

    methods: {
        handleFilUploadSuccess(res, file, fileList) {
            console.log(res, file, fileList)
            this.stop_loading()
            this.$message.success("Upload Successfully!")
            this.getIndex()
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        submitUpload() {
            console.log(this.server_url)
            this.$refs.upload.submit();
            this.start_loading()
        },
        handleUpdate() {
            this.dialogVisible = true;
        },
        handleUpload() {
            // console.log(res,file)
            this.submitUpload()
            this.dialogVisible = false
        },
        start_loading() {
            loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                // background: 'rgba(0, 0, 0, 1)',
                target: document.querySelector('#body')
            });
        },
        stop_loading() {
            loading.close()
            this.dialogVisible = false
        },
    },
}
</script>
<style scoped></style>