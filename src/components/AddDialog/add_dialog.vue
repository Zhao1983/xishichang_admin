<template>
<el-dialog :title="titleName" :visible.sync="isShow" width="40%">
    <div v-show="searchTag" class="filter-container">

    </div>
    <el-row>
        <el-card class="box-card">

        </el-card>
    </el-row>
    <div slot="footer" class="dialog-footer">
        <el-button @click="canDialog">취소</el-button>
        <el-button type="primary">추가</el-button>
    </div>
</el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination' // 페이징 콘퍼넨트 추가

export default {
    name: 'AddDialog',
    components: {
        Pagination
    },
    data() {
        return {
            isCancel: this.isShow
        }
    },
    props: {
        isSearch: {
            type: Boolean
        },
        isShow: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    computed: {
        showDlg() {
            return this.isShow
        },
        searchTag() {
            return this.isSearch
        },
        titleName() {
            return this.title
        }
    },
    methods: {
        setSearchKeyword() {
            this.$emit('setSearchKeyword')
        },
        setKeywordRow() {
            this.$emit('setKeywordRow')
        },
        canDialog() {
            this.isShow = false
        },
        setAddKeyword() {
            this.$emit('setAddKeyword')
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
