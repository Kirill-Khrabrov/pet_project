const url = 'http://127.0.0.1';
const PORT = process.env.PORT || 4001;

export default {
    actions: { },

    mutations: {
        updateTripDescription(state, newDescription) {
            state.description = newDescription; 
        },       
        
        updateTripDateStart(state, newDateStart) {
            state.dateStart = newDateStart;
        },
        
        updateTripDateEnd(state, newDateEnd) {
            state.dateEnd = newDateEnd;
        },
        
        updateTripTotalCash(state, newTotalCash) {
            state.totalCash = newTotalCash; 
        },

        updateChosenTripId(state, tripId) {
            state.specifiedTripId = tripId;
        },

        resetTripForm(state) {
            state.description = '';
            state.dateStart = '';
            state.dateEnd = '';
            state.totalCash = ''; 
        },

        
           
    },

    state: {
      //>>> Trip properties
      // this trip properties are entered by user 
      // and saved to DB if user enters " + " button, 
      // or updated when user eters " save " button
        description: '',
        dateStart: '',        
        dateEnd: '',          
        totalCash: 0,
    // Helper vars
    // this var is replaced with ID of specified Trip,
    // when it is not 0, the Trip with specified ID is able to be deleted or updated
        specifiedTripId: 0,   
    
    },

    getters: {
        tripDescription(state) {
            return state.description; 
        },
        
        tripDateStart(state) {
            return state.dateStart; 
        },
        
        tripDateEnd(state) {
            return state.dateEnd; 
        },
        
        tripTotalCash(state) {
            return state.totalCash; 
        },
        
        chosenTrip(state) {
            return state.specifiedTripId;
        },

    },

    
}