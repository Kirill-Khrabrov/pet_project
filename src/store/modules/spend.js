import { url, PORT } from '../server_config.js';

export default { 

  state: {
    //>>> Spend properties
    // this spend properties are entered by user 
    // and saved to DB if user enters " + " button, 
    // or updated when user eters " save " button
    spendDescription: '',
    spendDate: new Date().toLocaleDateString(),        
    spendCash: 0,

    // this var is replaced with ID of specified Spend,
    // when it is not 0, the Spend with specified ID is able to be deleted or updated
    specifiedSpendId: 0,   
      
  },

  actions: {
    // GET all Spends for specified Trip
    async fetchAllSpends({commit}, tripId) {
      
      const res = await fetch(
        `${url}:${PORT}/api/trips/${tripId}/spends`
      );
      
      const spends = await res.json();
      commit('updateSpendList', spends);        

    },

    //POST new Spend to DB
    async fetchNewSpend({commit}, newSpend) {
      
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
      commit('updateChosenSpendId', responseJson.spend.id);
      commit('addSpendToSpendList', responseJson.spend);      

    },

    //UPDATE Spend
    async fetchUpdateSpend({commit}, newSpend) {

      const body = {
        tripId: newSpend.tripId,
        description: newSpend.description,
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
        commit('updateSpendInSpendList', responseJson);               

    },

    //DELETE Spend from DB
    async fetchDeleteSpend({commit}, spend) {

      const fetchOptions = {
        method: 'DELETE'
      };

      const res = await fetch(
        `${url}:${PORT}/api/trips/${spend.tripId}/spends/${spend.spendId}`,
        fetchOptions
      );

      commit('removeSpendFromSpendList', spend.spendId);      

    },

  },

  mutations: {
    updateSpendDescription(state, newDescription) {
      state.spendDescription = newDescription; 
    },       
    
    updateSpendCash(state, newCash) {
      state.spendCash = newCash; 
    },

    updateChosenSpendId(state, spendId) {
      state.specifiedSpendId = spendId;
    },

    resetSpendForm(state) {
      state.spendDescription = '';
      state.spendCash = 0;
      state.specifiedSpendId = 0; 
    },
          
  },
      
}