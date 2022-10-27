import {
    getRunnerPrice,
    updateRunnerPrice
} from '@/api/shipping' // 배송 데이터 API 추가

import {
    MessageBox
} from 'element-ui' // 메세지다이얼로그 추가

import {
    showToast,
    setAddCommaTwo,
    removeComma
} from '@/utils/'

export default {
    name: 'Running_setting',
    components: {},
    created() {
        this.companyId = parseInt(this.$route.query && this.$route.query.id)
        this.getRunnerPrice()
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
    },
    data() {
        return {
            companyName: '',
            companyId: 0,
            priceLevel: 1,
            tableData: [{
                    priceLevel: '1公里',
                    costPrice: '',
                    salesPrice: '',
                    originalPrice: '',
                    isVisiblePriceToolTip: false
                }] // 배송정보 배렬
        }
    },
    methods: {
        setFocusValue(element) {
            for (let i = 0; i < this.tableData.length; i++) {
                if (element.target.id === 'costPrice-' + i) {
                    element.target.value = element.target.value !== '' ? parseFloat(element.target.value).toFixed(2) : ''
                    this.tableData[i].costPrice = element.target.value
                }

                if (element.target.id === 'salesPrice-' + i) {
                    element.target.value = element.target.value !== '' ? parseFloat(element.target.value).toFixed(2) : ''
                    this.tableData[i].salesPrice = element.target.value
                }

                if (element.target.id === 'originalPrice-' + i) {
                    if (parseFloat(this.tableData[i].costPrice) > parseFloat(element.target.value) || parseFloat(this.tableData[i].salesPrice) > parseFloat(element.target.value)) {
                        element.target.value = ''
                        this.tableData[i].originalPrice = element.target.value
                        this.tableData[i].isVisiblePriceToolTip = true
                    } else {
                        element.target.value = element.target.value !== '' ? parseFloat(element.target.value).toFixed(2) : ''
                        this.tableData[i].originalPrice = element.target.value
                        this.tableData[i].isVisiblePriceToolTip = false
                    }
                }
            }
        },
        setFilterValue(element) {
            for (let i = 0; i < this.tableData.length; i++) {
                if (element.target.id === 'costPrice-' + i) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                        this.tableData[i].costPrice = element.target.value
                    }
                }

                if (element.target.id === 'salesPrice-' + i) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                        this.tableData[i].salesPrice = element.target.value
                    }
                }

                if (element.target.id === 'originalPrice-' + i) {
                    element.target.value = element.target.value.replace(/[^0-9.]/g, '')

                    if (element.target.value.indexOf('.') !== -1) {
                        element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                        this.tableData[i].originalPrice = element.target.value
                    }
                }
            }
        },
        getRunnerPrice() {
            getRunnerPrice(this.companyId).then(response => {
                if (response.code === 0) {
                    this.companyName = response.data.runnerName

                    if (response.data.priceDto.length !== 0) {
                        this.tableData = []

                        response.data.priceDto.filter(res => {
                            const value = {
                                priceLevel: res.priceLevel + '公里',
                                originalPrice: res.originalPrice.toFixed(2),
                                costPrice: res.costPrice.toFixed(2),
                                salesPrice: res.salesPrice.toFixed(2)
                            }

                            this.tableData.push(value)
                        })

                        this.priceLevel = response.data.priceDto.length
                    }
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
        setAddRow() {
            this.priceLevel += 1

            const value = {
                priceLevel: this.priceLevel + '公里',
                costPrice: '',
                salesPrice: '',
                originalPrice: ''
            }

            this.tableData.push(value)
        },
        async updateRunnerInfo() {
            let isValidate = false

            this.tableData.filter(res => {
                if (res.originalPrice === '') {
                    showToast(this, '请输入原价', 'warning')
                    isValidate = true
                    return
                }

                if (res.salesPrice === '') {
                    showToast(this, '请输入销售价', 'warning')
                    isValidate = true
                    return
                }

                if (res.costPrice === '') {
                    showToast(this, '请输入成本价', 'warning')
                    isValidate = true
                    return
                }
            })

            if (isValidate) {
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            let data = []

            this.tableData.filter(res => {
                const value = {
                    priceLevel: parseInt(res.priceLevel.split('公里')[0]),
                    originalPrice: parseFloat(res.originalPrice),
                    costPrice: parseFloat(res.costPrice),
                    salesPrice: parseFloat(res.salesPrice)
                }

                data.push(value)
            })

            updateRunnerPrice(this.companyId, data).then(response => {
                if (response.code === 0) {
                    showToast(this, '操作成功', 'success')
                    this.getRunnerPrice()
                }
            })
        }
    }
}