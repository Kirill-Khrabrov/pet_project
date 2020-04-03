import Vue from 'vue';
import Vuex from 'vuex';
import trip from './modules/trip.js';
import spend from './modules/spend.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {        
    // vars for caching retrieved data from DB
    tripsList: [],  // cache for all Trips from Trip DB
    spendsList: [], // cache all Spends connected with specified Trip         
  },

  mutations: {
    //change Trip list on different actions
    updateTripList(state, trips) {
      state.tripsList = trips;
    },

    addTripToTripList(state, newTrip) {
      state.tripsList.push(newTrip);
    },
    
    updateTripInTripList(state, updatedTrip) {

      state.tripsList.forEach(trip => {
  
        if (trip.id === updatedTrip.trip.id) {

          let indexOfUpdatedTrip = state.tripsList.indexOf(trip);
          state.tripsList.splice(indexOfUpdatedTrip, 1, updatedTrip.trip);
        }

      });
    
    },    

    removeTripFromTripList(state, tripId) {
      state.tripsList = state.tripsList.filter(trip => trip.id !== tripId);
    },    

    //change Spend list on different actions
    updateSpendList(state, spends) {
      state.spendsList = spends;      
    },

    addSpendToSpendList(state, newSpend) {
      state.spendsList.push(newSpend);
    },

    updateSpendInSpendList(state, updatedSpend) {

      state.spendsList.forEach(spend => {
  
        if (spend.id === updatedSpend.spend.id) {

          let indexOfUpdatedSpend = state.spendsList.indexOf(spend);
          state.spendsList.splice(indexOfUpdatedSpend, 1, updatedSpend.spend);
        }

      });
    
    },

    removeSpendFromSpendList(state, spendId) {
      state.spendsList = state.spendsList.filter(spend => spend.id !== spendId);
    },
  },    
  
  modules: { 
      trip,
      spend
  }

});