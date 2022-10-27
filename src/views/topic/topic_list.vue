<template>
<div id="topic_list">
    <div class="app-container">
        <!-- 검색 -->
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label-width="25%" label="专题名称: ">
                                <!-- 광고명 -->
                                <el-input v-model="topicName" size="small" placeholder="专题名称" @keyup.enter.native="setSearchData" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label-width="25%" label="是否启用: ">
                                <!-- 광고상태 -->
                                <el-radio-group v-model="topicStatus">
                                    <el-radio :label="''">全部</el-radio>
                                    <el-radio :label="'1'">开启</el-radio>
                                    <el-radio :label="'0'">禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">
                            <el-form-item>
                                <el-button type="primary" size="small" plain icon="el-icon-search" @click="setSearchData">搜索</el-button>
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
                        <el-table v-loading="listLoading" :data="dataTopic" border fit highlight-current-row>
                            <el-table-column label="编号" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.id }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="专题名称" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.topicName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="专题分类" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.topicType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="序号" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.rankingNum }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="发布时间" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.publishDt }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="显示状态" align="center">
                                <template slot-scope="{row}">
                                    <el-button v-if="row.topicStatus === '1'" size="mini" type="primary" @click="setUpdateStatus(row.topicName, row.id, '0')">显示</el-button>
                                    <el-button v-else size="mini" type="danger" @click="setUpdateStatus(row.topicName, row.id, '1')">不显示</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="编辑" align="center">
                                <template slot-scope="{row}">
                                    <router-link v-if="row.topicStatus === '0'" :to="'/topic/topic_detail/' + row.id">
                                        <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                                    </router-link>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNum > 0" :total="totalNum" :page.sync="page" :limit.sync="size" @pagination="getTopicData" style="text-align: center;" />
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</div>
</template>

<script src="@/assets/js/topic/topic_list.js"></script>

<style lang="scss" scoped>

</style>
