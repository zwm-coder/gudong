import Vue from 'vue'
import Router from 'vue-router'

import PlaylistDetail from '@/components/playlist-detail/playlist-detail'
import IndexPage from '@/components/index/index'
import Search from '@/components/search/search'
import PlayList from '@/components/playlist/playlist'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: IndexPage
    },
    {
      path: '/playlist-detail',
      component: PlaylistDetail
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/playlist',
      component: PlayList
    }
  ]
})
