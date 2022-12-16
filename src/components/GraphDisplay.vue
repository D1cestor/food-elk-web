<template>
    <div class="panel">
        <div class="flex-row">
            <el-button class="btn" type="primary" @click="print">Export to pdf</el-button>
            <el-button class="btn" type="primary" @click="exportToCsv">Export to csv</el-button>
            <el-button class="btn" type="primary" @click="exportToHtml">Export to html</el-button>
            <el-button class="btn" type="primary" @click="handleUpdate">Upload File</el-button>
        </div>

        <el-dialog v-model="dialogVisible" width="30%">
            <span>
                <el-upload class="upload-demo" ref="upload" drag :action="server_url" multiple :auto-upload="false"
                    :limit="1" :on-success="handleFilUploadSuccess" :on-remove="handleRemove">
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

        <div class="select-row">
            <select v-model="selected_index" class="select-cell">
                <option v-for="i in index" v-bind:value="i">
                    {{ i }}
                </option>
            </select>

            <select v-model="selected_field" class="select-cell">
                <option v-for="field in fields" v-bind:value="field">
                    {{ field }}
                </option>
            </select>
        </div>

        <div class="chart">
            <BarChart :chart-data="chartData" />
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import BarChart from './BarChart.vue'
import Global from '../utils/Global';
import { exportPDF, exportCSV, exportHTML } from './../utils/util'

let loading

export default {
    components: {
        BarChart
    },
    props: {},
    data() {
        return {
            selected_index: '',
            selected_field: '',
            index: [],
            fields: [],
            chartData: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: 'rgb(255, 99, 132)',
                    label: ''
                }]
            },
            dialogVisible: false,
            server_url: ''
        };
    },
    computed: {},
    watch: {
        selected_field(newSelectedField, oldSelectedField) {
            axios({
                method: 'post',
                url: Global.querySrc + '/aggregation',
                data: { "index": this.selected_index, "field": newSelectedField }
            }).then(res => {
                console.log(res)
                this.chartData.labels = []
                this.chartData.datasets[0].data = []
                for (const v of res.data) {
                    this.chartData.labels.push(v["key"])
                    this.chartData.datasets[0].data.push(v["doc_count"])
                }
                this.chartData.datasets[0].label = newSelectedField
            }).catch(err => {
                console.log(err)
            })
        },
        selected_index(newSelectedIndex, oldSelectedField) {
            console.log(newSelectedIndex)
            axios({
                method: 'post',
                url: Global.querySrc + '/field',
                headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                data: newSelectedIndex
            }).then(res => {
                this.fields = res.data
            }).catch(err => {
                console.log(err)
            })
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        submitUpload() {
            console.log(this.server_url)
            this.$refs.upload.submit();
            this.start_loading()
        },
        handleFilUploadSuccess(res, file, fileList) {
            console.log(res, file, fileList)
            this.stop_loading()
            this.$message.success("Upload Successfully!")
            this.getIndex()
        },
        handleUpdate() {
            this.dialogVisible = true;
        },
        handleUpload() {
            // console.log(res,file)
            this.submitUpload()
            this.dialogVisible = false
        },
        getIndex() {
            axios({
                method: 'get',
                url: Global.querySrc + '/index',
            }).then(res => {
                this.index = res.data
            }).catch(err => {
                console.log(err)
            })
            this.fields = []
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
        },
        print() {
            exportPDF('bar-chart', 'bar-chart')
        },
        exportToCsv() {
            exportCSV(this.chartData.labels, this.chartData.datasets[0].data)
        },
        exportToHtml() {
            exportHTML('bar-chart', 'chart.html')
        },
    },
    mounted() {
        this.server_url = Global.fileSrc + '/uploadFile'
        document.querySelector('body').setAttribute('style', 'background:#fff')
        this.getIndex()
    }
}
</script>
<style scoped>
.chart {
    width: 50%;
}


.select-cell {
    height: 50px;
    width: 50%;
}

.panel {
    display: flex;
    flex-direction: column;
    /* justify-content: space-around; */
    width: 100vh;
    padding-bottom: 50px;
}

.btn {
    z-index: 100;
    border-radius: 30px;
    box-shadow: 0 2px 12px 0 rgba(91, 156, 255, 0.9)
}

.select-row {
    display: flex;
    flex-direction: row;
    width: 100%;
}


.el-upload {
    margin: 5px;
}

.flex-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    gap: 10px;
}
</style>
