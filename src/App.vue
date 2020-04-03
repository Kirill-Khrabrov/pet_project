<template>
  <div class="container-fluid text-center">

    <!-- Backgorund Image for all App -->
    <div class="row">
      <img class="backgroundImage" src='./assets/img/natural.png'>
    </div>

     <!-- Application Header -->
    <header class="row py-1 sticky-top">
      <h1 class="mx-2 font-weight-bold">Pocket Cash Calculator</h1>
    </header>
          
    <!-- Row for Trip Details/Expense Details/Trip info Sections-->
    <div class="row text-center">
      
      <!-- Trip Details Section -->   
      <trip-details />

      <!-- Trip Info section -->
      <trip-info :class="{inactive: !startFormIsValid || tripStatus.notStarted}"/>    
      
      <!-- Expense Details Section -->
      <expense-details :class="{inactive: !startFormIsValid || tripStatus.notStarted}"/>

    </div>  

    <!-- Global container for Trip list -->
    <div class="row py-1 text-center">
      <trips-list :allTrips="tripsList" />        
    </div>
   
  </div>  
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import TripDetails from './components/TripDetails.vue';
import TripInfo from './components/TripInfo.vue';
import ExpenseDetails from './components/ExpenseDetails.vue';
import TripsList from './components/TripsList.vue';

export default {
  name: 'App',

  computed: {
    ...mapState({     
      tripStatus: state => state.trip.tripStatus,
      tripDescription: state => state.trip.tripDescription,
      tripDateStart: state => state.trip.tripDateStart,
      tripDateEnd: state => state.trip.tripDateEnd,
      tripTotalCash: state => state.trip.tripTotalCash,
      tripsList: state => state.tripsList
    }),
    
    startFormIsValid () {
      return this.tripDescription && this.tripDateStart && this.tripDateEnd && this.tripTotalCash;
    }
  },

  methods: {
    ...mapActions(['fetchAllTrips']),
    ...mapMutations(['updateTripStatus']),       
  },

  async mounted() {
    this.fetchAllTrips();
  },

  updated() {
    this.updateTripStatus();
  },

  components: {
    TripDetails,
    TripInfo,
    ExpenseDetails,
    TripsList
  }

}
</script>

<style>
  /* Global styles */
  .backgroundImage {
    position: fixed;
    width: 100%;
    height: 100%;
    opacity: .33;
  }

  .container-fluid {
    background-color: #dfedfca8;
  }

  header {
    background-color: #bddbf5;  
  }

  input, textarea {
    border: 0px;
    border-radius: 3px;
    font-family: "Titillium Web";
  }

  input:hover, textarea:hover {
    cursor: pointer;
    background-color: #bddbf5;
  }

  button {
    background-color: #d9e1e9;
    font-family: "Titillium Web";
    font-weight: 600;
  }

  img {
    height: 14px;
    width: 14px;
  }

  /* Text styles */
  p, h1, h3, label, button, summary {
    font-family: "Titillium Web";
  }

  p, label {
    font-weight: 700;
    text-shadow: #54aaf0 0 0 3px;
  }

  p.text-white {
    font-size: 1.1em;
    text-shadow: #000000 0 0 10px;
    font-weight: 700;
  }
 
  /* Table styles */
  tbody tr:hover {
    background-color: #bddbf5!important;
  }

  .activeRow {
    background-color: #9fcff8!important;
  }

  th {
    font-size: 1.1em;
  }

  td > img:hover {
    cursor: pointer;
  }

  /* Styles used for computed visualisation */
  .inactive {
    display: none;
  }
</style>