import {
    getAllDeliveryCompany,
    getProvice,
    addDeliverInfo
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
    showToast,
    setAddCommaTwo,
    removeComma
} from '@/utils/'

export default {
    name: 'Company_add',
    components: {},
    async created() {
        setClearGoodsSearchField()
        setClearGoodsBatchSearchField()
        setClearShopSearchField()
        setClearShopBatchField()
        setClearOrderSearchField()

        this.kind = this.$route.query && this.$route.query.kind
        const prov = this.$route.query && this.$route.query.province

        const companies = await this.getCompanyData()

        if (companies.code === 0) {
            this.listCompany = companies.data
        }

        const province = await this.getProviceData()

        if (province.code === 0) {
            // 성소재지 정보
            let value = {
                province: '省份',
                active: '',
                fixed: true
            }
            this.listProvince.push(value)

            province.data.filter(res => {
                let v = {
                    province: res.name,
                    active: '',
                    fixed: false
                }

                prov.split('-').filter(val => {
                    if (res.name === val) {
                        v.active = 'label_color'
                    }
                })

                this.listProvince.push(v)
            })
        }

        let costVal = ''
        let saleVal = ''

        for (let i = 0; i < this.listProvince.length - 1; i++) {
            this.tableData[0].maxDays.push(0)
            this.tableData[0].minDays.push(0)

            if (i === this.listProvince.length - 2) {
                costVal += ''
                saleVal += ''
            } else {
                costVal += '' + ','
                saleVal += '' + ','
            }
        }

        this.tableData[1].costPrice = costVal.split(',')
        this.tableData[1].salePrice = saleVal.split(',')
    },
    mounted() {
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
    },
    data() {
        return {
            dataForm: {
                company: '' // 배송회사
            },
            rules: {
                company: [{
                    required: true,
                    message: '配送公司是必填项',
                    trigger: 'change'
                }]
            },
            kind: '', // 배송종루
            listCompany: [], // 배송회사배렬
            listProvince: [], // 성소재지 배렬
            weightUnit: 0.5, // 기초무게값
            tableData: [{
                        minDays: [],
                        maxDays: []
                    },
                    {
                        weight: 0.5,
                        costPrice: [],
                        salePrice: []
                    }
                ] // 배송정보 배렬
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
                        element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                        if (element.target.value.indexOf('.') !== -1) {
                            element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                            this.tableData[i].costPrice[j] = element.target.value
                        }
                    }

                    if (element.target.id === 'sale-' + i + '-' + j) {
                        element.target.value = element.target.value.replace(/[^0-9.]/g, '')
                        if (element.target.value.indexOf('.') !== -1) {
                            element.target.value = element.target.value.slice(0, element.target.value.indexOf('.') + 3)
                            this.tableData[i].salePrice[j] = element.target.value
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
        getCompanyData() { // 배송회사정보 얻기
            return new Promise((resolve, reject) => {
                getAllDeliveryCompany().then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getProviceData() { // 배송회사정보 얻기
            return new Promise((resolve, reject) => {
                getProvice().then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        setAddRow() {
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
        async setRegister() {
            if (this.dataForm.company === '') {
                showToast(this, '请选择配送公司', 'warning')
                return
            }

            const isSuccess = await this.openMessageBox()

            if (!isSuccess) {
                return
            }

            let costList = []
            let saleList = []

            this.tableData.filter((result, index) => {
                if (index !== 0) { // 배송날자구간
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

            let packageType = 0
            if (this.kind === '冷鲜') {
                packageType = 3
            }

            if (this.kind === '活体') {
                packageType = 2
            }

            if (this.kind === '陆运') {
                packageType = 1
            }

            const query = {
                companyCode: this.dataForm.company,
                packageType: packageType,
                minDays: this.tableData[0].minDays,
                maxDays: this.tableData[0].maxDays,
                costPrices: costList,
                salesPrices: saleList
            }

            addDeliverInfo(query).then(response => {
                if (response.code === 0) {
                    showToast(this, '操作成功', 'success')
                    this.$router.push({
                        path: '/shipping/shipping_detail'
                    })
                }
            })
        }
    }
}