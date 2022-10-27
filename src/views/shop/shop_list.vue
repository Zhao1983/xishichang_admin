<template>
<div id="shop_list">
    <div class="app-container">
        <!-- 검색 섹션 -->
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label-width="35%" label="商户名称: ">
                                <!-- 점포명 -->
                                <el-input placeholder="商户名称" v-model="shopName" size="small" @keyup.enter.native="setSearchData" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="35%" label="运营者名称: ">
                                <!-- 점포운영자명 -->
                                <el-input placeholder="运营者名称" v-model="shopOwner" size="small" @keyup.enter.native="setSearchData" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="35%" label="大类别: ">
                                <!-- 대분류 -->
                                <el-select v-model="typeId" placeholder="大类别" size="small" clearable style="width: 100%;" @change="setChangeCategory">
                                    <el-option key="" label="" value="" />
                                    <el-option v-for="item in listType" :key="item.id" :label="item.typeName" :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="35%" label="小类别: ">
                                <!-- 소분류 -->
                                <el-select v-model="subTypeId" placeholder="小类别" size="small" clearable style="width: 100%;">
                                    <el-option key="" label="" value="" />
                                    <el-option v-for="item in listSubType" :key="item.id" :label="item.typeName" :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="35%" label="商户状态: ">
                                <!-- 점포상태 -->
                                <el-select v-model="shopStatus" placeholder="小类别" size="small" clearable style="width: 100%;">
                                    <el-option key="" label="" value="" />
                                    <el-option :key="'0'" label="未上架" :value="0" />
                                    <el-option :key="'1'" label="已上架" :value="1" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-button type="primary" plain icon="el-icon-search" size="small" @click="setSearchData" style="margin-left: 10%;">搜索</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </div>
        <div class="filter-container">
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-table v-loading="listLoading" :data="shopData" border fit highlight-current-row @sort-change="setSortChange">
                            <el-table-column label="编号" align="center" width="60%">
                                <template slot-scope="{row}">
                                    <span>{{ row.id }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商户名称" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="goodsTotalNum" label="商品数量" align="center" sortable="custom" width="130%">
                                <template slot-scope="{row}">
                                    <router-link :to="'/shop/batch_shop/' + row.id">
                                        <span style="color: blue; text-decoration: underline; cursor: pointer;">{{ row.goodsNum | addComma }} / {{ row.goodsTotalNum | addComma }}</span>
                                    </router-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="运营者姓名" align="center" width="130%">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopOwner }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="电话号" align="center" width="130%">
                                <template slot-scope="{row}">
                                    <span>{{ row.phoneNum }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="shopType" label="所属分类" align="center" sortable="custom" width="300%">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopType }} - {{ row.shopSubType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="salesNum" label="销售总数" align="center" sortable="custom" width="130%">
                                <template slot-scope="{row}">
                                    <span>{{ row.salesNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rankingNum" label="序号" align="center" sortable="custom" width="80%">
                                <template slot-scope="{row}">
                                    <span>{{ row.rankingNum }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="clickNum" label="30天点击数" align="center" sortable="custom" width="150%">
                                <template slot-scope="{row}">
                                    <span>{{ row.clickNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <el-button v-if="row.shopStatus === '1'" size="mini" type="primary" @click="setStatusShop(row.id, '0', row.shopName)">上架</el-button>
                                    <el-button v-else-if="row.shopStatus === '0'" size="mini" type="danger" @click="setStatusShop(row.id, '1', row.shopName)">下架</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="编辑" align="center" width="90%">
                                <template slot-scope="{row}">
                                    <router-link :to="'/shop/shop_detail/' + row.id">
                                        <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                                    </router-link>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNumber > 0" :total="totalNumber" :page.sync="page" :limit.sync="size" @pagination="getShop" style="text-align: center;" />
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>

    <!-- 점포내림리유 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="编辑" :visible.sync="isShowStatusDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input ref="offCause" v-model="offCause" type="textarea" placeholder="请输入理由" style="width: 100%;" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setUpdateShopStatus">编辑</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/shop/shop_list.js"></script>

<style lang="scss">

</style>
