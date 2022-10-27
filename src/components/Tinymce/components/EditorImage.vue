<template>
<div class="upload-container">
	<el-button :kind="kind" :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click="dialogVisible=true">上传图片</el-button>
	<el-dialog :visible.sync="dialogVisible">
		<el-upload :with-credentials="true" :multiple="true" :headers="token" :file-list="fileList" :show-file-list="true" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload" class="editor-slide-upload" :action="postUrl"
			 list-type="picture-card">
			<el-button size="small" type="primary">上传</el-button>
		</el-upload>
		<el-button @click="dialogVisible = false">取消</el-button>
		<el-button type="primary" @click="handleSubmit">确认</el-button>
	</el-dialog>
</div>
</template>

<script>
import {
	getCookieData,
	setCookieData,
	removeCookieData
} from '@/utils/auth' // 쿠키설정

export default {
	name: 'EditorSlideUpload',
	props: {
		color: {
			type: String,
			default: '#1890ff'
		},
		kind: { // 이미지업로API URL 종류
			type: String,
			default: ''
		}
	},
	data() {
		return {
			dialogVisible: false,
			listObj: {},
			fileList: [],
			postUrl: this.kind,
			token: {
				'Authorization': getCookieData('token')
			}
		}
	},
	methods: {
		checkAllSuccess() {
			return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
		},
		handleSubmit() {
			const arr = Object.keys(this.listObj).map(v => this.listObj[v])
			if (!this.checkAllSuccess()) {
				this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
				return
			}
			this.$emit('successCBK', arr)
			this.listObj = {}
			this.fileList = []
			this.dialogVisible = false
		},
		handleSuccess(response, file) {
			const uid = file.uid
			const objKeyArr = Object.keys(this.listObj)
			for (let i = 0, len = objKeyArr.length; i < len; i++) {
				if (this.listObj[objKeyArr[i]].uid === uid) {
					this.listObj[objKeyArr[i]].url = response.data.uri
					this.listObj[objKeyArr[i]].hasSuccess = true
					return
				}
			}
		},
		handleRemove(file) {
			const uid = file.uid
			const objKeyArr = Object.keys(this.listObj)
			for (let i = 0, len = objKeyArr.length; i < len; i++) {
				if (this.listObj[objKeyArr[i]].uid === uid) {
					delete this.listObj[objKeyArr[i]]
					return
				}
			}
		},
		beforeUpload(file) {
			const _self = this
			const _URL = window.URL || window.webkitURL
			const fileName = file.uid
			this.listObj[fileName] = {}
			return new Promise((resolve, reject) => {
				const img = new Image()
				img.src = _URL.createObjectURL(file)
				img.onload = function () {
					_self.listObj[fileName] = {
						hasSuccess: false,
						uid: file.uid,
						width: this.width,
						height: this.height
					}
				}
				resolve(true)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
    margin-bottom: 20px;
    ::v-deep .el-upload--picture-card {
        width: 100%;
    }
}
</style>
