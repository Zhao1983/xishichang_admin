<template>
<div id="settlement_list">
    <div class="app-container">
        <!-- 검색섹션 -->
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="订单号: ">
                                    <el-input placeholder="订单号模糊查询" v-model="searchOrderNo" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="拣货名称: ">
                                    <el-input placeholder="拣货名称" v-model="searchGoodsShortName" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="商户名称: ">
                                    <el-input placeholder="商户名称" v-model="searchShopName" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="小组负责人: ">
                                    <el-select v-model="searchManagerId" placeholder="选择小组负责人" size="small" clearable style="width: 100%;">
                                        <el-option :key="0" label="全部" :value="0" />
                                        <el-option v-for="item in adminInfo" :key="item.id" :label="item.name" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="6">
                                <el-form-item v-if="activeOption === 'before'" label-width="25%" label="发货状态: ">
                                    <el-select v-model="searchOrderStatus" placeholder="选择发货状态" size="small" clearable style="width: 100%;">
                                        <el-option :key="1" label="已发货" :value="1" />
                                        <el-option :key="0" label="待发货" :value="0" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-else label-width="25%" label="结算批次: ">
                                    <el-input placeholder="结算批次" v-model="searchsettlementNo" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="付款时间(开始): ">
                                    <el-date-picker v-model="searchBeginDate" type="date" placeholder="付款时间" size="small" :picker-options="pickerOptionBegin" @change="setChangeDate" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="付款时间(结束): ">
                                    <el-date-picker v-model="searchEndDate" type="date" placeholder="付款时间" size="small" :picker-options="pickerOptionEnd" @change="setChangeDate" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="">
                                    <el-button type="primary" plain icon="el-icon-search" size="small" @click="setSearchData">搜索</el-button>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </div>
        <div class="filter-container">
            <el-row style="margin-bottom: 10px;">
                <el-button type="primary" @click="setExport('')" size="mini">导出</el-button>
                <el-button v-show="activeOption === 'before'" type="success" @click="setShowSettlementDialog('', 'multi')" size="mini">结算</el-button>
                <el-button v-show="activeOption === 'after'" type="success" @click="setExport('search')" size="mini">搜索导出</el-button>
                <span style="float: right; color: red; margin-right: 20px;">毛利总计: {{ sumPrice_1 | addCommaTwo }}</span>
                <span style="float: right; color: red; margin-right: 20px;">待结算总额: {{ sumPrice | addCommaTwo }}</span>
            </el-row>
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-tabs v-model="activeOption" type="border-card">
                            <el-tab-pane v-for="item in tabOption" :key="item.key" :label="item.label" :name="item.key">
                                <el-table ref="tableData" v-loading="listLoading" :data="settlementData" :row-key="getRowKeys" :expand-row-keys="expandKeys" fit highlight-current-row @expand-change="expandChange" @selection-change="handleSelectionChange" @select="rowSelectChange" @select-all="rowAllSelectChange">
                                    <el-table-column type="selection" align="center" width="60%"></el-table-column>
                                    <el-table-column type="expand" align="center" width="60%">
                                        <template slot-scope="{row}">
                                            <el-table :ref="'subTableData_' + row.shopId" :data="subSettlementData[row.shopId]" border fit highlight-current-row @select-all="subRowAllSelectChange(row.shopId)" @selection-change="handleSubSelectionChange" @select="subRowSelectChange(row.shopId)">
                                                <el-table-column v-if="activeOption === 'before'" type="selection" align="center" width="100%"></el-table-column>
                                                <el-table-column align="center" label="订单编号" width="180%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.orderNo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column v-if="activeOption === 'after'" align="center" label="结算时间" width="160%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.settlementNo.slice(0, 4) + '-' + row.settlementNo.slice(4, 6) + '-' + row.settlementNo.slice(6, 8) + ' ' + row.settlementNo.slice(8, 10) + ':' + row.settlementNo.slice(10, 12) + ':' + row.settlementNo.slice(12, 14) }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="订单状态" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span v-if="row.deliveryStatus === '0'">待发货</span>
                                                        <span v-else>待收货</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="拣货名称" width="140%">
                                                    <template slot-scope="{row}">
                                                        <span v-if="row.goodsShortName === '' || row.goodsShortName === null">-</span>
                                                        <span v-else>{{ row.goodsShortName }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="成交价" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span style="color: red;">{{ row.salesPrice | addCommaTwo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="进货价" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span style="color: red;">{{ row.costPrice | addCommaTwo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="商品数量" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.goodsNum | addComma }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="零售小计" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span style="color: red;">{{ row.totalSalesPrice | addCommaTwo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="应结算" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span style="color: red;">{{ row.totalCostPrice | addCommaTwo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="毛利小计" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.profitInfo | addCommaTwo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="毛利率" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.profitRate }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column v-if="activeOption === 'after'" align="center" label="结算状态" width="80%">
                                                    <template slot-scope="{row}">
                                                        <el-badge :is-dot="row.isAfterRemark" style="margin-top: 7px;">
                                                            <el-tooltip v-if="row.isAfterRemark" placement="bottom" effect="light">
                                                                <div slot="content">
                                                                    <span>{{ row.settlementRemark }}</span>
                                                                </div>
                                                                <el-button style="padding: 8px 10px;" size="small" type="danger">已结算</el-button>
                                                            </el-tooltip>
                                                            <el-button v-else style="padding: 8px 10px;" size="small" type="danger">已结算</el-button>
                                                        </el-badge>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column v-if="activeOption === 'before'" align="center" label="结算操作" width="150%">
                                                    <template slot-scope="{row}">
                                                        <el-button size="mini" type="primary" @click="setShowSettlementDialog(row, 'single')">待结算</el-button>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column v-else-if="activeOption === 'after'" align="center" label="结算批次号" width="130%">
                                                    <template slot-scope="{row}">
                                                        <span style="text-decoration: underline; color: blue; cursor: pointer;" @click="setShowSettlementDialog(row, 'detail')">{{ row.settlementNo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="补差额" width="170%">
                                                    <template slot-scope="{row}">
                                                        <span style="color: red;">{{ row.differencePrice | addCommaTwo }}</span>&nbsp;&nbsp;&nbsp;
                                                        <el-button v-show="activeOption === 'before'" size="mini" type="success" @click="setShowPriceDialog(row)">补差额</el-button>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="付款时间" width="160%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.payDt }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="发货时间" width="160%">
                                                    <template slot-scope="{row}">
                                                        <span v-if="row.deliveryDt === '' || row.deliveryDt === null">-</span>
                                                        <span v-else>{{ row.deliveryDt }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="备注">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.differencePriceRemark }}</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                            <pagination v-show="subTotalNum > 0 && activeOption === 'after'" :total="subTotalNum" :page.sync="subPage" :limit.sync="subSize" @pagination="getAfterSubSettlement" style="text-align: center;" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="activeOption === 'before'" label="最早待结算时间" align="center" width="300%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.settlementDt }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="商户名称" align="center">
                                        <template slot-scope="{row}">
                                            <span>{{ row.shopName }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="小组负责人" align="center" width="300%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.managerName }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="商品种类数量" align="center" width="300%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.orderNum | addComma }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="待结算总额" align="center" width="300%">
                                        <template slot-scope="{row}">
                                            <span style="color: red;">{{ row.settlementPrice | addCommaTwo }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="毛利总计" align="center" width="300%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.profitInfo | addCommaTwo }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="结算二维码" align="center" width="300%">
                                        <template slot-scope="{row}">
                                            <span v-if="row.payCode !== ''">有</span>
                                            <span v-else>-</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <pagination v-show="totalNum > 0" :total="totalNum" :page.sync="page" :limit.sync="size" @pagination="getSettlement" style="text-align: center;" />
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>

    <!-- 차이나는 가격수정 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="补差价" :visible.sync="isShowPriceDialog" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-table :data="priceInfo" border fit highlight-current-row>
                    <el-table-column align="center" label="商品信息" width="150%">
                        <template slot-scope="{row}">
                            <span v-if="row.goodsShortName === '' || row.goodsShortName === null">-</span>
                            <span v-else>{{ row.goodsShortName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="补差价" width="130%">
                        <template slot-scope="{row, $index}">
                            <el-input placeholder="" v-model="row.differencePrice" :ref="'differencePrice-' + $index" :id="'differencePrice-' + $index" size="small" class="edit-input color_prop" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="备注">
                        <template slot-scope="{row}">
                            <el-input placeholder="" v-model="row.differencePriceRemark" size="small" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog('price')">取消</el-button>
            <el-button type="primary" @click="setChangePrice">保存</el-button>
        </div>
    </el-dialog>
    <!-- 결산 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="结算" :visible.sync="isShowSettlementDialog" width="40%" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="8">
                                <el-form-item label-width="25%" label="商户名称: ">
                                    <span>{{ settleShopName }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label-width="25%" label="">
                                    <span>共 ({{ settleItem }}条)</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label-width="50%" label="总应结算金额: ">
                                    <span style="color: red;">{{ settleTotalPrice | addCommaTwo }}</span>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="12">
                                <el-form-item label-width="18%" label="结算备注: ">
                                    <el-input v-if="activeOption === 'before'" v-model="settleRemark" placeholder="结算备注" size="small" />
                                    <span v-else>{{ settleRemark }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="67%" label="结算批次: ">
                                    <span>{{ settleNo }}</span>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="8">
                                <el-form-item label-width="27%" label="">
                                    <Thumbnail :styles="styles" :imageUrl="settleQrCode" />
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
                    <el-table :data="settleInfo" border fit highlight-current-row>
                        <el-table-column align="center" label="商品信息">
                            <template slot-scope="{row}">
                                <span v-if="row.goodsShortName === '' || row.goodsShortName === null">-</span>
                                <span v-else>{{ row.goodsShortName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="供货价">
                            <template slot-scope="{row}">
                                <span style="color: red;">{{ row.costPrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="数量">
                            <template slot-scope="{row}">
                                <span>{{ row.goodsNum | addComma }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="应结算">
                            <template slot-scope="{row}">
                                <span style="color: red;">{{ row.totalCostPrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-card>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog('settlement')">取消</el-button>
            <el-button v-show="activeOption === 'before'" type="primary" @click="setSettlement">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/settlement/settlement_list.js"></script>

<style lang="scss">
.color_prop input {
    color: red !important;
}
</style>
