<script setup lang="ts">
import {nanoid} from "nanoid"; nanoid()
import { reactive, ref } from 'vue'
const getFrontFileName = function(fileName){
    return './src/source/front/' + fileName + '.jpg'
}

const getOppositeFileName = function(fileName){
    return './src/opposite/front/' + fileName + '.jpg'
}

const reversePicture = function(){
    if(frontOrOpposite.value == 'opposite'){
        frontOrOpposite.value = 'front'
    }else{
        frontOrOpposite.value = 'opposite'
    }
}

const deleteNodePoint = async function(){
    if(items.length == 1){
        alert('你不能删除最后一个元素')
        return
    }

    if(currentPointId.value && currentPointId.value != ''){
        items.splice(items.findIndex(item=>item.id === currentPointId.value),1)
    }
    resetForm()
}

const addNodePoint = async function(){
    const index = items.findIndex(item=>item.id === currentPointId.value)
    if(form.direction == '上'){
        items.splice(index,0,{
            id:nanoid(10),
            year: yearFileMap[originalFiles[currentIndex.value]],
            description: descriptionMap[originalFiles[currentIndex.value]],
            cardUrl: getFrontFileName(originalFiles[currentIndex.value])
        })
    }else{
        items.splice(index+1,0,{
            id:nanoid(10),
            year: yearFileMap[originalFiles[currentIndex.value]],
            description: descriptionMap[originalFiles[currentIndex.value]],
            cardUrl: getFrontFileName(originalFiles[currentIndex.value])
        })
    }
    resetForm()
}

const ranks = reactive([{
    color:'red',
    score:0,
},{
    color:'green',
    score:0,
},{
    color:'blue',
    score:0,
},])

const resetForm = function() {
    form.direction = ''

    dialogFormVisible.value = false
    currentPointId.value = ''
}

const changePoint = async function(item){
    dialogFormVisible.value = true
    currentPointId.value = item.id;
}
const getStyle = function(rank){
    return `background-color:${rank.color};width:100px;height:100px;display:flex;justify-content:center;align-items:center;margin-right: 30px;`
}

const addScore = function(rank){
    rank.score += 1
}
const subScore = function(rank){
    rank.score -= 1
    if(rank.score <= 0){
        rank.score = 0
    }
}
const addCurrentIndex = function(){
    frontOrOpposite.value = 'opposite'
    currentIndex.value = (currentIndex.value + 1) % originalFiles.length
}
let originalFiles = reactive([
    '发明啤酒','牧羊','发明眼镜'
].sort(() => 0.5 - Math.random()))
let yearFileMap = {
    '发明啤酒': '1000',
    '牧羊': '-9200',
    '发明眼镜':'1315'
}
let descriptionMap = {
    '发明啤酒': '发明啤酒',
    '牧羊': '牧羊',
    '发明眼镜':'发明眼镜'
}
const items = reactive([{
    id:nanoid(10),
    year: yearFileMap[originalFiles[0]],
    description: originalFiles[0],
    cardUrl: getFrontFileName(originalFiles[0])
}])
const options = [
    { value: '上', label: '上' },
    { value: '下', label: '下' },
]
let dialogFormVisible = ref(false)
let currentPointId = ref('')
let form = reactive({
    description:'',
    year:'',
    fileName:'',
    direction:'',
})

let currentIndex = ref(1)
let frontOrOpposite = ref('opposite')
</script>

<template>
    <el-timeline style="max-width: 600px">
        <el-timeline-item
            v-for="item of items"
            :key="item.id"
            :timestamp=item.year
            placement="top"
            @click="changePoint(item)">
            <el-card>
                <h4 class="card-description">{{item.description}}</h4>
                <img :src="item.cardUrl">
            </el-card>
        </el-timeline-item>
    </el-timeline>

    <div class="fixed-element">
        <img :src="'./src/source/'+frontOrOpposite+'/' + originalFiles[currentIndex] + '.jpg'" @click="reversePicture()">
        <br>
        <button @click="addCurrentIndex()">下一张图</button>
    </div>

    <div class="score">
        <div v-for="rank of ranks" :style="getStyle(rank)">
            <el-button @click="subScore(rank)">减分</el-button>
            <el-tag @click="addScore(rank)" style="font-size: 32px">{{rank.score}}</el-tag>
        </div>
    </div>

    <el-dialog v-model="dialogFormVisible" title="添加或删除卡片" width="500">
        <el-form :model="form">
            <el-form-item label="添加方向" :label-width="100">
                <el-select
                    v-model="form.direction"
                    placeholder="Select"
                    size="large"
                    style="width: 240px"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteNodePoint">删除节点</el-button>
                <el-button type="primary" @click="addNodePoint">
                    添加节点
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style>
.fixed-element {
    position: fixed;
    right: 26%;
    top: 10%;
    display: flex;
    flex-direction: column;
}
.el-timeline-item__timestamp{
    font-size: 25px !important;
    color: red !important;
}
.card-description{
    font-size: 25px;
    color: darkorange;
}
.score{
    position: fixed;
    right: 22%;
    top: 80%;
    display: flex;
    flex-direction: row;
}
</style>
