<template>
<div id="order_detail">
    <div class="app-container">
        <div class="filter-container">
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>基本信息</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="orderData" border fit highlight-current-row>
                            <el-table-column label="订单编号" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.orderNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="下单时间" align="center" width="160%">
                                <template slot-scope="{row}">
                                    <span>{{ row.createDt }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="来源" align="center" width="90%">
                                <template slot-scope="{row}">
                                    <span>{{ row.clientType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="支付状态" align="center" width="90%">
                                <template slot-scope="{row}">
                                    <span>{{ row.payStatus }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单状态" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.orderStatusName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收货人姓名" align="center" width="150%">
                                <template slot-scope="{row}">
                                    <span>{{ row.userName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收货人电话" align="center" width="110%">
                                <template slot-scope="{row}">
                                    <span>{{ row.userPhone }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收货地址" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.provinceName }} {{ row.cityName }} {{ row.countryName }} {{ row.addressInfo }} {{ row.houseNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="付款时间" align="center" width="160%">
                                <template slot-scope="{row}">
                                    <span v-if="row.payDt !== ''">{{ row.payDt }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="付款用户" align="center" width="130%">
                                <template slot-scope="{row}">
                                    <span v-if="row.userNick !== ''">{{ row.userNick }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="支付方式" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span v-if="row.payDt !== ''">{{ row.payType }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="支付单号" align="center" width="150%">
                                <template slot-scope="{row}">
                                    <span v-if="row.payNo !== null">{{ row.payNo }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="订单备注" align="center" width="150%">
                                <template slot-scope="{row}">
                                    <span v-if="row.orderRemark !== ''">{{ row.orderRemark }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="150%">
                                <template slot-scope="{}">
                                    <el-button size="mini" type="success" @click="setShowDeliveryInfoDialog">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-card>
            <el-row type="flex" align="middle" style="margin-bottom: 10px;">
                <el-col :span="5">
                    <el-button v-if="(orderStatus === 2 || orderStatus === 6) && deliveryType !== '跑腿' && deliveryType !== '自取' && isDeliveryStatus === true" size="mini" type="primary" @click="setShowSendDialog('', 'all', 'auto')">自动发货</el-button>
                    <el-button v-if="(orderStatus === 2 || orderStatus === 6) && deliveryType !== '跑腿' && deliveryType !== '自取' && isDeliveryStatus === true" size="mini" type="success" @click="setShowSendDialog('', 'all', 'manual')">手动发货</el-button>
                    <el-button v-else-if="(orderStatus === 2 || orderStatus === 6 || orderStatus === 7) && deliveryType === '跑腿' && deliveryNo === ''" size="mini" type="primary" @click="setSendDelivery">发货</el-button>
                    <el-button v-else-if="orderStatus === 70 && deliveryType === '跑腿'" size="mini" type="success" @click="setShowSendDialog('', 'all', '')">重新配送</el-button>
                    <el-button v-if="orderStatus === 2 || orderStatus === 7 || orderStatus === 8 || orderStatus === 70" size="mini" type="warning" @click="setShowRefundDialog">全部退款</el-button>
                    <el-button v-if="orderStatus === 1" size="mini" type="danger" @click="setShowCancelDialog">取消订单</el-button>
                    <el-button v-if="orderStatus === 8" size="mini" type="primary" @click="setOrderFinish">确认收货</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button type="success" size="mini" @click="setShowOrderHistoryDialog">订单记录</el-button>
                    <el-button type="primary" size="mini" @click="setPrint">打印清单</el-button>
                    <el-button v-if="permissionForce" type="default" size="mini" @click="setForceInit">订单初始化</el-button>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="14">
                    <el-table :data="orderData" border fit highlight-current-row>
                        <el-table-column label="总配送费" align="center" width="130%">
                            <template slot-scope="{row}">
                                <span style="color: red;">￥{{ row.deliveryPrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品总重量" align="center">
                            <template slot-scope="{}">
                                <span>{{ prodWeight | addCommaTwo }}kg</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="包装总重量" align="center">
                            <template slot-scope="{}">
                                <span>{{ packageWeight | addCommaTwo }}kg</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单总重量" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.deliveryWeight | addCommaTwo }}kg</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品总价" align="center">
                            <template slot-scope="{row}">
                                <span style="color: red;">￥{{ row.goodsPrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="总包装费" align="center">
                            <template slot-scope="{row}">
                                <span style="color: red;">￥{{ row.packagePrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="泡沫箱" align="center">
                            <template slot-scope="{}">
                                <span>{{ foamCount }}个</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="纸箱" align="center">
                            <template slot-scope="{}">
                                <span>{{ cartonCount }}个</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单总价" align="center">
                            <template slot-scope="{row}">
                                <span style="color: red;">￥{{ row.orderPrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-card v-for="item in subOrderData" :key="item.id" class="box-card" style="margin-bottom: 10px;">
                    <div slot="header" class="clearfix">
                        <span>{{ item.deliveryTypeName }}订单({{ item.orderNo }})</span>&nbsp;
                        <span v-if="item.postageFreeStatus === '0'" style="color: #ff0000">{{ item.deliveryName }}</span>
                        <span v-else style="color: blue; font-weight: bold;">免运费</span>
                        <el-button v-if="item.deliveryStatus === '0' && (orderStatus === 2 || orderStatus === 6) && item.deliveryType !== 4 && item.deliveryType !== 3" size="mini" type="success" style="float: right; margin-left: 5px;" @click="setShowSendDialog(item, 'sub', 'manual')">手动发货
                        </el-button>
                        <el-button v-if="item.deliveryStatus === '0' && (orderStatus === 2 || orderStatus === 6) && item.deliveryType !== 4 && item.deliveryType !== 3" size="mini" type="primary" style="float: right;" @click="setShowSendDialog(item, 'sub', 'auto')">自动发货
                        </el-button>
                        <el-button v-show="item.deliveryType !== 4 && item.deliveryType !== 3 && item.deliveryStatus !== '0' && item.deliveryType !== 4 && item.deliveryType !== 3" size="mini" type="danger" style="float: right;" @click="setShowDeliveryNumberDialog(item)">运单号
                        </el-button>
                    </div>
                    <el-row style="margin-bottom: 5px;">
                        <el-col :span="24">
                            <el-table :data="tableOrderData[item.orderNo]" :span-method="setSpanOrder" border fit highlight-current-row>
                                <el-table-column label="配送方式" align="center" width="100%">
                                    <template slot-scope="{row}">
                                        <span>{{ row.deliveryTypeName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="自取时间" align="center" width="160%">
                                    <template slot-scope="{row}">
                                        <span v-if="row.deliveryType === 4">{{ deliveryDt }}</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="发货时间" align="center" width="160%">
                                    <template slot-scope="{row}">
                                        <span v-if="row.deliveryType !== 4 && deliveryDt !== ''">{{ deliveryDt }}</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="配送公司" align="center" width="180%">
                                    <template slot-scope="{row}">
                                        <span v-if="row.deliveryName !== ''">{{ row.deliveryName }}</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="运单号" align="center">
                                    <template slot-scope="{row}">
                                        <span v-if="row.deliveryNo !== ''">{{ row.deliveryNo }}</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="配送状态" align="center" width="100%">
                                    <template slot-scope="{row}">
                                        <span>{{ row.deliveryStatusName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="配送费" align="center" width="100%">
                                    <template slot-scope="{row}">
                                        <span style="color: red;">{{ row.deliveryPrice | addCommaTwo }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="商品总重量" align="center" width="120%">
                                    <template slot-scope="{row}">
                                        <span>{{ row.prodWeight | addCommaTwo }}kg</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="包装总重量" align="center" width="120%">
                                    <template slot-scope="{row}">
                                        <span>{{ row.foamWeight + row.cartonWeight | addCommaTwo }}kg</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单总重量" align="center" width="120%">
                                    <template slot-scope="{row}">
                                        <span>{{ row.deliveryWeight | addCommaTwo }}kg</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="商品总价" align="center" width="100%">
                                    <template slot-scope="{row}">
                                        <span style="color: red;">{{ row.goodsPrice | addCommaTwo }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="总包装费" align="center" width="100%">
                                    <template slot-scope="{row}">
                                        <span style="color: red;">{{ row.packagePrice | addCommaTwo }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="泡沫箱个数" align="center" width="70%">
                                    <template slot-scope="{row}">
                                        <span>{{ row.foamCount }}个</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="纸箱个数" align="center" width="60%">
                                    <template slot-scope="{row}">
                                        <span>{{ row.cartonCount }}个</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单总价" align="center" width="100%">
                                    <template slot-scope="{row}">
                                        <span style="color: red;">{{ row.orderPrice | addCommaTwo }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-table :data="orderGoods[item.orderNo]" border fit highlight-current-row>
                            <el-table-column label="拣货名称" align="center">
                                <template slot-scope="{row}">
                                    <span v-show="row.goodsShortName !== ''">{{ row.goodsShortName }}</span>
                                    <span v-show="row.goodsShortName === ''">{{ row.goodsName }}</span>
                                    <br>
                                    <span v-show="row.goodsName !== row.sizeName" style="color: #b9b9b9;">{{ row.sizeName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品图片" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <el-tooltip placement="top" effect="light">
                                        <div slot="content">
                                            <img :src="row.goodsImg" alt="" style="width: 200px; height: 200px;">
                                        </div>
                                        <img :src="row.goodsImg" alt="" style="width: 45px; height: 45px; cursor: pointer;">
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column label="商户名称" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品单价" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.goodsPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品重量" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsWeight | addCommaTwo }}kg</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品数量" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品小计" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.goodsPrice * row.goodsNum | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="所用包装(容量)" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span v-if="row.boxInfo !== null">{{ row.boxInfo }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="配送分类" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.typeName }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-card>
            </el-row>
        </div>
    </div>

    <!-- 주문인쇄내용 -->
    <el-row style="display: none;">
        <div ref="print" id="print">
            <div style="width: 100%; text-align: center; margin-bottom: 15px;">
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
                        <h3 style="margin: 0; color: #000; width: 24%; text-align: center;">{{ delivery.deliveryType }}<br>({{ delivery.deliveryName }})</h3>
                        <div style="border: 1px dashed #000; width: 38%;"></div>
                    </template>
                    <template v-else>
                        <div style="width: 38%;">▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆</div>
                        <h3 style="margin: 0; color: #000; width: 24%; text-align: center;">免运费</h3>
                        <div style="width: 38%; text-align: right;">▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆</div>
                    </template>
                </div>
                <div v-for="(shop, idx) in delivery.shops" :key="idx">
                    <h4 style="margin: 0; color: #000;">{{ shop.shopName }}</h4>
                    <div style="height: 5px; width: 100%">&nbsp;</div>
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
                                <td style="border: 1px solid #000; width: 19%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">
                                    <span v-if="prod.goodsNum > 1">【 X{{ prod.goodsNum | addComma }}/{{ prod.goodsUnit }} 】</span>
                                    <span v-else>X{{ prod.goodsNum | addComma }}/{{ prod.goodsUnit }}</span>
                                </td>
                                <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">￥{{ prod.goodsPrice | addCommaTwo }}</td>
                                <td style="border: 1px solid #000; width: 15%; vertical-align: middle; color: #000; font-weight: bold; padding: 1px; text-align: right; font-size: 12px;">￥{{ prod.totalPrice | addCommaTwo }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="height: 5px; width: 100%">&nbsp;</div>
                </div>
            </div>
            <div style="align-items: center; justify-content: center; display: flex; margin-bottom: 15px; margin-top: 10px;">
                <div style="border: 1px dashed #000; width: 44%;"></div>
                <h3 style="margin: 0; color: #000; width: 12%; text-align: center;">其他</h3>
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
            <h3 style="color: #000; margin: 0 0 6px;">{{ provinceName }}&nbsp;{{ cityName }}&nbsp;{{ countryName }}&nbsp;{{ addressInfo }}&nbsp;{{ houseNo }}</h3>
            <div style="align-items: center; justify-content: left; display: flex; margin-bottom: 10px;">
                <h3 style="color: #000; margin: 0 0 0 5px;">{{ userName }}</h3>
                <h3 style="margin: 0; color: #000; margin-left: 10px;">{{ userPhone }}</h3>
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
    <!-- 택배배송번호추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog :title="'订单(' + orderNo + ') 发货'" :visible.sync="isShowDeliveryNumberDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-table :data="tmpSubOrderInfo" :span-method="setDialogSpanOrder" border fit highlight-current-row>
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
                            <el-input :ref="'deliveryNo-' + $index" :id="'deliveryNo-' + $index" v-model="row.deliveryNum" class="edit-input" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="配送公司" width="180%">
                        <template slot-scope="{row}">
                            <el-select v-model="row.deliveryCompanyCode" size="small" placeholder="请选择" clearable>
                                <el-option v-for="item in deliveryCompanyByType[row.deliveryTypeName]" :key="item.code" :label="item.name + '[' + item.type + ']'" :value="item.code" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="" width="200%">
                        <template slot-scope="{row, $index}">
                            <el-button v-show="row.isAdd" type="primary" icon="el-icon-plus" size="small" @click="setAddDeliveryNumber(row)">新增</el-button>
                            <el-button v-show="row.isRemove" type="danger" icon="el-icon-minus" size="small" @click="setRemoveDeliveryNumber(row, $index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddDeliveryNumberData">保存</el-button>
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
                            <el-input v-if="(kind === 'manual' || (orderStatus === 70 && deliveryType === '跑腿')) && row.deliveryNo === ''" v-model="row.deliveryNum" :id="'deliveryNo-' + $index" class="edit-input" size="small" />
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
                            <el-button v-show="kind !== 'manual' && row.deliveryNo === ''" size="mini" type="primary" @click="setAutoSendShipping(orderNo, row.orderNo)">发货</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
        </div>
    </el-dialog>
    <!-- 배송상태 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="收货信息" :visible.sync="isShowDeliveryStatusDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <label class="radio-label" style="color: #606266;">
                    配送地址:&nbsp;&nbsp;<span style="color: blue; font-weight: bold;">{{ addressInfo }} {{ houseNo }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
    <!-- 주문상태기록확인 다이얼로그 -->
    <el-dialog v-el-drag-dialog :visible.sync="isShowOrderHistory" title="订单操作记录" style="width: 50%; right: 0 !important; left: auto;" :close-on-click-modal="false">
        <table class="table table-bordered m-table m-table--border-metal m-table--head-bg-secodary" style="border: 1px solid #dedede; border-spacing: 0; width: 100%;">
            <thead style="background: #d0d0d0;">
                <tr>
                    <th class="text-center" style="border: 1px solid #dedede; padding: 10px;">记录标题</th>
                    <th class="text-center" style="border: 1px solid #dedede; padding: 10px;">记录内容</th>
                    <th class="text-center" style="border: 1px solid #dedede; padding: 10px;">操作</th>
                </tr>
            </thead>
            <tbody>
                <!-- 주문등록날자 -->
                <tr class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">订单生成</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ createDt }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 주문번호 -->
                <tr class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">订单编号</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ orderNo }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 지불날자 -->
                <tr v-show="payDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">订单支付</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ payDt }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 결제번호 -->
                <tr v-show="payDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">支付编号</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ payNo }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 주문배송날자 -->
                <tr v-show="deliveryDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">订单发货</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ deliveryDt }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 수령날자 -->
                <tr v-show="doneDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">订单收货</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ doneDt }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 수령확인날자 -->
                <tr v-show="doneDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">确认收货</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ doneDt }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 주문취소날자 -->
                <tr v-show="cancelDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">订单取消</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ cancelDt }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 취소리유 -->
                <tr v-show="cancelDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">取消原因</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ orderRemark }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 환불날자 -->
                <tr v-show="refundDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">订单退款</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ refundDt }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
                <!-- 환불리유 -->
                <tr v-show="refundDt !== ''" class="text-center">
                    <td style="border: 1px solid #dedede; padding: 10px;">退款原因</td>
                    <td style="border: 1px solid #dedede; padding: 10px;">{{ orderRemark }}</td>
                    <td style="border: 1px solid #dedede; padding: 10px;"></td>
                </tr>
            </tbody>
        </table>
    </el-dialog>
    <!-- 배송지 변경 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="修改订单信息" :visible.sync="isShowAddressDialog" :close-on-click-modal="false" width="35%">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form ref="prodForm" class="form-container">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label-width="30%" label="姓名: ">
                            <el-input v-model="deliveryUserName " class="edit-input" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label-width="30%" label="收货电话: ">
                            <el-input id="deliveryUserPhone" v-model="deliveryUserPhone " class="edit-input" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label-width="30%" label="省份: ">
                            <!-- 성 -->
                            <el-select v-model="deliveryProvinceName" size="small" placeholder="" clearable style="width: 100%;" @change="setChangeProvince">
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in provinceData" :key="item.name" :label="item.name" :value="item.name" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label-width="30%" label="城市: ">
                            <!-- 시 -->
                            <el-select v-model="deliveryCityName" size="small" placeholder="" clearable style="width: 100%;" @change="setChangeCity">
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in cityData" :key="item.name" :label="item.name" :value="item.name" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label-width="30%" label="地区: ">
                            <!-- 구 -->
                            <el-select v-model="deliveryCountryName" size="small" placeholder="" clearable style="width: 100%;">
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in countryData" :key="item.name" :label="item.name" :value="item.name" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="15">
                        <el-form-item label-width="16%" label="详细地址: ">
                            <el-input v-model="deliveryAddressInfo " class="edit-input" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label-width="30%" label="地址门牌: ">
                            <el-input v-model="deliveryHouseNo " class="edit-input" size="small" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button @click="setUpateDeliveryAddress" type="primary">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/order/order_detail.js"></script>

<style lang="scss">
.el-tooltip__popper {
    padding: 5px;
}
</style>
