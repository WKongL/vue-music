<template>
  <transition name="slide">
      <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
    import MusicList from 'components/music-list/music-list'
    import {getTopSongList} from 'api/rank'
    import {mapGetters} from 'vuex'
    import {ERR_OK} from 'api/config'
    import {createSong} from 'common/js/song'

    export default {
        data() {
            return {
                songs: [],
                rank: true
            }
        },
        computed: {
            title() {
                return this.topList.topTitle
            },
            bgImage() {
                return this.songs.length > 0 ? this.songs[0].image : ''
            },
            ...mapGetters([
                'topList'
            ])
        },
        created() {
            if (!this.topList.id) {
                this.$router.push('/rank')
                return
            }
            this._getTopSongList()
        },
        methods: {
            _getTopSongList() {
                getTopSongList(this.topList.id).then((res) => {
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.songlist)
                    }
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((item) => {
                    const musicData = item.data
                    if (musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        components: {
            MusicList
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>


