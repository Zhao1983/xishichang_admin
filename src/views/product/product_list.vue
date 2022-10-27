<template>
<div id="product_list">
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
                                    <el-input placeholder="以商品名称搜索" v-model="goodsName" size="small" @keyup.enter.native="setSearchData" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="30%" label="商户名称: ">
                                    <!-- 점포명 -->
                                    <el-input placeholder="商户名称" v-model="shopName" size="small" @keyup.enter.native="setSearchData" />
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
                                        <el-option :key="'0'" label="未上架" :value="0" />
                                        <el-option :key="'1'" label="已上架" :value="1" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label-width="25%" label="配送类别: ">
                                    <!-- 배송분류 -->
                                    <el-select v-model="deliveryType" placeholder="配送类别" size="small" clearable style="width: 80%;">
                                        <el-option key="" label="" value="" />
                                        <el-option :key="3" label="冷鲜" :value="3" />
                                        <el-option :key="2" label="活体" :value="2" />
                                        <el-option :key="1" label="常温" :value="1" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label-width="30%" label="满减商品状态: ">
                                    <!-- 상품상태 -->
                                    <el-select v-model="profitRateFreeStatus" placeholder="满减商品状态" size="small" clearable style="width: 100%;">
                                        <el-option key="" label="" value="" />
                                        <el-option :key="'0'" label="未满减商品" :value="0" />
                                        <el-option :key="'1'" label="已满减商品" :value="1" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="23">
                            <el-form-item>
                                <el-button type="primary" plain icon="el-icon-search" size="small" @click="setSearchData" style="float: right;">搜索</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </div>
        <!-- 상품리스트 -->
        <div class="filter-container">
            <el-row style="margin-bottom: 10px;">
                <router-link :to="'/product/batch_product_detail'">
                    <el-button type="primary" size="mini">批量编辑</el-button>
                </router-link>
                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(批量改价只能商品名称、原价、供货价、序号)</span>
                <el-button class="filter-item" type="primary" icon="el-icon-upload2" size="mini" @click="setClickExcelFile" style="float: right; margin-left: 10px;">上传</el-button>
                <input ref="excel" type="file" name="file" style="display: none;" @change="setAddUploadFile">
                <el-button class="filter-item" type="success" icon="el-icon-download" size="mini" @click="setDownloadExcelFile" style="float: right;">Excel格式下载</el-button>
            </el-row>
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-table v-loading="listLoading" :data="productList" border fit highlight-current-row @sort-change="setSortChange">
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
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsName }}</span><br>
                                    <span style="color: #b9b9b9;">{{ row.goodsShortName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="shopName" label="所属商户" align="center" sortable="custom">
                                <template slot-scope="{row}">
                                    <router-link :to="'/shop/batch_shop/' + row.shopId">
                                        <span style="color: blue; text-decoration: underline;">{{ row.shopName }}</span>
                                    </router-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否为推荐" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span v-if="row.isRecommended === '1'">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="typeName" label="商品大类别" align="center" sortable="custom" width="130%">
                                <template slot-scope="{row}">
                                    <span>{{ row.typeName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品小类别" align="center" width="130%">
                                <template slot-scope="{row}">
                                    <span>{{ row.subTypeName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="originalPrice" label="原价(￥)" align="center" sortable="custom" width="100%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.originalPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="salesPrice" label="销售价(￥)" align="center" sortable="custom" width="120%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.salesPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="costPrice" label="供货价(￥)" align="center" sortable="custom" width="120%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.costPrice | addCommaTwo }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="profitInfo" label="商品利润(￥)" align="center" sortable="custom" width="130%">
                                <template slot-scope="{row}">
                                    <span style="color: red;">{{ row.profitInfo | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="profitRate" label="商品利润率" align="center" sortable="custom" width="120%">
                                <template slot-scope="{row}">
                                    <span>{{ row.profitRate }}%</span>
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
                            <el-table-column label="商品重量(kg)" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span>{{ row.goodsWeight | addCommaTwo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="虚拟销量" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span>{{ row.visualSalesNum | addComma }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品招牌" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span v-if="row.goodsIconName !== null">{{ row.goodsIconName }}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="序号" align="center" width="75%">
                                <template slot-scope="{row}">
                                    <span>{{ row.rankingNum }}</span>
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
                            <el-table-column prop="goodsStatus" label="状态" align="center" sortable="custom" width="80%">
                                <template slot-scope="{row}">
                                    <el-button v-if="row.goodsStatus === '1'" size="mini" type="primary" @click="setStatusProduct(row.id, '0', row.goodsName)">上架</el-button>
                                    <el-button v-else-if="row.goodsStatus === '0'" size="mini" type="danger" @click="setStatusProduct(row.id, '1', row.goodsName)">下架</el-button>
                                    <el-button v-else-if="row.goodsStatus === '5'" size="mini" type="success" disable>店铺下架</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="编辑" align="center" width="90%">
                                <template slot-scope="{row}">
                                    <router-link :to="'/product/product_detail/' + row.id">
                                        <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                                    </router-link>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNumber > 0" :total="totalNumber" :page.sync="page" :limit.sync="size" @pagination="getProductData" style="text-align: center;" />
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>

    <!-- 상품내림리유 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="编辑" :visible.sync="isShowStatusDialog" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input ref="offCause" v-model="offCause" type="textarea" placeholder="请输入理由" style="width: 100%;" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setUpdateProductStatus">编辑</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/product/product_list.js"></script>

<style lang="scss" scoped>

</style>
