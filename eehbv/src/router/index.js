import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MachineComponents from "../views/pages/MachineComponents";
import Processes from "../views/pages/Processes";
import ComponentOverview from "../components/ComponentOverview";
import ProcessOverview from "../components/ProcessOverview";
import VariantPicklist from "../components/VariantPicklist";
import Restrictions from "../components/Restrictions";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/components',
    name: 'Component',
    component: MachineComponents
  },
  {
    path: '/components/:type',
    name: 'ComponentOverview',
    component: ComponentOverview,
    props: true
  },
  {
    path: '/processes',
    name: 'Process',
    component: Processes
  },
  {
    path: '/processes/:type',
    name: 'ProcessOverview',
    component: ProcessOverview,
    props: true
  },
  {
    path: '/processes/:type/pick_variants',
    name: 'VariantPicklist',
    component: VariantPicklist,
    props: true
  },
  {
    path: '/processes/:type/restrictions',
    name: 'Restrictions',
    component: Restrictions,
    props: true
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
