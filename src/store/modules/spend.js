const url = 'http://127.0.0.1';
const PORT = process.env.PORT || 4001;

export default {
  state: {
    //>>> Spend properties
    // this spend properties are entered by user 
    // and saved to DB if user enters " + " button, 
    // or updated when user eters " save " button
    description: '',
    date: new Date().toLocaleDateString(),        
    cash: 0,

    // this var is replaced with ID of specified Spend,
    // when it is not 0, the Spend with specified ID is able to be deleted or updated
      specifiedSpendId: 0,   
      
  },

  actions: {
    // GET all Spends for specified Trip
    async fetchAllSpends(ctx, tripId) {
      
      const res = await fetch(
        `${url}:${PORT}/api/trips/${tripId}/spends`
      );
      
      const spends = await res.json();
      ctx.commit('updateSpendList', spends);        

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

    //UPDATE Spend
    async fetchUpdateSpend(ctx, newSpend) {

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
        ctx.commit('updateSpendInSpendList', responseJson);               

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
    updateSpendDescription(state, newDescription) {
      state.description = newDescription; 
    },       
    
    updateSpendCash(state, newCash) {
      state.cash = newCash; 
    },

    updateChosenSpendId(state, spendId) {
      state.specifiedSpendId = spendId;
    },

    resetSpendForm(state) {
      state.description = '';
      state.cash = 0;
      state.specifiedSpendId = 0; 
    },
          
  },

  getters: {
    spendDescription(state) {
      return state.description; 
    },
    
    spendDate(state) {
      return state.date; 
    },        
            
    spendCash(state) {
      return state.cash; 
    },
    
    chosenSpend(state) {
      return state.specifiedSpendId;
    }

  }
    
}