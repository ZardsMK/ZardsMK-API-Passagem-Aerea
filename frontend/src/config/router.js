import Home from '../components/home/Home.vue';
import Offers from '../components/home/Offers.vue';
import Auth from '../components/auth/Auth.vue';
import Flights from '../components/home/Flights.vue';
import FlightDetails from '../components/home/FlightDetails.vue';
import User from '../components/auth/User.vue';
import Payment from '../components/home/Payment.vue'
import { userKey } from '../global';
import { createWebHistory, createRouter } from 'vue-router';


const routes = [{
    path: '/',
    component: Home,
    meta: { showMenu: true }
    }, {
    path: '/offers',
    component: Offers,
    meta: { showMenu: true }
    }, {
    path: '/flights',
    component: Flights,
    meta: { showMenu: true }
    }, {
      path: '/flights/:id',
      component: FlightDetails,
      meta: { showMenu: true }
    },{
    path: '/payment',
    component: Payment,
    meta: { showMenu: true }
    }, {
    path: '/auth',
    component: Auth,
    meta: { showMenu: false }
    }, {
    path: '/user',
    component: User,
    meta: { showMenu: true }
    }, {
      path: '/logout',
      name: 'Logout',
      beforeEnter(to, from, next) {
        localStorage.removeItem(userKey);
        const store = require('./store').default;
        store.commit('clearUser');
        next('/');
      }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
export default router;