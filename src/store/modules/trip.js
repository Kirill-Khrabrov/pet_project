import { url, PORT } from '../server_config.js';

export default {    

    state: {
        //>>> Trip properties
        // this trip properties are entered by user 
        // and saved to DB if user enters " + " button, 
        // or updated when user eters " save " button
        tripDescription: '',
        tripDateStart: '',        
        tripDateEnd: '',          
        tripTotalCash: 0,
        
        // this var is replaced with ID of specified Trip,
        // when it is not 0, the Trip with specified ID is able to be deleted or updated
        specifiedTripId: 0,
            
        // status of the trip calculated each time
        // when the site updates. Connected with VUE "Updated" lifecircle hook
        tripStatus: {
            notStarted: false,
            inProcess: false,
            finished: false
        },
    
    },

    actions: {
        // GET all trips from DB  
        async fetchAllTrips({commit}) {
            
            const res = await fetch(
            `${url}:${PORT}/api/trips`
            );

            const trips = await res.json();                
            commit('updateTripList', trips);
  
        },

        //POST new Trip to DB
        async fetchNewTrip({commit}, newTrip) {
    
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
            commit('updateChosenTripId', responseJson.trip.id);
            commit('addTripToTripList', responseJson.trip);        
    
        },

        //UPDATE Trip
        async fetchUpdateTrip({commit}, trip) {
        
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
            commit('updateTripInTripList', responseJson);               
  
        },

        //DELETE trip from DB
        async fetchDeleteTrip({commit}, tripId) {

            const fetchOptions = {
                method: 'DELETE'
            };
    
            const res = await fetch(
                `${url}:${PORT}/api/trips/${tripId}`,
                fetchOptions
            );
    
            commit('removeTripFromTripList', tripId);

        },

    },

    mutations: {
        updateTripDescription(state, newDescription) {
            state.tripDescription = newDescription; 
        },       
        
        updateTripDateStart(state, newDateStart) {
            state.tripDateStart = newDateStart;
        },
        
        updateTripDateEnd(state, newDateEnd) {
            state.tripDateEnd = newDateEnd;
        },
        
        updateTripTotalCash(state, newTotalCash) {
            state.tripTotalCash = newTotalCash; 
        },

        updateChosenTripId(state, tripId) {
            state.specifiedTripId = tripId;
        },

        resetTripForm(state) {
            state.tripDescription = '';
            state.tripDateStart = '';
            state.tripDateEnd = '';
            state.tripTotalCash = '';
            state.specifiedTripId = 0; 
        },

        updateTripStatus(state) {
            const dayNow = Math.floor(new Date() / (1000 * 3600 * 24));
            const dayStart = Math.floor(new Date(state.tripDateStart) / (1000 * 3600 * 24));
            const dayEnd = Math.floor(new Date(state.tripDateEnd) / (1000 * 3600 * 24));
            
            if (state.tripDescription && state.tripDateStart && state.tripDateEnd && state.tripTotalCash) {
                                
                if (dayNow - dayStart < 0) {
                    state.tripStatus.notStarted = true;
                    state.tripStatus.inProcess = false;
                    state.tripStatus.finished = false;
  
                } else if (dayNow - dayStart >= 0 && dayNow - dayEnd <= 0) {
                    state.tripStatus.notStarted = false;
                    state.tripStatus.inProcess = true;
                    state.tripStatus.finished = false;

                } else if (dayNow - dayEnd > 0) { 
                    state.tripStatus.notStarted = false;
                    state.tripStatus.inProcess = false;
                    state.tripStatus.finished = true;
                }
    
            }
   
        }        
           
    },    
    
}