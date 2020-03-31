import Vue from 'vue';
import Vuex from 'vuex';
import trip from './modules/trip.js';
import spend from './modules/spend.js';

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
        
        console.log(`Sending GET SPends request for ${tripId}`)

        const res = await fetch(
            `${url}:${PORT}/api/trips/${tripId}/spends`
        );
        const spends = await res.json();

        ctx.commit('updateSpendList', spends);        

    },

    //POST new Trip to DB
    async fetchNewTrip(ctx, newTrip) {

      console.log('Sending new POST request')

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
                
      const res = await fetch(
        `${url}:${PORT}/api/trips`, 
        fetchOptions
      );

      const responseJson = await res.json();

      ctx.commit('updateChosenTripId', responseJson.trip.id);
      ctx.commit('addTripToTripList', responseJson.trip);        

    },

    //POST new Spend to DB
    async fetchNewSpend(ctx, newSpend) {

      const body = {
        tripId: newSpend.tripId,
        description: newSpend.description,
        date: newSpend.date,
        spendCash: newSpend.spendCash
      }

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'                     
        },
        body: JSON.stringify({ spend: body })
      };

      const res = await fetch(
        `${url}:${PORT}/api/trips/${newSpend.tripId}/spends`, 
        fetchOptions
      );

      const responseJson = await res.json();

      ctx.commit('updateChosenSpendId', responseJson.spend.id);
      ctx.commit('addSpendToSpendList', responseJson.spend);      

    },

    //UPDATE Trip
    async fetchUpdateTrip(ctx, trip) {

      console.log(`Sending new PUT request witg data ${trip}`)

      const body = {
        description: trip.description,
        dateStart: trip.dateStart,
        dateEnd: trip.dateEnd,
        totalCash: trip.totalCash,
      };

      const fetchOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'                     
        },
        body: JSON.stringify({ trip: body })
        };
                
        const res = await fetch(
          `${url}:${PORT}/api/trips/${trip.tripId}`, 
          fetchOptions
        );

        const responseJson = await res.json();

        ctx.commit('updateTripInTripsList', responseJson);               

    },

    //UPDATE Spend
    async fetchUpdateSpend(ctx, newSpend) {

      const body = {
        tripId: newSpend.tripId,
        description: newSpend.description,
        date: newSpend.date,
        spendCash: newSpend.spendCash
      }

      const fetchOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'                     
        },
        body: JSON.stringify({ spend: body })
        };
                
        const res = await fetch(
          `${url}:${PORT}/api/trips/${newSpend.tripId}/spends/${newSpend.spendId}`, 
          fetchOptions
        );

        const responseJson = await res.json();

        ctx.commit('updateSpendInSpendsList', responseJson);               

    },
    
    //DELETE trip from DB
    async fetchDeleteTrip(ctx, tripId) {

      const fetchOptions = {
        method: 'DELETE'
      };

      const res = await fetch(
        `${url}:${PORT}/api/trips/${tripId}`,
        fetchOptions
      );

      ctx.commit('removeTripFromTripList', tripId);      

    },

    //DELETE Spend from DB
    async fetchDeleteSpend(ctx, spend) {

      const fetchOptions = {
        method: 'DELETE'
      };

      const res = await fetch(
        `${url}:${PORT}/api/trips/${spend.tripId}/spends/${spend.spendId}`,
        fetchOptions
      );

      ctx.commit('removeSpendFromSpendList', spend.spendId);      

    },

        
  },

  mutations: {
    updateTripList(state, trips) {
      state.tripsList = trips;
    },

    addTripToTripList(state, newTrip) {
      state.tripsList.push(newTrip);
    },

    addSpendToSpendList(state, newSpend) {
      state.spendsList.push(newSpend);
    },

    updateTripInTripsList(state, updatedTrip) {

      state.tripsList.forEach(trip => {
  
        if (trip.id === updatedTrip.trip.id) {

          let indexOfUpdatedTrip = state.tripsList.indexOf(trip);
          state.tripsList.splice(indexOfUpdatedTrip, 1, updatedTrip.trip);
        }

      });
    
    },

    updateSpendInSpendsList(state, updatedSpend) {

      state.spendsList.forEach(spend => {
  
        if (spend.id === updatedSpend.spend.id) {

          let indexOfUpdatedSpend = state.tripsList.indexOf(trip);
          state.spendsList.splice(indexOfUpdatedSpend, 1, updatedSpend.spend);
        }

      });
    
    },

    removeTripFromTripList(state, tripId) {
      state.tripsList = state.tripsList.filter(trip => trip.id !== tripId);
    },

    removeSpendFromSpendList(state, spendId) {
      state.spendsList = state.spendsList.filter(spend => spend.id !== spendId);
    },

    updateSpendList(state, spends) {
      state.spendsList = spends;      
    },

    

  },

  state: {
        
    // vars for caching retrieved data from DB
    tripsList: [],  // cach for all Trips from Trip DB
    spendsList: [], // cach all Spends connected with specified Trip     
    
  },

  getters: {
        
    allTrips(state) {      
      return state.tripsList;
    },

    allSpends(state) {
      return state.spendsList;
    },

  },  
  
  modules: { 
      trip,
      spend
  }

});