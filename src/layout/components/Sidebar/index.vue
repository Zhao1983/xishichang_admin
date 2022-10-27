<template>
<div :class="{'has-logo':showLogo}">
	<logo v-if="showLogo" :collapse="isCollapse" />
	<el-scrollbar wrap-class="scrollbar-wrapper">
		<el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="'#304156'" :text-color="'#bfcbd9'" :unique-opened="false" :active-text-color="'#409EFF'" :collapse-transition="false" mode="vertical">
			<sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
		</el-menu>
	</el-scrollbar>
</div>
</template>

<script>
import {
	mapGetters
} from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

import {
	getMenus
} from '@/api/admin'

export default {
	components: {
		SidebarItem,
		Logo
	},
	asyncComputed: {
		...mapGetters([
			'sidebar'
		]),
		async routes() {
			const menu = await this.getMenuData()
			const temp = this.$router.options.routes

			let routes = []

			if (menu.code === 0) {
				if (menu.data.length !== 0) {
					routes = this.filterMenu(menu.data, temp)
				} else {
					routes = temp
				}
			} else {
				routes = temp
			}

			return routes
		},
		async activeMenu() {
			const route = this.$route
			const {
				meta,
				path
			} = route
			// if set path, the sidebar will highlight the path you set
			if (meta.activeMenu) {
				return meta.activeMenu
			}
			return path
		},
		async showLogo() {
			return this.$store.state.settings.sidebarLogo
		},
		variables() {
			return variables
		},
		async isCollapse() {
			return !this.sidebar.opened
		}
	},
	methods: {
		getMenuData() {
			return new Promise((resolve, reject) => {
				getMenus().then(response => {
					resolve(response)
				})
			})
		},
		filterMenu(data, old) {
			let result = []

			data.filter(res => {
				old.filter(value => {
					if (res.uri === value.path.split('/')[1]) {
						if (res.subs.length !== 0) {
							const tmp = value.children

							if (value.meta) {
								value.meta.title = res.name
							}

							value.children = []

							res.subs.filter(val => {
								tmp.filter(v => {
									if (v.path === val.uri) {
										v.meta.title = val.name
										value.children.push(v)
									}
								})
							})
						} else {
							value.children[0].meta.title = res.name
						}

						result.push(value)
					}
				})
			})

			return result
		}
	}
}
</script>
