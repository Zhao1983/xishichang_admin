import {
	getDeliveriesTime
} from '@/api/statistics'

import {
	setClearGoodsSearchField,
	setClearGoodsBatchSearchField,
	setClearShopSearchField,
	setClearShopBatchField,
	setClearOrderSearchField
} from '@/utils/auth'

export default {
	name: 'Deliverytime_statistics',
	components: {

	},
	created() {

	},
	mounted() {

	},
	data() {
		return {
			listLoading: false,
			deliveryCompany_1: '1',
			deliveryCompany_2: '3',
			deliveryCompany_3: '7',
			deliveryCompany_4: '8',
			isShowView_1: false,
			isShowView_2: false,
			isShowView_3: false,
			isShowView_4: false,
			typeIds: '',
			dataList: []
		}
	},
	methods: {
		setChangeCompany() {
			let tmpIds = []

			if (this.isShowView_1) {
				tmpIds.push(this.deliveryCompany_1)
			} else {
				tmpIds.slice(0, this.deliveryCompany_1)
			}

			if (this.isShowView_2) {
				tmpIds.push(this.deliveryCompany_2)
			} else {
				tmpIds.slice(0, this.deliveryCompany_2)
			}

			if (this.isShowView_3) {
				tmpIds.push(this.deliveryCompany_3)
			} else {
				tmpIds.slice(0, this.deliveryCompany_3)
			}

			if (this.isShowView_4) {
				tmpIds.push(this.deliveryCompany_4)
			} else {
				tmpIds.slice(0, this.deliveryCompany_4)
			}

			this.typeIds = tmpIds.join(',')
		},
		setSearchData() {
			getDeliveriesTime({ typeIds: this.typeIds }).then(response => {
				if (response.data.length !== 0) {
					this.dataList = response.data
				}
			})
		}
	}
}