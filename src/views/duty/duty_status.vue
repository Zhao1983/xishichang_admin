<template>
<div id="duty_status">
    <div class="app-container">
        <el-form>
            <el-row>
                <el-col :span="6" style="height: 1px;"></el-col>
                <el-col :span="12">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="">
                                <el-date-picker v-model="currentDate" type="month" placeholder="" :picker-options="pickerOptions" @change="setChangeDate"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-button class="filter-item" type="success" size="mini" @click="showDialogMemo('0')" style="float: right; margin-top: 10px; margin-left: 10px;">填写备注</el-button>
                        <el-button class="filter-item" type="primary" size="mini" @click="showDialogMember" style="float: right; margin-top: 10px;">填写值班人员</el-button>
                    </el-row>
                    <el-row>
                        <table cellspacing="0" style="width: 100%; text-align: center;">
                            <thead>
                                <tr>
                                    <td width="14.28%" style="padding: 12px 0;">一</td>
                                    <td width="14.28%" style="padding: 12px 0;">二</td>
                                    <td width="14.28%" style="padding: 12px 0;">三</td>
                                    <td width="14.28%" style="padding: 12px 0;">四</td>
                                    <td width="14.28%" style="padding: 12px 0;">五</td>
                                    <td width="14.28%" style="padding: 12px 0; color: #ff0000;">六</td>
                                    <td width="14.28%" style="padding: 12px 0; color: #ff0000;">日</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in calendarData" :key="index">
                                    <td v-for="(rw, idx) in row" :key="idx" style="padding: 0;">
                                        <div v-if="isToday(rw.date, rw.id)" style="border: 2px solid #69c8ff; padding: 12px 0; height: 95px; width: 100%;">
                                            <div style="color: #69c8ff; font-weight: bold; font-size: 20px; margin-bottom: 5px;">{{ rw.day }}</div>
                                            <div style="font-size: 14px; margin-bottom: 5px;">{{ rw.adminNames }}</div>
                                            <div v-show="rw.remarkStatus === '1'" style="font-size: 14px; color: #93bcff; cursor: pointer;" @click="showDialogMemo(rw.id)">查看备注</div>
                                        </div>
                                        <div v-else style="border: 1px solid #dedede; padding: 12px 0; height: 95px; width: 100%;">
                                            <div v-if="rw.adminNames !== ''" style="margin-bottom: 10px;">
                                                <div v-if="rw.isActive" style="color: #ff0000;">{{ rw.day }}</div>
                                                <div v-else>{{ rw.day }}</div>
                                            </div>
                                            <div v-else style="margin-bottom: 10px;">
                                                <div v-if="rw.isActive" style="color: #f97373;">{{ rw.day }}</div>
                                                <div v-else style="color: #a4a4a4">{{ rw.day }}</div>
                                            </div>
                                            <div style="font-size: 14px; margin-bottom: 5px;">{{ rw.adminNames }}</div>
                                            <div v-show="rw.remarkStatus === '1'" style="font-size: 14px; color: #93bcff; cursor: pointer;" @click="showDialogMemo(rw.id)">查看备注</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </el-row>
                </el-col>
                <el-col :span="6" style="height: 1px;"></el-col>
            </el-row>
        </el-form>
    </div>

    <!-- 메모다이얼로그 -->
    <el-dialog v-el-drag-dialog title="填写备注" :visible.sync="isShowDialogMemo" :close-on-click-modal="false" width="30%">
        <el-row>
            <el-card class="box-card" style="margin-bottom: 5px;">
                <el-table :data="remarkData" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="备注" prop="id" align="left">
                        <template slot-scope="{row}">
                            <span>{{ row.remarkInfo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="时间" align="center" width="180%;">
                        <template slot-scope="{row}">
                            <span>{{ row.remarkDt }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card v-show="isStatus" class="box-card">
                <el-input type="textarea" v-model="remarkInfo"></el-input>
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog('memo')">取消</el-button>
            <el-button v-show="isStatus" type="primary" @click="setDutyRemark">保存</el-button>
        </div>
    </el-dialog>
    <!-- 직발인원다이얼로그 -->
    <el-dialog v-el-drag-dialog title="填写值班人员" :visible.sync="isShowDialogMember" width="20%" :close-on-click-modal="false">
        <el-row>
            <el-card class="box-card" style="margin-bottom: 5px;">
                <el-table :data="adminInfo" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="60%"></el-table-column>
                    <el-table-column label="管理员名称" prop="id" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.name }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog('member')">取消</el-button>
            <el-button type="primary" @click="setDutyMember">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/duty/duty_status.js"></script>

<style lang="scss">
textarea {
    min-height: 130px;
}
</style>
