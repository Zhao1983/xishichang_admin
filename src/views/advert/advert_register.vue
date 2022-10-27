<template>
<div id="advert_register">
    <div class="mixin-components-container">
        <el-form ref="postForm" :model="dataForm" :rules="rules" class="form-container">
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <!-- 광고명 -->
                        <el-form-item prop="adName" label-width="15%" label="广告名称: " class="postInfo-container-item">
                            <el-input id="adName" ref="adName" size="small" v-model="dataForm.adName" placeholder="请输入广告名称" style="width: 36%;" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(名称不能超过20字)</span>
                        </el-form-item>
                        <!-- 이미지 추가 -->
                        <el-form-item label-width="15%" label="" class="postInfo-container-item">
                            <input ref="advertimage" type="file" size="small" name="advertimage" value="" style="display: none;" @change="setChangeImage">
                            <div @click="setPriviewImage" style="width: 150px;">
                                <Thumbnail :styles="styles" :imageUrl="dataForm.imgUri" />
                            </div>
                            <span style="color: #999999; font-size: 12px;">(建议上传 规格660*270 及200KB以下图片)</span>
                        </el-form-item>
                        <!-- 관련링크 -->
                        <el-form-item prop="adType" label-width="15%" label="链接类型: " class="postInfo-container-item">
                            <el-select v-model="dataForm.adType" size="small" placeholder="链接类型" clearable style="width: 36%" @change="setKind">
                                <el-option v-for="item in listKind" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <!-- 검색용키워드추가 -->
                        <el-form-item v-show="isShowKeywordSelect" prop="entityName" label-width="15%" label="关键字: " class="postInfo-container-item">
                            <el-select v-model="dataForm.entityName" size="small" placeholder="关键字" clearable style="width: 36%">
                                <el-option v-for="item in keywordData" :key="item.id" :label="item.tagInfo" :value="item.tagInfo" />
                            </el-select>
                            <el-button type="primary" icon="el-icon-plus" size="mini" style="margin-left: 5px;" @click="setShowKeywordDialog">增加</el-button>
                        </el-form-item>
                        <!-- 링크한 타겟 내용 -->
                        <el-form-item label-width="15%" label="广告内容: " class="postInfo-container-item">
                            <el-input ref="advert_content" size="small" v-model="dataForm.linkName" placeholder="广告内容" style="width: 36%;" v-bind:readonly="true" @click.native="setClickKind" />
                        </el-form-item>
                        <!-- 랭킹순위 -->
                        <el-form-item prop="rankingNum" label-width="15%" label="序号: " class="postInfo-container-item">
                            <el-input id="rankingNum" ref="rankingNum" size="small" v-model="dataForm.rankingNum" type="text" placeholder="序号" style="width: 36%;" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(影响前台显示排序及后台排序 降序)</span>
                        </el-form-item>
                        <!-- 광고진행날자 -->
                        <el-form-item prop="beginDt" label-width="15%" label="日期: " class="postInfo-container-item">
                            <el-date-picker ref="beginDt" size="small" v-model="dataForm.beginDt" type="date" placeholder="开始日期" style="width: 15%;" @change="setChangeDate" />
                            <label class="radio-label" style="margin-left: 33px; margin-right: 32px;">~</label>
                            <el-date-picker ref="endDt" size="small" v-model="dataForm.endDt" type="date" placeholder="结束日期" style="width: 15%;" @change="setChangeDate" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(超过结束日期时广告将自动下架)</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <el-row style="margin-top: 10px;">
            <el-button type="primary" size="normal" style="float: right; margin-left: 10px;" @click="setRegisterAdvert">保存</el-button>
            <router-link :to="'/advert/advert_list'" style="float: right;">
                <el-button type="danger">取消</el-button>
            </router-link>
        </el-row>
    </div>

    <!-- 관련링크 다이얼로그(상품) -->
    <el-dialog v-el-drag-dialog title="广告商品" :visible.sync="isShowProductDlg" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 15px;">
            <el-row>
                <label class="radio-label" style="margin-left: 10px;">商品名称: </label>
                <el-input v-model="searchProdName" size="small" placeholder="以商品名称搜索" style="width: 60%;" @keyup.enter.native="setSearchProduct" />
                <el-button type="default" icon="el-icon-search" size="small" style="float: right;" @click="setSearchProduct">搜索</el-button>
            </el-row>
        </div>
        <el-row>
            <el-card class="box-card">
                <el-table v-loading="listLoading" :data="listProduct" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="选择" prop="id" align="center" width="80%;">
                        <template slot-scope="{row}">
                            <input type="radio" v-model="row.checked" name="" :value="row.id" @click="setSelectProduct(row)" style="cursor: pointer;">
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.goodsName }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="totalProduct > 0" :total="totalProduct" :page.sync="prodPage" :limit.sync="prodSize" @pagination="getProductData" style="text-align: center;" />
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDlg">取消</el-button>
            <el-button type="primary" @click="setAddProduct">添加</el-button>
        </div>
    </el-dialog>
    <!-- 관련링크 다이얼로그(점포) -->
    <el-dialog v-el-drag-dialog title="广告商户" :visible.sync="isShowShopDlg" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 15px;">
            <el-row>
                <label class="radio-label" style="margin-left: 10px;">商户名称: </label>
                <el-input v-model="searchShopName" size="small" placeholder="请以商户名称进行搜索" style="width: 60%;" @keyup.enter.native="setSearchShop" />
                <el-button type="default" size="small" icon="el-icon-search" style="float: right;" @click="setSearchShop">搜索</el-button>
            </el-row>
        </div>
        <el-row>
            <el-card class="box-card">
                <el-table v-loading="listLoading" :data="listShop" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="选择" prop="id" align="center" width="80%;">
                        <template slot-scope="{row}">
                            <input type="radio" v-model="row.checked" name="" :value="row.id" @click="setSelectShop(row)" style="cursor: pointer;">
                        </template>
                    </el-table-column>
                    <el-table-column label="商户名称" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.shopName }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="totalShop > 0" :total="totalShop" :page.sync="shopPage" :limit.sync="shopSize" @pagination="getShopData" style="text-align: center;" />
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDlg">取消</el-button>
            <el-button type="primary" @click="setAddShop">添加</el-button>
        </div>
    </el-dialog>
    <!-- 관련링크 다이얼로그(주제) -->
    <el-dialog v-el-drag-dialog title="广告专题" :visible.sync="isShowTopicDlg" width="40%" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 15px;">
            <el-row>
                <label class="radio-label" style="margin-left: 10px;">专题名称: </label>
                <el-input v-model="searchTopicName" size="small" placeholder="以专题名称搜索" style="width: 60%;" @keyup.enter.native="setSearchTopic" />
                <el-button type="default" size="small" icon="el-icon-search" style="float: right;" @click="setSearchTopic">搜索</el-button>
            </el-row>
        </div>
        <el-row>
            <el-card class="box-card">
                <el-table v-loading="listLoading" :data="listTopic" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="选择" prop="id" align="center" width="80%;">
                        <template slot-scope="{row}">
                            <input type="radio" v-model="row.checked" name="" :value="row.id" @click="setSelectTopic(row)" style="cursor: pointer;">
                        </template>
                    </el-table-column>
                    <el-table-column label="专题名称" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.topicName }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="totalTopic > 0" :total="totalTopic" :page.sync="pageTopic" :limit.sync="sizeTopic" @pagination="getTopicData" style="text-align: center;" />
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDlg">取消</el-button>
            <el-button type="primary" @click="setAddTopic">添加</el-button>
        </div>
    </el-dialog>
    <!-- 검색키워드추가다이얼로그 -->
    <el-dialog v-el-drag-dialog title="关键字增加" :visible.sync="isShowKeywordDialog" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input ref="searchKeyword" id="searchKeyword" type="text" size="small" v-model="searchKeyword" min="0" placeholder="请输入关键字" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="setCancelDlg">取消</el-button>
            <el-button type="primary" @click="setAddSearchKeyword">增加</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/advert/advert_register.js"></script>

<style lang="scss" scoped>
.mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}
</style>
