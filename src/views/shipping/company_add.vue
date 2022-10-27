<template>
<div id="company_add">
    <div class="mixin-components-container">
        <el-form ref="dataForm" :model="dataForm" :rules="rules" class="form-container" style="margin-bottom: 10px;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>新增配送公司</span>
                </div>
                <el-form-item label-width="17%" label="配送分类: " class="postInfo-container-item">
                    <span>{{ kind }}</span>
                </el-form-item>
                <el-form-item prop="company" label-width="17%" label="配送公司: " class="postInfo-container-item">
                    <el-select v-model="dataForm.company" size="small" placeholder="请选择" clearable style="width: 20%">
                        <el-option v-for="item in listCompany" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                </el-form-item>
            </el-card>
        </el-form>
        <el-row>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="setAddRow" style="float: right; margin-bottom: 10px;">新增</el-button>
        </el-row>
        <el-card class="box-card">
            <el-row>
                <el-table :data="tableData" border fit highlight-current-row max-height="1000">
                    <el-table-column v-for="(item, idx) in listProvince" :key="idx" align="center" :label="item.province" :label-class-name="item.active" :fixed="item.fixed" width="130%">
                        <template slot-scope="{row, $index}">
                            <div v-if="$index === 0">
                                <span class="label_color_day" v-if="idx === 0">时效</span>
                                <input type="text" size="small" v-if="idx !== 0" :id="'minDays-' + (idx - 1)" class="color_prop_day" placeholder="" style="margin-bottom: 5px;" v-model="row.minDays[idx - 1]" />
                                <input type="text" size="small" v-if="idx !== 0" :id="'maxDays-' + (idx - 1)" class="color_prop_day" placeholder="" v-model="row.maxDays[idx - 1]" />
                            </div>
                            <div v-else>
                                <span v-if="idx === 0">{{ row.weight }}kg</span>
                                <input type="text" size="small" v-if="idx !== 0" :id="'cost-' + $index + '-' + (idx - 1)" class="color_prop" placeholder="" style="margin-bottom: 5px;" v-model="row.costPrice[idx - 1]" />
                                <input type="text" size="small" v-if="idx !== 0" :id="'sale-' + $index + '-' + (idx - 1)" class="color_prop" placeholder="" v-model="row.salePrice[idx - 1]" />
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-card>
    </div>
    <el-row>
        <router-link :to="'/shipping/shipping_detail'" style="position: fixed; right: 120px; bottom: 50px; z-index: 10;">
            <el-button type="danger" size="normal">取消</el-button>
        </router-link>
        <el-button type="primary" size="normal" style="position: fixed; right: 40px; bottom: 50px; z-index: 10;" @click="setRegister">保存</el-button>
    </el-row>
</div>
</template>

<script src="@/assets/js/shipping/company_add.js"></script>

<style lang="scss">
.mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}

.color_prop {
    color: red !important;
}

.label_color {
    color: red;
}

.label_color_day {
    color: blue;
}

.color_prop_day {
    color: blue !important;
}

input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input {
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    width: 100%;
    height: 30px;
    padding-left: 10px;
}

input:focus {
    border-color: #409EFF;
    outline: 0;
}
</style>
