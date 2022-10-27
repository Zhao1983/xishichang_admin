<template>
<img :src="currentUrl" alt="" v-bind:style="currentStyles" />
</template>

<script>
export default {
    name: 'Thumbnail',
    props: {
        imageUrl: {
            type: String
        },
        styles: {
            type: Object
        }
    },
    computed: {
        currentUrl() {
            return this.imageUrl
        },
        currentStyles() {
            return this.styles
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
