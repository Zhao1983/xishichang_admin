<template>
<div id="category_list">
    <div class="app-container">
        <el-row>
            <el-col :span="24">
                <el-tabs v-model="activeOption" type="border-card">
                    <el-tab-pane v-for="item in tabOption" :key="item.key" :label="item.label" :name="item.key">
                        <el-row>
                            <el-button class="filter-item" type="primary" plain icon="el-icon-check" size="mini" @click="setSortData" style="float: right; margin-bottom: 10px; margin-left: 10px;">保存</el-button>
                            <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="showCategoryDialog('add', 0, 0)" style="float: right; margin-bottom: 10px;">新增分类</el-button>
                        </el-row>
                        <div v-if="activeOption === 'domestic'">
                            <el-row>
                                <el-col :span="7" style="height: 10px;"></el-col>
                                <el-col :span="10">
                                    <el-card class="box-card">
                                        <el-tree ref="category" :check-strictly="checkStrictly" :data="categoryData" :props="defaultProps" show-checkbox node-key="id" class="permission-tree" default-expand-all draggable @node-drag-end="handleDragEnd" :allow-drop="allowDrop" :allow-drag="allowDrag">
                                            <span class="custom-tree-node" slot-scope="{data}">
                                                <span>{{ data.name.split('##')[0] }}</span>
                                                <span>
                                                    <div v-if="data.name.split('##')[1] === '0'" style="color: blue;">{{ data.name.split('##')[1] }}</div>
                                                    <router-link v-else-if="data.id.split('-')[1] !== ''" :to="'/category/category_detail/' + data.id.split('-')[0] + '/' + data.id.split('-')[1]">
                                                        <div style="color: blue; text-decoration: underline;">{{ data.name.split('##')[1] }}</div>
                                                    </router-link>
                                                    <router-link v-else :to="'/category/category_detail/' + data.id.split('-')[0] + '/0'">
                                                        <div style="color: blue; text-decoration: underline;">{{ data.name.split('##')[1] }}</div>
                                                    </router-link>
                                                </span>
                                                <span v-if="data.id.split('-')[1] !== ''">
                                                    <el-button type="text" size="mini" @click="showCategoryDialog('edit', data.id.split('-')[0], data.id.split('-')[1])" style="color: #67c23a;">编辑</el-button>
                                                </span>
                                                <span v-else>
                                                    <el-button type="text" size="mini" @click="showCategoryDialog('add', data.id.split('-')[0], 0)">增加下级分类</el-button>
                                                    <el-button type="text" size="mini" @click="showCategoryDialog('edit', data.id.split('-')[0], 0)" style="color: #67c23a;">编辑</el-button>
                                                </span>
                                            </span>
                                        </el-tree>
                                    </el-card>
                                </el-col>
                                <el-col :span="7" style="height: 10px;"></el-col>
                            </el-row>
                        </div>
                        <div v-if="activeOption === 'overseas'">

                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>

    <!-- 카테고리 등록/수정 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isCategoryDialog" :close-on-click-modal="false" width="25%">
        <el-form ref="addForm" :model="addForm" :rules="rules" class="form-container">
            <el-row>
                <el-col :span="24">
                    <el-form-item prop="typeName" label-width="20%" label="分类名称: " class="postInfo-container-item">
                        <el-input id="typeName" size="small" v-model="addForm.typeName" ref="typeName" placeholder="请输入分类名称" style="width: 70%;" />
                    </el-form-item>
                    <el-form-item v-if="subcatid !== 0" label-width="20%" label="分类名称: " class="postInfo-container-item">
                        <el-select v-model="addForm.parentId" size="small" placeholder="请选择" clearable style="width: 36%">
                            <el-option v-for="item in tempCategory" :key="item.id" :label="item.typeName" :value="item.id" :disabled="true" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="20%" label="" class="postInfo-container-item" v-if="activeOption === 'domestic'">
                        <div style="position: relative; width: 100px;">
                            <input ref="iconUri" type="file" name="iconUri" value="" style="display: none;" @change="setChangeCatIcon">
                            <div @click="setPriviewCatIcon">
                                <Thumbnail :styles="styles" :imageUrl="addForm.iconUri" />
                            </div>
                            <div v-show="isShowImageCancel" @click="setCancelIconImage" style="position: absolute; right: 8px; top: -2px; font-size: 20px; cursor: pointer; color: red;">X</div>
                        </div>
                    </el-form-item>
                    <el-form-item label-width="20%" label="状态: " class="postInfo-container-item">
                        <el-radio-group v-model="addForm.isShow">
                            <el-radio :label="'1'">是</el-radio>
                            <el-radio :label="'0'">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="cancelCategoryDialog">取消</el-button>
            <el-button v-if="kind === 'add'" type="primary" @click="setCategory">保存</el-button>
            <el-button v-else type="success" @click="setCategory">编辑</el-button>
        </div>
    </el-dialog>
    <!-- 카테고리 랭킹 다이얼로그 -->
    <el-dialog v-el-drag-dialog :title="typeTitle + '   ' + subTypeTitle" :visible.sync="isRankingDialog" class="type-dialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table ref="dragTable" v-loading="listLoading" :data="goodsData" row-key="id" border fit highlight-current-row>
                        <el-table-column align="center" label="" width="50%">
                            <template slot-scope="{}">
                                <svg-icon class="drag-handler" icon-class="drag" />
                            </template>
                        </el-table-column>
                        <el-table-column label="商品图片" align="center" width="80%">
                            <template slot-scope="{row}">
                                <img :src="row.goodsImg" alt="" style="width: 40px; height: 40px;">
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="商品名称">
                            <template slot-scope="{row}">
                                <span>{{ row.goodsName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="所属商户">
                            <template slot-scope="{row}">
                                <span>{{ row.shopName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="商户负责人" width="120%">
                            <template slot-scope="{row}">
                                <span>{{ row.shopOwner }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="供货价" width="100%">
                            <template slot-scope="{row}">
                                <span style="color: red;">{{ row.costPrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="销售价" width="100%">
                            <template slot-scope="{row}">
                                <span style="color: red;">{{ row.salesPrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="原价" width="100%">
                            <template slot-scope="{row}">
                                <span style="color: red;">{{ row.originalPrice | addCommaTwo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="折扣显示" width="100%">
                            <template slot-scope="{row}">
                                <span>{{ row.discount | addComma }}折</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="毛利" width="80%">
                            <template slot-scope="{row}">
                                <span>{{ row.profit | addComma }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="毛利率" width="80%">
                            <template slot-scope="{row}">
                                <span>{{ row.profitRate | addComma }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="近30天总销量" width="120%">
                            <template slot-scope="{row}">
                                <span>{{ row.salesNum | addComma }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="近30天总点击" width="120%">
                            <template slot-scope="{row}">
                                <span>{{ row.clickNum | addComma }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="状态" width="80%">
                            <template slot-scope="{row}">
                                <span v-if="row.goodsStatus === 0" style="color: red;">已下架</span>
                                <span v-else style="color: blue;">已上架</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="setCancelRankingDialog">取消</el-button>
            <el-button type="primary" @click="setRankingGoods">编辑</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/category/category_list.js"></script>

<style>
</style>

<style lang="scss">
.drag-handler {
    width: 15px;
    height: 15px;
    cursor: pointer;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.type-dialog .el-dialog {
    width: 95% !important;
}
</style>
