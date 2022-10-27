<template>
<li class="image_item">
    <div @click="removeItemImage" class="image_cancel">X</div>
    <img :src="currentUrl" class="form-control m-input" style="width: 100%; height: 100%; padding: 0;" alt="">
</li>
</template>

<script>
export default {
    name: 'Thumbnails',
    props: {
        imageUrl: {
            type: String
        },
        styles: {
            type: Object
        },
        objData: {
            required: true,
            type: Array
        },
        img: {
            type: String,
            required: true
        },
        addImgs: {
            type: Array
        },
        delImgs: {
            type: Array
        }
    },
    computed: {
        currentUrl() {
            return this.imageUrl
        },
        currentStyles() {
            return this.styles
        }
    },
    methods: {
        removeItemImage() {
            for (let i = 0; i < this.objData.length; i++) {
                if (this.objData[i].imgUri === this.img) {
                    if (this.objData[i].id !== undefined) {
                        this.delImgs.push(this.objData[i].id)
                    }

                    this.objData.splice(i, 1)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.image_item {
    display: inline-block;
    width: 130px;
    height: 130px;
    position: relative;
    margin-left: 7px;
}

.image_cancel {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 20px;
    cursor: pointer;
    color: red;
}
</style>
