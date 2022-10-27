<template>
<div id="event_product">
    <div class="app-container">
        <el-row>
            <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="setShowProductDlg" style="float: right; margin-bottom: 10px;">新增</el-button>
        </el-row>
        <div class="filter-container">
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>活动商品</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="listEventProduct" border fit highlight-current-row style="width: 100%;">
                            <el-table-column label="编号" align="center" width="80%;">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsId }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品图片" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <img :src="row.uri" style="width: 45px; height: 45px;" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column label="商品名称" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品价格" align="center" width="130%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.originalPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="活动价格" align="center" width="150%">
                                <template slot-scope="{row, $index}">
                                    <el-input class="color_prop" :id="'sale-price-' + $index" v-model="row.salesPrice" type="text" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="序号" align="center" width="150%">
                                <template slot-scope="{row, $index}">
                                    <el-input :id="'rankNumber-' + $index" v-model="row.rankingNum" type="text" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="删除" align="center" width="100%">
                                <template slot-scope="{$index}">
                                    <el-button size="mini" icon="el-icon-edit" type="danger" @click="setDeleteProduct($index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-card>
            <el-row>
                <el-button type="primary" size="normal" style="float: right; margin-left: 10px;" @click="setUpdate">编辑</el-button>
                <router-link :to="'/event/event_list'" style="float: right;">
                    <el-button type="danger">取消</el-button>
                </router-link>
            </el-row>
        </div>
    </div>

    <!-- 이벤트상품 추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="添加商品" :visible.sync="isShowProductDlg" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-row>
                <el-input type="text" size="small" v-model="searchProdName" placeholder="请输入商品名称" style="width: 60%;" @keyup.enter.native="setSearchProduct" />
                <el-button type="primary" size="small" plain icon="el-icon-search" style="float: right;" @click="setSearchProduct">搜索</el-button>
            </el-row>
        </div>
        <el-row>
            <el-card class="box-card">
                <el-table :data="dataProduct" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="选择" prop="id" align="center" width="80%;">
                        <template slot-scope="{row}">
                            <input type="radio" v-model="isCheckProd" name="" :value="row.id" @click="setSelectProduct(row)">
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.goodsName }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="totalProd > 0" :total="totalProd" :page.sync="prodPage" :limit.sync="prodSize" @pagination="getProductData" style="text-align: center;" />
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="setCancelDlg">取消</el-button>
            <el-button type="primary" @click="setAddProduct">添加商品</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/event/event_product.js"></script>

<style lang="scss">
.mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}

.color_prop .el-input__inner {
    color: red !important;
}
</style>
