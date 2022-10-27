<template>
<div id="batch_product_detail">
    <div class="app-container">
        <!-- 검색 섹션 -->
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="商品名称: ">
                                    <!-- 상품명 -->
                                    <el-input placeholder="以商品名称搜索" size="small" v-model="goodsName" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="商户名称: ">
                                    <!-- 점포명 -->
                                    <el-input placeholder="商户名称" size="small" v-model="shopName" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="35%" label="商品大类别: ">
                                    <!-- 상품 대카테고리 -->
                                    <el-select v-model="typeId" placeholder="商品大类别" size="small" clearable style="width: 100%;" @change="setChangeCategory">
                                        <el-option key="" label="" value="" />
                                        <el-option v-for="item in listCategory" :key="item.id" :label="item.typeName" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="35%" label="商品小类别: ">
                                    <!-- 상품 소카테고리 -->
                                    <el-select v-model="subTypeId" placeholder="商品小类别" size="small" clearable style="width: 100%;">
                                        <el-option key="" label="" value="" />
                                        <el-option v-for="item in listSubCategory" :key="item.id" :label="item.typeName" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="商品状态: ">
                                    <!-- 상품상태 -->
                                    <el-select v-model="status" placeholder="商品状态" size="small" clearable style="width: 100%;">
                                        <el-option key="" label="" value="" />
                                        <el-option :key="'0'" label="未上传" :value="0" />
                                        <el-option :key="'1'" label="已上传" :value="1" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label-width="25%" label="配送类别: ">
                                    <!-- 상품상태 -->
                                    <el-select v-model="deliveryType" placeholder="配送类别" size="small" clearable style="width: 80%;">
                                        <el-option key="" label="" value="" />
                                        <el-option :key="3" label="冷鲜" :value="3" />
                                        <el-option :key="2" label="活体" :value="2" />
                                        <el-option :key="1" label="常温" :value="1" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-form-item>
                                    <el-button type="primary" plain icon="el-icon-search" size="small" @click="setSearchData">搜索</el-button>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </div>
        <!-- 상품리스트 -->
        <div class="filter-container">
            <el-row style="margin-bottom: 10px;">
                <router-link :to="'/product/product_list'">
                    <el-button class="filter-item" type="danger" size="mini" style="float: right; margin-left: 10px;">取消</el-button>
                </router-link>
                <el-button class="filter-item" type="primary" icon="el-icon-edit" size="mini" style="float: right;" @click="setBatchData">保存</el-button>
            </el-row>
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-table v-loading="listLoading" :data="productList" border fit highlight-current-row @sort-change="setSortChange" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" align="center" width="60%"></el-table-column>
                            <el-table-column label="编号" align="center" width="60%">
                                <template slot-scope="{row}">
                                    <span>{{ row.id }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品图片" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <el-tooltip placement="left" effect="light">
                                        <div slot="content">
                                            <img :src="row.goodsImg" alt="" style="width: 200px; height: 200px;">
                                        </div>
                                        <img :src="row.goodsImg" alt="" style="width: 40px; height: 40px; cursor: pointer;">
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品名称" align="center">
                                <template slot-scope="{row, $index}">
                                    <el-input v-model="row.goodsName" :ref="'goodsName-' + $index" :id="'goodsName-' + $index" class="edit-input" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column label="拣货名称" align="center">
                                <template slot-scope="{row, $index}">
                                    <el-input v-model="row.goodsShortName" :ref="'goodsShortName-' + $index" :id="'goodsShortName-' + $index" class="edit-input" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="shopName" label="所属商户" align="center" sortable="custom">
                                <template slot-scope="{row}">
                                    <span>{{ row.shopName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否为推荐" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <el-checkbox v-model="row.isRecommended" @change="setChangeRecommended"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="typeName" label="商品类别" align="center" sortable="custom" width="130%">
                                <template slot-scope="{row}">
                                    <span>{{ row.typeName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="originalPrice" label="原价(￥)" align="center" sortable="custom" width="100%">
                                <template slot-scope="{row, $index}">
                                    <el-input v-model="row.originalPrice" :ref="'originalPrice-' + $index" :id="'originalPrice-' + $index" class="edit-input color_prop" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="salesPrice" label="销售价(￥)" align="center" sortable="custom" width="120%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.salesPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="costPrice" label="供货价(￥)" align="center" sortable="custom" width="120%">
                                <template slot-scope="{row, $index}">
                                    <el-popover placement="bottom-start" title="" width="170" trigger="manual" content="注意销售价低于进价" v-model="row.isVisibleCostPriceToolTip">
                                        <el-input slot="reference" v-model="row.costPrice" :ref="'costPrice-' + $index" :id="'costPrice-' + $index" class="edit-input color_prop" size="small" />
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="包装" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span v-if="row.packageName !== ''">{{ row.packageName }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="deliveryType" label="配送类型" align="center" sortable="custom" width="110%">
                                <template slot-scope="{row}">
                                    <span>{{ row.deliveryType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否有规格" align="center" width="70%">
                                <template slot-scope="{row}">
                                    <span v-if="row.sizeStatus === '0'">否</span>
                                    <span v-else>是</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品重量" align="center" width="80%">
                                <template slot-scope="{row, $index}">
                                    <el-input v-model="row.goodsWeight" :ref="'goodsWeight-' + $index" :id="'goodsWeight-' + $index" class="edit-input" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column label="虚拟销量" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span>{{ row.visualSalesNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品招牌" align="center" width="150%">
                                <template slot-scope="{row, $index}">
                                    <el-select v-model="row.goodsIconName" size="small" clearable @change="setChangeGoodsIcon($index, row.goodsIconName)">
                                        <el-option value="" />
                                        <el-option v-for="item in goodsIcons" :key="item.code" :label="item.code" :value="item.code" />
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="序号" align="center" width="80%">
                                <template slot-scope="{row, $index}">
                                    <el-input v-model="row.rankingNum" :ref="'rankingNum-' + $index" :id="'rankingNum-' + $index" class="edit-input" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="clickNum" label="近30天点击数" align="center" sortable="custom" width="75%">
                                <template slot-scope="{row}">
                                    <span>{{ row.clickNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="salesNum" label="近30天总销量" align="center" sortable="custom" width="75%">
                                <template slot-scope="{row}">
                                    <span>{{ row.salesNum | addComma }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNumber > 0" :total="totalNumber" :page.sync="page" :limit.sync="size" @pagination="getProductData" style="text-align: center;" />
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</div>
</template>

<script src="@/assets/js/product/batch_product_detail.js"></script>

<style>
.color_prop input {
    color: red !important;
}
</style>
