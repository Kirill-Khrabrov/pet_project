export default {
    actions: { },

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

    state: {
      //>>> Spend properties
      // this spend properties are entered by user 
      // and saved to DB if user enters " + " button, 
      // or updated when user eters " save " button
        description: '',
        date: new Date().toLocaleDateString(),        
        cash: 0,

    // Helper vars
    // this var is replaced with ID of specified Spend,
    // when it is not 0, the Spend with specified ID is able to be deleted or updated
        specifiedSpendId: 0,   
    
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
        },

    },

    
}