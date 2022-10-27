<template>
<div id="batch_shop">
    <div class="app-container">
        <div class="filter-container">
            <el-card class="box-card">
                <div class="clearfix" style="margin-bottom: 20px;">
                    <span>{{ shopName }}({{ shopOwner }} | {{ phoneNum }})</span>
                </div>
                <el-row style="margin-bottom: 5px;">
                    <el-button class="filter-item" type="primary" icon="el-icon-edit" size="mini" @click="setBatchData">保存</el-button>
                    <router-link :to="'/shop/shop_list'">
                        <el-button class="filter-item" type="danger" size="mini" style="margin-left: 10px;">取消</el-button>
                    </router-link>
                    <router-link :to="'/shop/batch_shop_product/' + shopId">
                        <el-button type="success" size="mini" style="float: right;">新增</el-button>
                    </router-link>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table ref="dragTable" v-loading="listLoading" :data="productList" border fit highlight-current-row row-key="id" @sort-change="setSortChange" @selection-change="handleSelectionChange">
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
                                    <span>{{ row.packageName }}</span>
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
                            <el-table-column label="状态" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <el-button v-if="row.goodsStatus === '1'" size="mini" type="primary" @click="setStatusProduct(row.id, '0', row.goodsName)">上架</el-button>
                                    <el-button v-else-if="row.goodsStatus === '0'" size="mini" type="danger" @click="setStatusProduct(row.id, '1', row.goodsName)">下架</el-button>
                                    <el-button v-else-if="row.goodsStatus === '5'" size="mini" type="success" disable>店铺下架</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="编辑" align="center" width="90%">
                                <template slot-scope="{row}">
                                    <router-link :to="'/shop/batch_shop_detail/' + shopId + '/' + row.id">
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

<script src="@/assets/js/shop/batch_shop.js"></script>

<style>
.color_prop input {
    color: red !important;
}
</style>

<style lang="scss" scoped>
.drag-handler {
    width: 15px;
    height: 15px;
    cursor: pointer;
}
</style>
