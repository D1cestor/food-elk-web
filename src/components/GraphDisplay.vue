<template>
    <select v-model="selectedfield" :style="{height: 50 + 'px'}">
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
            selectedfield: '',
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
        selectedfield(newSelectedField, oldSelectedField) {
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
        }
    },
    methods: {

    },
    mounted() {
        document.querySelector('body').setAttribute('style', 'background:#fff')
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8080/field',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            data: 'food'
        }).then(res => {
            this.fields = res.data
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>
<style scoped>

</style>