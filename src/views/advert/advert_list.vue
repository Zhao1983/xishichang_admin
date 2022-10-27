<template>
<div id="advert_list">
    <div class="app-container">
        <!-- 검색 섹션 -->
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label-width="25%" label="广告名称: ">
                                <!-- 광고명 -->
                                <el-input v-model="adName" size="small" placeholder="ID或者广告名称" @keyup.enter.native="getSearchData" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="25%" label="开始日期: ">
                                <!-- 시작날자 -->
                                <el-date-picker type="date" size="small" v-model="beginDt" placeholder="开始日期" @change="setChangeDate" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="25%" label="结束日期: ">
                                <!-- 마감날자 -->
                                <el-date-picker type="date" size="small" v-model="endDt" placeholder="结束日期" @change="setChangeDate" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="25%" label="是否启用: ">
                                <!-- 광고상태 -->
                                <el-radio-group v-model="adStatus">
                                    <el-radio :label="''">全部</el-radio>
                                    <el-radio :label="'1'">开启</el-radio>
                                    <el-radio :label="'0'">禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">
                            <el-form-item>
                                <el-button type="primary" size="small" plain icon="el-icon-search" @click="getSearchData">搜索</el-button>
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
                        <el-table v-loading="listLoading" :data="listAdvert" border fit highlight-current-row>
                            <el-table-column label="编号" align="center" width="80%">
                                <template slot-scope="{row}">
                                    <span>{{ row.id }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="广告名称" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.adName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="链接类型" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.adType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="开始日期" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.beginDt }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="结束日期" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.endDt }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="点击数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.publishDt }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="序号" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.rankingNum }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" align="center" width="120%">
                                <template slot-scope="{row}">
                                    <el-button v-if="row.adStatus === '1'" size="mini" type="primary" @click="setUpdateStatus(row.adName, row, '0')">开启</el-button>
                                    <el-button v-else size="mini" type="danger" @click="setUpdateStatus(row.adName, row, '1')">禁用</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="编辑" align="center" width="120%">
                                <template slot-scope="{row}">
                                    <router-link v-if="row.adStatus === '0'" :to="'/advert/advert_detail/' + row.id">
                                        <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                                    </router-link>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNumber > 0" :total="totalNumber" :page.sync="page" :limit.sync="size" @pagination="getAdvertData" style="text-align: center;" />
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</div>
</template>

<script src="@/assets/js/advert/advert_list.js"></script>

<style lang="scss" scoped>

</style>
