import elDragDialog from "@/directive/el-drag-dialog"
import ElDragSelect from "@/components/DragSelect"

import {
    getCompanyInfo,
    updateDeliveryInfo
} from '@/api/shipping' // 배송 데이터 API 추가

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    setClearGoodsSearchField,
    setClearGoodsBatchSearchField,
    setClearShopSearchField,
    setClearShopBatchField,
    setClearOrderSearchField
} from '@/utils/auth' // 쿠키설정

import {
    showToast
} from '@/utils/'

export default {
    name: 'Company_update',
    components: {
        ElDragSelect
    },
    directives: {
        elDragDialog
    },
    async created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        const deliveryid = this.$route.query && this.$route.query.id
        const province = this.$route.query && this.$route.query.province

        const info = await this.getCompanyData(deliveryid)

        if (info.code === 0) {
            this.deliveryName = info.data.deliveryName // 배송회사명
            this.provinceData = info.data.provinceNames

            // 성소재지 정보
            let value = {
                province: '省份',
                active: '',
                fixed: true
            }
            this.listProvince.push(value)

            if (info.data.provinceNames.length !== 0) {
                info.data.provinceNames.filter(res => {
                    let v = {
                        province: res,
                        active: ''
                    }

                    province.split('-').filter(val => {
                        if (res === val) {
                            v.active = 'label_color'
                        }
                    })

                    this.listProvince.push(v)
                })
            }

            // 상품날자구간
            this.tableData[0].minDays = info.data.minDays
            this.tableData[0].maxDays = info.data.maxDays

            // 배송정보
            const cost = info.data.costPrices
            const sale = info.data.salesPrices

            if (cost.length !== 0) {
                cost.filter((res, index) => {
                    this.weightUnit += 0.5

                    const value = {
                        weight: this.weightUnit,
                        costPrice: '',
                        salePrice: ''
                    }
                    this.updateData.push(value)

                    this.tableData[index + 1] = {
                        weight: this.weightUnit,
                        costPrice: res.split(','),
                        salePrice: sale[index].split(',')
                    }
                })
            }

            console.log(this.tableData);
        }
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
    },
    data() {
        return {
            listLoading: false,
            deliveryName: '', // 배송회사명
            listProvince: [], // 성, 시 배렬
            tableData: [{
                    minDays: [],
                    maxDays: []
                },
                {
                    weight: this.weightUnit,
                    costPrice: [],
                    salePrice: []
                }
            ], // 배송정보 배렬
            weightUnit: 0, // 기초무게값
            updateData: [], // 무게배렬
            isShowDialog: false,
            proviceValues: [],
            provinceData: []
        }
    },
    methods: {
        setFocusValue(element) {
            for (let i = 1; i < this.tableData.length; i++) {
                for (let j = 0; j < this.tableData[i].costPrice.length; j++) {
                    if (element.target.id === 'cost-' + i + '-' + j) {
                        element.target.value = element.target.value !== '' ? parseFloat(element.target.value).toFixed(2) : ''
                        this.tableData[i].costPrice[j] = element.target.value
                    }

                    if (element.target.id === 'sale-' + i + '-' + j) {
                        element.target.value = element.target.value !== '' ? parseFloat(element.target.value).toFixed(2) : ''
                        this.tableData[i].salePrice[j] = element.target.value
                    }
                }
            }

            for (let i = 0; i < this.updateData.length; i++) {
                if (element.target.id === 'cost-' + i) {
                    element.target.value = element.target.value !== '' ? parseFloat(element.target.value).toFixed(2) : ''
                    this.updateData[i].costPrice = element.target.value
                }

                if (element.target.id === 'sale-' + i) {
                    element.target.value = element.target.value !== '' ? parseFloat(element.target.value).toFixed(2) : ''
                    this.updateData[i].salePrice = element.target.value
                }
            }
        },
        setFilterValue(element) {
            for (let i = 0; i < this.tableData[0].minDays.length; i++) {
                if (element.target.id === 'minDays-' + i) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.tableData[0].minDays[i] = parseInt(element.target.value)
                }

                if (element.target.id === 'maxDays-' + i) {
                    element.target.value = element.target.value.replace(/[^0-9]/g, '')
                    this.tableData[0].maxDays[i] = parseInt(element.target.value)
                }
            }

            for (let i = 1; i < this.tableData.length; i++) {
                for (let j = 0; j < this.tableData[i].costPrice.length; j++) {
                    if (element.target.id === 'cost-' + i + '-' + j) {
                        if (element.target.value !== undefined) {
                            element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                            if (element.target.value.indexOf('.') !== -1) {
                                element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                                this.tableData[i].costPrice[j] = element.target.value
                            }
                        }
                    }

                    if (element.target.id === 'sale-' + i + '-' + j) {
                        if (element.target.value !== undefined) {
                            element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                            if (element.target.value.indexOf('.') !== -1) {
                                element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                                this.tableData[i].salePrice[j] = element.target.value
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < this.updateData.length; i++) {
                if (element.target.id === 'cost-' + i) {
                    if (element.target.value !== undefined) {
                        element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                        if (element.target.value.indexOf('.') !== -1) {
                            element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                            this.updateData[i].costPrice = element.target.value
                        }
                    }
                }

                if (element.target.id === 'sale-' + i) {
                    if (element.target.value !== undefined) {
                        element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                        if (element.target.value.indexOf('.') !== -1) {
                            element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                            this.updateData[i].salePrice = element.target.value
                        }
                    }
                }
            }
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
        getCompanyData(deliveryid) { // 배송회사정보 얻기
            return new Promise((resolve, reject) => {
                getCompanyInfo(deliveryid).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setAddRow() { // 새로운 행 추가
            this.weightUnit += 0.5

            let value = {
                weight: this.weightUnit,
                costPrice: [],
                salePrice: []
            }

            let costVal = ''
            let saleVal = ''

            for (let i = 0; i < this.listProvince.length - 1; i++) {
                if (i === this.listProvince.length - 2) {
                    costVal += ''
                    saleVal += ''
                } else {
                    costVal += '' + ','
                    saleVal += '' + ','
                }
            }

            value.costPrice = costVal.split(',')
            value.salePrice = saleVal.split(',')

            this.tableData.push(value)
        },
        async setUpdate() { // 배송정보 업데이트
            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            let costList = []
            let saleList = []

            this.tableData.filter((result, index) => {
                if (index !== 0) {
                    if (result.costPrice.length !== 0) {
                        let costValue = ''

                        result.costPrice.filter(res => {
                            costValue += res + ','
                        })
                        costList.push(costValue.slice(0, costValue.length - 1))
                    } else {
                        let costValue = ''

                        for (let i = 0; i < this.listProvince.length - 1; i++) {
                            costValue += '' + ','
                        }
                        costList.push(costValue.slice(0, costValue.length - 1))
                    }

                    if (result.salePrice.length !== 0) {
                        let saleValue = ''

                        result.salePrice.filter(res => {
                            saleValue += res + ','
                        })
                        saleList.push(saleValue.slice(0, saleValue.length - 1))
                    } else {
                        let saleValue = ''

                        for (let i = 0; i < this.listProvince.length - 1; i++) {
                            saleValue += '' + ','
                        }
                        saleList.push(saleValue.slice(0, saleValue.length - 1))
                    }
                }
            })

            const deliveryid = this.$route.query && this.$route.query.id
            const query = {
                minDays: this.tableData[0].minDays,
                maxDays: this.tableData[0].maxDays,
                costPrices: costList,
                salesPrices: saleList
            }

            updateDeliveryInfo(deliveryid, query).then(response => {
                if (response === '') {
                    showToast(this, '操作成功', 'success')
                    this.$router.push({
                        path: '/shipping/shipping_detail'
                    })
                }
            })
        },
        setAddValues() {
            if (this.proviceValues.length === 0) {
                showToast(this, '请选择省份', 'warning')
                return
            }

            for (let i = 1; i < this.tableData.length; i++) {
                for (let j = 0; j < this.tableData[i].costPrice.length; j++) {
                    const province = this.proviceValues.find(rs => rs === this.provinceData[j])

                    if (province) {
                        this.tableData[i].costPrice[j] = this.updateData[i - 1].costPrice
                        this.tableData[i].salePrice[j] = this.updateData[i - 1].salePrice
                        this.tableData.push()
                    }
                }
            }

            this.isShowDialog = false
        },
        setShowDialog() {
            this.isShowDialog = true

            this.updateData.filter(res => {
                res.costPrice = ''
                res.salePrice = ''
            })
            this.proviceValues = []
        },
        setCancelDialog() {
            this.isShowDialog = false
        }
    }
}