<template>
<div id="order_waring">
    <div class="app-container">
        <div class="filter-container">
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
                                    <span v-if="row.deliveryPrice === 0"></span>
                                    <span v-else-if="row.deliveryType === 4">{{ row.deliveryTypeName }}<br>({{ row.deliveryDt }})</span>
                                    <span v-else>{{ row.deliveryTypeName }}<br>({{ row.deliveryCompanyName }})</span>
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
                                    <el-button v-if="row.orderStatus === 2 || row.orderStatus === 7 || row.orderStatus === 8 || row.orderStatus === 70" size="mini" type="info" @click="setShowRefundDialog(row.id, row.dutyAdmin, 0, 'all')">退款</el-button>
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
</div>
</template>

<script src="@/assets/js/order/order_warning.js"></script>

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
