<template>
    
  <details class="col-lg-10 mx-auto">
          
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
            <tr v-for="trip in allTrips" :key="trip.id" :class="{activeRow: specifiedTripId === trip.id}">
              <td>
                <img src="@/assets/img/quit.svg" @click="removeTrip(trip)">
              </td>
              <td @click="chooseTrip(trip)">{{ trip.description }}</td>
              <td @click="chooseTrip(trip)">{{ trip.trip_start | date('date') }}</td>
              <td @click="chooseTrip(trip)">{{ trip.trip_end | date('date') }}</td>
              <td @click="chooseTrip(trip)">{{ trip.total_cash | currency('RUB') }}</td>                    
            </tr>
                    
          </tbody>
                
        </table>
          
      </div>
            
    </div>

  </details>

</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TripsList',

  computed: {
    ...mapState({
      specifiedTripId: state => state.trip.specifiedTripId
    }),  
      
  },
    
  props: {
    allTrips: {
      required: true,
      type: Array
    }
  },

  methods: {
    //removes Trip from DB and rendered TripsList
    removeTrip(trip){
      this.$store.dispatch('fetchDeleteTrip', trip.id);      

      if (trip.id === this.specifiedTripId) {
        this.$store.commit('resetSpendForm');
        this.$store.commit("resetTripForm");
        this.$store.commit('updateSpendList', []);
      }
    },

    //switch selected Trip to chosen
    chooseTrip(trip) {      
      this.$store.commit('updateChosenTripId', trip.id);
      this.$store.dispatch('fetchAllSpends', this.specifiedTripId);
      this.$store.commit('updateTripDescription', trip.description);
      this.$store.commit('updateTripDateStart', trip.trip_start);
      this.$store.commit('updateTripDateEnd', trip.trip_end);
      this.$store.commit('updateTripTotalCash', trip.total_cash); 
      this.$store.commit('resetSpendForm');
    },
  }
  
}
</script>

<style scoped>
  .TripList {
    height: 14em;
    overflow-y: auto
  }

  td {
    font-weight: 500;
  }
</style>