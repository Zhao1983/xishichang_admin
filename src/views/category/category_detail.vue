<template>
<div id="category_detail">
    <div class="app-container">
        <div class="filter-container">
            <el-card class="box-card">
                <div class="clearfix">
                    <span v-if="subTypeTitle !== ''">{{ typeTitle }} / {{ subTypeTitle }}</span>
                    <span v-else>{{ typeTitle }}</span>
                </div>
                <el-row style="margin-bottom: 10px;">
                    <router-link :to="'/category/category_list'">
                        <el-button class="filter-item" type="danger" size="mini" style="margin-left: 10px; float: right;">取消</el-button>
                    </router-link>
                    <el-button class="filter-item" type="primary" icon="el-icon-edit" size="mini" @click="setRankingGoods" style="float: right;">保存</el-button>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table ref="dragTable" v-loading="listLoading" :data="goodsData" row-key="id" border fit highlight-current-row @sort-change="setSortChange">
                            <el-table-column align="center" label="" width="50%">
                                <template slot-scope="{}">
                                    <svg-icon class="drag-handler" icon-class="drag" />
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="" width="100%">
                                <template slot-scope="{row, $index}">
                                    <i class="el-icon-upload2" style="cursor: pointer;" @click="setMoveTop(row, $index)" />
                                    <i class="el-icon-top" style="margin-left: 5px; cursor: pointer;" @click="setMoveUp(row, $index)" />
                                    <i class="el-icon-bottom" style="margin-left: 5px; cursor: pointer;" @click="setMoveDown(row, $index)" />
                                    <i class="el-icon-download" style="margin-left: 5px; cursor: pointer;" @click="setMoveBottom(row, $index)" />
                                </template>
                            </el-table-column>
                            <el-table-column label="商品图片" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <el-tooltip placement="left" effect="light">
                                        <div slot="content">
                                            <img :src="row.goodsImg" alt="" style="width: 200px; height: 200px;">
                                        </div>
                                        <img :src="row.goodsImg" alt="" style="width: 40px; height: 40px; cursor: pointer;">
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="商品名称">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="所属商户">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="商户负责人" width="120%">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopOwner }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="供货价" width="100%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.costPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="销售价" width="100%">
                                <template slot-scope="{row}">
                                    <span style="color: green;">{{ row.salesPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="原价" width="100%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.originalPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="折扣显示" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.discount | addComma }}折</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="profit" align="center" label="毛利" sortable="custom" width="80%">
                                <template slot-scope="{row}">
                                    <span v-if="row.profit > 0" style="color: green;">{{ row.profit | addComma }}</span>
                                    <span v-else-if="row.profit < 0" style="color: red;">{{ row.profit | addComma }}</span>
                                    <span v-else>{{ row.profit | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="profitRate" align="center" label="毛利率" sortable="custom" width="100%">
                                <template slot-scope="{row}">
                                    <span v-if="row.profitRate > 0" style="color: green;">{{ row.profitRate | addComma }}%</span>
                                    <span v-else-if="row.profitRate < 0" style="color: red;">{{ row.profitRate | addComma }}%</span>
                                    <span v-else>{{ row.profitRate | addComma }}%</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="近30天总销量" width="120%">
                                <template slot-scope="{row}">
                                    <span>{{ row.salesNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="近30天总点击" width="120%">
                                <template slot-scope="{row}">
                                    <span>{{ row.clickNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="状态" width="80%">
                                <template slot-scope="{row}">
                                    <span v-if="row.goodsStatus === '0'" style="color: red;">已下架</span>
                                    <span v-else style="color: blue;">已上架</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</div>
</template>

<script src="@/assets/js/category/category_detail.js"></script>

<style lang="scss">
</style>
