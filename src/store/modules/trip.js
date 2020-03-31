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

        updateTripStatus(state) {
            const dayNow = Math.floor(new Date() / (1000 * 3600 * 24));
            const dayStart = Math.floor(new Date(state.dateStart) / (1000 * 3600 * 24));
            const dayEnd = Math.floor(new Date(state.dateEnd) / (1000 * 3600 * 24));

            
            if (state.description && state.dateStart && state.dateEnd && state.totalCash) {
                                
                if (dayNow - dayStart < 0) {
                    state.status.notStarted = true;
                    state.status.inProcess = false;
                    state.status.finished = false;
  
                } else if (dayNow - dayStart >= 0 && dayNow - dayEnd <= 0) {
                    state.status.notStarted = false;
                    state.status.inProcess = true;
                    state.status.finished = false;

                } else if (dayNow - dayEnd > 0) { 
                    state.status.notStarted = false;
                    state.status.inProcess = false;
                    state.status.finished = true;
                }
    
            }
   
        }

        
           
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
        
    // status of the trip calculated each time
    // when the site updates. Connected with VUE "Updated" lifecircle hook
        status: {
            notStarted: false,
            inProcess: false,
            finished: false
        },
    
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

        tripStatus(state) {
            return state.status;
        }

    },

    
}