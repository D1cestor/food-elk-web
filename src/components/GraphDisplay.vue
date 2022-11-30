<template>
    <form enctype="multipart/form-data" method="POST" action="/upload">
        <input type="text" name="imgName" />
        <input type="file" name="imgFile" />
        <input type="submit" value="upload" />
    </form>
    <br>

    <select v-model="selected_index" :style="{ height: 50 + 'px' }">
        <option v-for="i in index" v-bind:value="i">
            {{ i }}
        </option>
    </select>
    <select v-model="selected_field" :style="{ height: 50 + 'px' }">
        <option v-for="field in fields" v-bind:value="field">
            {{ field }}
        </option>
    </select>
    <BarChart :chart-data="chartData" />
</template>

<script>
import axios from 'axios'
import BarChart from './BarChart.vue'

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
        };
    },
    computed: {},
    watch: {
        selected_field(newSelectedField, oldSelectedField) {
            axios({
                method: 'post',
                url: 'http://127.0.0.1:8080/aggregation',
                data: { "index": "food", "field": newSelectedField }
            }).then(res => {
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
                url: 'http://127.0.0.1:8080/field',
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

    },
    mounted() {
        document.querySelector('body').setAttribute('style', 'background:#fff')
        axios({
            method: 'get',
            url: 'http://127.0.0.1:8080/index',
        }).then(res => {
            this.index = res.data
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>
<style scoped>

</style>
