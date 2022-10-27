<template>
<div id="event_register">
    <div class="mixin-components-container">
        <el-form ref="postForm" :model="dataForm" :rules="rules" class="form-container" style="margin-bottom: 10px;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>活动信息</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <!-- 이벤트명 -->
                        <el-form-item prop="eventName" label-width="15%" label="活动名称: " class="postInfo-container-item">
                            <el-input id="eventName" size="small" ref="eventName" v-model="dataForm.eventName" placeholder="活动名称" style="width: 36%;" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(名称不能超过20字)</span>
                        </el-form-item>
                        <!-- 랭킹번호 -->
                        <el-form-item prop="rankingNum" label-width="15%" label="序号: " class="postInfo-container-item">
                            <el-input id="rankingNum" size="small" ref="rankingNum" v-model="dataForm.rankingNum" type="text" placeholder="序号" style="width: 36%;" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(影响前台显示排序及后台排序 降序)</span>
                        </el-form-item>
                        <!-- 이벤트날자 -->
                        <el-form-item label-width="15%" label="日期: " class="postInfo-container-item">
                            <el-date-picker v-model="dataForm.beginDt" size="small" type="date" placeholder="开始日期" style="width: 15%;" @change="setChangeDate" />
                            <label class="radio-label" style="margin-left: 37px; margin-right: 37px;">~</label>
                            <el-date-picker v-model="dataForm.endDt" size="small" type="date" placeholder="结束日期" style="width: 15%;" @change="setChangeDate" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(超过结束日期时广告将自动下架并且前台消失)</span>
                        </el-form-item>
                        <!-- 배송방식 -->
                        <el-form-item label-width="15%" label="配送方式: " class="postInfo-container-item">
                            <el-select v-model="dataForm.deliveryType" size="small" placeholder="" clearable style="width: 36%;">
                                <el-option key="" value="" label="" />
                                <el-option v-for="item in listDelivery" :key="item.id" :value="item.id" :label="item.name" />
                            </el-select>
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(暂固定为用户选择)</span>
                        </el-form-item>
                        <!-- 이벤트 이미지 -->
                        <el-form-item prop="coverImgUri" label-width="15%" label="活动首页图片: " class="postInfo-container-item">
                            <input ref="coverImgUri" type="file" name="coverImgUri" value="" style="display: none;" @change="setPreviewMainImage">
                            <div style="width: 150px; float: left; line-height: 18px;" @click="setOpenMainImage">
                                <Thumbnail :styles="styles" :imageUrl="dataForm.coverImgUri" />
                                <span style="color: #999999; font-size: 12px;">(建议上传 660*200及200KB以下图片)</span>
                            </div>
                            <label class="radio-label" style="margin-left: 6%; float: left;">活动顶部图片: </label>
                            <div style="position: relative; width: 150px; float: left; margin-left: 15px; line-height: 18px;">
                                <input ref="topImgUri" type="file" name="topImgUri" value="" style="display: none;" @change="setPreviewSubImage">
                                <div style="width: 150px;" @click="setOpenSubImage">
                                    <Thumbnail :styles="styles" :imageUrl="dataForm.topImgUri" />
                                    <span style="color: #999999; font-size: 12px;">(建议上传 720*319及200KB以下图片)</span>
                                </div>
                                <div v-show="isShowImageCancel" @click="setCancelSubImage" style="position: absolute; right: 8px; top: 5px; font-size: 20px; cursor: pointer; color: red;">X</div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-row>
                <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="setShowProductDlg" style="float: right; margin-bottom: 5px; margin-top: 10px;">添加商品</el-button>
            </el-row>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>活动商品</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="listEventProduct" border fit highlight-current-row style="width: 100%;">
                            <el-table-column label="编号" align="center" width="80%;">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsId }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品图片" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <img :src="row.uri" style="width: 45px; height: 45px;" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column label="商品名称" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品价格" align="center" width="130%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.originalPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="活动价格" align="center" width="150%">
                                <template slot-scope="{row, $index}">
                                    <el-input class="color_prop" :id="'sale-price-' + $index" v-model="row.salesPrice" type="text" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="序号" align="center" width="150%">
                                <template slot-scope="{row, $index}">
                                    <el-input :id="'rankNumber-' + $index" v-model="row.rankingNum" type="text" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="删除" align="center" width="100%">
                                <template slot-scope="{$index}">
                                    <el-button size="mini" icon="el-icon-edit" type="danger" @click="setDeleteProduct($index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <el-row>
            <el-button type="primary" size="normal" style="float: right; margin-left: 10px;" @click="setRegister">保存</el-button>
            <router-link :to="'/event/event_list'" style="float: right;">
                <el-button type="danger">取消</el-button>
            </router-link>
        </el-row>
    </div>

    <!-- 이벤트상품 추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="添加商品" :visible.sync="isShowProductDlg" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-row>
                <el-input type="text" size="small" v-model="searchProdName" placeholder="请输入商品名称" style="width: 60%;" @keyup.enter.native="setSearchProduct" />
                <el-button type="primary" size="small" plain icon="el-icon-search" style="float: right;" @click="setSearchProduct">搜索</el-button>
            </el-row>
        </div>
        <el-row>
            <el-card class="box-card">
                <el-table :data="dataProduct" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="选择" prop="id" align="center" width="80%;">
                        <template slot-scope="{row}">
                            <input type="radio" v-model="isCheckProd" name="" :value="row.id" @click="setSelectProduct(row)">
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.goodsName }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="totalProd > 0" :total="totalProd" :page.sync="prodPage" :limit.sync="prodSize" @pagination="getProductData" style="text-align: center;" />
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="setCancelDlg">取消</el-button>
            <el-button type="primary" @click="setAddProduct">添加商品</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/event/event_register.js"></script>

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
