<template>
<div id="event_detail">
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
                            <el-input id="eventName" ref="eventName" size="small" v-model="dataForm.eventName" placeholder="活动名称" style="width: 36%;" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(名称不能超过20字)</span>
                        </el-form-item>
                        <!-- 랭킹번호 -->
                        <el-form-item prop="rankingNum" label-width="15%" label="序号: " class="postInfo-container-item">
                            <el-input id="rankingNum" ref="rankingNum" size="small" v-model="dataForm.rankingNum" type="text" placeholder="序号" style="width: 36%;" />
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
        </el-form>
        <el-row>
            <el-button type="primary" size="normal" style="float: right; margin-left: 10px;" @click="setUpdate">编辑</el-button>
            <router-link :to="'/event/event_list'" style="float: right;">
                <el-button type="danger">取消</el-button>
            </router-link>
        </el-row>
    </div>
</div>
</template>

<script src="@/assets/js/event/event_detail.js"></script>

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
