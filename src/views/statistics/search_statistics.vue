<template>
<div id="search_statistics">
    <div class="app-container">
        <div class="filter-container">
            <el-row style="margin-bottom: 10px; margin-top: 10px;">
                <el-radio-group v-model="switchDate" style="float: right;" @change="setChangeDate">
                    <el-radio-button label="0">昨日</el-radio-button>
                    <el-radio-button label="1">近7日</el-radio-button>
                    <el-radio-button label="2">近30日</el-radio-button>
                    <el-radio-button label="3">近三个月</el-radio-button>
                    <el-radio-button label="4">近六个月</el-radio-button>
                    <el-radio-button label="5">近一年</el-radio-button>
                </el-radio-group>
            </el-row>
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-table v-loading="listLoading" :data="listData" border fit highlight-current-row>
                            <el-table-column label="排名" align="center" width="60%">
                                <template slot-scope="{$index}">
                                    <span>{{ ++$index }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="搜索词" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.keywordInfo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="搜索数" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.num | addComma }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNumber > 0" :total="totalNumber" :page.sync="page" :limit.sync="size" @pagination="getData" style="text-align: center;" />
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</div>
</template>

<script src="@/assets/js/statistics/search_statistics.js"></script>

<style lang="scss" scoped>

</style>
