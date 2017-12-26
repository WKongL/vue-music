<template>
	<div class="singer" ref="singer">
		<listview :data="singers" @select="selectDetail" ref="list"></listview>
        <router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
    import {getSingerList} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import Singer from 'common/js/singer'
    import listview from 'base/listview/listview'
    import {mapMutations} from 'Vuex'
    import {playListMixin} from 'common/js/mixin'
    
    const HOT_NAME = '热门'
    const HOT_LENGTH = 10
    export default {
        mixins: [playListMixin],
        data() {
            return {
                singers: []
            }
        },
        created() {
            this._getSingerList()
        },
        methods: {
            handlePlayList(playlist) {
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.singer.style.bottom = bottom
                this.$refs.list.refresh()
            },
            selectDetail(singer) {
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            _getSingerList() {
                getSingerList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.singers = this._normalizeSinger(res.data.list)
                    }
                })
            },
            _normalizeSinger(list) {
                let map = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                }
                // 整理singer数据
                list.forEach((item, index) => {
                    if (index < HOT_LENGTH) {
                        map.hot.items.push(new Singer({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name
                        }))
                    }
                    // 根据排序号整理数据
                    let key = item.Findex
                    if (!map[key]) {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    map[key].items.push(new Singer({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name
                        }))
                })
                // 整理MAP，转换成有序数据
                let hot = []
                let ret = []
                for (let key in map) {
                    let val = map[key]
                    if (val.title.match(/[a-zA-Z]/)) {
                        ret.push(val)
                    } else if (val.title === HOT_NAME) {
                        hot.push(val)
                    }
                }
                ret.sort((a, b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })
                return hot.concat(ret)
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        components: {
            listview
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
        
</style>
