const app = new Vue({
    el: '#app',
    data: {
      description: '',      //description ==> text
      dateStart: '',        //Date object ==> parsed to date format for sqllite
      dateEnd: '',          //Date object ==> parsed to date format for sqllite
      totalCash: 0,         //Total Budjet ==> parsed to Number
      todaySpendings: 0,    //Todays spendings 
      specifiedTripId: 0,
      trips: [],
      spendingList: [],
            
    },
    computed: {
      startFormIsValid: function() {
        if (this.description && this.dateStart && this.dateEnd && this.totalCash) {
          return true;
        } else {
          return false;
        }
      },
      

      tripStatus: function() {
        // check if Trip is started or not ==> used to show FrontEnd sections
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

      // GET all Trips form DB
      getAllTrips: function () {
        // reset the trip list for refilling it from Trops.BD
        this.trips.length = 0;
        
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
              this.trips.push(jsonResponse[i]);
            }

            console.log(this.trips);

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

      //POST Trip to DB
      saveToTripDatabase: function() {
        
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
              this.trips.push(jsonResponse.trip);
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
            this.trips = this.trips.filter(trip => trip.id !== target.tripId);          
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
            
            then(() => {

              this.getAllTrips();

              });
                     
      },

          
      saveSpending: function() {
        //saves the daily spending to database for current trip
       
      },

      resetSpendingFields: function() {
        //resets SpndAdd_Form fields
        this.todaysSpendings = 0;
      },

      developerPane: function() {
        console.log(`
          Trip description is: ${this.description}
          Trip starts at: ${this.dateStart}
          Trip end at ${this.dateEnd}
          Today is ${this.dateNow()}
          Total cash is ${this.totalCash}
          Todays spendings is: ${this.todaySpendings}
          List of trips is: ${this.tripList}
          List of spends ${this.spendingList}

        `);
        
        
        
      }



    },

    //--- test section
    // adding lifecircle hooks
    created: function() {
      console.log(`
        Vue app front page is created:
        description: ${this.description},
        date Start: ${this.dateStart},
        date End: ${this.dateEnd},
        total cash: ${this.totalCash},
        today is ${this.dateNow()}
       `)
    }
  });