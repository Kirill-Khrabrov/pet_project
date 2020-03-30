import Vue from 'vue';
import Vuex from 'vuex';
import trip from './modules/trip.js';

const url = 'http://127.0.0.1';
const PORT = process.env.PORT || 4001;


Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    // GET all trips from DB  
    async fetchAllTrips(ctx) {
            
      const res = await fetch(
        `${url}:${PORT}/api/trips`
      );
      const trips = await res.json();
           
      ctx.commit('updateTripList', trips);

    },

    // GET all Spends for specified Trip
    async fetchAllSpends(ctx, tripId) {
        
        const res = await fetch(
            `${url}:${PORT}/api/trips/${tripId}/spends`
        );
        const spends = await res.json();

        ctx.commit('updateSpendList', spends);        

    },

    //PUT new Trip to DB
    async fetchNewTrip(ctx, newTrip) {

        const body = {
            description: newTrip.description,
            dateStart: newTrip.dateStart,
            dateEnd: newTrip.dateEnd,
            totalCash: newTrip.totalCash,
        };

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'                     
            },
            body: JSON.stringify({ trip: body })
          };

          console.log(fetchOptions.body);

        const res = await fetch(
            `${url}:${PORT}/api/trips`, fetchOptions
        );

        const newlyCreatedTrip = await res.json();
        ctx.commit('addTripToTripList', newlyCreatedTrip);
        ctx.commit('updateChosenTripId',newlyCreatedTrip.id);
    }

        
  },

  mutations: {
    updateTripList(state, trips) {
      state.tripsList = trips;
    },

    addTripToTripList(state, newTrip) {
        state.tripsList.push(newTrip);
    },

    updateSpendList(state, spends) {
      state.spendsList = spends;      
    },

    updateChosenSpendId(state, spendId) {
      state.specifiedSpendId = spendId;
    }
  },

  state: {
        
    // vars for caching retrieved data from DB
    tripsList: [],  // cach for all Trips from Trip DB
    spendsList: [], // cach all Spends connected with specified Trip 
    
    
    specifiedSpendId: 0,
  },

  getters: {
        
    allTrips(state) {      
      return state.tripsList;
    },

    allSpends(state) {
      return state.spendsList;
    },

    chosenSpend(state) {
      return state.specifiedSpendId;
    },


  },  

  
  
  modules: { 
      trip
  }

});