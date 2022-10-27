<template>
<div id="syslog">
    <div class="app-container">
        <el-row>
            <el-card class="box-card">
                <el-table v-loading="listLoading" :data="listLog" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="AdminID" width="100" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="AdminName" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.adminName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Name" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.opName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="URL" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.opUri }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="MethodName" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.methodName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="IP" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.opIp }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Date" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.opDt }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="totalNumber > 0" :total="totalNumber" :page.sync="page" :limit.sync="size" @pagination="getLog" style="text-align: center;" />
            </el-card>
        </el-row>
    </div>
</div>
</template>

<script src="@/assets/js/syslog/syslog.js"></script>

<style lang="scss" scoped>
</style>
