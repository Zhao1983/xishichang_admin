<template>
<div id="batch_shop_detail">
    <div class="mixin-components-container" v-loading="listLoading">
        <el-form ref="prodForm" :model="dataForm" :rules="rules" class="form-container">
            <!-- 상품정보 섹션 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>商品信息</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="5">
                            <el-form-item label-width="8%" label="" class="postInfo-container-item">
                                <el-checkbox v-model="dataForm.smsStatus">是否短信通知</el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="15">
                            <!-- 상품명 -->
                            <el-form-item prop="goodsName" label-width="8%" label="商品名称: " class="postInfo-container-item">
                                <el-input id="goodsName" ref="goodsName" v-model="dataForm.goodsName" size="small" placeholder="商品名称" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(名称不能超过50字)</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <!-- 선택명 -->
                            <el-form-item prop="goodsShortName" label-width="15%" label="拣货名称: " class="postInfo-container-item">
                                <el-input id="goodsShortName" ref="goodsShortName" v-model="dataForm.goodsShortName" size="small" placeholder="拣货名称" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(名称不能超过16字)</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="15">
                            <!-- 검색명 -->
                            <el-form-item prop="goodsSearchName" label-width="8%" label="商品搜索名称: " class="postInfo-container-item">
                                <el-input id="goodsSearchName" ref="goodsSearchName" v-model="dataForm.goodsSearchName" size="small" placeholder="商品搜索名称" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(名称不能超过50字)</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="8">
                            <!-- 키워드 -->
                            <el-form-item prop="tagName" label-width="15%" label="所属标签: " class="postInfo-container-item">
                                <el-input id="tagName" ref="tagName" v-model="dataForm.tagName" size="small" placeholder="请输入所属标签" style="width: 48.5%;" :readonly="true" />
                                <el-button type="primary" icon="el-icon-plus" size="small" @click="setShowTagDialog" style="margin-left: 5px;">新增</el-button>
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(可动态添加标签，支持绑定多个标签)</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 상품 분류 -->
                            <el-form-item prop="typeName" label-width="15%" label="所属分类: " class="postInfo-container-item">
                                <el-input id="typeName" ref="typeName" v-model="dataForm.typeName" size="small" placeholder="请输入所属分类" style="width: 48.5%;" :readonly="true" />
                                <el-button type="primary" icon="el-icon-plus" size="small" @click="setShowTypeDialog" style="margin-left: 5px;">新增</el-button>
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(可动态添加分类)</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- 랭킹번호 -->
                            <el-form-item prop="rankingNum" label-width="15%" label="序号: " class="postInfo-container-item">
                                <el-input id="rankingNum" ref="rankingNum" v-model="dataForm.rankingNum" size="small" placeholder="序号" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;">(影响前台显示排序及后台排序 降序)</span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="8">
                            <!-- 중량 -->
                            <el-form-item prop="goodsWeight" label-width="15%" label="商品重量(kg): " class="postInfo-container-item">
                                <el-input id="goodsWeight" ref="goodsWeight" v-model="dataForm.goodsWeight" size="small" placeholder="商品重量" style="width: 60%;" />
                                <span style="color: #999999; font-size: 12px; margin-left: 10px;"></span>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 상품가격정보 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <el-row>
                    <!-- 원가 -->
                    <el-col :span="4">
                        <el-form-item label-width="30%" label="原价: " class="postInfo-container-item">
                            <el-input class="color_prop" id="originalPrice" ref="originalPrice" type="text" size="small" v-model="dataForm.originalPrice" placeholder="原价" />
                        </el-form-item>
                    </el-col>
                    <!-- 판매가 -->
                    <el-col :span="4">
                        <el-form-item prop="salesPrice" label-width="30%" label="销售价: " class="postInfo-container-item">
                            <el-popover placement="top-start" title="" width="170" trigger="manual" content="注意销售价低于进价" v-model="isVisiblePriceToolTip">
                                <el-input slot="reference" v-if="dataForm.isPercent" class="color_prop" size="small" id="salesPrice" ref="salesPrice" type="text" v-model="dataForm.salesPrice" placeholder="销售价" :readonly="true" />
                                <el-input slot="reference" v-else class="color_prop" id="salesPrice" size="small" ref="salesPrice" type="text" v-model="dataForm.salesPrice" placeholder="销售价" />
                            </el-popover>
                        </el-form-item>
                        <el-col :span="7">
                            <el-form-item label-width="80%" label="折扣比例: " class="postInfo-container-item">
                                <el-checkbox v-model="dataForm.isPercent" @change="setChangePercent"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="17">
                            <el-form-item prop="discountPercent" label="" class="postInfo-container-item">
                                <el-input v-if="dataForm.isPercent === true" id="discountPercent" ref="discountPercent" type="text" size="small" v-model="dataForm.discountPercent" placeholder="折扣比例" />
                                <el-input v-else id="discountPercent" ref="discountPercent" type="text" size="small" v-model="dataForm.discountPercent" placeholder="折扣比例" :disabled="true" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <!-- 공급가 -->
                    <el-col :span="4">
                        <el-form-item prop="costPrice" label-width="30%" label="供货价: " class="postInfo-container-item">
                            <el-input class="color_prop" id="costPrice" ref="costPrice" type="text" size="small" v-model="dataForm.costPrice" placeholder="供货价" />
                        </el-form-item>
                    </el-col>
                    <!-- 가상판매량 -->
                    <el-col :span="4">
                        <el-form-item label-width="30%" label="虚拟销量: " class="postInfo-container-item">
                            <el-input id="visualSalesNum" ref="visualSalesNum" type="text" size="small" v-model="dataForm.visualSalesNum" placeholder="销量" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 택배회사선택 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <el-row>
                    <el-col :span="4">
                        <el-col :span="7">
                            <el-form-item label-width="80%" label="指定快递: " class="postInfo-container-item">
                                <el-checkbox v-model="dataForm.isSetDeliveryCompany" @change="setChangeEnableSetDeliveryCompany"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="17">
                            <el-form-item label-width="20%" label="" class="postInfo-container-item">
                                <el-select v-if="dataForm.isSetDeliveryCompany" size="small" v-model="dataForm.deliveryId" clearable>
                                    <el-option key="" label="" value="" />
                                    <el-option v-for="item in dataForm.deliveryCompany" :key="item.id" :label="item.name" :value="item.id" />
                                </el-select>
                                <el-select v-else v-model="dataForm.deliveryId" size="small" clearable disabled>
                                    <el-option key="" label="" value="" />
                                    <el-option v-for="item in dataForm.deliveryCompany" :key="item.id" :label="item.name" :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <el-card v-if="isFreeShippingStatus === '1'" class="box-card" style="margin-bottom: 10px;">
                <el-row>
                    <el-col :span="7">
                        <el-col :span="5">
                            <el-form-item label-width="100%" label="是否参加满免活动: " class="postInfo-container-item">
                                <el-checkbox v-model="dataForm.isProfitRateFreeStatus" :disabled="isEnableShippingRate"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="17">
                            <div style="color: #999999; font-size: 13px; margin-left: 30px; margin-top: 12px;">毛利率高于 <span style="font-weight: bold; color: #222222; font-size: 15px;">{{freeShippingRate}}%</span> 才能参加该活动</div>
                        </el-col>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 옵션상품정보 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>规格商品</span>
                    <el-radio-group v-model="isOption" style="margin-left: 40px;">
                        <el-radio :label="1">使用</el-radio>
                        <el-radio :label="0">不使用</el-radio>
                    </el-radio-group>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(规格信息开启添加后，主商品价格将失效)</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="dataOption" border fit highlight-current-row style="width: 100%;" v-show="isOption === 1">
                            <el-table-column label="图片" align="center" width="120%;">
                                <template slot-scope="{row, $index}">
                                    <input type="file" name="" :ref="'imageInput-' + $index" value="" size="small" @change="setChangeOptionImage(row, $index)" style="display: none;">
                                    <div @click="setPriviewOptionImage($index)">
                                        <Thumbnail :styles="optionThumb" :imageUrl="row.imgUri" />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品名称" align="center">
                                <template slot-scope="{row, $index}">
                                    <el-input :id="'sizeName-' + $index" v-model="row.sizeName" size="small" :ref="'sizeName-' + $index" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="原价" align="center" width="125%;">
                                <template slot-scope="{row, $index}">
                                    <el-input class="color_prop" :id="'originalPrice-' + $index" size="small" v-model="row.originalPrice" type="text" :ref="'originalPrice-' + $index" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="销售价" align="center" width="125%;">
                                <template slot-scope="{row, $index}">
                                    <el-input v-if="row.isPercent" class="color_prop" :id="'salesPrice-' + $index" v-model="row.salesPrice" type="text" size="small" :ref="'salesPrice-' + $index" placeholder="" :readonly="true" />
                                    <el-input v-else class="color_prop" :id="'salesPrice-' + $index" v-model="row.salesPrice" type="text" size="small" :ref="'salesPrice-' + $index" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="折扣比例" align="center" width="125%;">
                                <template slot-scope="{row, $index}">
                                    <el-col :span="4">
                                        <el-checkbox v-model="row.isPercent" @change="setChangeOptionPercent(row, $index)" style="padding-top: 5px; margin-right: 3px;"></el-checkbox>
                                    </el-col>
                                    <el-col :span="20">
                                        <el-input v-if="row.isPercent" :id="'discountPercent-' + $index" v-model="row.discountPercent" type="text" size="small" :ref="'discountPercent-' + $index" placeholder="" />
                                        <el-input v-else :id="'discountPercent-' + $index" v-model="row.discountPercent" type="text" :ref="'discountPercent-' + $index" size="small" placeholder="" :disabled="true" />
                                    </el-col>
                                </template>
                            </el-table-column>
                            <el-table-column label="供货价" align="center" width="125%;">
                                <template slot-scope="{row, $index}">
                                    <el-input class="color_prop" :id="'costPrice-' + $index" v-model="row.costPrice" type="text" :ref="'costPrice-' + $index" size="small" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="重量(kg)" align="center" width="125%;">
                                <template slot-scope="{row, $index}">
                                    <el-input :id="'sizeWeight-' + $index" v-model="row.sizeWeight" type="text" :ref="'sizeWeight-' + $index" size="small" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="包装费" align="center" width="170%;">
                                <template slot-scope="{row, $index}">
                                    <el-col :span="4">
                                        <el-checkbox v-model="row.isPackage" @change="setChangeOptionPackage(row, $index)" style="padding-top: 28px;"></el-checkbox>
                                    </el-col>
                                    <el-col :span="20">
                                        <el-input v-if="row.isPackage === true" :id="'packageNum-' + $index" v-model="row.packageInfo.num" type="text" size="small" :ref="'packageNum-' + $index" placeholder="" style="margin-bottom: 10px;" />
                                        <el-select v-if="row.isPackage === true" v-model="row.packageInfo.name" placeholder="" clearable size="small">
                                            <el-option key="" label="" value="" />
                                            <el-option v-for="item in row.listPackage" :key="item.name" :label="item.name" :value="item.name" />
                                        </el-select>
                                        <el-input v-if="row.isPackage === false" :id="'packageNum-' + $index" v-model="row.packageInfo.num" type="text" size="small" :ref="'packageNum-' + $index" placeholder="" style="margin-bottom: 10px;" :disabled="true" />
                                        <el-select v-if="row.isPackage === false" v-model="row.packageInfo.name" placeholder="" size="small" disabled>
                                            <el-option key="" label="" value="" />
                                            <el-option v-for="item in row.listPackage" :key="item.name" :label="item.name" :value="item.name" />
                                        </el-select>
                                    </el-col>
                                </template>
                            </el-table-column>
                            <el-table-column label="虚拟销量" align="center" width="125%;">
                                <template slot-scope="{row, $index}">
                                    <el-input :id="'visualSalesNum-' + $index" v-model="row.visualSalesNum" type="text" size="small" :ref="'visualSalesNum-' + $index" placeholder="" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="150%;">
                                <template slot-scope="{row, $index}">
                                    <el-button v-show="row.visible" size="small" type="primary" @click="setAddOptionProduct(row, $index)">保存</el-button>
                                    <el-button size="small" type="danger" @click="setDeleteOptionProduct(row, $index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 상품속성 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>商品属性</span>
                </div>
                <!-- 무료배송상태설정 -->
                <el-row>
                    <el-col :span="1">
                        <el-form-item label-width="41%" label="" class="postInfo-container-item">
                            <el-checkbox v-model="dataForm.postageFreeStatus" @change="setChangeFreeStatus">是否免运费</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <!-- 상품배송분류 -->
                        <el-form-item label-width="5.5%" label="配送分类: " class="postInfo-container-item">
                            <el-radio-group v-model="dataForm.deliveryType">
                                <el-radio v-for="item in listDeliveryType" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
                            </el-radio-group>
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">(冷鲜、活体分类除指定省份都走航运，常温直走陆运)</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="!dataForm.postageFreeStatus">
                    <el-col :span="1">
                        <el-form-item label-width="41%" label="" class="postInfo-container-item">
                            <el-checkbox v-model="dataForm.isPackage" @change="setChangeProductPackage">包装费</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label-width="23%" label="每" class="postInfo-container-item">
                            <el-input id="packageNumber" ref="packageNumber" v-if="dataForm.isPackage" size="small" v-model="dataForm.packageDto.num" type="text" placeholder="" style="width: 80%;" />
                            <el-input id="packageNumber" ref="packageNumber" v-else type="text" size="small" v-model="dataForm.packageDto.num" placeholder="" style="width: 80%;" :disabled="true" />
                            <span style="color: #999999; font-size: 12px; margin-left: 10px;">个</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label-width="20%" label="每" class="postInfo-container-item">
                            <el-select v-if="dataForm.isPackage" size="small" v-model="dataForm.packageDto.name" clearable>
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in dataForm.listPackage" :key="item.name" :label="item.name" :value="item.name" />
                            </el-select>
                            <el-select v-else v-model="dataForm.packageDto.name" size="small" clearable disabled>
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in dataForm.listPackage" :key="item.name" :label="item.name" :value="item.name" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label-width="25%" label="广告词-品名下方: " class="postInfo-container-item" style="width: 28%">
                        <el-input id="adWords" ref="adWords" type="text" size="small" v-model="dataForm.adWords" placeholder="广告词-品名下方" />
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label-width="25%" label="广告词-品名右侧: " class="postInfo-container-item" style="width: 28%">
                        <el-input id="adWords2" ref="adWords2" type="text" size="small" v-model="dataForm.adWords2" placeholder="广告词-品名右侧" />
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="goodsIconName" label-width="7%" label="商品招牌: " class="postInfo-container-item">
                            <el-col :span="3">
                                <el-select v-model="dataForm.goodsIconName" size="small" clearable @change="setChangeGoodsIcon">
                                    <el-option value="" />
                                    <el-option v-for="item in goodsIcons" :key="item.code" :label="item.code" :value="item.code" />
                                </el-select>
                            </el-col>
                            <el-col :span="1">
                                <div style="width: 70px; margin-left: 10px;">
                                    <Thumbnail :styles="styles" :imageUrl="dataForm.goodsIconUri" />
                                </div>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="goodsUnit" label-width="7%" label="计量单位: " class="postInfo-container-item">
                            <el-select v-model="dataForm.goodsUnit" size="small" clearable>
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in listUnit" :key="item.name" :label="item.name" :value="item.name" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-for="(item, index) in goodsProp" :key="item.key">
                    <el-col :span="1">
                        <el-form-item label-width="80%" label="" class="postInfo-container-item">
                            <el-checkbox v-model="item.isStatus"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label-width="22%" label="" class="postInfo-container-item">
                            <el-input :id="'key-' + index" :ref="'key-' + index" v-model="item.keys" size="small" type="text" placeholder="" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="2%" label="" class="postInfo-container-item">
                            <el-input :id="'value-' + index" :ref="'value-' + index" type="text" size="small" v-model="item.value" placeholder="" style="width: 40%;" />
                            <el-button type="primary" v-show="item.visible" icon="el-icon-plus" size="small" @click="setAddGoodsProp(item, index)" style="margin-left: 5px;">新增</el-button>
                            <el-button type="danger" icon="el-icon-minus" size="small" @click="setDeleteGoodsProp(item, index)" style="margin-left: 5px;">删除</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 메인상품동영상 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>主图视频</span>
                    <input ref="mainvideo" type="file" name="file" value="" style="display: none;" @change="setChangeMainVideo">
                    <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 40px;" @click="setPriviewMainVideo">上传</el-button>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(视频最多上传1个, 建议上传正方形视频及2Mb以下视频)</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="4.5%" label="" class="postInfo-container-item">
                            <video v-if="dataForm.goodsVideo !== ''" width="450" height="300" controls :src="dataForm.goodsVideo"></video>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 메인상품이미지 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>商品主图</span>
                    <input ref="mainimage" type="file" multiple="multiple" name="mainfile[]" value="" style="display: none;" @change="setChangeMainImage">
                    <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left: 40px;" @click="setPriviewMainImage">上传</el-button>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(商品图片最多上传5张, 建议上传 800*800及200KB以下图片)</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="4.5%" label="" class="postInfo-container-item">
                            <ul ref="dragElement" style="list-style-type: none; padding: 0; display: flex;">
                                <Thumbnails v-for="img in listMainImage" :key="img.imgUri" :imageUrl="img.imgUri" :objData="listMainImage" :img="img.imgUri" :delImgs="delImgs" />
                            </ul>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <!-- 상품소개 -->
            <el-card class="box-card" style="margin-bottom: 10px;">
                <div slot="header" class="clearfix">
                    <span>商品介绍</span>
                    <span style="color: #999999; font-size: 12px; margin-left: 10px;">(图片需要单独点击“上传图片”按钮上传。图片建议宽度800)</span>
                </div>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="5%" label="" class="postInfo-container-item">
                            <tinymce v-model="dataForm.goodsDesc" :kind="baseURL + 'upload/newsImg'" :height="300" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
        <el-row>
            <router-link :to="'/shop/batch_shop/' + shopId" style="position: fixed; right: 120px; bottom: 50px; z-index: 10;">
                <el-button type="danger">取消</el-button>
            </router-link>
            <el-button type="primary" @click="setUpdate" style="position: fixed; right: 40px; bottom: 50px; z-index: 10;">保存</el-button>
        </el-row>
    </div>

    <!-- 점포추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowShopDialog" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-row>
                <el-col :span="15">
                    <el-input id="searchShopName" ref="searchShopName" size="small" v-model="searchShopName" placeholder="请以商户名称进行搜索" @keyup.enter.native="setSearchShop" />
                </el-col>
                <el-col :span="9">
                    <el-button type="primary" plain icon="el-icon-search" size="small" style="float: right;" @click="setSearchShop">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-card class="box-card">
            <el-table :data="dataShop" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column label="选择" align="center" width="60%">
                    <template slot-scope="{row}">
                        <input type="radio" v-model="row.checked" :value="row.id" name="" @click="setShopRow(row)" style="cursor: pointer;">
                    </template>
                </el-table-column>
                <el-table-column label="商户名称" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.shopStatus === '1'">{{ row.shopName }}</span>
                        <span v-else style="color: red;">{{ row.shopName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="大分类" align="center" width="200%">
                    <template slot-scope="{row}">
                        <span v-if="row.shopStatus === '1'">{{ row.shopType }}</span>
                        <span v-else style="color: red;">{{ row.shopType }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="小分类" align="center" width="200%">
                    <template slot-scope="{row}">
                        <span v-if="row.shopStatus === '1'">{{ row.shopSubType }}</span>
                        <span v-else style="color: red;">{{ row.shopSubType }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="totalShop > 0" :total="totalShop" :page.sync="shopPage" :limit.sync="shopSize" @pagination="getShop" style="text-align: center;" />
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddShop">保存</el-button>
        </div>
    </el-dialog>

    <!-- 키워드추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowTagDialog" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-row>
                <el-col :span="15">
                    <el-input id="searchTagName" ref="searchTagName" size="small" v-model="searchTagName" placeholder="以标签名称搜索" @keyup.enter.native="setSearchTag" />
                </el-col>
                <el-col :span="9">
                    <el-button type="success" icon="el-icon-plus" size="small" style="float: right; margin-left: 5px;" @click="setRegisterTag">新增</el-button>
                    <el-button type="primary" plain icon="el-icon-search" size="small" style="float: right;" @click="setSearchTag">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-card class="box-card">
            <el-table :data="dataTag" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column label="" align="center" :render-header="renderTagHeader" width="100%">
                    <template slot-scope="{row}">
                        <el-checkbox v-model="row.checked" @change="setTableTagSelect(row.id, row.tagInfo)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="以标签名称搜索" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.tagInfo }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAddTag">保存</el-button>
        </div>
    </el-dialog>

    <!-- 분류추가 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowTypeDialog" @close="setCanceTypeDialog" :close-on-click-modal="false">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form ref="prodForm" class="form-container">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="20%" label="商品大类别: ">
                            <!-- 상품 대분류 -->
                            <el-select v-model="dataForm.typeId" size="small" placeholder="商品大类别" clearable style="width: 100%;" @change="setChangeCategory">
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in listType" :key="item.id" :label="item.typeName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="25%" label="商品小类别: ">
                            <!-- 상품 소분류 -->
                            <el-select v-model="dataForm.subTypeId" size="small" placeholder="商品小类别" clearable style="width: 100%;">
                                <el-option key="" label="" value="" />
                                <el-option v-for="item in listSubType" :key="item.id" :label="item.typeName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="10%" label="" class="postInfo-container-item">
                            <el-checkbox v-model="dataForm.isRecommended">是否为推荐商品</el-checkbox>
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

<script src="@/assets/js/shop/batch_shop_detail.js"></script>

<style lang="scss">
.mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}

.color_prop .el-input__inner {
    color: red !important;
}

.el-popover {
    color: red;
}

.el-popper[x-placement^=top] .popper__arrow {
    left: 11.5px !important;
}

.el-popover--plain {
    padding: 5px 20px;
}
</style>
