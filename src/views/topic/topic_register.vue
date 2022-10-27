<template>
<div id="topic_register">
    <div class="mixin-components-container">
        <el-form ref="postForm" :model="dataForm" :rules="rules" class="form-container">
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <!-- 주제명 -->
                        <el-form-item prop="topicName" label-width="15%" label="专题名称: " class="postInfo-container-item">
                            <el-input id="topicName" size="small" ref="topicName" v-model="dataForm.topicName" placeholder="请输入专题名称" style="width: 36%;" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(专题分类为标签时显示在首页标签列表标题里)</span>
                        </el-form-item>
                        <!-- 주제서브명 -->
                        <el-form-item label-width="15%" label="副题名称: " class="postInfo-container-item">
                            <el-input id="topicAlias" size="small" ref="topicAlias" v-model="dataForm.topicAlias" placeholder="请输入副题名称" style="width: 36%;" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(专题分类为标签时显示在首页标签列表标副题里)</span>
                        </el-form-item>
                        <!-- 랭킹번호 -->
                        <el-form-item prop="rankingNum" label-width="15%" label="序号: " class="postInfo-container-item">
                            <el-input id="rankingNum" size="small" ref="rankingNum" v-model="dataForm.rankingNum" placeholder="请输入序号" style="width: 36%;" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(首页显示排序 升序)</span>
                        </el-form-item>
                        <!-- 주제종류 -->
                        <el-form-item prop="topicType" label-width="15%" label="专题分类: " class="postInfo-container-item">
                            <el-select ref="topicType" size="small" v-model="dataForm.topicType" placeholder="专题分类" clearable style="width: 36%;" @change="setChangeTopicType">
                                <el-option key="1" label="分类" value="1" />
                                <el-option key="2" label="标签" value="2" />
                            </el-select>
                        </el-form-item>
                        <!-- 분류 -->
                        <el-form-item v-show="dataForm.topicType === '1'" prop="entityId" label-width="15%" label="所属分类: " class="postInfo-container-item">
                            <el-input id="typeName" ref="typeName" size="small" v-model="typeName" placeholder="请输入所属分类" style="width: 30.2%;" :readonly="true" />
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="setShowTypeDialog" style="margin-left: 5px;">新增</el-button>
                        </el-form-item>
                        <!-- 키워드 -->
                        <el-form-item v-show="dataForm.topicType === '2'" prop="entityId" label-width="15%" label="标签: " class="postInfo-container-item">
                            <el-select ref="tag" v-model="dataForm.entityId" size="small" placeholder="标签" clearable style="width: 36%;">
                                <el-option v-for="item in listTag" :key="item.id" :label="item.tagInfo" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <el-row style="margin-top: 10px;">
            <el-button type="primary" size="normal" style="float: right; margin-left: 10px;" @click="setRegister">保存</el-button>
            <router-link :to="'/topic/topic_list'" style="float: right;">
                <el-button type="danger">取消</el-button>
            </router-link>
        </el-row>
    </div>

    <!-- 분류추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowTypeDialog" @close="setCanceTypeDialog" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form ref="prodForm" class="form-container">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="20%" label="商品大类别: ">
                            <!-- 상품 대분류 -->
                            <el-select v-model="typeId" size="small" placeholder="商品大类别" clearable style="width: 100%;" @change="setChangeCategory">
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in listType" :key="item.id" :label="item.typeName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="25%" label="商品小类别: ">
                            <!-- 상품 소분류 -->
                            <el-select v-model="subTypeId" size="small" placeholder="商品小类别" clearable style="width: 100%;">
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
</div>
</template>

<script src="@/assets/js/topic/topic_register.js"></script>

<style lang="scss" scoped>
.mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}
</style>
