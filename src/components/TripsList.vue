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
                  <tr v-for="trip in allTrips" :key="trip.id" >
                    <td>
                      <img src="public/img/x-circle.svg">
                    </td>
                    <td>{{ trip.description }}</td>
                    <td>{{ trip.trip_start }}</td>
                    <td>{{ trip.trip_end }}</td>
                    <td>{{ trip.total_cash }}</td>                    
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
    }
}
</script>