<template>
<div id="setting">
    <div class="mixin-components-container">
        <el-card class="box-card" style="padding: 10px;">
            <el-form ref="dataForm" :model="dataForm" :rules="rules" class="form-container" label-width="17%">
                <!-- 사이트명 -->
                <el-form-item prop="siteName" label="商城名称: " class="postInfo-container-item">
                    <el-input id="siteName" ref="siteName" size="small" v-model="dataForm.siteName" placeholder="请输入商城名称" style="width: 30%;" />
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(前台显示的商城名称)</span>
                </el-form-item>
                <!-- 사이트로고 -->
                <el-form-item label="商城LOGO: " class="postInfo-container-item">
                    <input ref="siteLogo" type="file" name="siteLogo" size="small" value="" style="display: none;" @change="setChangeSiteLogoImage">
                    <div style="width: 70px;" @click="setPreviewSiteLogoImage">
                        <Thumbnail :styles="styles" :imageUrl="dataForm.siteLogo" />
                    </div>
                </el-form-item>
                <!-- 점포이미지 -->
                <el-form-item label="商户标签: " class="postInfo-container-item">
                    <input ref="shopIcon" type="file" name="shopIcon" value="" style="display: none;" @change="setChangeShopIconImage">
                    <div style="width: 130px;" @click="setPreviewShopIconImage">
                        <Thumbnail :styles="shopStyle" :imageUrl="dataForm.shopIcon" />
                    </div>
                </el-form-item>
                <!-- 고객센터전화 -->
                <el-form-item prop="tempPhone" label="客服电话: " class="postInfo-container-item">
                    <el-input ref="tempPhone" v-model="dataForm.tempPhone" size="small" placeholder="请输入客服电话" style="width: 30%;" />
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(接受新订单的短信通知)</span>
                </el-form-item>
                <!-- 위쳇번호 -->
                <el-form-item label="客服微信号: " class="postInfo-container-item">
                    <el-input ref="tempWechatName" v-model="dataForm.tempWechatName" size="small" placeholder="请输入微信号" style="width: 30%;" />
                    <el-button type="primary" icon="el-icon-check" size="mini" style="margin-left: 5px;" @click="setShowWechatInfo">绑定</el-button>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(接受新订单的微信推送通知，需要填写关注过公众号的微信昵称。“, ”号区分，支持绑定多个)</span>
                </el-form-item>
                <!-- SMS전송여부 -->
                <el-form-item label="" class="postInfo-container-item">
                    <el-checkbox v-model="dataForm.orderSmsStatus">是否短信通知</el-checkbox>
                    <div class="">
                        <el-input ref="tempSmsMsg" id="tempSmsMsg" v-model="dataForm.orderSmsMsg" size="small" placeholder="请输入短信通知" style="width: 30%;" :disabled="!dataForm.orderSmsStatus" />
                        <span style="color: #999999; font-size: 12px; margin-left: 10px;">(不能超过100字)</span>
                    </div>
                </el-form-item>
                <!-- 메일 -->
                <el-form-item label="邮箱: " class="postInfo-container-item">
                    <el-input ref="tempMail" v-model="dataForm.tempMail" size="small" placeholder="请输入邮箱" style="width: 30%;" />
                </el-form-item>
                <!-- 운영기업위치 -->
                <el-form-item prop="gps" label="商城位置: " class="postInfo-container-item">
                    <el-input ref="gps" v-model="dataForm.gps" size="small" placeholder="请输入商城位置" style="width: 30%;" :readonly="true" />
                    <el-button type="primary" icon="el-icon-check" size="mini" style="margin-left: 5px;" @click="setShowMapDialog">选取</el-button>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(设置商城所在坐标)</span>
                </el-form-item>
                <!-- ICP증서번호 -->
                <el-form-item prop="icp" label="ICP证书号: " class="postInfo-container-item">
                    <el-input ref="icp" v-model="dataForm.icp" size="small" placeholder="请输入ICP证书号" style="width: 30%;" />
                </el-form-item>
                <!-- 근무시간 -->
                <el-form-item prop="tempStartWorking" label="工作时间: " class="postInfo-container-item">
                    <el-col :span="3">
                        <el-time-picker ref="tempStartWorking" size="small" v-model="dataForm.tempStartWorking" value-format="HH:mm" type="date" placeholder="开始日期" style="width: 100%;" />
                    </el-col>
                    <el-col :span="1" style="text-align: center;">~</el-col>
                    <el-col :span="3">
                        <el-time-picker ref="tempEndWorking" size="small" v-model="dataForm.tempEndWorking" value-format="HH:mm" type="date" placeholder="结束日期" style="width: 100%;" />
                    </el-col>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(商城工作时间，用在工作时间外下单前会提示用户现在下单可能不能马上发货的信息)</span>
                </el-form-item>
                <!-- 지불허용시간 -->
                <el-form-item prop="orderLimit" label="营业结束前限制时间(hh): " class="postInfo-container-item">
                    <el-input id="orderLimit" ref="orderLimit" size="small" v-model="dataForm.orderLimit" type="text" placeholder="" style="width: 30%;" />
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(小时)</span>
                </el-form-item>
                <!-- 하루 주문가능 수량설정 -->
                <el-form-item prop="orderLimitNum" label="每天订单的上限数量: " class="postInfo-container-item">
                    <el-input id="orderLimitNum" ref="orderLimitNum" size="small" v-model="dataForm.orderLimitNum" type="text" placeholder="" style="width: 30%;" />
                </el-form-item>
                <!-- 하루 주문가능 수량설정 메세지 -->
                <el-form-item prop="orderLimitMsg" label="每天订单上限数量的提示语: " class="postInfo-container-item">
                    <el-input id="orderLimitMsg" ref="orderLimitMsg" size="small" v-model="dataForm.orderLimitMsg" type="text" placeholder="" style="width: 30%;" />
                </el-form-item>
                <!-- 도메인 -->
                <el-form-item prop="domain" label="网站域名: " class="postInfo-container-item">
                    <el-input ref="domain" v-model="dataForm.domain" size="small" placeholder="请输入网站域名" style="width: 30%;" />
                </el-form-item>
                <!-- 판매수설정 -->
                <el-form-item label="销量设置: " class="postInfo-container-item">
                    <el-radio-group v-model="dataForm.salesStatus">
                        <el-radio :label="'1'">虚拟销量</el-radio>
                        <el-radio :label="'2'">真实销量</el-radio>
                        <el-radio :label="'0'">不显示</el-radio>
                    </el-radio-group>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(虚拟销量-前台显示商品虚拟销量+真实销量, 真实销量-前台只显示商品真实销量, 不显示-前台不显示商品销量)</span>
                </el-form-item>
                <!-- 지불대기시간 -->
                <el-form-item prop="orderInvalidDuration" label="下单付款失效(mm): " class="postInfo-container-item">
                    <el-input id="orderInvalidDuration" ref="orderInvalidDuration" size="small" v-model="dataForm.orderInvalidDuration" type="text" placeholder="" style="width: 30%;" />
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(分钟，订单在提交后在指定时间未付款时订单自动失效)</span>
                </el-form-item>
                <!-- 배송설정일 -->
                <el-form-item prop="orderDeliveryDuration" label="超时快递设置(天): " class="postInfo-container-item">
                    <el-input id="orderDeliveryDuration" ref="orderDeliveryDuration" size="small" v-model="dataForm.orderDeliveryDuration" type="text" placeholder="" style="width: 30%;" />
                </el-form-item>
                <!-- 추천검색어 -->
                <el-form-item label="热搜标签设置: " class="postInfo-container-item">
                    <el-input ref="tempKeyword" v-model="dataForm.tempKeyword" size="small" placeholder="" style="width: 30%;" />
                    <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-left: 5px;" @click="setShowKeywordDialog">新增</el-button>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(前台搜索时显示的热搜标签)</span>
                </el-form-item>
                <!-- 쇼핑몰 ON/OFF -->
                <el-form-item label="商城开关: " class="postInfo-container-item">
                    <el-radio-group v-model="dataForm.siteStatus">
                        <el-radio :label="'1'">开启</el-radio>
                        <el-radio :label="'0'">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- ON/OFF 리유 -->
                <el-form-item v-if="dataForm.siteStatus === '0'" label="" class="postInfo-container-item">
                    <el-input ref="closedNotice" v-model="dataForm.closedNotice" size="small" id="siteReason" type="textarea" placeholder="请输入理由" style="width: 30%;" />
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(关闭商城时显示的文本)</span>
                </el-form-item>
                <!-- 점포등급 -->
                <el-form-item prop="shopLevel_min_1" label="商户销量等级算法: " class="postInfo-container-item">
                    <el-col :span="24" style="margin-bottom: 10px;">
                        <el-col :span="3">
                            <el-input id="shopLevel_min_1" ref="" v-model="dataForm.shopLevel_min_1" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <el-col :span="1" style="text-align: center;">~</el-col>
                        <el-col :span="3">
                            <el-input id="shopLevel_max_1" ref="" v-model="dataForm.shopLevel_max_1" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <span style="color: #999999; font-size: 12px; margin-left: 10px;">为1钻</span>
                    </el-col>
                    <el-col :span="24" style="margin-bottom: 10px;">
                        <el-col :span="3">
                            <el-input id="shopLevel_min_2" ref="" v-model="dataForm.shopLevel_min_2" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <el-col :span="1" style="text-align: center;">~</el-col>
                        <el-col :span="3">
                            <el-input id="shopLevel_max_2" ref="" v-model="dataForm.shopLevel_max_2" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <span style="color: #999999; font-size: 12px; margin-left: 10px;">为2钻</span>
                    </el-col>
                    <el-col :span="24" style="margin-bottom: 10px;">
                        <el-col :span="3">
                            <el-input id="shopLevel_min_3" ref="" v-model="dataForm.shopLevel_min_3" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <el-col :span="1" style="text-align: center;">~</el-col>
                        <el-col :span="3">
                            <el-input id="shopLevel_max_3" ref="" v-model="dataForm.shopLevel_max_3" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <span style="color: #999999; font-size: 12px; margin-left: 10px;">为3钻</span>
                    </el-col>
                    <el-col :span="24" style="margin-bottom: 10px;">
                        <el-col :span="3">
                            <el-input id="shopLevel_min_4" ref="" v-model="dataForm.shopLevel_min_4" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <el-col :span="1" style="text-align: center;">~</el-col>
                        <el-col :span="3">
                            <el-input id="shopLevel_max_4" ref="" v-model="dataForm.shopLevel_max_4" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <span style="color: #999999; font-size: 12px; margin-left: 10px;">为4钻</span>
                    </el-col>
                    <el-col :span="24" style="margin-bottom: 10px;">
                        <el-col :span="3">
                            <el-input id="shopLevel_min_5" ref="" v-model="dataForm.shopLevel_min_5" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <el-col :span="1" style="text-align: center;">~</el-col>
                        <el-col :span="3">
                            <el-input id="shopLevel_max_5" ref="" v-model="dataForm.shopLevel_max_5" size="small" placeholder="" style="width: 100%;" />
                        </el-col>
                        <span style="color: #999999; font-size: 12px; margin-left: 10px;">为5钻</span>
                    </el-col>
                </el-form-item>
                <!-- 계량단위 -->
                <el-form-item label="计量单位设置: " class="postInfo-container-item">
                    <el-select v-model="dataForm.unit" placeholder="请选择" size="small" clearable style="width: 30%">
                        <el-option v-for="item in tempUnit" :key="item" :label="item" :value="item" />
                    </el-select>
                    <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-left: 5px;" @click="setShowUnitDialog">增加</el-button>
                </el-form-item>
                <el-form-item label="商品招牌: " class="postInfo-container-item">
                    <el-col :span="24">
                        <el-col :span="3">
                            <el-select v-model="dataForm.iconName" placeholder="请选择" size="small" clearable style="width: 90%" @change="setChangeGoodsIconData">
                                <el-option v-for="item in dataForm.goodsIconBeans" :key="item.iconName" :label="item.iconName" :value="item.iconName" />
                            </el-select>
                        </el-col>
                        <el-col :span="1">
                            <div style="width: 70px;">
                                <Thumbnail :styles="styles" :imageUrl="dataForm.iconUrl" />
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="setShowGoodsIconDialog">增加</el-button>
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(建议上传 40*40及图片)</span>
                        </el-col>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品图片水印: " class="postInfo-container-item">
                    <input ref="watermarkPicFile" type="file" name="watermarkPicFile" size="small" value="" style="display: none;" @change="setChangeGoodsImageIcon">
                    <div style="width: 70px; float: left;" @click="setPreviewGoodsImageIcon">
                        <Thumbnail :styles="styles" :imageUrl="dataForm.watermarkPic" />
                    </div>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px; float: left;">(建议上传 100*100及图片)</span>
                </el-form-item>
                <el-form-item label="商品文字水印: " class="postInfo-container-item">
                    <input ref="watermarkWordFile" type="file" name="watermarkWordFile" size="small" value="" style="display: none;" @change="setChangeGoodsWordImage">
                    <div style="width: 70px;" @click="setPreviewGoodsWordImage">
                        <Thumbnail :styles="styles" :imageUrl="dataForm.watermarkWord" />
                    </div>
                </el-form-item>
                <!-- 사이트소개 -->
                <el-form-item label="商城介绍: " class="postInfo-container-item">
                    <tinymce v-model="dataForm.readme" :kind="baseURL + 'upload/readme'" :width="700" :height="200" />
                </el-form-item>
                <!-- 푸터내용 -->
                <el-form-item label="购买须知: " class="postInfo-container-item">
                    <tinymce v-model="dataForm.salesNotice" :kind="baseURL + 'upload/salesNotice'" :width="700" :height="200" />
                </el-form-item>
            </el-form>
        </el-card>
        <el-row>
            <el-button type="primary" size="normal" style="position: fixed; right: 40px; bottom: 50px; z-index: 10;" @click="setUpdate">保存</el-button>
        </el-row>
    </div>

    <!-- 운영자위챗정보 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowWechatDialog" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-row>
                <el-col :span="7">
                    <el-input id="searchWehchatName" size="small" ref="searchShopName" v-model="searchWehchatName" placeholder="微信昵称" @keyup.enter.native="setSearchUserInfo" />
                </el-col>
                <el-col :span="1" style="height: 10px"></el-col>
                <el-col :span="7">
                    <el-input id="searchWehchatPhone" size="small" ref="searchShopName" v-model="searchWehchatPhone" placeholder="手机号" @keyup.enter.native="setSearchUserInfo" />
                </el-col>
                <el-col :span="9">
                    <el-button type="primary" size="small" plain icon="el-icon-search" style="float: right;" @click="setSearchUserInfo">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-card class="box-card">
            <el-table :data="listUserData" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column label="选择" align="center" :render-header="renderTagHeader" width="100%">
                    <template slot-scope="{row}">
                        <el-checkbox v-model="row.checked" @change="setTableTagSelect(row.id, row.name)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="名称" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.userNick }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.phoneNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="角色" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.userRole }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="totalUserNum > 0" :total="totalUserNum" :page.sync="pageUser" :limit.sync="sizeUser" @pagination="getOwnerInfoData" style="text-align: center;" />
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddOwnerInfo">保存</el-button>
        </div>
    </el-dialog>
    <!-- 지도 추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="商城位置选取" :visible.sync="isShowMapDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <div style="width: 100%; height: 500px;">
                    <Map :center="'129.507401,42.905621'" @handleMapLocation="setMapLocation" />
                </div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!-- 추천검색어 추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="热搜标签保存" :visible.sync="isShowKeywordDialog" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input ref="keyword" id="keyword" type="text" size="small" v-model="keyword" min="0" placeholder="请输入热搜标签" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddKeyword">保存</el-button>
        </div>
    </el-dialog>
    <!-- 계랭단위 추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="计量单位保存" :visible.sync="isShowUnitDialog" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input ref="dlgUnit" id="dlgUnit" type="text" size="small" v-model="dlgUnit" min="0" placeholder="请输入计量单位" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddUnit">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="商品招牌" :visible.sync="isShowGoodsIconDialog" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input ref="dlgIconName" id="dlgIconName" type="text" size="small" v-model="dlgIconName" min="0" style="margin-bottom: 10px;" placeholder="请输入商品招牌名称" />
                <input ref="goodsIconFile" type="file" name="goodsIconFile" size="small" value="" style="display: none;" @change="setChangeGoodsIcon">
                <div style="width: 70px;" @click="setPreviewGoodsIcon">
                    <Thumbnail :styles="styles" :imageUrl="dlgIconUrl" />
                </div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddGoodsIconInfo">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/setting/setting.js"></script>

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
