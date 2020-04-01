const url = 'http://127.0.0.1';
const PORT = process.env.PORT || 4001;

export default {
    state: {
        //>>> Trip properties
        // this trip properties are entered by user 
        // and saved to DB if user enters " + " button, 
        // or updated when user eters " save " button
        description: '',
        dateStart: '',        
        dateEnd: '',          
        totalCash: 0,
        
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

    actions: {
        // GET all trips from DB  
        async fetchAllTrips(ctx) {
            
            const res = await fetch(
            `${url}:${PORT}/api/trips`
            );

            const trips = await res.json();                
            ctx.commit('updateTripList', trips);
  
        },

        //POST new Trip to DB
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
                    
            const res = await fetch(
                `${url}:${PORT}/api/trips`, 
                fetchOptions
            );
    
            const responseJson = await res.json();    
            ctx.commit('updateChosenTripId', responseJson.trip.id);
            ctx.commit('addTripToTripList', responseJson.trip);        
    
        },

        //UPDATE Trip
        async fetchUpdateTrip(ctx, trip) {
        
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
            ctx.commit('updateTripInTripList', responseJson);               
  
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

    },

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
            state.specifiedTripId = 0; 
        },

        updateTripStatus(state) {
            const dayNow = Math.floor(new Date() / (1000 * 3600 * 24) + 1);
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