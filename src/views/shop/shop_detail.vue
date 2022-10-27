<template>
<div id="shop_register">
    <div class="mixin-components-container" v-loading="listLoading">
        <!-- <el-row style="margin-bottom: 10px;">
        <el-button type="primary" @click="setShopHidden" size="mini" style="float: right;">删除</el-button>
      </el-row> -->
        <el-form ref="shopForm" :model="dataForm" :rules="rules" class="form-container">
            <!-- 점포정보 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>商户信息</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="8">
                            <!-- 점포명 -->
                            <el-form-item prop="shopName" label-width="15%" label="商户名称: " class="postInfo-container-item">
                                <el-input id="shopName" size="small" ref="shopName" v-model="dataForm.shopName" placeholder="商户名称" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(名称不能超过20字)</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 점포 층, 구역, 위치 -->
                            <el-form-item prop="floorNum" label-width="10%" label="位置信息: " class="postInfo-container-item">
                                <!-- 점포 층수 -->
                                <el-select ref="floorNum" size="small" v-model="dataForm.floorNum" placeholder="楼层" clearable style="width: 25%;" @change="setChangeFloor('', '')">
                                    <el-option key="" value="" />
                                    <el-option v-for="item in listFloor" :key="item" :label="item" :value="item" />
                                </el-select>
                                <!-- 점포 구역 -->
                                <el-select ref="zoneNum" size="small" v-model="dataForm.zoneNum" placeholder="区" clearable style="width: 25%; margin-left: 10px;" @change="setChangeZone('')">
                                    <el-option key="" value="" />
                                    <el-option v-for="item in listZone" :key="item" :label="item" :value="item" />
                                </el-select>
                                <!-- 점포 위치 -->
                                <el-select ref="positionNum" size="small" v-model="dataForm.positionNum" placeholder="位号" clearable style="width: 25%; margin-left: 10px;">
                                    <el-option key="" value="" />
                                    <el-option v-for="item in listPosition" :key="item" :label="item" :value="item" />
                                </el-select>
                                <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-left: 5px;" @click="setShowPositionDialog">新增</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 위치주석 -->
                            <el-form-item label-width="15%" label="商户位置备注: " class="postInfo-container-item">
                                <el-input id="locationRemark" size="small" ref="locationRemark" v-model="dataForm.locationRemark" placeholder="商户位置备注" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(不能超过20字)</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="8">
                            <!-- 점포랭킹번호 -->
                            <el-form-item prop="rankingNum" label-width="15%" label="序号: " class="postInfo-container-item">
                                <el-input id="rankingNum" size="small" ref="rankingNum" v-model="dataForm.rankingNum" placeholder="序号" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(影响后台排序倒序)</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 키워드 -->
                            <el-form-item prop="tagName" label-width="10%" label="所属标签: " class="postInfo-container-item">
                                <el-input id="tagName" ref="tagName" size="small" v-model="dataForm.tagName" placeholder="请输入所属标签" style="width: 51%;" :readonly="true" />
                                <el-button type="primary" icon="el-icon-plus" size="mini" @click="setShowTagDialog" style="margin-left: 5px;">新增</el-button>
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(可动态添加标签，支持绑定多个标签)</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 분류 -->
                            <el-form-item prop="typeName" label-width="15%" label="所属分类: " class="postInfo-container-item">
                                <el-input id="typeName" ref="typeName" size="small" v-model="dataForm.typeName" placeholder="请输入所属分类" style="width: 48.5%;" :readonly="true" />
                                <el-button type="primary" icon="el-icon-plus" size="mini" @click="setShowTypeDialog" style="margin-left: 5px;">新增</el-button>
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(可动态添加分类)</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="8">
                            <!-- 점포오픈날자 -->
                            <el-form-item label-width="15%" label="开店时间: " class="postInfo-container-item">
                                <el-date-picker type="date" size="small" id="openDt" ref="openDt" v-model="dataForm.openDt" placeholder="开店时间" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;"></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="5%" label="" class="postInfo-container-item">
                                <el-checkbox v-model="dataForm.isSelf">是否是自营</el-checkbox>
                                <el-checkbox v-model="dataForm.isRecommend">推荐商户</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 점포배너이미지 -->
            <el-row style="margin-bottom: 10px;">
                <el-col :span="12">
                    <el-card class="box-card" style="width: 99%;">
                        <div slot="header" class="clearfix">
                            <span>商品主图</span>
                            <input ref="shopBanner" type="file" name="shopBanner" value="" style="display: none;" @change="setChangeBannerImage">
                            <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 40px;" @click="setOpenBannerBrowser">上传</el-button>
                        </div>
                        <el-row>
                            <div style="width: 35%; height: 200px; position: relative; margin-left: 100px;">
                                <Thumbnail :styles="busnessStyle" :imageUrl="dataForm.shopBanner" />
                                <div v-show="isShowBannerImg" @click="setCancelBannerImage" style="position: absolute; right: 15px; top: 15px; font-size: 20px; cursor: pointer; color: red;">X</div>
                            </div>
                        </el-row>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>列表背景图</span>
                            <input ref="shopBackround" type="file" name="shopBackround" value="" style="display: none;" @change="setChangeShopBackroundImage">
                            <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 40px;" @click="setOpenShopBackroundBrowser">上传</el-button>
                        </div>
                        <el-row>
                            <div style="width: 35%; height: 200px; position: relative; margin-left: 100px;">
                                <Thumbnail :styles="busnessStyle" :imageUrl="dataForm.shopBackround" />
                                <div v-show="isShowShopBackgroundImg" @click="setCancelShopBackroundImage" style="position: absolute; right: 15px; top: 15px; font-size: 20px; cursor: pointer; color: red;">X</div>
                            </div>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
            <!-- 점포운영자정보 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>运营者信息</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="8">
                            <!-- 점포운영자 위챗바인딩정보 -->
                            <el-form-item prop="shopWechatName" label-width="15%" label="运营者微信: " class="postInfo-container-item">
                                <el-input id="shopWechatName" size="small" ref="shopWechatName" v-model="dataForm.shopWechatName" placeholder="请绑定运营者微信" style="width: 48.5%;" :readonly="true" />
                                <el-button type="primary" icon="el-icon-plus" size="small" @click="setShowUserDialog" style="margin-left: 5px;">绑定</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 주민등록번호 -->
                            <el-form-item prop="idCard" label-width="15%" label="身份证号: " class="postInfo-container-item">
                                <el-input id="idCard" size="small" ref="idCard" v-model="dataForm.idCard" placeholder="身份证号" style="width: 60%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 운영자전화번호 -->
                            <el-form-item prop="phoneNum" label-width="15%" label="电话号: " class="postInfo-container-item">
                                <el-input id="phoneNum" size="small" ref="phoneNum" v-model="dataForm.phoneNum" placeholder="电话号" style="width: 60%;" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="8">
                            <!-- 점포운영자명 -->
                            <el-form-item prop="shopOwner" label-width="15%" label="运营者姓名: " class="postInfo-container-item">
                                <el-input id="shopOwner" size="small" ref="shopOwner" v-model="dataForm.shopOwner" placeholder="运营者姓名" style="width: 60%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 은행정보 -->
                            <el-form-item label-width="15%" label="结算信息: " class="postInfo-container-item">
                                <el-input id="bankCard" size="small" ref="bankCard" v-model="dataForm.bankCard" placeholder="结算信息" style="width: 60%;" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="8">
                            <!-- 점포운영자이미지 -->
                            <el-form-item label-width="15%" label="" class="postInfo-container-item">
                                <div style="width: 40%; position: relative;">
                                    <input ref="ownerAvatar" type="file" name="ownerAvatar" value="" style="display: none;" @change="setChangeOwnerImage">
                                    <el-button type="primary" icon="el-icon-plus" size="small" style="margin-bottom: 10px;" @click="setOpenOwnerBrowser">运营者头像</el-button>
                                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(建议上传200KB以下图片)</span>
                                    <Thumbnail :styles="busnessStyle" :imageUrl="dataForm.ownerAvatar" />
                                    <div v-show="isShowOwnerImg" @click="setCancelOwnerImage" style="position: absolute; right: 15px; top: 50px; font-size: 20px; cursor: pointer; color: red;">X</div>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 점포등록증 이미지 -->
                            <el-form-item label-width="15%" label="" class="postInfo-container-item">
                                <div style="width: 40%; position: relative;">
                                    <input ref="shopLicense" type="file" name="shopLicense" value="" style="display: none;" @change="setChangeLicenseImage">
                                    <el-button type="primary" icon="el-icon-plus" size="small" style="margin-bottom: 10px;" @click="setOpenLicenseBrowser">营业执照</el-button>
                                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(建议上传200KB以下图片)</span>
                                    <Thumbnail :styles="busnessStyle" :imageUrl="dataForm.shopLicense" />
                                    <div v-show="isShowLicenseImg" @click="setCancelLicenseImage" style="position: absolute; right: 15px; top: 50px; font-size: 20px; cursor: pointer; color: red;">X</div>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 결제수금번호 이미지 -->
                            <el-form-item label-width="15%" label="" class="postInfo-container-item">
                                <div style="width: 40%; position: relative;">
                                    <input ref="payCode" type="file" name="payCode" value="" style="display: none;" @change="setChangePayCodeImage">
                                    <el-button type="primary" icon="el-icon-plus" size="small" style="margin-bottom: 10px;" @click="setOpenPayCodeBrowser">结算收款码</el-button>
                                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(建议上传200KB以下图片)</span>
                                    <Thumbnail :styles="busnessStyle" :imageUrl="dataForm.payCode" />
                                    <div v-show="isShowPayCodeImg" @click="setCancelPayCodeImage" style="position: absolute; right: 15px; top: 50px; font-size: 20px; cursor: pointer; color: red;">X</div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 점포소개 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>商户介绍</span>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(图片需要单独点击“上传图片”按钮上传。图片建议宽度800)</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="5%" label="" class="postInfo-container-item">
                            <el-input type="textarea" v-model="dataForm.shopIntro"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <el-row>
            <router-link :to="'/shop/shop_list'" style="position: fixed; right: 120px; bottom: 50px; z-index: 10;">
                <el-button type="danger">取消</el-button>
            </router-link>
            <el-button type="primary" @click="setUpdate" style="position: fixed; right: 40px; bottom: 50px; z-index: 10;">保存</el-button>
        </el-row>
    </div>

    <!-- 점포구역 추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowPositionDialog" :close-on-click-modal="false">
        <div class="filter-container">
            <el-row>
                <el-input id="dlgFloorNum" size="small" ref="dlgFloorNum" v-model="dlgFloorNum" placeholder="请输入楼层" style="margin-bottom: 10px;" />
                <el-input id="dlgZoneNum" size="small" ref="dlgZoneNum" v-model="dlgZoneNum" placeholder="请输入区" style="margin-bottom: 10px;" />
                <el-input id="dlgPositionNum" size="small" ref="dlgPositionNum" v-model="dlgPositionNum" placeholder="请输入位号" />
            </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddPosition">保存</el-button>
        </div>
    </el-dialog>

    <!-- 키워드추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowTagDialog" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-row>
                <el-col :span="15">
                    <el-input id="searchTagName" size="small" ref="searchTagName" v-model="searchTagName" placeholder="以标签名称搜索" @keyup.enter.native="setSearchTag" />
                </el-col>
                <el-col :span="9">
                    <el-button type="success" size="small" icon="el-icon-plus" style="float: right; margin-left: 5px;" @click="setRegisterTag">新增</el-button>
                    <el-button type="primary" size="small" plain icon="el-icon-search" style="float: right;" @click="setSearchTag">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-card class="box-card">
            <el-table :data="dataTag" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column label="" align="center" :render-header="renderTagHeader" width="100%">
                    <template slot-scope="{row}">
                        <el-checkbox v-model="row.checked" @change="setTableTagSelect(row.id, row.tagInfo)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="以标签名称搜索" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.tagInfo }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddTag">保存</el-button>
        </div>
    </el-dialog>

    <!-- 분류추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowTypeDialog" @close="setCanceTypeDialog" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form ref="prodForm" class="form-container">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="20%" label="商品大类别: ">
                            <!-- 상품 대분류 -->
                            <el-select size="small" v-model="dataForm.typeId" placeholder="商品大类别" clearable style="width: 100%;" @change="setChangeCategory">
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in listType" :key="item.id" :label="item.typeName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="25%" label="商品小类别: ">
                            <!-- 상품 소분류 -->
                            <el-select size="small" v-model="dataForm.subTypeId" placeholder="商品小类别" clearable style="width: 100%;">
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in listSubType" :key="item.id" :label="item.typeName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCanceTypeDialog">取消</el-button>
            <el-button type="primary" @click="setAddType">保存</el-button>
        </div>
    </el-dialog>

    <!-- 운영자위챗정보 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowUserDialog" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-row>
                <el-col :span="7">
                    <el-input size="small" id="searchWehchatName" ref="searchShopName" v-model="searchWehchatName" placeholder="微信昵称" @keyup.enter.native="setSearchUserInfo" />
                </el-col>
                <el-col :span="1" style="height: 10px"></el-col>
                <el-col :span="7">
                    <el-input size="small" id="searchWehchatPhone" ref="searchShopName" v-model="searchWehchatPhone" placeholder="手机号" @keyup.enter.native="setSearchUserInfo" />
                </el-col>
                <el-col :span="9">
                    <el-button size="small" type="primary" plain icon="el-icon-search" style="float: right;" @click="setSearchUserInfo">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-card class="box-card">
            <el-table :data="listUserData" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column label="选择" align="center" width="60%">
                    <template slot-scope="{row}">
                        <input type="radio" v-model="row.checked" :value="row.id" name="" @click="setOwnerInfo(row)" style="cursor: pointer;">
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
</div>
</template>

<script src="@/assets/js/shop/shop_detail.js"></script>

<style lang="scss">
.mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}

.color_prop .el-input__inner {
    color: red !important;
}

textarea {
    min-height: 300px;
}
</style>
