import Thumbnail from '@/components/ImageItem/single_image' // 카테고리아이콘용 컴포넨트 추가
import elDragDialog from '@/directive/el-drag-dialog'
import Sortable from 'sortablejs'
import imageBack from '@/assets/images/review_image_back.png' // 썸네일 백그라운드 이미지 추가

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    getCategories,
    setUploadIcon,
    setUpdateRankingNum,
    setRegisterCategory,
    setUpdateCategory,
    getGoodsDataByType,
    updateGoodsRankingNumberByType,
    getOverSeasTypeInfo,
    setAddOverSeasTypeInfo,
    setUpdateOverSeasTypeInfo,
    setUpdateOverSeasTypeRankingNumber,
    setUpdateGoodsRankingNumberByOverSeasType
} from '@/api/category' // 상품카테고리 API 추가

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth' // 쿠키설정

import {
    showToast,
    setAddCommaTwo,
    setAddComma
} from '@/utils/' // 토스트 설정

export default {
    name: 'Category_list',
    components: {
        Thumbnail
    },
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.getCategoryData()
    },
    directives: {
        elDragDialog
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
    },
    watch: {
        activeOption(val) {
            this.activeOption = val
            this.getCategoryData()
        }
    },
    computed: {
        categoryData() {
            return this.listCategory
        }
    },
    filters: {
        addCommaTwo(data) { // 3자리수마다 콤마 추가
            return setAddCommaTwo(data)
        },
        addComma(value) {
            return setAddComma(value)
        }
    },
    data() {
        return {
            listLoading: false,
            imageBack: imageBack, // 이미지백그라운드
            isClicked: false, // 한번이상 클릭체크값
            listCategory: [], // 카테고리 배렬
            tempCategory: [],
            checkStrictly: false, // 관리자권한설정에시 리용되는 나무구조에서 어미가 변해도 자식쪽에 영향을 주지 않기
            defaultProps: { // 나무구조에서 보여줘야 할 부분 설정변수
                children: 'children', // 자식부분
                label: 'name' // 메뉴제목
            },
            addForm: {
                typeName: '', // 카테고리명
                parentId: undefined, // 대카테고리아이디
                isShow: '0', // 카테고리 로출상태
                iconUri: imageBack // 카테고리 아이콘
            },
            subcatid: undefined, // 소카테고리아이디
            parent: undefined, // 대, 소카테고리 상태값(0: 대카테고리, 1: 소카테고리)
            iconFile: undefined, // 카테고리 아이콘 파일
            isCategoryDialog: false, // 카테고리다이얼로그 로출 상태
            isShowImageCancel: false, // 카테고리 이미지 로출 상태
            kind: 'add', // 카테고리 다이얼로그 종류(추가/편집)
            rules: {
                typeName: [{
                    required: true,
                    message: '分类名称是必填项',
                    trigger: 'blur'
                }]
            },
            styles: {
                width: '100px',
                height: '100px',
                cursor: 'pointer'
            },
            isRankingDialog: false,
            rankingKind: '',
            rankingTypeId: 0,
            rankingSubTypeId: 0,
            goodsData: [],
            newGoodsData: [],
            oldGoodsData: [],
            sortable: null,
            typeTitle: '',
            subTypeTitle: '',
            tabOption: [{
                    label: '国内版分类',
                    key: 'domestic'
                },
                {
                    label: '海外版分类',
                    key: 'overseas'
                }
            ],
            activeOption: 'domestic'
        }
    },
    methods: {
        setFilterValue(element) { // 입력부분 필터링 설정
            if (element.target.id === 'typeName') {
                this.addForm.typeName = this.addForm.typeName.trim().substr(0, 20)
            }
        },
        getCategoryData() { // 카테고리 데이터 얻는 API 호출
            this.checkStrictly = true

            if (this.activeOption === 'domestic') {
                getCategories().then(response => {
                    if (response.code === 0) {
                        this.listCategory = this.generateCategory(response.data.list, 'all')
                        this.tempCategory = response.data.list

                        this.$nextTick(() => {
                            const category = this.generateCategory(response.data.list, 'show')
                            this.$refs.category[0].setCheckedNodes(this.generateArr(category))

                            this.checkStrictly = false
                        })
                    }
                })
            }

            if (this.activeOption === 'overseas') {
                getOverSeasTypeInfo({ typeStatus: '1' }).then(response => {
                    if (response.code === 0) {

                    }
                })
            }
        },
        setUploadIcons(data) { // 카테고리 아이콘 업로드
            return new Promise((resolve, reject) => {
                setUploadIcon(data).then(response => {
                    resolve(response.data.uri)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        compareImageName(value) {
            return value.includes('data:image/png;base64')
        },
        async openMessageBox() { // 메시지다이얼로그 async/await 처리
            try {
                await MessageBox.confirm('确认要保存吗？', '信息', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                return true
            } catch (e) {
                return false
            }
        },
        generateCategory(category, index) { // 해당 카테고리를 나무구조에 맞게 새로 생성하기
            const res = []
            let data = {}

            for (let cat of category) {
                if (index === 'all') {
                    data = {
                        id: cat.id + '-' + '',
                        name: cat.typeName + '##' + cat.goodsNum
                    }

                    if (cat.subs.length !== 0) {
                        data.children = []
                        cat.subs.filter(res => {
                            let val = {
                                id: cat.id + '-' + res.id,
                                name: res.typeName + '##' + res.goodsNum
                            }
                            data.children.push(val)
                        })
                    }
                } else {
                    if (cat.isShow === '1') {
                        data = {
                            id: cat.id + '-' + '',
                            name: cat.typeName + '##' + cat.goodsNum
                        }

                        if (cat.subs.length !== 0) {
                            data.children = []
                            cat.subs.filter(res => {
                                if (res.isShow === '1') {
                                    let val = {
                                        id: cat.id + '-' + res.id,
                                        name: res.typeName + '##' + res.goodsNum
                                    }
                                    data.children.push(val)
                                }
                            })
                        }
                    }
                }

                res.push(data)
            }

            return res
        },
        generateArr(category) { // 배렬형태를 string으로 변환하기
            let data = []
            category.forEach(res => {
                data.push(res)
                if (res.children) {
                    const temp = this.generateArr(res.children)
                    if (temp.length > 0) {
                        data = [...data, ...temp]
                    }
                }
            })
            return data
        },
        handleDragEnd() {
            this.checkStrictly = true

            this.$nextTick(() => {
                const category = this.generateCategory(this.tempCategory, 'show')
                this.$refs.category[0].setCheckedNodes(this.generateArr(category))

                this.checkStrictly = false
            })
        },
        allowDrop(draggingNode, dropNode, type) {
            if (draggingNode.data.id.split('-')[1] === '') { // 대카테고리 이동
                if (dropNode.data.id.split('-')[1] !== '') { // 이동할 위치가 소카테고리이면 이동 불가
                    return false
                }
            }

            if (draggingNode.data.id.split('-')[1] !== '') { // 소카테고리 이동
                if (dropNode.data.id.split('-')[0] !== draggingNode.data.id.split('-')[0]) { // 같은 대카테고리내의 소카테고리이동이 아니라면 이동 불가
                    return false
                } else if (dropNode.data.id.split('-')[1] === '') { // 소카테고리를 대카테고리로 이동 불가
                    return false
                }
            }

            return type !== 'inner'
        },
        allowDrag() {
            return true
        },
        showCategoryDialog(kind, catid, subcatid) { // 카테고리 추가/편집 다이얼로그 로출
            this.isCategoryDialog = true
            this.kind = kind
            this.addForm.parentId = parseInt(catid)
            this.subcatid = parseInt(subcatid)

            if (kind === 'add') {
                this.setClearValue()
            } else {
                this.tempCategory.filter(res => {
                    if (parseInt(subcatid) === 0) { // 대카테고리 편집
                        if (parseInt(catid) === res.id) {
                            this.addForm.typeName = res.typeName
                            this.addForm.iconUri = res.iconUri === '' || res.iconUri === null ? imageBack : res.iconUri
                            this.addForm.isShow = res.isShow

                            if (res.iconUri !== '' && res.iconUri !== null) {
                                this.isShowImageCancel = true
                            }
                        }
                    } else { // 소카테고리 편집
                        res.subs.filter(value => {
                            if (parseInt(subcatid) === value.id) {
                                this.addForm.typeName = value.typeName
                                this.addForm.isShow = value.isShow
                                this.addForm.iconUri = value.iconUri === '' || value.iconUri === null ? imageBack : value.iconUri

                                if (value.iconUri !== '' && value.iconUri !== null) {
                                    this.isShowImageCancel = true
                                }
                            }
                        })
                    }
                })
            }
        },
        cancelCategoryDialog() { // 다이얼로그 취소
            this.isCategoryDialog = false
            this.setClearValue()
        },
        setClearValue() {
            this.addForm.typeName = '' // 카테고리명
            this.addForm.isShow = '0' // 카티고리 보임상태
            this.addForm.iconUri = imageBack // 카테고리 아이콘 URL
            this.iconFile = undefined // 카테고리 아이콘 파일
            this.isShowImageCancel = false
        },
        setPriviewCatIcon() { // 이미지 파일브라우저 열기
            this.$refs.iconUri.click()
        },
        setChangeCatIcon(input) { // 이미지 프리뷰 설정
            if (input.target.files && input.target.files[0]) {
                const files = input.target.files

                for (let i = 0; i < files.length; i++) {
                    if (files[i].type !== 'image/jpeg' && files[i].type !== 'image/png' && files[i].type !== 'image/gif') {
                        showToast(this, '只允许上传 JPEG, PNG, GIF等格式', 'warning')
                        return
                    }

                    if (files[i].size > 204800) {
                        showToast(this, '图片大小不能大于200KB', 'warning')
                        return
                    }

                    this.addForm.iconUri = URL.createObjectURL(files[0])
                    this.iconFile = files[0]
                    this.isShowImageCancel = true
                }
            }
        },
        setCancelIconImage() { // 이미지 프리뷰 삭제
            this.isShowImageCancel = false
            this.addForm.iconUri = imageBack
            this.iconFile = undefined
        },
        setSortData() { // 대카테고리, 소카테고리 정렬
            const sortData = this.$refs.category[0].getCheckedKeys()
            let index = 0
            let data = []
            let existCat = ''
            let existSubCat = ''

            sortData.filter(res => {
                if (res.split('-')[1] === '') { // 대카테고리이면
                    let sortCat = {
                        id: parseInt(res.split('-')[0]),
                        rankingNum: parseInt(++index)
                    }

                    existCat += res.split('-')[0] + ','
                    data.push(sortCat)
                } else { // 소카테고리이면
                    let sortCat = {
                        id: parseInt(res.split('-')[1]),
                        rankingNum: parseInt(++index)
                    }

                    existSubCat += res.split('-')[1] + ','
                    data.push(sortCat)
                }
            })

            this.tempCategory.filter(res => {
                if (existCat.search(res.id) === -1) {
                    let sortCat = {
                        id: parseInt(res.id),
                        rankingNum: parseInt(++index)
                    }

                    data.push(sortCat)
                }
            })

            this.tempCategory.filter(res => {
                if (res.subs.length !== 0) {
                    res.subs.filter(value => {
                        if (existSubCat.search(value.id) === -1) {
                            let sortCat = {
                                id: parseInt(value.id),
                                rankingNum: parseInt(++index)
                            }

                            data.push(sortCat)
                        }
                    })
                }
            })

            setUpdateRankingNum(data).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.getCategoryData()
                }
            })
        },
        async setCategory() {
            if (this.isClicked) {
                return
            }

            // 카테고리명이 없으면
            if (this.addForm.typeName.trim() === '') {
                this.$refs.typeName.focus()
                showToast(this, '请输入分类名称', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            let data = new FormData()
            let icon = ''

            if (this.iconFile !== undefined) {
                data.append('file', this.iconFile)
                icon = await this.setUploadIcons(data)
            } else {
                icon = this.addForm.iconUri.split('/')[4]
            }

            const compare = await this.compareImageName(this.addForm.iconUri)

            if (icon.search('jpeg') === -1 && icon.search('jpg') === -1 && icon.search('png') === -1 && icon.search('gif') === -1 && compare === false) {
                this.isClicked = false
                showToast(this, icon, 'error')

                return
            }

            const query = {
                typeName: this.addForm.typeName,
                parentId: this.addForm.parentId,
                isShow: this.addForm.isShow,
                iconUri: compare === true ? '' : icon
            }

            if (this.kind === 'add') {
                setRegisterCategory(query).then(response => {
                    if (response.code === 0) {
                        this.cancelCategoryDialog()
                        this.getCategoryData()

                        showToast(this, '操作成功', 'success')
                    }

                    this.isClicked = false
                })
            }

            if (this.kind === 'edit') {
                const id = this.subcatid === 0 ? this.addForm.parentId : this.subcatid

                setUpdateCategory(id, query).then(response => {
                    if (response === '') {
                        this.cancelCategoryDialog()
                        this.getCategoryData()
                        showToast(this, '操作成功', 'success')
                    }

                    this.isClicked = false
                })
            }
        },
        getGoodsData() { // 대분류/소분류 상품 정보 얻기
            this.goodsData = []
            this.oldGoodsData = []
            this.newGoodsData = []

            if (this.rankingKind === 'parent') {
                this.listLoading = true

                getGoodsDataByType(this.rankingTypeId).then(response => {
                    if (response.code === 0) {
                        this.goodsData = response.data
                        this.oldGoodsData = response.data.map(v => v.id)
                        this.newGoodsData = this.oldGoodsData.slice()

                        this.$nextTick(() => {
                            this.setSortGoodsData()
                        })
                    }

                    this.listLoading = false
                })
            }

            if (this.rankingKind === 'subparent') {
                this.listLoading = true

                getGoodsDataByType(this.rankingSubTypeId).then(response => {
                    if (response.code === 0) {
                        this.goodsData = response.data
                        this.oldGoodsData = response.data.map(v => v.id)
                        this.newGoodsData = this.oldGoodsData.slice()

                        this.$nextTick(() => {
                            this.setSortGoodsData()
                        })
                    }

                    this.listLoading = false
                })
            }
        },
        setSortGoodsData() { // 상품순서 정렬
            const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost',
                setData: function(dataTransfer) {
                    dataTransfer.setData('Text', '')
                },
                onEnd: evt => {
                    const targetRow = this.goodsData.splice(evt.oldIndex, 1)[0]
                    this.goodsData.splice(evt.newIndex, 0, targetRow)

                    const tempIndex = this.newGoodsData.splice(evt.oldIndex, 1)[0]
                    this.newGoodsData.splice(evt.newIndex, 0, tempIndex)
                }
            })
        },
        setShowRankingDialog(kind, catid, subcatid) { // 대분류/소분류 상품정보를 보여주는 다이얼로그 로출
            this.isRankingDialog = true
            this.rankingKind = kind
            this.rankingTypeId = catid
            this.rankingSubTypeId = subcatid
            this.typeTitle = ''
            this.subTypeTitle = ''

            this.categoryData.filter(res => {
                if (res.id.split('-')[0] === catid) {
                    this.typeTitle = res.name.split('##')[0]
                }

                if (res.children) {
                    res.children.filter(val => {
                        if (val.id.split('-')[1] === subcatid) {
                            this.subTypeTitle = val.name.split('##')[0]
                        }
                    })
                }
            })

            this.getGoodsData()
        },
        setCancelRankingDialog() {
            this.isRankingDialog = false
        },
        async setRankingGoods() {
            if (this.isClicked) {
                return
            }

            let query = []

            this.newGoodsData.filter((res, idx) => {
                let value = {
                    id: parseInt(res),
                    rankingNum: idx + 1
                }

                query.push(value)
            })

            if (query.length === 0) {
                this.setCancelRankingDialog()

                return
            }

            const isSuccess = await this.openMessageBox()
            if (!isSuccess) {
                return
            }

            this.isClicked = true

            if (this.rankingKind === 'parent') {
                updateGoodsRankingNumberByType(this.rankingTypeId, query).then(response => {
                    if (response === '') {
                        this.setCancelRankingDialog()
                        this.getCategoryData()
                        showToast(this, '操作成功', 'success')
                    }
                })

                this.isClicked = false
            }

            if (this.rankingKind === 'subparent') {
                updateGoodsRankingNumberByType(this.rankingSubTypeId, query).then(response => {
                    if (response === '') {
                        this.setCancelRankingDialog()
                        this.getCategoryData()
                        showToast(this, '操作成功', 'success')
                    }
                })

                this.isClicked = false
            }
        }
    }
}