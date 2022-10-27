<template>
<div id="map">
    <iframe class="map-item" id="getAddress" frameborder="0" @load="loadiframe" :src="apiUrl + '?center=' + center + '&key=' + apiKey" style="width:100%; height:100%; position: absolute; z-index:22222;"></iframe>
</div>
</template>

<script>
import {
    showToast
} from '@/utils/'

import setting from '@/settings'

export default {
    name: 'Map',
    props: {
        center: {
            type: String,
            required: true
        }
    },
    created() {

    },
    data() {
        return {
            apiUrl: setting.MAP_URL,
            apiKey: setting.MAP_KEY
        }
    },
    methods: {
        loadiframe() {
            let iframe = document.getElementById('getAddress').contentWindow
            iframe.postMessage('hello', this.apiUrl)
            window.addEventListener('message', function (e) {
                if (e.data.command !== 'COMMAND_GET_TITLE') {
                    if (e.data.location) {
                        this.$emit('handleMapLocation', e.data.location)
                    }
                }
            }.bind(this), false)
        }
    }
}
</script>

<style scoped>
.map-item {
    position: fixed;
    width: 100%;
    height: 89%;
    top: 0;
    background: #fff;
    z-index: 222;
}
</style>
