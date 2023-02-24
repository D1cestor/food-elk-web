<template>
    <div class="panel">
         <!-- Buttons to export the chart data to different formats (PDF, CSV or HTML.) and to upload a new file-->
        <div class="flex-row">
            <el-button class="btn" type="primary" @click="print">Export to pdf</el-button>
            <el-button class="btn" type="primary" @click="exportToCsv">Export to csv</el-button>
            <el-button class="btn" type="primary" @click="exportToHtml">Export to html</el-button>
            <el-button class="btn" type="primary" @click="showUploadfile">Upload File</el-button>
        </div>
        <UploadFile :dialogVisible = dialogVisible :server_url = server_url @disapper="HideUploadfile"></UploadFile>
        <div class="select-row">
            <select v-model="selected_index" class="select-cell">
                <option value="" disabled selected>Select a file</option>
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

        <div class="select-row">
            <div class="chart">
                <BarChart :chart-data="chartData" />
            </div>
            <div style="color: black;">
                {{ missing }}% of data is missing
            </div>
        </div>

        

    </div>
</template>

<script>
import axios from 'axios'
import BarChart from './BarChart.vue'
import UploadFile from './UploadFile.vue';
import Global from '../utils/Global';
import { exportPDF, exportCSV, exportHTML } from './../utils/util' // import utility functions for exporting data


export default {
    components: {
        BarChart,
        UploadFile
    },
    props: {},
    data() {
        return {
            selected_index: '', // currently selected index
            selected_field: '', // currently selected field
            missing: 0,
            index: [], // list of available indices
            fields: [], // list of fields for a selected index
            chartData: { // data for the bar chart
                labels: [], // labels for the chart
                datasets: [{
                    data: [], // data points for the chart
                    backgroundColor: 'rgb(255, 99, 132)',
                    label: '' // label for the data
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
                    this.chartData.labels.push(v["key"])
                    this.chartData.datasets[0].data.push(v["doc_count"])
                }
                this.chartData.datasets[0].label = newSelectedField
            }).catch(err => {
                console.log(err)
            })
            axios({
                method: 'post',
                url: Global.querySrc + '/quality',
                data: { "index": this.selected_index, "field": newSelectedField }
            }).then(res => {
                this.missing = res.data
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
        showUploadfile() {
            this.dialogVisible = true;
        },
        HideUploadfile() {
            this.dialogVisible = false;
            this.getIndex();
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
        print() {
            //Export the char in PDF format
            exportPDF('bar-chart', 'bar-chart')
        },
        exportToCsv() {
            //Export the char in CSV format based on the the given dataset
            exportCSV(this.chartData.labels, this.chartData.datasets[0].data)
        },
        exportToHtml() {
            //Export the char in HTML format
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
    vertical-align: top;
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
