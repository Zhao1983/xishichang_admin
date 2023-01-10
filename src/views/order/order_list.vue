<template>
<div id="order_list">
    <div class="app-container">
        <!-- 검색섹션 -->
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="订单号: ">
                                    <!-- 주문번호 -->
                                    <el-input placeholder="订单号模糊查询" v-model="searchOrderNo" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="收货人电话: ">
                                    <el-input placeholder="收货人电话" v-model="searchUserPhone" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="收货人姓名: ">
                                    <el-input placeholder="收货人姓名" v-model="searchUserName" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="收货信息: ">
                                    <!-- 수화정보 -->
                                    <el-input placeholder="收货信息" v-model="searchAddress" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="起始下单: ">
                                    <!-- 주문시작날자 -->
                                    <el-date-picker v-model="beginDt" type="date" placeholder="起始下单时间" size="small" @change="setChangeDate('order')" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="结束下单: ">
                                    <!-- 주문완료날자 -->
                                    <el-date-picker v-model="endDt" type="date" placeholder="结束下单时间" size="small" @change="setChangeDate('order')" :picker-options="pickerOptions" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="发货起始下单: ">
                                    <!-- 배송시작날자 -->
                                    <el-date-picker v-model="deliveryBeginDt" type="date" placeholder="发货起始下单" size="small" @change="setChangeDate('delivery')" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="发货结束下单: ">
                                    <!-- 배송완료날자 -->
                                    <el-date-picker v-model="deliveryEndDt" type="date" placeholder="发货结束下单" size="small" @change="setChangeDate('delivery')" :picker-options="pickerOptions" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="支付状态: ">
                                    <!-- 지불상태 -->
                                    <el-select v-model="searchPayStatus" placeholder="选择支付状态" size="small" clearable style="width: 100%;">
                                        <el-option :key="0" label="全部" :value="0" />
                                        <el-option :key="1" label="待付款" :value="1" />
                                        <el-option :key="2" label="已退款" :value="2" />
                                        <el-option :key="3" label="已支付" :value="3" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="配送方式:">
                                    <!-- 배송방식 -->
                                    <el-select v-model="searchDeliveryType" placeholder="选择配送方式" size="small" clearable style="width: 100%;">
                                        <el-option :key="0" label="全部" :value="0" />
                                        <el-option :key="1" label="陆运" :value="1" />
                                        <el-option :key="2" label="空运" :value="2" />
                                        <el-option :key="3" label="跑腿" :value="3" />
                                        <el-option :key="4" label="自取" :value="4" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="订单状态:">
                                    <!-- 배송상태 -->
                                    <el-select v-model="searchOrderStatus" placeholder="选择订单状态" size="small" clearable style="width: 100%;">
                                        <el-option :key="''" label="全部" :value="''" />
                                        <el-option v-for="item in orderStatusData" :key="item.code" :label="item.name" :value="item.code" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="商品名称: ">
                                    <!-- 주문번호 -->
                                    <el-input placeholder="商品名称查询" v-model="searchGoodsName" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="运单编号: ">
                                    <!-- 배송번호 -->
                                    <el-input placeholder="运单编号" v-model="searchDeliveryNo" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="订单异常: ">
                                    <!-- 배송상태 -->
                                    <el-select v-model="searchWarningStatus" placeholder="选择订单异常" size="small" clearable style="width: 100%;">
                                        <el-option :key="0" label="全部" :value="0" />
                                        <el-option :key="1" label="异常" :value="1" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="25%" label="来源类型: ">
                                    <!-- 배송상태 -->
                                    <el-select v-model="searchClientType" placeholder="选择来源类型" size="small" clearable style="width: 100%;">
                                        <el-option :key="0" label="全部" :value="0" />
                                        <el-option :key="1" label="公众号" :value="1" />
                                        <el-option :key="2" label="小程序" :value="2" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item>
                                    <el-button type="primary" plain icon="el-icon-search" style="float: right;" size="small" @click="setSearchData">搜索</el-button>
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
                <label style="float: left; font-size: 14px; padding-top: 5px; font-weight: bold;">
                    <span>快递/跑腿 总价: </span><span style="color: red;">￥{{ totalDeliveryPrice | addComma }}</span>
                    <span style="margin-left: 30px;">包装费总价: </span><span style="color: red;">￥{{ totalPackagePrice | addComma }}</span>
                    <span style="margin-left: 30px;">订单总重量: </span><span>{{ totalDeliveryWeight | addCommaTwo }}kg</span>
                    <span style="margin-left: 30px;">订单总价: </span><span style="color: red;">￥{{ totalOrderPrice | addComma }}</span>
                    <span style="margin-left: 30px;">商品总价: </span><span style="color: red;">￥{{ totalGoodsPrice | addComma }}</span>
                </label>
                <el-button type="success" @click="setExportOrderData" size="mini" style="float: right;">EXCEL导出</el-button>
            </el-row>
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-table v-loading="listLoading" :data="orderData" :row-key="getRowKeys" :expand-row-keys="expandKeys" :row-class-name="tableRowClassName" fit highlight-current-row @expand-change="expandChange">
                            <el-table-column type="expand" align="center" width="60%">
                                <template>
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
                                                <span style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
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
                                        <el-table-column align="center" label="运单号" width="150%">
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
                            <el-table-column label="订单编号" align="center" width="180%">
                                <template slot-scope="{row}">
                                    <span class="link-type" style="text-decoration: underline;" @click="setShowOrderDialog(row.deliveries, row.id, row.payDt, row.orderStatus, row.orderNo, row.dutyAdmin)">{{ row.orderNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收货人姓名" align="center" width="150%">
                                <template slot-scope="{row}">
                                    <span class="link-type" style="text-decoration: underline;" @click="setShowReceiverInfoDialog(row.userName, row.phoneNum, row.deliveryAddress)">{{ row.userName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="配送方式" align="center" width="120%">
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
                            <el-table-column label="运费" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span v-if="row.deliveryPrice !== 0" style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
                                    <span v-else style="color: blue; font-weight: bold;">免运费</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="包装费" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.packagePrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收货人电话" align="center" width="110%">
                                <template slot-scope="{row}">
                                    <span>{{ row.phoneNum }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="配送重量(kg)" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span>{{ row.deliveryWeight | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="下单时间" align="center" width="150%">
                                <template slot-scope="{row}">
                                    <span>{{ row.createDt }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="来源" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.clientType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="发货时间" align="center" width="150%">
                                <template slot-scope="{row}">
                                    <span v-if="row.deliveryDt !== ''">{{ row.deliveryDt }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单完成时间" align="center" width="150%">
                                <template slot-scope="{row}">
                                    <span v-if="row.doneDt !== ''">{{ row.doneDt }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单状态" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span style="color: #7b6c42;">{{ row.orderStatusName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品总价" align="center" width="110%">
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
                            <el-table-column label="订单备注" align="center" width="130%">
                                <template slot-scope="{row}">
                                    <span v-if="row.orderRemark !== ''" style="color: red;">{{ row.orderRemark }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="查看详情" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <router-link :to="'/order/order_detail/' + row.id">
                                        <el-button size="mini" type="primary">查看</el-button>
                                    </router-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="处理订单" align="center" width="350%">
                                <template slot-scope="{row}">
                                    <el-button v-if="(row.orderStatus === 2 || row.orderStatus === 6) && row.deliveryType !== 3 && row.deliveryType !== 4" size="mini" type="primary" @click="setShowSendDialog(row.deliveries, row.orderNo, row.id, row.dutyAdmin, 'all', 'auto')">自动发货
                                    </el-button>
                                    <el-button v-if="(row.orderStatus === 2 || row.orderStatus === 6) && row.deliveryType !== 3 && row.deliveryType !== 4" size="mini" type="success" @click="setShowSendDialog(row.deliveries, row.orderNo, row.id, row.dutyAdmin, 'all', 'manual')">手动发货
                                    </el-button>
                                    <el-button v-else-if="(row.orderStatus === 2 || row.orderStatus === 6 || row.orderStatus === 7) && row.deliveryType === 3 && row.deliveries[0].deliveryNo === ''" size="mini" type="success" @click="setSendDelivery(row.id, row.dutyAdmin)">发货
                                    </el-button>
                                    <el-button v-else-if="row.orderStatus === 70 && row.deliveryType === 3" size="mini" type="primary" @click="setShowSendDialog(row.deliveries, row.orderNo, row.id, row.dutyAdmin, 'all', 'manual')">重新配送</el-button>
                                    <el-button v-if="(row.orderStatus === 2 || row.orderStatus === 7 || row.orderStatus === 8 || row.orderStatus === 70)" size="mini" type="info" @click="setShowRefundDialog(row.id, row.dutyAdmin, 0, 'all')">退款</el-button>
                                    <el-button v-if="row.orderStatus === 1" size="mini" type="danger" @click="setShowCancelDialog(row.id, row.dutyAdmin)">取消</el-button>
                                    <el-button v-if="row.orderStatus === 8" size="mini" type="primary" @click="setOrderFinish(row.id, row.dutyAdmin)">确认收货</el-button>
                                    <el-button v-if="row.warningStatus === '0' || row.warningStatus === null" size="mini" type="info" @click="setShowDutyDialog(row.id, row.dutyAdmin, 'normal')">订单异常</el-button>
                                    <el-button v-else size="mini" type="danger" @click="setShowDutyDialog(row.id, row.dutyAdmin, 'warning')">订单异常</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNum > 0" :total="totalNum" :page.sync="page" :limit.sync="size" @pagination="getOrderData" style="text-align: center;" />
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
                        <span style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
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
</div>
</template>

<script src="@/assets/js/order/order_list.js"></script>

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
