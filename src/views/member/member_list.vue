<template>
<div id="member_list">
    <div class="app-container">
        <!-- 검색 섹션 -->
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-form class="form-container">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label-width="5%" label="会员名称: ">
                                <!-- 회원명 -->
                                <el-input v-model="userNick" size="small" placeholder="会员名称" style="width: 8%;" @keyup.enter.native="getSearchData" />
                                <!-- 전화번호 -->
                                <label class="radio-label" style="margin-left: 1%; color: #606266;">电话号: </label>
                                <el-input v-model="phoneNum" size="small" placeholder="电话号" style="width: 8%; margin-left: 10px;" @keyup.enter.native="getSearchData" />
                                <!-- 수화정보 -->
                                <label class="radio-label" style="margin-left: 1%; color: #606266;">收货地址: </label>
                                <el-input v-model="address" size="small" placeholder="收货地址" style="width: 9%; margin-left: 10px;" @keyup.enter.native="getSearchData" />
                                <!-- 시작날자 -->
                                <label class="radio-label" style="margin-left: 1%; color: #606266;">注册日期: </label>
                                <el-date-picker v-model="beginDt" size="small" type="date" placeholder="开始日期" style="width: 9%; margin-left: 10px;" @change="setChangeDate" />
                                <!-- 마감날자 -->
                                <label class="radio-label" style="margin-left: 1%; color: #606266;"></label>
                                <el-date-picker v-model="endDt" size="small" type="date" placeholder="结束日期" style="width: 9%; margin-left: 10px;" @change="setChangeDate" :picker-options="pickerOptions" />
                                <!-- 회원상태 -->
                                <label class="radio-label" style="margin-left: 1%; color: #606266;">是否启用: </label>
                                <el-radio-group v-model="userStatus" style="margin-left: 13px;">
                                    <el-radio :label="''">全部</el-radio>
                                    <el-radio :label="'0'">禁用</el-radio>
                                    <el-radio :label="'1'">启用</el-radio>
                                </el-radio-group>
                                <el-button type="primary" size="small" plain icon="el-icon-search" style="margin-left: 2%;" @click="getSearchData">搜索</el-button>
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
                        <el-tabs v-model="activeOption" type="border-card">
                            <el-tab-pane v-for="item in tabOption" :key="item.key" :label="item.label" :name="item.key">
                                <el-table v-loading="listLoading" :data="listUserInfo" border fit highlight-current-row>
                                    <el-table-column label="会员ID" align="center" width="90%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.id }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="微信名称" align="center" width="250%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.userNick }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="注册日期" align="center" width="160%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.regDt }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="会员电话号" align="center" width="180%">
                                        <template slot-scope="{row}">
                                            <span>{{ row.phoneNum }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="收货地址" align="center">
                                        <template slot-scope="{row}">
                                            <span>{{ row.address }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="状态" align="center" width="120%">
                                        <template slot-scope="{row}">
                                            <el-button v-if="row.userStatus === '1'" size="mini" type="primary" @click="setUpdateMemberStatus(row.id, '0', row.userNick)">开启</el-button>
                                            <el-button v-else size="mini" type="danger" @click="setUpdateMemberStatus(row.id, '1', row.userNick)">禁用</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <pagination v-show="totalNum > 0" :total="totalNum" :page.sync="page" :limit.sync="size" @pagination="getMemberInfo(activeOption)" style="text-align: center;" />
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>

    <!-- 리유 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="编辑" :visible.sync="isShowStatusDlg" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <el-input ref="offCause" v-model="offCause" type="textarea" placeholder="请输入理由" style="width: 100%;" />
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取消</el-button>
            <el-button type="primary" @click="updateStatus">编辑</el-button>
        </div>
    </el-dialog>

    <!-- 수화정보 다이얼로그 -->
    <el-dialog v-el-drag-dialog title="收货信息" :visible.sync="isShowReceiveAddress" width="25%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="24">
                <label class="radio-label" style="color: #606266; float: left;">收货信息: </label>
                <div style="float: left; width: 80%; line-height: 1.4; margin-left: 10px;">{{ receiver }} {{ receiverPhone }} {{ provinceName }} {{ cityName }} {{ countryName }} {{ addressInfo }}</div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/member/member_list.js"></script>

<style lang="scss" scoped>

</style>
