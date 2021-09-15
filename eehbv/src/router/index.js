import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MachineComponents from "../views/pages/MachineComponents";
import Processes from "../views/pages/Processes";
import ComponentOverview from "../components/ComponentOverview";
import ProcessOverview from "../components/ProcessOverview";
import Optimization from "../components/Optimization";
import ComponentCreation from "../components/ComponentCreation";
import OptimizationResult from "../components/OptimizationResult";

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
    path: '/components/create',
    name: 'ComponentCreation',
    component: ComponentCreation
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
    path: '/processes/:type/define_optimization',
    name: 'Optimization',
    component: Optimization,
    props: true
  },
  {
    path: '/processes/:type/optimization_result',
    name: 'OptimizationResult',
    component: OptimizationResult,
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
