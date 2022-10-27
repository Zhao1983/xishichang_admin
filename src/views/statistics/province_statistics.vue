<template>
<div id="province_statistics">
    <div class="app-container">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="5">
                                <el-form-item label-width="40%" label="起始下单: ">
                                    <!-- 주문시작날자 -->
                                    <el-date-picker v-model="beginDt" type="date" placeholder="起始时间" size="small" @change="setChangeDate" :picker-options="pickerOptions" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label-width="40%" label="结束下单: ">
                                    <!-- 주문시작날자 -->
                                    <el-date-picker v-model="endDt" type="date" placeholder="结束时间" size="small" @change="setChangeDate" :picker-options="pickerOptions" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item>
                                    <el-button type="primary" plain icon="el-icon-search" size="small" @click="setSearchData" style="margin-left: 10%;">搜索</el-button>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </div>
        <div class="filter-container">
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-table v-loading="listLoading" :data="listData" border fit highlight-current-row @sort-change="setSortChange">
                            <el-table-column label="编号" align="center" width="60%">
                                <template slot-scope="{$index}">
                                    <span>{{ ++$index }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="省份" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.provinceName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="orderNum" label="订单总数" align="center" sortable="custom">
                                <template slot-scope="{row}">
                                    <span>{{ row.orderNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="orderRate" label="全国占比" align="center" sortable="custom">
                                <template slot-scope="{row}">
                                    <span>{{ row.orderRate | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="salesPrice" label="商品总金额(￥)" align="center" sortable="custom">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.salesPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="salesPriceAvg" label="客单价(￥)" align="center" sortable="custom">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.salesPriceAvg | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="profitInfo" label="平均毛利(￥)" align="center" sortable="custom">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.profitInfo | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="profitRate" label="毛利率" align="center" sortable="custom">
                                <template slot-scope="{row}">
                                    <span>{{ row.profitRate | addComma }}%</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="平均重量" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsWeight | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单异常数量" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.warningNum | addComma }}</span>
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

<script src="@/assets/js/statistics/province_statistics.js"></script>

<style lang="scss" scoped>

</style>
