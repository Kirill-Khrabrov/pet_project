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
      spendDate: new Date().toLocaleDateString(),
      spendCash: 0, 
    },

    computed: {
      startFormIsValid: function() {
        return this.description && this.dateStart && this.dateEnd && this.totalCash;
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
          if ((this.dayEnd - this.dayStart) > 0) {
            return this.dayEnd - this.dayStart + 1;
          }
        },

        daysLeft: function() {
        //counting days  remaining till trip ends
          return this.dayEnd - this.dayNow() + 1;
        },

        cashLeft: function() {
        //counting remaining budjet
          if (this.spendsList.length == 0) {
            return this.totalCash;
        
          } else {
            let copiedTotalCash = this.totalCash;
          
            this.spendsList.forEach(spend => {
              copiedTotalCash -= spend.spends_sum;
            });

            return copiedTotalCash;
          }
          
        },

        totalSpends: function() {
        //counting all spendings
          if (this.spendsList.length == 0) {
            return 0;
      
        } else {
          let totalSpends = 0;

          this.spendsList.forEach(spend => {
            totalSpends += spend.spends_sum;
          });

          return totalSpends;
        }  
        
        

        },

        everydayCash: function() {
        //counting average sum for day
          return Math.round(this.cashLeft / this.daysLeft);
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
               
       fetch('http://localhost:4001/api/trips').
          then(response => {
            if (response.ok){
              return response.json();
            }
            throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)).
          
          then(jsonResponse => {
            
            //refill tripList with rows from Trips.DB
            this.tripsList = jsonResponse;
            
            console.log(this.tripsList);

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

      //GET specific Spend
      getSpecificSpend: function(target) {

        console.log(`Sending GET specific Request`);
        
        fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends/${target.spendId}`).
          then(response => {
            if (response.ok){
              return response.json();
            }
            throw new Error('Request failed!');

          }, networkError => console.log(networkError.message)).
          
          then(jsonResponse => {
            console.log(`GET request: ${Object.entries(jsonResponse)}`);
            this.spendDescription = jsonResponse.description;
            this.spendCash = jsonResponse.spends_sum;
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
              this.specifiedTripId = jsonResponse.trip.id;
        });
        
      },

      //Spend to DB
      saveSpendToDatabase: function() {
        
        const newSpend = {
          tripId: this.specifiedTripId,
          date: this.spendDate,
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
              this.spendsList.push(jsonResponse.spend);
        });
        
      },

    //DELETE...................... 
      //Trip from DB
      removeTripFromDatabase: function(target) {
        
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

      //Spend from DB
      removeSpendFromDatabase: function(target) {
        
        console.log(`Sending Delete Request`);
        
        const fetchOptions = {
          method: 'DELETE'
        };

        fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends/${target.spendId}`, fetchOptions).
          then(response => {
            
            if (!response.ok) {
              return new Promise(resolve => resolve(null));
            }
            return response;
          }).
          then(() => {
            this.spendsList = this.spendsList.filter(spend => spend.id !== target.spendId);          
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
               
              
              this.tripsList.forEach(trip => {

                if (trip.id === jsonResponse.trip.id) {
                  let indexOfUpdatedTrip = this.tripsList.indexOf(trip);

                  this.tripsList.splice(indexOfUpdatedTrip, 1, jsonResponse.trip);
                }
              
              })
                       
            });
                     
      },

          
      resetSpendingFields: function() {
        //resets SpndAdd_Form fields
        this.spendDescription = '';
        this.spendCash = 0;
      },

    },
    
    watch: {
      
      specifiedTripId: function () {
       
          // reset the spends list for refilling it from Spends.BD
          //this.spendsList.length = 0;
          //this.resetSpendingFields();
          
         fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends`).
            then(response => {
              if (response.ok){
                return response.json();
              }
              throw new Error('Request failed!');
              }, networkError => console.log(networkError.message)).
            
            then(jsonResponse => {
              
              //refill tripList with rows from Trips.DB
              this.spendsList = jsonResponse; 
              
              this.spendsList.forEach(spend => console.log(spend));
  
            });

      },

      totalDays: function() {
        //section to control the status
        if (this.startFormIsValid) {
        
          if (this.dayNow() - this.dayStart < 0) {
          
            this.status.notStarted = true;
            this.status.inProcess = false;
            this.status.finished = false;
            console.log(`Trip is not started: todays is ${this.dayNow()} and trip starts at ${this.dayStart}`);
    
         } else if (this.dayNow() - this.dayStart >= 0 && this.dayNow() - this.dayEnd <= 0) {
            this.status.notStarted = false;
            this.status.inProcess = true;
            this.status.finished = false;
            console.log(`Trip is in process: todays is ${this.dayNow()}, trip starts at ${this.dayStart} and ends at ${this.dayEnd}`);

         } else if (this.dayNow() - this.dayEnd > 0) { 
            this.status.notStarted = false;
            this.status.inProcess = false;
            this.status.finished = true;
            console.log(`Trip finished: todays is ${this.dayNow()}, trip ends at ${this.dayEnd}`);
          }
       }

      }


    },
      
     // adding lifecircle hooks
     // test
    created: function() {
      this.getAllTrips();

    },

  });