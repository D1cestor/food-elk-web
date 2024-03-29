<template>
    <div class="panel">
        <!-- Buttons to export the chart data to different formats (PDF, CSV or HTML.) and to upload a new file-->
        <div class="flex-row">
            <el-button class="btn" type="primary" @click="print">Export to pdf</el-button>
            <el-button class="btn" type="primary" @click="exportToCsv">Export to csv</el-button>
            <el-button class="btn" type="primary" @click="exportToHtml">Export to html</el-button>
        </div>

        <!-- Dialog to allow users to upload a file -->
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

        <!-- Selects to allow users to choose the data displayed in the chart, in this case, two datasets -->
        <div class="select-row">
            <select v-model="selected_index" class="select-cell">
                <option value="" disabled selected>Select a file</option>
                <option v-for="i in index" v-bind:value="i">
                    {{ i }}
                </option>
            </select>
            <select v-model="selected_index2" class="select-cell">
                <option value="" disabled selected>Select another file to compare</option>
                <option v-for="i in index" v-bind:value="i">
                    {{ i }}
                </option>
            </select>

            <select v-model="selected_field" class="select-cell">
                <option value="" disabled selected>Choose the specified attribute</option>
                <option v-for="field in fields" v-bind:value="field">
                    {{ field }}
                </option>
            </select>
        </div>

        <!-- The comparison chart itself -->
        <div class="chart">
            <BarChart :chart-data="chartData" />
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import BarChart from './BarChartComparison.vue' // import BarChart component
import Global from '../utils/Global';
import { exportPDF, exportCSV, exportHTML } from './../utils/util' // import utility functions for exporting data

let loading

export default {
    components: {
        BarChart // register BarChart component
    },
    props: {},
    data() {
        return {
            selected_index: '', // one of the currently selected index to compare
            selected_index2: '', // the other currently selected index to compare
            selected_field: '', // currently selected field
            index: [], // first list of available indices to compare
            index2: [], // second list of available indices to compare
            fields: [], // list of fields for the selected indexes to compare 
            chartData: { // data for the bar chart
                labels: [], // labels for the chart
                datasets: [{ 
                    data: [], // data points for the chart (first dataset)
                    backgroundColor: 'rgb(255, 99, 132)',
                    label: '' // label for the data (first dataset)
                },
                {
                    data: [], // data points for the chart (second dataset)
                    backgroundColor: 'rgb(0, 0, 255)',
                    label: '' // label for the data (second dataset)
                }]
            },
            dialogVisible: false, // visibility of the dialog box
            server_url: '' // server url for uploading file
        };
    },
    computed: {},
    watch: {
        selected_field(newSelectedField, oldSelectedField) { // watch for changes in selected field
            // Make an API request to retrieve the data for the selected field
            axios({
                method: 'post',
                url: Global.querySrc + '/aggregation',
                data: { "index": this.selected_index, "field": newSelectedField }
            }).then(res => {
                console.log(res)
                this.chartData.labels = []
                this.chartData.datasets[0].data = []
                
                for (const v of res.data) {
                    console.log(res.data)
                    this.chartData.labels.push(v["key"])
                    this.chartData.datasets[0].data.push(v["doc_count"])
                }
                this.chartData.datasets[0].label = newSelectedField
            }).catch(err => {
                console.log(err)
            }),
            axios({
                method: 'post',
                url: Global.querySrc + '/aggregation',
                data: { "index": this.selected_index2, "field": newSelectedField }
            }).then(res => {
                console.log(res)
                this.chartData.datasets[1].data = []
                for (const v of res.data) {
                    console.log(res.data)
                    this.chartData.datasets[1].data.push(v["doc_count"])
                }
                this.chartData.datasets[1].label = newSelectedField
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
        },
        selected_index2(newSelectedIndex, oldSelectedField) {
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
        handleRemove(file, fileList) { // handle file removal
            console.log(file, fileList);
        },
        submitUpload() { // submit file upload
            // Submit the upload request and display loading animation
            console.log(this.server_url)
            this.$refs.upload.submit();
            this.start_loading()
        },
        handleFilUploadSuccess(res, file, fileList) { // handle file upload success
            console.log(res, file, fileList)
            // Stop loading animation and display success message
            this.stop_loading()
            this.$message.success("Upload Successfully!")
            this.getIndex() // retrieve index and fields data after file upload
        },
        handleUpdate() { // handle update button click
            this.dialogVisible = true;
        },
        handleUpload() { // handle file upload button click
            // console.log(res,file)
            this.submitUpload()
            this.dialogVisible = false
        },
        getIndex() { // retrieve index and fields data
            // Make an API request to retrieve the available indices from server
            axios({
                method: 'get',
                url: Global.querySrc + '/index',
            }).then(res => {
                this.index = res.data
            }).catch(err => {
                console.log(err)
            })
            // Reset fields array to empty
            this.fields = []
        },
        start_loading() {
            // start loading spinner
            loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                // background: 'rgba(0, 0, 0, 1)',
                target: document.querySelector('#body')
            });
        },
        stop_loading() {
             //Stop the loading the data
            loading.close()
        },
        print() {
            //Export the char in PDF format
            exportPDF('bar-chart-comparison', 'bar-chart')
        },
        exportToCsv() {
            //Export the char in CSV format based on the the given dataset
            exportCSV(this.chartData.labels, this.chartData.datasets[0].data)
        },
        exportToHtml() {
            //Export the char in HTML format
            exportHTML('bar-chart-comparison', 'chart.html')
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

.panel1 {
    /*display: flex;*/
    display: inline-block;
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
    display: inline-block;
  vertical-align: top;
    /*display: flex;*/
    flex-direction: row;
    margin-bottom: 10px;
    gap: 10px;
}
</style>
