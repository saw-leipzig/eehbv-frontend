import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MachineComponents from "../views/pages/MachineComponents";
import MaterialProperties from "../views/pages/MaterialProperties";
import Processes from "../views/pages/Processes";
import UserManagement from "../views/pages/UserManagement";
import History from '../views/pages/History';
import Glossary from '../views/pages/Glossary';
import Login from "../views/pages/Login";
import ComponentOverview from "../components/ComponentOverview";
import ProcessOverview from "../components/ProcessOverview";
import Optimization from "../components/Optimization";
import ComponentCreation from "../components/ComponentCreation";
import ProcessCreation from "../components/ProcessCreation";
import OptimizationResult from "../components/OptimizationResult";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/users',
    name: 'Users',
    component: UserManagement
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/components',
    name: 'Component',
    component: MachineComponents
  },
  {
    path: '/properties',
    name: 'Property',
    component: MaterialProperties
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
    path: '/processes/create',
    name: 'ProcessCreation',
    component: ProcessCreation
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
    path: '/processes/:type/optimization_result/:timestamp',
    name: 'OptimizationResult',
    component: OptimizationResult,
    props: true
  },
  {
    path: '/history',
    name: 'History',
    component: History
  },
  {
    path: '/glossary',
    name: 'Glossary',
    component: Glossary
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
