<template>
    <div class="panel">
        <div class="flex-row">
            <el-button class="btn" type="primary" @click="print">Export to pdf</el-button>
            <el-button class="btn" type="primary" @click="exportToCsv">Export to csv</el-button>
            <el-button class="btn" type="primary" @click="exportToHtml">Export to html</el-button>
            <el-button class="btn" type="primary" @click="showUploadfile">Upload File</el-button>
        </div>
        <UploadFile :dialogVisible = dialogVisible :server_url = server_url @disapper="HideUploadfile"></UploadFile>
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
import { exportPDF, exportCSV, exportHTML } from './../utils/util'


export default {
    components: {
        BarChart,
        UploadFile
    },
    props: {},
    data() {
        return {
            selected_index: '',
            selected_field: '',
            missing: 0,
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
