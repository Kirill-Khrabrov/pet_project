import Vue from 'vue';
import Vuex from 'vuex';
import trip from './modules/trip.js';

const url = 'http://127.0.0.1';
const PORT = process.env.PORT || 4001;


Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    async fetchTrips(ctx) {
      
      console.log(`Sending GET Request to ${url}:${PORT}/api/trips`)

      const res = await fetch(
        `${url}:${PORT}/api/trips`
      );
      const trips = await res.json();

      console.log(`Request received ${trips}`);
      
      ctx.commit('updateTripList', trips);

    }
  },

  mutations: {
    updateTripList(state, trips) {
      state.tripsList = trips;
    }
  },

  state: {
    // vars for caching retrieved data from DB
    tripsList: [],  // cach for all Trips from Trip DB
    spendsList: [], // cach all Spends connected with specified Trip 
  },

  getters: {
    allTrips(state) {
      console.log(state.tripsList);
      return state.tripsList;
    },
  },  

  
  
  modules: { 
      trip
  }

});