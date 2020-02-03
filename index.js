const app = new Vue({
    el: '#app',
    
    data: {
      //trip properties
      description: '',
      dateStart: '',        
      dateEnd: '',          
      totalCash: 0,
      specifiedTripId: 0,
      status: {
        notStarted: false,
        inProcess: false,
        finished: false
      },

      // save all trips and all spendings retrived from DB
      tripsList: [],
      spendsList: [],

      //spend properties
      spendDescription: '',
      spendCash: 0, 
    },

    computed: {
      startFormIsValid: function() {
        if (this.description && this.dateStart && this.dateEnd && this.totalCash) {
          return true;
        } else {
          return false;
        }
      },
      

      //section for days calculations
      dayStart: {
        get: function() {
          return Math.floor(new Date(this.dateStart) / (1000 * 3600 * 24));
        }
      },

      dayEnd: {
        get: function() {
          return Math.floor(new Date(this.dateEnd) / (1000 * 3600 * 24));
        }
      },

      totalDays: function() {
        //counting total days depending on start and end dates
        if ((this.dayEnd - this.dayStart) < 0) {
          alert('End of the trip can not be earlier than it starts');
        } else {
          return this.dayEnd - this.dayStart + 1;
        }
      },

      daysLeft: function() {
        //counting days  remaining till trip ends
        return this.dayEnd - this.dayNow() + 1;
      },



      cashLeft: function() {
        //counting remaining budjet
      },

      everydayCash: function() {
        // NOT WORKS PROPERLLY
        //counting average sum for day
        return Math.round(this.totalCash / this.daysLeft);
      },

      
    },
    
    methods: {

      dayNow: function() {
          return Math.floor(new Date() / (1000 * 3600 * 24));
      },

      dateNow: function() {
          return new Date().toLocaleDateString();
      },


      resetStrtForm: function() {
        //reset StrtForm 
        this.description = '';
        this.dateStart = '';
        this.dateEnd = '';
        this.totalCash = 0;
      },

      
// CRUD Functionallity
    // GET.............................................. 
      
      //all Trips form DB
      getAllTrips: function () {
        // reset the trip list for refilling it from Trops.BD
        this.tripsList.length = 0;
        
       fetch('http://localhost:4001/api/trips').
          then(response => {
            if (response.ok){
              return response.json();
            }
            throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)).
          
          then(jsonResponse => {
            
            //refill tripList with rows from Trips.DB
            for (let i = 0; i < jsonResponse.length; i++) {
              this.tripsList.push(jsonResponse[i]);
            }

            console.log(this.tripsList);

          });
      },

      //all Spends form DB
      getAllSpends: function () {
        // reset the spends list for refilling it from Spends.BD
        this.spendsList.length = 0;
        
       fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends`).
          then(response => {
            if (response.ok){
              return response.json();
            }
            throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)).
          
          then(jsonResponse => {
            
            //refill tripList with rows from Trips.DB
            for (let i = 0; i < jsonResponse.length; i++) {
              this.spendsList.push(jsonResponse[i]);
            }

            console.log(this.spendsList);

          });
      },

      //GET specific Trip
      getSpecificTrip: function(target) {

        console.log(`Sending GET specific Request`);
        
        fetch(`http://localhost:4001/api/trips/${target.tripId}`).
          then(response => {
            if (response.ok){
              return response.json();
            }
            throw new Error('Request failed!');

          }, networkError => console.log(networkError.message)).
          
          then(jsonResponse => {
            console.log(`GET request: ${Object.entries(jsonResponse)}`);
            this.specifiedTripId = jsonResponse.id;
            this.description = jsonResponse.description;
            this.dateStart = jsonResponse.trip_start;
            this.dateEnd = jsonResponse.trip_end;
            this.totalCash = jsonResponse.total_cash;
        });

      },

      //POST..............................................
      //Trip to DB
      saveTripToDatabase: function() {
        
        const newTrip = {
          description: this.description,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
          totalCash: this.totalCash,
        };

        const fetchOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'                     
          },
          body: JSON.stringify({ trip: newTrip })
        };

        fetch('http://localhost:4001/api/trips', fetchOptions).
          then(response => {
            if (response.ok){
              return response.json();
            }
            throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)).
            
            then(jsonResponse => {
              console.log(jsonResponse.trip);
              this.tripsList.push(jsonResponse.trip);
        });
        
      },

      //Spend to DB
      saveSpendToDatabase: function() {
        
        const newSpend = {
          date: this.dateNow(),
          description: this.spendDescription,
          spendCash: this.spendCash,
        };

        const fetchOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'                     
          },
          body: JSON.stringify({ spend: newSpend })
        };

        fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends`, fetchOptions).
          then(response => {
            if (response.ok){
              return response.json();
            }
            throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)).
            
            then(jsonResponse => {
              console.log(jsonResponse.spend);
              this.spends.push(jsonResponse.spend);
        });
        
      },

    //DELETE Trip from DB
      removeFromDatabase: function(target) {
        
        console.log(`Sending Delete Request`);
        
        const fetchOptions = {
          method: 'DELETE'
        };

        fetch(`http://localhost:4001/api/trips/${target.tripId}`, fetchOptions).
          then(response => {
            
            if (!response.ok) {
              return new Promise(resolve => resolve(null));
            }
            return response;
          }).
          then(() => {
            this.tripsList = this.tripsList.filter(trip => trip.id !== target.tripId);          
        });

      },

    //UPDATE Trip to DB
      saveChangesToDatabase: function() {

        console.log('Sending PUT request');

        const updatedTrip = {
          description: this.description,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
          totalCash: this.totalCash,
        };

        const fetchOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'                     
          },
          body: JSON.stringify({ trip: updatedTrip })
        };

        
        fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}`, fetchOptions).
          then(response => {
            if (response.ok){
              return response.json();
            }
            throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)).
            
            then((jsonResponse) => {
               
              const indexOfUpdatedTrip = this.tripsList.indexOf(jsonResponse.trip);
              this.tripsList.splice(indexOfUpdatedTrip, 1, jsonResponse.trip);

              });
                     
      },

          
      resetSpendingFields: function() {
        //resets SpndAdd_Form fields
        this.todaysSpendings = 0;
      },

    },
      
     // adding lifecircle hooks
     // test
    created: function() {
      console.log(`
        Vue app front page is created:
        description: ${this.description},
        date Start: ${this.dateStart},
        date End: ${this.dateEnd},
        total cash: ${this.totalCash},
        today is ${this.dateNow()}
       `)
    },

    updated: function() {
     
      if (this.startFormIsValid) {
        
        if (this.dayNow() - this.dayStart < 0) {
          this.status.notStarted = true;
          this.status.inProcess = false;
          this.status.finished = false;
          console.log('Trip is not started');
        
        } else if (this.dayNow() - this.dayStart > 0 && this.dayNow() - this.dayEnd < 0) {
          this.status.notStarted = false;
          this.status.inProcess = true;
          this.status.finished = false;
          console.log('Trip is in process');

        } else if (this.dayNow() - this.dayEnd > 0) {
          this.status.notStarted = false;
          this.status.inProcess = false;
          this.status.finished = true;
          console.log('Trip is finished');
        }
      }
    }


  });