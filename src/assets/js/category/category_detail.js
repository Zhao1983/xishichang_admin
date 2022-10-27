import Sortable from 'sortablejs'

import {
    getCategories,
    getGoodsDataByType,
    updateGoodsRankingNumberByType
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

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

export default {
    name: 'Category_detail',
    components: {},
    created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.typeId = parseInt(this.$route.params && this.$route.params.id)
        this.subTypeId = parseInt(this.$route.params && this.$route.params.subid)

        this.getCategoryData()
        this.getGoodsData()
    },
    mounted() {

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
            isClicked: false, // 한번이상 클릭체크값
            listCategory: [], // 카테고리 배렬
            typeId: undefined, // 1급분류
            subTypeId: undefined, // 2급분류
            typeTitle: '', // 1급분류명
            subTypeTitle: '', // 2급분류명
            sortable: null,
            newGoodsData: [],
            oldGoodsData: [],
            goodsData: [],
            orderType: undefined
        }
    },
    methods: {
        getCategoryData() { // 카테고리 데이터 얻는 API 호출
            getCategories().then(response => {
                if (response.code === 0) {
                    this.listCategory = response.data.list

                    this.listCategory.filter(res => {
                        if (res.id === this.typeId) {
                            this.typeTitle = res.typeName
                        }

                        if (res.subs !== null) {
                            if (res.subs.length !== 0) {
                                res.subs.filter(val => {
                                    if (val.id === this.subTypeId) {
                                        this.subTypeTitle = val.typeName
                                    }
                                })
                            }
                        }
                    })
                }
            })
        },
        getGoodsData() { // 대분류/소분류 상품 정보 얻기
            this.listLoading = true
            const query = {
                orderType: this.orderType
            }

            if (this.subTypeId === 0) {
                getGoodsDataByType(this.typeId, query).then(response => {
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
            } else {
                getGoodsDataByType(this.subTypeId, query).then(response => {
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
        setSortChange(data) {
            if (data.order === 'ascending') { // 올림차순
                if (data.prop === 'profit') { // 점포명
                    this.orderType = 1
                }

                if (data.prop === 'profitRate') { // 분류명
                    this.orderType = 3
                }
            }

            if (data.order === 'descending') { // 내림차순
                if (data.prop === 'profit') { // 점포명
                    this.orderType = 2
                }

                if (data.prop === 'profitRate') { // 분류명
                    this.orderType = 4
                }
            }

            if (data.order !== null) {
                this.getGoodsData()
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
        setMoveUp(row, index) {
            if (index === 0) {
                return
            }

            this.goodsData.splice(index - 1, 0, row)
            this.goodsData.splice(index + 1, 1)
            this.newGoodsData.splice(index - 1, 0, row.id)
            this.newGoodsData.splice(index + 1, 1)
        },
        setMoveDown(row, index) {
            if (index === this.goodsData.length - 1) {
                return
            }

            this.goodsData.splice(index + 2, 0, row)
            this.goodsData.splice(index, 1)
            this.newGoodsData.splice(index + 2, 0, row.id)
            this.newGoodsData.splice(index, 1)
        },
        setMoveTop(row, index) {
            this.goodsData.splice(0, 0, row)
            this.goodsData.splice(index + 1, 1)
            this.newGoodsData.splice(0, 0, row.id)
            this.newGoodsData.splice(index + 1, 1)
        },
        setMoveBottom(row, index) {
            this.goodsData.splice(this.goodsData.length, 0, row)
            this.goodsData.splice(index, 1)
            this.newGoodsData.splice(this.goodsData.length, 0, row.id)
            this.newGoodsData.splice(index, 1)
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
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            this.isClicked = true

            if (this.subTypeId === 0) {
                updateGoodsRankingNumberByType(this.typeId, query).then(response => {
                    if (response === '') {
                        showToast(this, '操作成功', 'success')
                        this.isClicked = false
                    }
                })
            } else {
                updateGoodsRankingNumberByType(this.subTypeId, query).then(response => {
                    if (response === '') {
                        showToast(this, '操作成功', 'success')
                        this.isClicked = false
                    }
                })
            }
        }
    }
}