<template>
<div id="shipping_detail">
    <div class="mixin-components-container">
        <el-form ref="dataForm" :model="dataForm" :rules="rules" class="form-container">
            <el-card class="box-card" style="padding: 10px; margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>配送设置</span>
                </div>
                <!-- 무료배송설정 -->
                <el-row>
                    <el-col :span="24">
                        <el-row>
                            <el-form-item label-width="15.6%" label="免邮设置: " class="postInfo-container-item">
                                <el-radio-group v-model="dataForm.freeShippingStatus">
                                    <el-radio :label="'1'">是</el-radio>
                                    <el-radio :label="'0'">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item v-show="dataForm.freeShippingStatus === '1'" label-width="15.6%" label="满减: " class="postInfo-container-item">
                                <el-input class="color_prop" id="freeShippingPrice" size="small" ref="freeShippingPrice" v-model="dataForm.freeShippingPrice" placeholder="" style="width: 20%;" />
                            </el-form-item>
                            <el-form-item v-show="dataForm.freeShippingStatus === '1'" label-width="15.6%" label="毛利率高于: " class="postInfo-container-item">
                                <el-input id="freeShippingRate" size="small" ref="freeShippingRate" v-model="dataForm.freeShippingRate" placeholder="" style="width: 20%;" />
                                <span style="color: #303133; font-size: 14px;">&nbsp;&nbsp;%才能参加该活动</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label-width="15.6%" label="免包装费设置: " class="postInfo-container-item">
                                <el-radio-group v-model="dataForm.freePackageStatus">
                                    <el-radio :label="'1'">是</el-radio>
                                    <el-radio :label="'0'">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item v-show="dataForm.freePackageStatus === '1'" label-width="15.6%" label="满减: " class="postInfo-container-item">
                                <el-input class="color_prop" id="freePackagePrice" size="small" ref="freePackagePrice" v-model="dataForm.freePackagePrice" placeholder="" style="width: 20%;" />
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item prop="winterBeginMonth" label-width="62%" label="冬天设置: " class="postInfo-container-item">
                                    <el-input id="winterBeginMonth" size="small" ref="winterBeginMonth" v-model="dataForm.winterBeginMonth" placeholder="" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="1" style="color: #303133; font-size: 14px; text-align: center; height: 40px; padding-top: 12px;">月到</el-col>
                            <el-col :span="6">
                                <el-form-item prop="winterEndMonth" label-width="0%" label="" class="postInfo-container-item">
                                    <el-input id="winterEndMonth" size="small" ref="winterEndMonth" v-model="dataForm.winterEndMonth" placeholder="" style="width: 35%;" />
                                    <span style="color: #303133; font-size: 14px; margin-left: 10px;">月</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item prop="summerBeginMonth" label-width="62%" label="春夏秋设置: " class="postInfo-container-item">
                                    <el-input id="summerBeginMonth" size="small" ref="summerBeginMonth" v-model="dataForm.summerBeginMonth" placeholder="" style="width: 100%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="1" style="color: #303133; font-size: 14px; text-align: center; height: 40px; padding-top: 12px;">月到</el-col>
                            <el-col :span="6">
                                <el-form-item prop="summerEndMonth" label-width="0%" label="" class="postInfo-container-item">
                                    <el-input id="summerEndMonth" size="small" ref="summerEndMonth" v-model="dataForm.summerEndMonth" placeholder="" style="width: 35%;" />
                                    <span style="color: #303133; font-size: 14px; margin-left: 10px;">月</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card" style="padding: 10px; margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>包装设置</span>
                </div>
                <el-row v-for="(item, index) in packageData" :key="index">
                    <el-col :span="24">
                        <el-col :span="6">
                            <el-form-item label-width="62%" label="" class="postInfo-container-item">
                                <el-input :id="'name_' + index" size="small" :ref="'name_' + index" v-model="item.name" placeholder="" style="width: 100%;" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="35%" label="单价" class="postInfo-container-item">
                                <el-input class="color_prop" :id="'price_' + index" size="small" :ref="'price_' + index" v-model="item.price" placeholder="" style="width: 80%;" />
                                <span style="color: #303133; font-size: 14px; margin-left: 10px;">元</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label-width="50%" label="冬天设置 重量" class="postInfo-container-item">
                                <el-input :id="'winterWeight_' + index" size="small" :ref="'winterWeight_' + index" v-model="item.winterWeight" placeholder="" style="width: 80%;" />
                                <span style="color: #303133; font-size: 14px; margin-left: 10px;">kg</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label-width="50%" label="春夏秋设置 重量" class="postInfo-container-item">
                                <el-input :id="'summerWeight_' + index" size="small" :ref="'summerWeight_' + index" v-model="item.summerWeight" placeholder="" style="width: 80%;" />
                                <span style="color: #303133; font-size: 14px; margin-left: 10px;">kg</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card" style="padding: 10px; margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>自取设置</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="6">
                            <el-form-item label-width="62%" label="起始自取时间: " class="postInfo-container-item">
                                <el-input id="minuteBegin" size="small" ref="minuteBegin" v-model="dataForm.minuteBegin" placeholder="" style="width: 80%;" />
                                <span style="color: #303133; font-size: 14px; margin-left: 10px;">分</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="35%" label="间隔时间: " class="postInfo-container-item">
                                <el-select v-model="dataForm.minuteInterval" size="small" placeholder="请选择" clearable style="width: 80%">
                                    <el-option label="20" value="20" />
                                    <el-option label="30" value="30" />
                                </el-select>
                                <span style="color: #303133; font-size: 14px; margin-left: 10px;">分</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="35%" label="截至时间: " class="postInfo-container-item">
                                <el-time-picker type="date" id="endTime" size="small" ref="endTime" v-model="dataForm.endTime" value-format="HH:mm" placeholder="" style="width: 80%;" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card" style="padding: 10px; margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>跑腿设置</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="5" style="text-align: right;">
                            <el-form-item label-width="17%" label="" class="postInfo-container-item">
                                <el-checkbox v-model="dataForm.packageStatus">同珹是否支收包装费</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="19">
                            <el-form-item label-width="10%" label="同城设置: " class="postInfo-container-item">
                                <span style="color: #606266">延吉市</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="12">
                            <el-form-item label-width="31%" label="配送公司: " class="postInfo-container-item">
                                <el-select v-model="dataForm.companyRunnerId" size="small" placeholder="请选择" clearable style="width: 35%">
                                    <el-option v-for="item in companyRunnerList" :key="item.id" :label="item.name" :value="item.id" />
                                </el-select>
                                <el-button type="success" size="mini" style="margin-left: 15px;" @click="setUpdateRunnerPrice">配置</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item prop="autoCommitDay" label-width="45%" label="自动收货小时数: " class="postInfo-container-item">
                                <el-input id="autoCommitDay" ref="autoCommitDay" size="small" v-model="dataForm.autoCommitDay" type="text" placeholder="" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card" style="padding: 10px; margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>冷鲜设置</span>
                </div>
                <el-row style="margin-bottom: 15px;">
                    <el-col :span="24">
                        <el-col :span="2" style="height: 10px;"></el-col>
                        <el-col :span="10" style="padding: 10px;">
                            <span style="color: #606266; font-size: 14px; font-weight: 700;">冬天陆运省份:</span>
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="setShowProvinceDialog('fresh_winter')" style="margin-bottom: 5px; float: right;">增加</el-button>
                            <el-table :data="freshWinterLocal" border fit highlight-current-row style="width: 100%;">
                                <el-table-column label="编号" align="center" width="80%">
                                    <template slot-scope="{$index}">
                                        <span>{{ ++$index }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="省份名称" align="center">
                                    <template slot-scope="{row}">
                                        <span>{{ row.province }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="" align="center" width="80%">
                                    <template slot-scope="{$index}">
                                        <el-button size="mini" type="danger" @click="setDeleteProvince($index, 'fresh_winter')">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="10" style="padding: 10px;">
                            <span style="color: #606266; font-size: 14px; font-weight: 700;">春夏秋天陆运省份:</span>
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="setShowProvinceDialog('fresh_summer')" style="margin-bottom: 5px; float: right;">增加</el-button>
                            <el-table :data="freshSummerLocal" border fit highlight-current-row style="width: 100%;">
                                <el-table-column label="编号" align="center" width="80%">
                                    <template slot-scope="{$index}">
                                        <span>{{ ++$index }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="省份名称" align="center">
                                    <template slot-scope="{row}">
                                        <span>{{ row.province }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="" align="center" width="80%">
                                    <template slot-scope="{$index}">
                                        <el-button size="mini" type="danger" @click="setDeleteProvince($index, 'fresh_summer')">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="2" style="height: 10px;"></el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="12">
                            <el-form-item label-width="31%" label="配送公司: " class="postInfo-container-item">
                                <el-select v-model="dataForm.companyFresh" size="small" placeholder="请选择" clearable style="width: 35%">
                                    <el-option v-for="item in companyFreshList" :key="item.id" :label="item.name" :value="item.id" />
                                </el-select>
                                <el-button type="success" size="mini" style="margin-left: 5px;" @click="setUpdateDeliveryInfo('fresh')">配置</el-button>
                                <el-button type="primary" icon="el-icon-plus" size="mini" @click="setAddDeliveryInfo('fresh')">增加配送公司</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="freshDay" label-width="20%" label="自动收货天数: " class="postInfo-container-item">
                                <el-input id="freshDay" ref="freshDay" size="small" v-model="dataForm.freshDay" type="text" placeholder="" style="width: 25%;" />
                                <span style="color: #303133; font-size: 14px; margin-left: 10px;">天</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card" style="padding: 10px; margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>活体设置</span>
                </div>
                <el-row style="margin-bottom: 15px;">
                    <el-col :span="24">
                        <el-col :span="2" style="height: 10px;"></el-col>
                        <el-col :span="10" style="padding: 10px;">
                            <span style="color: #606266; font-size: 14px; font-weight: 700;">冬天陆运省份:</span>
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="setShowProvinceDialog('living_winter')" style="margin-bottom: 5px; float: right;">增加</el-button>
                            <el-table :data="livingWinterLocal" border fit highlight-current-row style="width: 100%;">
                                <el-table-column label="编号" align="center" width="80%">
                                    <template slot-scope="{$index}">
                                        <span>{{ ++$index }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="省份名称" align="center">
                                    <template slot-scope="{row}">
                                        <span>{{ row.province }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="" align="center" width="80%">
                                    <template slot-scope="{$index}">
                                        <el-button size="mini" type="danger" @click="setDeleteProvince($index, 'living_winter')">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="10" style="padding: 10px;">
                            <span style="color: #606266; font-size: 14px; font-weight: 700;">春夏秋天陆运省份:</span>
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="setShowProvinceDialog('living_summer')" style="margin-bottom: 5px; float: right;">增加</el-button>
                            <el-table :data="livingSummerLocal" border fit highlight-current-row style="width: 100%;">
                                <el-table-column label="编号" align="center" width="80%">
                                    <template slot-scope="{$index}">
                                        <span>{{ ++$index }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="省份名称" align="center">
                                    <template slot-scope="{row}">
                                        <span>{{ row.province }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="" align="center" width="80%">
                                    <template slot-scope="{$index}">
                                        <el-button size="mini" type="danger" @click="setDeleteProvince($index, 'living_summer')">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="2" style="height: 10px;"></el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="12">
                            <el-form-item label-width="31%" label="配送公司: " class="postInfo-container-item">
                                <el-select v-model="dataForm.companyLiving" size="small" placeholder="请选择" clearable style="width: 35%">
                                    <el-option v-for="item in companyLivingList" :key="item.id" :label="item.name" :value="item.id" />
                                </el-select>
                                <el-button type="success" size="mini" style="margin-left: 5px;" @click="setUpdateDeliveryInfo('living')">配置</el-button>
                                <el-button type="primary" icon="el-icon-plus" size="mini" @click="setAddDeliveryInfo('living')">增加配送公司</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="livingDay" label-width="20%" label="自动收货天数: " class="postInfo-container-item">
                                <el-input id="livingDay" ref="livingDay" size="small" v-model="dataForm.livingDay" type="text" placeholder="" style="width: 25%;" />
                                <span style="color: #303133; font-size: 14px; margin-left: 10px;">天</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card" style="padding: 10px;">
                <div slot="header" class="clearfix">
                    <span>陆运设置</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="12">
                            <el-form-item label-width="31%" label="配送公司: " class="postInfo-container-item">
                                <el-select v-model="dataForm.companyPackage" size="small" placeholder="请选择" clearable style="width: 35%">
                                    <el-option v-for="item in companyPackageList" :key="item.id" :label="item.name" :value="item.id" />
                                </el-select>
                                <el-button type="success" size="mini" style="margin-left: 5px;" @click="setUpdateDeliveryInfo('package')">配置</el-button>
                                <el-button type="primary" icon="el-icon-plus" size="mini" @click="setAddDeliveryInfo('package')">增加配送公司</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="packageDay" label-width="20%" label="自动收货天数: " class="postInfo-container-item">
                                <el-input id="packageDay" ref="packageDay" size="small" v-model="dataForm.packageDay" type="text" placeholder="" style="width: 25%;" />
                                <span style="color: #303133; font-size: 14px; margin-left: 10px;">天</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
    </div>
    <el-row>
        <el-button type="primary" size="normal" style="position: fixed; right: 40px; bottom: 50px; z-index: 10;" @click="setUpdate">保存</el-button>
    </el-row>

    <!-- 성, 시 추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowProvinceDialog" :close-on-click-modal="false">
        <el-row>
            <el-card class="box-card">
                <el-table ref="provinceTable" :data="listProvince" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="" align="center" :render-header="renderHeader" width="80%">
                        <template slot-scope="{row}">
                            <el-checkbox v-model="row.checked" @change="setTableRowSelect(row.code, row.province)"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="省份名称" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.province }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddProvince">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/shipping/shipping_detail.js"></script>

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
