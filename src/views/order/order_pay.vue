<template>
<div id="order_pay">
    <div class="app-container">
        <!-- 검색섹션 -->
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="订单号: ">
                                    <!-- 주문번호 -->
                                    <el-input placeholder="订单号模糊查询" v-model="searchOrderNo" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="40%" label="收货人姓名: ">
                                    <el-input placeholder="收货人姓名" v-model="searchUserName" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="40%" label="收货人电话: ">
                                    <el-input placeholder="收货人电话" v-model="searchUserPhone" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="收货信息: ">
                                    <!-- 수화정보 -->
                                    <el-input placeholder="收货信息" v-model="searchAddress" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="商品名称: ">
                                    <!-- 주문번호 -->
                                    <el-input placeholder="商品名称查询" v-model="searchGoodsName" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="起始下单: ">
                                    <!-- 주문시작날자 -->
                                    <el-date-picker v-model="beginDt" type="date" placeholder="起始下单时间" size="small" @change="setChangeDate" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="结束下单: ">
                                    <!-- 주문시작날자 -->
                                    <el-date-picker v-model="endDt" type="date" placeholder="结束下单时间" size="small" @change="setChangeDate" :picker-options="pickerOptions" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <el-form-item label-width="40%" label="来源类型: ">
                                    <!-- 주문종류(공증호, 미니앱) -->
                                    <el-select v-model="searchClientType" placeholder="选择来源类型" size="small" clearable style="width: 100%;">
                                        <el-option :key="0" label="全部" :value="0" />
                                        <el-option :key="1" label="公众号" :value="1" />
                                        <el-option :key="2" label="小程序" :value="2" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-form-item>
                                    <el-button type="primary" plain icon="el-icon-search" size="small" @click="setSearchData" style="margin-left: 10%;">搜索</el-button>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </div>
        <!-- 주문리스트 -->
        <div class="filter-container">
            <el-row style="margin-bottom: 10px;">
                <el-button v-show="activeTabOption === '1'" type="success" @click="setExportOrderGoods" size="mini">一键拣货导出</el-button>
                <el-button type="primary" @click="setBatchPrint" size="mini">拣货打印</el-button>
                <el-button type="success" @click="setOrderBatchRead" size="mini">确认已读</el-button>
                <el-button v-show="activeTabOption === '0'" type="info" @click="setReadyDeliveryStatus" size="mini">确认准备发货</el-button>
                <el-button v-show="activeTabOption === '1' || activeTabOption === '3' || activeTabOption === '4'" type="info" @click="setNormalBatchPrint" size="mini">一键打印清单</el-button>
                <el-button v-show="activeTabOption === '1'" type="secondary" @click="setConfirmFutureDelivery" size="mini">确认明日发货</el-button>
                <el-button v-show="activeTabOption === '1'" type="danger" @click="setConfirmWarningDelivery" size="mini">确认订单异常</el-button>
                <el-button v-show="activeTabOption === '3'" type="danger" @click="setConfirmWarningDeliveryFromFuture" size="mini">确认订单异常</el-button>
                <el-button v-show="activeTabOption === '4'" type="success" @click="setConfirmWarningOrderReady" size="mini">转入已准备发货</el-button>
            </el-row>
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-tabs v-model="activeTabOption" type="border-card">
                            <el-tab-pane v-for="item in tabOption" :key="item.key" :label="item.label" :name="item.key">
                                <template #label>
                                    <span class="custom-tabs-label">
                                        <span>{{ item.label }}</span>
                                        <span v-if="item.key === '0'" style="color: red;">({{ notReadyNum | addComma }})</span>
                                        <span v-if="item.key === '1'" style="color: red;">({{ readyNum | addComma }})</span>
                                        <span v-if="item.key === '3'" style="color: red;">({{ futureNum | addComma }})</span>
                                        <span v-if="item.key === '4'" style="color: red;">({{ warningNum | addComma }})</span>
                                    </span>
                                </template>
                                <el-table v-loading="listLoading" :data="orderData" :row-key="getRowKeys" :expand-row-keys="expandKeys" :row-class-name="tableRowClassName" fit highlight-current-row @expand-change="expandChange" @selection-change="handleSelectionChange">
                                    <el-table-column type="selection" align="center" width="60%"></el-table-column>
                                    <el-table-column type="expand" align="center" width="20%">
                                        <template>
                                            <el-table :data="subOrderData" :span-method="objectSpanMethod" border fit highlight-current-row>
                                                <el-table-column align="center" label="子订单号" width="180%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.orderNo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="配送方式" width="160%">
                                                    <template slot-scope="{row}">
                                                        <span v-if="row.deliveryType === 4">{{ row.deliveryTypeName }}<br>({{ row.deliveryDt }})</span>
                                                        <span v-else>{{ row.deliveryTypeName }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="运费" width="70%">
                                                    <template slot-scope="{row}">
                                                        <span v-if="row.postageFreeStatus === '0'" style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
                                                        <span v-else style="color: red;">免运费</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="配送公司" width="80%">
                                                    <template slot-scope="{row}">
                                                        <div v-if="row.deliveryName !== ''">
                                                            <div v-for="(itm, idx) in row.deliveryName.split(',')" :key="idx">
                                                                <span>{{ itm }}</span>
                                                            </div>
                                                        </div>
                                                        <div v-else>-</div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="运单号" width="180%">
                                                    <template slot-scope="{row}">
                                                        <div v-if="row.deliveryNo !== '' && row.deliveryType !== 3 && row.deliveryType !== 4">
                                                            <div v-for="(itm, idx) in row.deliveryNo.split(',')" :key="idx">
                                                                <span class="link-type" style="text-decoration: underline;" @click="setShowDeliveryStatusDialog(row.parentId, row.id, itm.trim())">{{ itm }}</span>
                                                            </div>
                                                        </div>
                                                        <div v-else-if="row.deliveryNo !== '' && (row.deliveryType === 3 || row.deliveryType === 4)">
                                                            <span>{{ row.deliveryNo }}</span>
                                                        </div>
                                                        <div v-else>-</div>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="发货" width="195%">
                                                    <template slot-scope="{row}">
                                                        <el-button v-if="row.deliveryStatus === '0' && (row.orderStatus === 2 || row.orderStatus === 6) && row.deliveryType !== 4 && row.deliveryType !== 3 && row.deliveryNo === ''" size="mini" type="primary" @click="setShowSendDialog(subOrderData, row.orderNo, row.id, row.dutyAdmin, 'sub', 'auto')">自动发货
                                                        </el-button>
                                                        <el-button v-if="row.deliveryStatus === '0' && (row.orderStatus === 2 || row.orderStatus === 6) && row.deliveryType !== 4 && row.deliveryType !== 3 && row.deliveryNo === ''" size="mini" type="success" @click="setShowSendDialog(subOrderData, row.orderNo, row.id, row.dutyAdmin, 'sub', 'manual')">手动发货
                                                        </el-button>
                                                        <span v-else>-</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="配送分类" width="80%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.typeName }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="商户名称" width="150%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.shopName }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="商户联系人" width="100%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.shopOwner }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="联系电话" width="110%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.shopPhone }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="商品图片" align="center" width="80%">
                                                    <template slot-scope="{row}">
                                                        <el-tooltip placement="top" effect="light">
                                                            <div slot="content">
                                                                <img :src="row.goodsImg" alt="" style="width: 200px; height: 200px;">
                                                            </div>
                                                            <img :src="row.goodsImg" alt="" style="width: 40px; height: 40px; cursor: pointer;">
                                                        </el-tooltip>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="商品名称">
                                                    <template slot-scope="{row}">
                                                        <span v-if="row.goodsShortName !== ''">{{ row.goodsShortName }}</span>
                                                        <span v-else>{{ row.goodsName }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="商品规格">
                                                    <template slot-scope="{row}">
                                                        <span v-if="row.sizeName !== null">{{ row.sizeName }}</span>
                                                        <span v-else>-</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="商品数量" width="60%">
                                                    <template slot-scope="{row}">
                                                        <span>{{ row.goodsNum | addComma }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="包装费" width="70%">
                                                    <template slot-scope="{row}">
                                                        <span style="color: red;">{{ row.packagePrice | addCommaTwo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="商品单价" width="80%">
                                                    <template slot-scope="{row}">
                                                        <span style="color: red;">{{ row.goodsPrice | addCommaTwo }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column align="center" label="退款" width="153%">
                                                    <template slot-scope="{row}">
                                                        <el-button v-if="row.refundStatus === '0'" size="mini" type="info" @click="setShowRefundDialog(row.parentId, row.dutyAdmin, row.goodsId, 'single')">退款</el-button>
                                                        <span v-else style="color: red;">{{ row.refundDt }}</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="订单编号" align="center" width="178%">
                                        <template slot-scope="{row}">
                                            <span class="link-type" style="text-decoration: underline;" @click="setShowOrderDialog(row.deliveries, row.id, row.payDt, row.orderStatus, row.orderNo, row.dutyAdmin)">{{ row.orderNo }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="收货人姓名" align="center" width="150%">
                                        <template slot-scope="{row}">
                                            <span class="link-type" style="text-decoration: underline;" @click="setShowReceiverInfoDialog(row.userName, row.phoneNum, row.deliveryAddress)">{{ row.userName }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="配送方式" align="center" width="110%">
                                        <template slot-scope="{row}">
                                            <div>
                                                <span v-if="row.deliveryPrice === 0"></span>
                                                <span v-else-if="row.deliveryType === 4">{{ row.deliveryTypeName }}<br>({{ row.deliveryDt }})</span>
                                                <span v-else>{{ row.deliveryTypeName }}<br>({{ row.deliveryCompanyName }})</span>
                                            </div>
                                            <div>
                                                <span v-if="row.postageFreeStatus === '2'" style="color: green;">活动免减</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="运费" align="center" width="75%">
                                        <template slot-scope="{row}">
                                            <span v-if="row.deliveryPrice !== 0" style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
                                            <span v-else style="color: blue; font-weight: bold;">免运费</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="包装费" align="center" width="75%">
                                        <template slot-scope="{row}">
                                            <span style="color: red;">{{ row.packagePrice | addCommaTwo }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="收货人电话" align="center" width="110%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.phoneNum }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="收货地址" align="center" width="130%">
                                        <template slot-scope="{row}">
                                            <span v-if="row.deliveryAddress !== ''">{{ row.deliveryAddress }}</span>
                                            <span v-else>-</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="配送重量(kg)" align="center" width="80%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.deliveryWeight | addComma }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="来源" align="center" width="80%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.clientType }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="付款时间" align="center" width="150%">
                                        <template slot-scope="{row}">
                                            <span v-if="row.payDt !== ''">{{ row.payDt }}</span>
                                            <span v-else>-</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="商品总价" align="center" width="100%">
                                        <template slot-scope="{row}">
                                            <div style="color: red;">{{ row.goodsPrice | addCommaTwo }}</div>
                                            <div style="font-size: 12px;">{{ row.profit.toFixed(1) | addComma }}({{ row.profitRate.toFixed(1) | addComma }}%)</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="订单总价" align="center" width="100%">
                                        <template slot-scope="{row}">
                                            <span style="color: red;">{{ row.orderPrice | addCommaTwo }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="订单备注" align="center" width="100%">
                                        <template slot-scope="{row}">
                                            <span v-if="row.orderRemark !== ''" style="color: red;">{{ row.orderRemark }}</span>
                                            <span v-else>-</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="已读状态" align="center" width="100%">
                                        <template slot-scope="{row}">
                                            <el-button v-if="row.isRead === '0'" size="mini" type="danger" @click="setOrderSingleRead(row.id)">未读</el-button>
                                            <span v-else style="color: green;">已读</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="打印状态" align="center" width="80%">
                                        <template slot-scope="{row}">
                                            <span v-if="row.printNum === 0" style="color: red;">未打</span>
                                            <span v-else style="color: green;">已打({{ row.printNum }})</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="查看详情" align="center" width="80%">
                                        <template slot-scope="{row}">
                                            <router-link :to="'/order/order_detail/' + row.id">
                                                <el-button size="mini" type="primary">查看</el-button>
                                            </router-link>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="处理订单" align="center" width="450%">
                                        <template slot-scope="{row}">
                                            <el-button v-if="(row.orderStatus === 2 || row.orderStatus === 6) && row.deliveryType !== 3 && row.deliveryType !== 4" size="mini" type="primary" @click="setShowSendDialog(row.deliveries, row.orderNo, row.id, row.dutyAdmin, 'all', 'auto')">自动发货
                                            </el-button>
                                            <el-button v-if="(row.orderStatus === 2 || row.orderStatus === 6) && row.deliveryType !== 3 && row.deliveryType !== 4" size="mini" type="success" @click="setShowSendDialog(row.deliveries, row.orderNo, row.id, row.dutyAdmin, 'all', 'manual')">手动发货
                                            </el-button>
                                            <el-button v-else-if="(row.orderStatus === 2 || row.orderStatus === 6 || row.orderStatus === 7) && row.deliveryType === 3 && row.deliveries[0].deliveryNo === ''" size="mini" type="success" @click="setSendDelivery(row.id, row.dutyAdmin)">发货
                                            </el-button>
                                            <el-button v-else-if="row.orderStatus === 70 && row.deliveryType === 3" size="mini" type="primary" @click="setShowSendDialog(row.deliveries, row.orderNo, row.id, row.dutyAdmin, 'all', 'manual')">重新配送</el-button>
                                            <el-button v-if="row.orderStatus === 2 || row.orderStatus === 7 || row.orderStatus === 8 || row.orderStatus === 70" size="mini" type="info" @click="setShowRefundDialog(row.id, row.dutyAdmin, 0, 'all')">退款</el-button>
                                            <el-button v-if="row.orderStatus === 1" size="mini" type="danger" @click="setShowCancelDialog(row.id, row.dutyAdmin)">取消</el-button>
                                            <el-button v-if="row.orderStatus === 8" size="mini" type="primary" @click="setOrderFinish(row.id, row.dutyAdmin)">确认收货</el-button>
                                            <el-button size="mini" type="warning" @click="setPrint(row)">打印清单</el-button>
                                            <el-button v-if="row.warningStatus === '0' || row.warningStatus === null" size="mini" type="info" @click="setShowDutyDialog(row.id, row.dutyAdmin, 'normal')">订单异常</el-button>
                                            <el-button v-else size="mini" type="danger" @click="setShowDutyDialog(row.id, row.dutyAdmin, 'warning')">订单异常</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <pagination v-show="totalNum > 0" :total="totalNum" :page.sync="page" :limit.sync="size" @pagination="getOrderData(listKind, activeTabOption)" style="text-align: center;" />
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>

    <!-- 주문이상다이얼로그 -->
    <el-dialog v-el-drag-dialog title="订单异常" :visible.sync="isShowDialogDuty" :close-on-click-modal="false" width="30%">
        <el-row>
            <el-card class="box-card" style="margin-bottom: 5px;">
                <div style="margin-bottom: 5px;">值班人员: {{ dutyAdmin }}</div>
                <el-table v-show="isDutyStatus" :data="warningData" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="备注" prop="id" align="left">
                        <template slot-scope="{row}">
                            <span>{{ row.warningInfo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="时间" align="center" width="180%;">
                        <template slot-scope="{row}">
                            <span>{{ row.warningDt }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="box-card">
                <el-input type="textarea" v-model="warningInfo"></el-input>
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddWarningInfo">保存</el-button>
        </div>
    </el-dialog>
    <!-- 일반일괄인쇄내용 -->
    <el-row style="display: none;">
        <div ref="print_normal_batch" id="print_normal_batch">
            <div v-for="(order, ix) in batchOrderData" :key="ix" style="margin-bottom: 30px;">
                <div style="width: 100%; text-align: center; margin-top: 5px; margin-bottom: 15px;">
                    <h2 style="margin: 0; color: #000; font-weight: bold;">延吉西市场({{ order.deliveryTypeName }})</h2>
                </div>
                <div style="margin-bottom: 5px;">
                    <h3 style="margin: 0; color: #000;">订单号: {{ order.orderNo }}</h3>
                </div>
                <div style="margin-bottom: 5px;">
                    <h3 style="margin: 0; color: #000;">下单时间: {{ order.createDt }}</h3>
                </div>
                <div style="margin-bottom: 5px;">
                    <h3 style="margin: 0; color: #000;">打印时间: {{ order.todayDate }}</h3>
                </div>
                <div style="margin-bottom: 15px;">
                    <h2 style="margin: 0; color: #000;">备注: {{ order.orderRemark }}</h2>
                </div>
                <div v-for="(delivery, index) in order.printData" :key="index" style="width: 100%; margin-bottom: 5px;">
                    <div style="align-items: center; justify-content: center; display: flex; margin-bottom: 5px;">
                        <template v-if="delivery.postageFreeStatus === '0'">
                            <div style="border: 1px dashed #000; width: 38%;"></div>
                            <h3 v-if="delivery.postageFreeStatus === '0'" style="margin: 0; color: #000; width: 24%; text-align: center;">{{ delivery.deliveryType }}<br>({{ delivery.deliveryName }})</h3>
                            <div style="border: 1px dashed #000; width: 38%;"></div>
                        </template>
                        <template v-else>
                            <div style="width: 38%;">▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆</div>
                            <h3 style="margin: 0; color: #000; width: 24%; text-align: center;">免运费</h3>
                            <div style="width: 38%; text-align: right;">▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆</div>
                        </template>
                    </div>
                    <div v-for="(shop, idx) in delivery.shops" :key="idx">
                        <h4 style="margin: 0; color: #000;">{{ shop.shopName }}</h4>
                        <div style="height: 5px; width: 100%"></div>
                        <table style="border: 1px solid #000; width: 100%; border-spacing: 0;">
                            <tbody>
                                <tr v-for="(prod, idx) in shop.goods" :key="idx">
                                    <td v-if="prod.goodsName !== prod.sizeName && prod.goodsShortName !== ''" style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">
                                        {{ prod.goodsShortName }}({{ prod.sizeName }})
                                    </td>
                                    <td v-else-if="prod.goodsShortName !== '' && prod.goodsName === prod.sizeName" style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">
                                        {{ prod.goodsShortName }}
                                    </td>
                                    <td v-else-if="prod.goodsShortName === '' && prod.goodsName !== prod.sizeName" style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">
                                        {{ prod.goodsName }}({{ prod.sizeName }})
                                    </td>
                                    <td v-else-if="prod.goodsShortName === '' && prod.goodsName === prod.sizeName" style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">
                                        {{ prod.goodsName }}
                                    </td>
                                    <td v-else style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">{{ prod.goodsShortName }}</td>
                                    <td style="border: 1px solid #000; width: 19%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">
                                        <span v-if="prod.goodsNum > 1">【 X{{ prod.goodsNum | addComma }}/{{ prod.goodsUnit }} 】</span>
                                        <span v-else>X{{ prod.goodsNum | addComma }}/{{ prod.goodsUnit }}</span>
                                    </td>
                                    <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">￥{{ prod.goodsPrice | addCommaTwo }}</td>
                                    <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">￥{{ prod.totalPrice | addCommaTwo }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="height: 5px; width: 100%"></div>
                    </div>
                </div>
                <div style="align-items: center; justify-content: center; display: flex; margin-bottom: 15px; margin-top: 10px;">
                    <div style="border: 1px dashed #000; width: 44%;"></div>
                    <h3 style="margin: 0; color: #000; width: 12%; text-align: center; font-weight: bold;">其他</h3>
                    <div style="border: 1px dashed #000; width: 44%;"></div>
                </div>
                <div style="width: 100%; margin-bottom: 10px;">
                    <h4 style="color: #000; margin: 0 0 5px;">配送费: ￥{{ order.deliveryPrice | addCommaTwo }}</h4>
                    <h4 style="margin: 0 0 5px; color: #000;">包装费: ￥{{ order.packagePrice | addCommaTwo }}</h4>
                    <h4 style="margin: 0; color: #000;">订单重量: {{ order.deliveryWeight | addCommaTwo }}kg</h4>
                </div>
                <div style="border: 1px dashed #000; width: 100%; margin-bottom: 10px;"></div>
                <h2 style="color: #000; text-align: right; margin: 0 0 10px;">总计: ￥{{ order.orderPrice | addCommaTwo }}</h2>
                <div style="border: 1px dashed #000; width: 100%; margin-bottom: 10px;"></div>
                <div style="color: #000; margin: 0 0 6px; font-size: 20px;">{{ order.deliveryAddress }}</div>
                <div style="align-items: center; justify-content: left; display: flex; margin-bottom: 10px;">
                    <div style="color: #000; margin: 0; font-size: 20px;">{{ order.userName }}</div>
                    <div style="margin: 0 0 0 5px; color: #000; font-size: 20px;">{{ order.phoneNum }}</div>
                </div>
            </div>

            <div style="align-items: center; justify-content: center; display: flex; margin-bottom: 20px;">
                <div style="border: 1px dashed #000; width: 20%;"></div>
                <h3 style="margin: 0; color: #000; width: 60%; text-align: center;">延边朝鲜族特产集散地</h3>
                <div style="border: 1px dashed #000; width: 20%;"></div>
            </div>
            <div style="width: 100%; text-align: center;">
                <h4 style="color: #000; font-weight: bold; margin: 0 0 5px;">西市场网购中有任何疑问请发送平台客服</h4>
                <h4 style="color: #000; font-weight: bold; margin: 0 0 5px;">消息或拨打咨询电话 0433-2651000</h4>
                <h4 style="margin: 0; color: #000; font-weight: bold;">客服微信: yanjixishi 工作时间: 8:30-16:30</h4>
            </div>
        </div>
    </el-row>
    <!-- 일반인쇄내용 -->
    <el-row style="display: none;">
        <div ref="print" id="print">
            <div style="width: 100%; text-align: center; margin-top: 5px; margin-bottom: 15px;">
                <h2 style="margin: 0; color: #000; font-weight: bold;">延吉西市场({{ deliveryType }})</h2>
            </div>
            <div style="margin-bottom: 5px;">
                <h3 style="margin: 0; color: #000;">订单号: {{ orderNo }}</h3>
            </div>
            <div style="margin-bottom: 5px;">
                <h3 style="margin: 0; color: #000;">下单时间: {{ createDt }}</h3>
            </div>
            <div style="margin-bottom: 5px;">
                <h3 style="margin: 0; color: #000;">打印时间: {{ todayDate }}</h3>
            </div>
            <div style="margin-bottom: 15px;">
                <h2 style="margin: 0; color: #000;">备注: {{ orderRemark }}</h2>
            </div>
            <div v-for="(delivery, index) in printData" :key="index" style="width: 100%; margin-bottom: 5px;">
                <div style="align-items: center; justify-content: center; display: flex; margin-bottom: 5px;">
                    <template v-if="delivery.postageFreeStatus === '0'">
                        <div style="border: 1px dashed #000; width: 38%;"></div>
                        <h3 v-if="delivery.postageFreeStatus === '0'" style="margin: 0; color: #000; width: 24%; text-align: center;">{{ delivery.deliveryType }}<br>({{ delivery.deliveryName }})</h3>
                        <div style="border: 1px dashed #000; width: 38%;"></div>
                    </template>
                    <template v-else>
                        <div style="width: 38%;">▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆</div>
                        <h3 style="margin: 0; color: #000; width: 24%; text-align: center;">免运费</h3>
                        <div style="width: 38%; text-align: right;">▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆</div>
                    </template>
                </div>
                <div v-for="(shop, idx) in delivery.shops" :key="idx">
                    <h4 style="margin: 0; color: #000;">{{ shop.shopName }}</h4>
                    <div style="height: 5px; width: 100%"></div>
                    <table style="border: 1px solid #000; width: 100%; border-spacing: 0;">
                        <tbody>
                            <tr v-for="(prod, idx) in shop.goods" :key="idx">
                                <td v-if="prod.goodsName !== prod.sizeName && prod.goodsShortName !== ''" style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">
                                    {{ prod.goodsShortName }}({{ prod.sizeName }})
                                </td>
                                <td v-else-if="prod.goodsShortName !== '' && prod.goodsName === prod.sizeName" style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">
                                    {{ prod.goodsShortName }}
                                </td>
                                <td v-else-if="prod.goodsShortName === '' && prod.goodsName !== prod.sizeName" style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">
                                    {{ prod.goodsName }}({{ prod.sizeName }})
                                </td>
                                <td v-else-if="prod.goodsShortName === '' && prod.goodsName === prod.sizeName" style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">
                                    {{ prod.goodsName }}
                                </td>
                                <td v-else style="border: 1px solid #000; width: 51%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">{{ prod.goodsShortName }}</td>
                                <td style="border: 1px solid #000; width: 19%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">
                                    <span v-if="prod.goodsNum > 1">【 X{{ prod.goodsNum | addComma }}/{{ prod.goodsUnit }} 】</span>
                                    <span v-else>X{{ prod.goodsNum | addComma }}/{{ prod.goodsUnit }}</span>
                                </td>
                                <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">￥{{ prod.goodsPrice | addCommaTwo }}</td>
                                <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">￥{{ prod.totalPrice | addCommaTwo }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="height: 5px; width: 100%"></div>
                </div>
                <h3 style="margin: 15px 0 0 0; color: #000; text-align: right">最后时效: {{ delivery.lastDuration }}<br>{{ delivery.lastDt }}</h3>
            </div>
            <div style="align-items: center; justify-content: center; display: flex; margin-bottom: 15px; margin-top: 10px;">
                <div style="border: 1px dashed #000; width: 44%;"></div>
                <h3 style="margin: 0; color: #000; width: 12%; text-align: center; font-weight: bold;">其他</h3>
                <div style="border: 1px dashed #000; width: 44%;"></div>
            </div>
            <div style="width: 100%; margin-bottom: 10px;">
                <h4 style="color: #000; margin: 0 0 5px;">配送费: ￥{{ deliveryPrice | addCommaTwo }}</h4>
                <h4 style="margin: 0 0 5px; color: #000;">包装费: ￥{{ packagePrice | addCommaTwo }}</h4>
                <h4 style="margin: 0; color: #000;">订单重量: {{ deliveryWeight | addCommaTwo }}kg</h4>
            </div>
            <div style="border: 1px dashed #000; width: 100%; margin-bottom: 10px;"></div>
            <h2 style="color: #000; text-align: right; margin: 0 0 10px;">总计: ￥{{ orderPrice | addCommaTwo }}</h2>
            <div style="border: 1px dashed #000; width: 100%; margin-bottom: 10px;"></div>
            <div style="color: #000; margin: 0 0 6px; font-size: 16px;">{{ province }}</div>
            <div style="align-items: center; justify-content: left; display: flex; margin-bottom: 10px;">
                <div style="color: #000; margin: 0 0 0 5px; font-size: 16px;">{{ userName }}</div>
                <div style="margin: 0; color: #000; font-size: 16px; margin-left: 10px;">{{ userPhone }}</div>
            </div>
            <div style="align-items: center; justify-content: center; display: flex; margin-bottom: 20px;">
                <div style="border: 1px dashed #000; width: 20%;"></div>
                <h3 style="margin: 0; color: #000; width: 60%; text-align: center;">延边朝鲜族特产集散地</h3>
                <div style="border: 1px dashed #000; width: 20%;"></div>
            </div>
            <div style="width: 100%; text-align: center;">
                <h4 style="color: #000; font-weight: bold; margin: 0 0 5px;">西市场网购中有任何疑问请发送平台客服</h4>
                <h4 style="color: #000; font-weight: bold; margin: 0 0 5px;">消息或拨打咨询电话 0433-2651000</h4>
                <h4 style="margin: 0; color: #000; font-weight: bold;">客服微信: yanjixishi 工作时间: 8:30-16:30</h4>
            </div>
        </div>
    </el-row>
    <!-- 일괄인쇄내용 -->
    <el-row style="display: none;">
        <div ref="batch_print" id="batch_print">
            <div style="margin-bottom: 15px;">
                <div style="border: 1px dashed #000; width: 100%;"></div>
                <h3 style="margin: 0; color: #000;">{{ todayDate }}</h3>
                <div style="border: 1px dashed #000; width: 100%;"></div>
            </div>
            <div v-for="(data, index) in printData" :key="index" style="width: 100%; margin-bottom: 25px;">
                <div v-for="(shop, idx) in data.shopDtos" :key="idx">
                    <h4 style="color: #000; margin-bottom: 10px;">商户 : {{ shop.shopName }}</h4>
                    <table style="border: 1px solid #000; width: 100%; border-spacing: 0;">
                        <tbody>
                            <tr v-for="(prod, idx) in shop.goodsDtos" :key="idx">
                                <td style="border: 1px solid #000; width: 20%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">{{ prod.goodsShortName }}</td>
                                <td style="border: 1px solid #000; width: 50%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">{{ prod.sizeName }}</td>
                                <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">
                                    <span v-if="prod.goodsNum > 1" style="border-bottom: 4px solid #000;">X{{ prod.goodsNum | addComma }}</span>
                                    <span v-else>X{{ prod.goodsNum | addComma }}</span>
                                </td>
                                <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">{{ prod.goodsWeight | addCommaTwo }}kg</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-for="(data, index) in freePrintData" :key="index" style="width: 100%; margin-bottom: 25px;">
                <div v-for="(shop, idx) in data.shopDtos" :key="idx">
                    <h4 style="color: #000; margin-bottom: 10px;">商户 : {{ shop.shopName }}(免运费)</h4>
                    <table style="border: 1px solid #000; width: 100%; border-spacing: 0;">
                        <tbody>
                            <tr v-for="(prod, idx) in shop.goodsDtos" :key="idx">
                                <td style="border: 1px solid #000; width: 20%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">{{ prod.goodsShortName }}</td>
                                <td style="border: 1px solid #000; width: 50%; vertical-align: middle; color: #000; font-weight: bold; padding: 5px; font-size: 12px; line-height: 1.8;">{{ prod.sizeName }}</td>
                                <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">
                                    <span v-if="prod.goodsNum > 1">【 X{{ prod.goodsNum | addComma }} 】</span>
                                    <span v-else>X{{ prod.goodsNum | addComma }}</span>
                                </td>
                                <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">
                                    {{ prod.goodsWeight | addCommaTwo }}kg
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </el-row>

    <!-- 취소리유 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="取消" :visible.sync="isShowCancelDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input v-model="cancelReason" type="textarea" placeholder="请输入理由" style="width: 100%;" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setCancelOrder">确认</el-button>
        </div>
    </el-dialog>
    <!-- 환불리유 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="退款" :visible.sync="isShowRefundDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input v-model="refundReason" type="textarea" placeholder="请输入理由" style="width: 100%;" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setRefundOrder">确认</el-button>
        </div>
    </el-dialog>
    <!-- 수화발송 다이얼로그 -->
    <el-dialog v-el-drag-dialog :title="'订单(' + orderNo + ') 发货'" :visible.sync="isShowSendDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-table :data="tempOrderInfo" border fit highlight-current-row>
                    <el-table-column align="center" label="订单号">
                        <template slot-scope="{row}">
                            <span>{{ row.orderNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="配送方式" width="100%">
                        <template slot-scope="{row}">
                            <span>{{ row.deliveryTypeName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="运单号">
                        <template slot-scope="{row, $index}">
                            <el-input v-if="(kind === 'manual' || row.deliveryType === 3) && row.deliveryNo === ''" v-model="row.deliveryNum" :id="'deliveryNo-' + $index" class="edit-input" size="small" />
                            <span v-else-if="row.deliveryNo !== ''">{{ row.deliveryNo }}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="配送公司" width="180%">
                        <template slot-scope="{row}">
                            <el-select v-if="row.deliveryNo === '' && kind === 'manual'" v-model="row.deliveryCompanyCode" size="small" placeholder="请选择" clearable>
                                <el-option v-for="item in deliveryCompany" :key="item.code" :label="item.name + '[' + item.type + ']'" :value="item.code" />
                            </el-select>
                            <span v-else>{{ row.deliveryName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="配送重量(kg)" width="130%">
                        <template slot-scope="{row}">
                            <span>{{ row.deliveryWeight | addCommaTwo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="运费" width="100%">
                        <template slot-scope="{row}">
                            <span style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="发货" width="100%">
                        <template slot-scope="{row}">
                            <el-button v-show="kind === 'manual' && row.deliveryNo === ''" size="mini" type="primary" @click="setSendShipping(row.id, row.deliveryNum, row.deliveryCompanyCode)">发货</el-button>
                            <el-button v-show="kind !== 'manual' && row.deliveryNo === ''" size="mini" type="primary" @click="setAutoSendShipping(row.parentNo, row.orderNo)">发货</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelSendDialog">取消</el-button>
        </div>
    </el-dialog>

    <!-- 주문상세상품 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="订单商品" :visible.sync="isShowOrderDialog" class="order-dialog" :close-on-click-modal="false">
        <el-row>
            <el-table :data="subOrderData" :span-method="objectSpanMethod" border fit highlight-current-row>
                <el-table-column align="center" label="子订单号" width="180%">
                    <template slot-scope="{row}">
                        <span>{{ row.orderNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="配送方式" width="80%">
                    <template slot-scope="{row}">
                        <span>{{ row.deliveryTypeName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运费" width="70%">
                    <template slot-scope="{row}">
                        <span v-if="row.postageFreeStatus === '0'" style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
                        <span v-else style="color: red;">免运费</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="配送公司" width="130%">
                    <template slot-scope="{row}">
                        <div v-if="row.deliveryName !== ''">
                            <div v-for="(itm, idx) in row.deliveryName.split(',')" :key="idx">
                                <span>{{ itm }}</span>
                            </div>
                        </div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运单号" width="180%">
                    <template slot-scope="{row}">
                        <div v-if="row.deliveryNo !== '' && row.deliveryType !== 3 && row.deliveryType !== 4">
                            <div v-for="(itm, idx) in row.deliveryNo.split(',')" :key="idx">
                                <span class="link-type" style="text-decoration: underline;" @click="setShowDeliveryStatusDialog(row.parentId, row.id, itm.trim())">{{ itm }}</span>
                            </div>
                        </div>
                        <div v-else-if="row.deliveryNo !== '' && (row.deliveryType === 3 || row.deliveryType === 4)">
                            <span>{{ row.deliveryNo }}</span>
                        </div>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发货" width="195%">
                    <template slot-scope="{row}">
                        <el-button v-if="row.deliveryStatus === '0' && (row.orderStatus === 2 || row.orderStatus === 6) && row.deliveryType !== 4 && row.deliveryType !== 3 && row.deliveryNo === ''" size="mini" type="primary" @click="setShowSendDialog(subOrderData, row.orderNo, row.id, row.dutyAdmin, 'sub', 'auto')">自动发货
                        </el-button>
                        <el-button v-if="row.deliveryStatus === '0' && (row.orderStatus === 2 || row.orderStatus === 6) && row.deliveryType !== 4 && row.deliveryType !== 3 && row.deliveryNo === ''" size="mini" type="success" @click="setShowSendDialog(subOrderData, row.orderNo, row.id, row.dutyAdmin, 'sub', 'manual')">手动发货
                        </el-button>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="配送分类" width="80%">
                    <template slot-scope="{row}">
                        <span>{{ row.typeName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商户名称" width="150%">
                    <template slot-scope="{row}">
                        <span>{{ row.shopName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商户联系人" width="100%">
                    <template slot-scope="{row}">
                        <span>{{ row.shopOwner }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="联系电话" width="110%">
                    <template slot-scope="{row}">
                        <span>{{ row.shopPhone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品图片" align="center" width="80%">
                    <template slot-scope="{row}">
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">
                                <img :src="row.goodsImg" alt="" style="width: 200px; height: 200px;">
                            </div>
                            <img :src="row.goodsImg" alt="" style="width: 40px; height: 40px; cursor: pointer;">
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品名称">
                    <template slot-scope="{row}">
                        <span v-if="row.goodsShortName !== ''">{{ row.goodsShortName }}</span>
                        <span v-else>{{ row.goodsName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品规格">
                    <template slot-scope="{row}">
                        <span v-if="row.sizeName !== null">{{ row.sizeName }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品数量" width="60%">
                    <template slot-scope="{row}">
                        <span>{{ row.goodsNum | addComma }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="包装费" width="70%">
                    <template slot-scope="{row}">
                        <span style="color: red;">{{ row.packagePrice | addCommaTwo }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品单价" width="80%">
                    <template slot-scope="{row}">
                        <span style="color: red;">{{ row.goodsPrice | addCommaTwo }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="退款" width="153%">
                    <template slot-scope="{row}">
                        <el-button v-if="row.refundStatus === '0'" size="mini" type="info" @click="setShowRefundDialog(row.parentId, row.dutyAdmin, row.goodsId, 'single')">退款</el-button>
                        <span v-else style="color: red;">{{ row.refundDt }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">关闭</el-button>
        </div>
    </el-dialog>
    <!-- 수화정보 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="收货信息" :visible.sync="isShowReceiverDialog" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <label style="color: #606266; float: left;">收货信息: </label>
                <div style="float: left; line-height: 1.4; margin-left: 10px;">
                    {{ userName }} {{ userPhone }}<br><br>
                    {{ deliveryAddress }}
                </div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">关闭</el-button>
        </div>
    </el-dialog>
    <!-- 배송상태 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="收货信息" :visible.sync="isShowDeliveryStatusDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <label class="radio-label" style="color: #606266;">
                    配送地址:&nbsp;&nbsp;<span style="color: blue; font-weight: bold;">{{ address }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    配送公司:&nbsp;&nbsp;<span style="color: blue; font-weight: bold;">{{ deliveryName }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    配送编号:&nbsp;&nbsp;<span style="color: blue; font-weight: bold;">{{ deliveryNo }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    订单号:&nbsp;&nbsp;<span style="color: blue; font-weight: bold;">{{ orderNo }}</span>&nbsp;&nbsp;&nbsp;
                </label>
                <div style="margin-top: 25px;">
                    <div style="margin-bottom: 15px;" v-for="(value, index) in tracks" :key="index">
                        <div v-if="index === 0" style="line-height: 1.6">
                            <div style="color: red;">-&nbsp;&nbsp;{{ value.context }}</div>
                            <div style="color: red;">&nbsp;&nbsp;&nbsp;{{ value.ftime }}</div>
                        </div>
                        <div v-else style="line-height: 1.6">
                            <div style="color: #222222;">-&nbsp;&nbsp;{{ value.context }}</div>
                            <div style="color: #222222;">&nbsp;&nbsp;&nbsp;{{ value.ftime }}</div>
                        </div>
                    </div>
                    <div v-show="tracks === null" style="margin-bottom: 15px; text-align: center; font-size: 18px; color: #000; font-weight: bold;">未查到配送相关信息</div>
                </div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">关闭</el-button>
        </div>
    </el-dialog>
    <!-- 인쇄 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="打印清单" :visible.sync="isShowPrintDialog" width="18%" :close-on-click-modal="false">
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setPrint">打印清单</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/order/order_pay.js"></script>

<style lang="scss">
.link-type {
    color: #337ab7;
    cursor: pointer;
}

.order-dialog .el-dialog {
    width: 95% !important;
}

.el-tooltip__popper {
    padding: 5px;
}

textarea {
    min-height: 130px;
}

.el-table .warning-row {
    background: oldlace;
}
</style>
