<template>
<div id="company_update">
    <div class="mixin-components-container">
        <el-row>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="setAddRow" style="float: right; margin-bottom: 10px;">新增</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="setShowDialog" style="float: right; margin-bottom: 10px; margin-right: 15px;">批量更改</el-button>
        </el-row>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>{{ deliveryName }}配置</span>
                <span style="color: #999999; font-size: 12px; margin-left: 15px;">(不设置省份运费将视为不配送省份, 红色省份表示陆运，设置运费也会无效，蓝色表示空运)</span>
            </div>
            <el-row>
                <el-table :data="tableData" border fit highlight-current-row max-height="1000">
                    <el-table-column v-for="(item, idx) in listProvince" :key="idx" align="center" :label="item.province" :label-class-name="item.active" :fixed="item.fixed" width="130%">
                        <template slot-scope="{row, $index}">
                            <div v-if="$index === 0">
                                <span class="label_color_day" v-if="idx === 0">时效</span>
                                <input type="text" size="small" v-if="idx !== 0" :id="'minDays-' + (idx - 1)" class="color_prop_day" placeholder="" style="margin-bottom: 5px;" v-model.lazy="row.minDays[idx - 1]" />
                                <input type="text" size="small" v-if="idx !== 0" :id="'maxDays-' + (idx - 1)" class="color_prop_day" placeholder="" v-model.lazy="row.maxDays[idx - 1]" />
                            </div>
                            <div v-else>
                                <span v-if="idx === 0">{{ row.weight }}kg</span>
                                <input type="text" size="small" v-if="idx !== 0" :id="'cost-' + $index + '-' + (idx - 1)" class="color_prop" placeholder="" style="margin-bottom: 5px;" v-model.lazy="row.costPrice[idx - 1]" />
                                <input type="text" size="small" v-if="idx !== 0" :id="'sale-' + $index + '-' + (idx - 1)" class="color_prop" placeholder="" v-model.lazy="row.salePrice[idx - 1]" />
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
        <el-button type="primary" size="normal" style="position: fixed; right: 40px; bottom: 50px; z-index: 10;" @click="setUpdate">保存</el-button>
    </el-row>

    <el-dialog title="批量更改" :visible.sync="isShowDialog" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-drag-select v-model="proviceValues" style="width: 100%; margin-bottom: 15px;" multiple placeholder="请选择更改省份">
                <el-option v-for="(item, idx) in provinceData" :key="idx" :label="item" :value="item" />
            </el-drag-select>
        </el-row>
        <el-row>
            <el-table :data="updateData" border fit highlight-current-row>
                <el-table-column align="center" label="重量" width="180%">
                    <template slot-scope="{row}">
                        <span>{{ row.weight }}kg</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="原价">
                    <template slot-scope="{row, $index}">
                        <input type="text" size="small" :id="'cost-' + $index" class="color_prop" placeholder="" v-model.lazy="row.costPrice" />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="销售价">
                    <template slot-scope="{row, $index}">
                        <input type="text" size="small" :id="'sale-' + $index" class="color_prop" placeholder="" v-model.lazy="row.salePrice" />
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddValues">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/shipping/company_update.js"></script>

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
