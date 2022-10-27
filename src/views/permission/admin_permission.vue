<template>
<div id="admin_permission">
    <div class="app-container">
        <div class="filter-container">
            <el-row>
                <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" style="float: right; margin-bottom: 10px;" @click="setShowAdminDialog('add', 0)">新增</el-button>
            </el-row>
            <el-card class="box-card">
                <el-row>
                    <el-col :span="24">
                        <el-table v-loading="listLoading" :data="adminData" border fit highlight-current-row>
                            <el-table-column label="编号" align="center" width="60%">
                                <template slot-scope="{row}">
                                    <span>{{ row.id }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="管理员名称" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.adminName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="管理员昵称" align="center">
                                <template slot-scope="{row}">
                                    <span>{{ row.trueName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="管理员电话号" align="center" width="250%">
                                <template slot-scope="{row}">
                                    <span>{{ row.adminPhone }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="性别" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.gender }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="微信绑定名" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span>{{ row.wechatName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="管理员状态" align="center" width="100%">
                                <template slot-scope="{row}">
                                    <span v-if="row.adminStatus === '1'" style="color: blue;">开启</span>
                                    <span v-else style="color: red;">禁用</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="编辑" align="center" width="250%">
                                <template slot-scope="{row}">
                                    <el-button size="mini" icon="el-icon-edit" type="primary" @click="setShowAdminDialog('update', row.id)">编辑</el-button>
                                    <el-button size="mini" type="success" @click="setShowPermissionDialog(row.id)">菜单</el-button>
                                    <el-button size="mini" type="danger" @click="setRemoveAdmin(row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="totalNum > 0" :total="totalNum" :page.sync="page" :limit.sync="size" @pagination="getAdminData" style="text-align: center;" />
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>

    <el-dialog v-el-drag-dialog title="保存" :visible.sync="isShowAdmin" width="80%" :close-on-click-modal="false">
        <el-row>
            <el-col :span="11">
                <el-form ref="addForm" :model="addForm" :rules="rules" class="form-container">
                    <el-card class="box-card">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="adminName" label-width="30%" label="管理员名称: " class="postInfo-container-item">
                                    <el-input ref="adminName" id="adminName" size="small" v-model="addForm.adminName" placeholder="请输入管理员名称" style="width: 90%;" />
                                </el-form-item>
                                <el-form-item prop="trueName" label-width="30%" label="管理员昵称: " class="postInfo-container-item">
                                    <el-input id="trueName" ref="trueName" size="small" v-model="addForm.trueName" type="text" placeholder="请输入管理员昵称" value="" style="width: 90%;" />
                                </el-form-item>
                                <el-form-item prop="adminPhone" label-width="30%" label="管理员电话: " class="postInfo-container-item">
                                    <el-input id="adminPhone" ref="adminPhone" size="small" v-model="addForm.adminPhone" placeholder="请输入管理员电话" style="width: 90%;" />
                                </el-form-item>
                                <el-form-item v-show="kind === 'update'" label-width="30%" label="密码: " class="postInfo-container-item">
                                    <el-button type="primary" size="small" @click="setViewPwd">修改密码</el-button>
                                </el-form-item>
                                <el-form-item prop="adminPwd" v-if="isPwd" label-width="30%" label="密码: " class="postInfo-container-item">
                                    <el-input :type="passwordType" id="adminPwd" size="small" ref="adminPwd" v-model="addForm.adminPwd" placeholder="请输入密码" style="width: 90%;" />
                                    <span class="show-pwd" @click="showPwd">
                                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                                    </span>
                                </el-form-item>
                                <el-form-item label-width="30%" label="性别: " class="postInfo-container-item">
                                    <el-radio-group v-model="addForm.gender">
                                        <el-radio :label="'1'">男</el-radio>
                                        <el-radio :label="'2'">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label-width="30%" label="管理员状态: " class="postInfo-container-item">
                                    <el-radio-group v-model="addForm.adminStatus">
                                        <el-radio :label="'1'">开启</el-radio>
                                        <el-radio :label="'0'">禁用</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-form>
            </el-col>
            <el-col :span="1" style="height: 10px"></el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <el-row>
                        <el-col :span="24">
                            <div class="filter-container" style="margin-bottom: 10px;">
                                <el-row>
                                    <el-col :span="9">
                                        <el-input id="searchWehchatName" size="small" ref="searchWehchatName" v-model="searchWehchatName" placeholder="微信昵称" @keyup.enter.native="setSearchUserInfo" />
                                    </el-col>
                                    <el-col :span="1" style="height: 10px"></el-col>
                                    <el-col :span="9">
                                        <el-input id="searchWehchatPhone" size="small" ref="searchWehchatName" v-model="searchWehchatPhone" placeholder="手机号" @keyup.enter.native="setSearchUserInfo" />
                                    </el-col>
                                    <el-col :span="5">
                                        <el-button type="primary" size="small" plain icon="el-icon-search" style="float: right;" @click="setSearchUserInfo">搜索</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-table :data="listUserData" v-loading="listLoadingUser" border fit highlight-current-row>
                                <el-table-column label="选择" align="center" width="60%">
                                    <template slot-scope="{row}">
                                        <input type="radio" v-model="row.checked" :value="row.id" name="" @click="setOwnerInfo(row)" style="cursor: pointer;">
                                    </template>
                                </el-table-column>
                                <el-table-column label="名称" align="center">
                                    <template slot-scope="{row}">
                                        <span>{{ row.userNick }}</span>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column label="手机号" align="center">
                    <template slot-scope="{row, $index}">
                      <span>{{ row.phoneNum }}</span>
                    </template>
                  </el-table-column> -->
                                <el-table-column label="角色" align="center">
                                    <template slot-scope="{row}">
                                        <span>{{ row.userRole }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="totalUserNum > 0" :total="totalUserNum" :page.sync="pageUser" :limit.sync="sizeUser" @pagination="getOwnerInfoData" />
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button v-if="kind === 'add'" type="success" @click="setAdmin">保存</el-button>
            <el-button v-else type="primary" @click="setAdmin">编辑</el-button>
        </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="权限编辑" :visible.sync="isShowPermission" :close-on-click-modal="false">
        <el-form ref="addForm" class="form-container">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="">
                        <el-tree ref="menu" :check-strictly="checkStrictly" :data="menus" :props="defaultProps" show-checkbox node-key="id" class="permission-tree" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setCancelDialog">取消</el-button>
            <el-button type="primary" @click="setAdminPermission">编辑</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script src="@/assets/js/permission/admin_permission.js"></script>

<style lang="scss" scoped>
.show-pwd {
    position: absolute;
    right: 50px;
    top: 3px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
}
</style>
