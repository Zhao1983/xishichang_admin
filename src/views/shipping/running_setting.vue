<template>
<div id="running_setting">
    <div class="mixin-components-container">
        <el-form ref="dataForm" class="form-container" style="margin-bottom: 10px;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>跑腿配置</span>
                </div>
                <el-form-item label-width="17%" label="配送分类: " class="postInfo-container-item">
                    <span>跑腿</span>
                </el-form-item>
                <el-form-item prop="company" label-width="17%" label="配送公司: " class="postInfo-container-item">
                    <span>{{ companyName }}</span>
                </el-form-item>
            </el-card>
        </el-form>
        <el-row style="margin-bottom: 10px;">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="setAddRow" style="float: right; margin-left: 5px;">增加</el-button>
            <el-button type="success" size="small" style="float: right; margin-left: 5px;" @click="updateRunnerInfo">保存</el-button>
            <router-link :to="'/shipping/shipping_detail'" style="float: right;">
                <el-button type="danger" size="small">取消</el-button>
            </router-link>
        </el-row>
        <el-card class="box-card">
            <el-row>
                <el-col :span="24">
                    <el-col :span="8">
                        <div style="height: 1px;"></div>
                    </el-col>
                    <el-col :span="8">
                        <el-table :data="tableData" border fit highlight-current-row>
                            <el-table-column align="center" label="公里" width="130%">
                                <template slot-scope="{row}">
                                    <span>{{ row.priceLevel }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="成本价">
                                <template slot-scope="{row, $index}">
                                    <el-input type="text" size="small" :id="'costPrice-' + $index" class="color_prop" placeholder="" v-model="row.costPrice" />
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="销售价">
                                <template slot-scope="{row, $index}">
                                    <el-input type="text" size="small" :id="'salesPrice-' + $index" class="color_prop" placeholder="" v-model="row.salesPrice" />
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="原价">
                                <template slot-scope="{row, $index}">
                                    <el-popover placement="top-start" title="" width="170" trigger="manual" content="原价不能低于成本价" v-model="row.isVisiblePriceToolTip">
                                        <el-input slot="reference" type="text" size="small" :id="'originalPrice-' + $index" class="color_prop" placeholder="" v-model="row.originalPrice" />
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="8">
                        <div style="height: 1px;"></div>
                    </el-col>
                </el-col>
            </el-row>
        </el-card>
    </div>
</div>
</template>

<script src="@/assets/js/shipping/running_setting.js"></script>

<style lang="scss">
.mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}

.label_color {
    color: red;
}

.color_prop .el-input__inner {
    color: red !important;
}

.el-popover {
    color: red;
}

.el-popper[x-placement^=top] .popper__arrow {
    left: 11.5px !important;
}

.el-popover--plain {
    padding: 5px 20px;
}
</style>
