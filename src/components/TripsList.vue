<template>
    
    <details class="col my-auto">
          
        <summary class="col my-auto font-weight-bold">SCHEDULE OF TRIPS</summary>

        <div class="TripList row py-1 text-center"> 
            
            <div class="col mb-auto">
              
              <table class="table table-md table-striped">
                
                <thead>
                  <th></th>
                  <th>Description</th>
                  <th>Trip Starts</th>
                  <th>Trip Ends</th>
                  <th>Cash</th>          
                </thead>
                
                <tbody id="TripList" class="overflow-auto">
                  <tr v-for="trip in allTrips" :key="trip.id" @click="chooseTrip(trip)">
                    <td>
                      <img src="public/img/x-circle.svg" >
                    </td>
                    <td>{{ trip.description }}</td>
                    <td>{{ trip.trip_start | date('date') }}</td>
                    <td>{{ trip.trip_end | date('date') }}</td>
                    <td>{{ trip.total_cash | currency('RUB') }}</td>                    
                  </tr>
                  
                </tbody>
              
              </table>
        
            </div>
          
          </div>

        </details>

    </template>

<script>
  export default {
    name: 'TripsList',
    
    props: {
        allTrips: {
            required: true,
            type: Array
        }
    },

    methods: {
      chooseTrip(trip) {
        
        this.$store.commit('updateChosenTripId', trip.id);
        this.$store.dispatch('fetchAllSpends', this.$store.getters.chosenTrip);
        this.$store.commit('updateTripDescription', trip.description);
        this.$store.commit('updateTripDateStart', trip.trip_start);
        this.$store.commit('updateTripDateEnd',trip.trip_end);
        this.$store.commit('updateTripTotalCash', trip.total_cash);        

      },


    }
}
</script>