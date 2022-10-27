<template>
<div id="statistics">
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
                        <el-table v-loading="listLoading" :data="listData" border fit highlight-current-row>
                            <el-table-column label="编号" align="center" width="60%">
                                <template slot-scope="{row}">
                                    <span>{{ row.id }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="统计日期" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.statDate }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="曜日" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.day }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商户数量" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商户总数量" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopTotalNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品数量 / 商品总数量" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsNum | addComma }}/{{ row.goodsTotalNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="公众号关注人数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.userTotalNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="新关注人数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.userNewNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="取消关注人数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.userUnfollowNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="公众号浏览数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.gzhAccessNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="小程序浏览数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.miniAccessNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="公众号订单数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.gzhOrderNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="小程序订单数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.miniOrderNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单支付总额" align="center">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.orderTotalPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单退款总额" align="center">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.orderRefundPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品总价格" align="center">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.goodsTotalPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品总成本" align="center">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.goodsCostPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收取跑腿/快递费" align="center">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收取包装费" align="center">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.packagePrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="当日发货数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.shippedNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="待发货总数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.unshippedNum | addComma }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNum > 0" :total="totalNum" :page.sync="page" :limit.sync="size" @pagination="getData" style="text-align: center;" />
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</div>
</template>

<script src="@/assets/js/statistics/statistics.js"></script>

<style lang="scss" scoped>

</style>
