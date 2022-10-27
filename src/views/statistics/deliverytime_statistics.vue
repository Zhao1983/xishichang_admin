<template>
<div id="deliverytime_statistics">
    <div class="app-container">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="7">
                            <div style="height: 1px;"></div>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-checkbox v-model="isShowView_1" @change="setChangeCompany">韵达快递</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-checkbox v-model="isShowView_2" @change="setChangeCompany">邮政快递</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-checkbox v-model="isShowView_3" @change="setChangeCompany">中通快递</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-checkbox v-model="isShowView_4" @change="setChangeCompany">申通快递</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-button type="primary" plain icon="el-icon-search" size="small" @click="setSearchData" style="margin-left: 10%;">搜索</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <div style="height: 1px;"></div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
        </div>
        <div class="filter-container">
            <el-card class="box-card">
                <el-row>
                    <el-form ref="addForm" class="form-container">
                        <el-row>
                            <el-col :span="24">
                                <div v-for="(item, idx) in dataList" :key="idx">
                                    <el-col :span="5">
                                        <h3>{{item.deliveryName}}</h3>
                                        <el-card class="box-card">
                                            <el-row>
                                                <el-table ref="tableData" :data="item.items" style="height: 800px; overflow-y: auto;">
                                                    <el-table-column align="center" label="省份">
                                                        <template slot-scope="{row}">
                                                            <span>{{ row.provinceName }}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="最后一次时效">
                                                        <template slot-scope="{row}">
                                                            <span>{{ row.lastDuration }}</span>
                                                            <br>
                                                            <span style="color: #aeaeae;">{{ row.lastDt }}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="最快时效">
                                                        <template slot-scope="{row}">
                                                            <span>{{ row.fastestDuration }}</span>
                                                            <br>
                                                            <span style="color: #aeaeae;">{{ row.fastestDt }}</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-row>
                                        </el-card>
                                    </el-col>
                                    <el-col :span="1">
                                        <div style="height: 1px;"></div>
                                    </el-col>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-row>
            </el-card>
        </div>
    </div>
</div>
</template>

<script src="@/assets/js/statistics/deliverytime_statistics.js"></script>
