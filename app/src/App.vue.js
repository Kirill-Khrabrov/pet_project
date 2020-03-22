const app = new Vue({
  
  el: '#app',
  
  data: {

    //>>> Trip properties
    // this trip properties are entered by user 
    // and saved to DB if user enters " + " button, 
    // or updated when user eters " save " button
    description: '',
    dateStart: '',        
    dateEnd: '',          
    totalCash: 0,

    // status of the trip calculated each time
    // when the site updates. Connected with VUE "Updated" lifecircle hook
    status: {
      notStarted: false,
      inProcess: false,
      finished: false
    },

    //>>> Spend properties
    // this spend properties are entered by user 
    // and saved to DB if user enters " + " button, 
    // or updated when user eters " save " button
    spendDescription: '',
    spendDate: new Date().toLocaleDateString(),  //for the state of the App all spends have this property equals to current Date
    spendCash: 0,

    //>>>Helper vars
    // these vars are replaced with ID of specified Trip / specified Spend,
    // when it is not 0, the Trip / Spend with specified ID is able to be deleted or updated
    specifiedTripId: 0,
    specifiedSpendId: 0,
      
    // vars for caching retrieved data from DB
    tripsList: [],  // cach for all Trips from Trip DB
    spendsList: [], // cach all Spends connected with specified Trip      
  },
    
  computed: {
    // control all fields of Trip form to be filled by user,
    // otherwise it is unable to save Trip to DB
    startFormIsValid () {
      return this.description && this.dateStart && this.dateEnd && this.totalCash;
    },

    // convert entered start Trip date to number
    dayStart () {
      return Math.floor(new Date(this.dateStart) / (1000 * 3600 * 24));
    },

    // convert entered end Trip date to number
    dayEnd () {
      return Math.floor(new Date(this.dateEnd) / (1000 * 3600 * 24));
    },

    // calculate trip length 
    totalDays () {
      if ((this.dayEnd - this.dayStart) > 0) {
        return this.dayEnd - this.dayStart + 1;
      }
    },

    // calculate number of days, remaining till trip ends
    daysLeft () {
      return this.dayEnd - this.dayNow() + 1;
    },

    // calculate remaining cash-on-hand
    cashLeft () {
        
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

    // calculate total expenses of the specified Trip
    totalSpends () {
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

    // calculate recommended daily cash amount
    everydayCash () {
      return Math.round(this.cashLeft / this.daysLeft);
    },
      
  },
    
  methods: {
  
    // return current date, converted into days number
    dayNow () {
      return Math.floor(new Date() / (1000 * 3600 * 24));
    },

    // return current Date
    dateNow () {
      return new Date().toLocaleDateString();
    },

    // reset Trip form to default values
    resetStrtForm () {    
      this.resetSpendingForm();
      this.spendsList.length = 0;
      this.specifiedTripId = 0;
      this.description = '';
      this.dateStart = '';
      this.dateEnd = '';
      this.totalCash = 0;       
    },

    // reset Spend form to default values
    resetSpendingForm () {      
      this.specifiedSpendId = 0;
      this.spendDescription = '';
      this.spendCash = 0;
    },

    // This Section is all about CRUD Functionallity
    // GET.............................................. 
    // ...all Trips form DB
    getAllTrips () {     
      
      fetch('http://localhost:4001/api/trips').
        then(response => {
          if (response.ok){
            return response.json();
          }
          
          throw new Error('Request failed!');
        
        }, networkError => console.log(networkError.message)).          
          then(jsonResponse => {
            //save rows from Trips DB to cache
            this.tripsList = jsonResponse;
          });
    },

    // ...specific Trip from DB
    getSpecificTrip (target) {
      // at first reset Spend Form 
      this.resetSpendingForm();
      
      fetch(`http://localhost:4001/api/trips/${target.tripId}`).
        then(response => {
          if (response.ok){
            return response.json();
          }
      
          throw new Error('Request failed!');
      
        }, networkError => console.log(networkError.message)).
          
          then(jsonResponse => {
            // overwrite Trip Data with retrieved from DB Trip  
            this.specifiedTripId = jsonResponse.id;
            this.description = jsonResponse.description;
            this.dateStart = jsonResponse.trip_start;
            this.dateEnd = jsonResponse.trip_end;
            this.totalCash = jsonResponse.total_cash;
          });

    },

    // ...specific Spend form DB
    getSpecificSpend (target) {
      
      fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends/${target.spendId}`).
        then(response => {
          if (response.ok){
            return response.json();
          }
      
          throw new Error('Request failed!');

        }, networkError => console.log(networkError.message)).
          
          then(jsonResponse => {
            // overwrite Spend Data with retrieved from DB Spend
            this.spendDescription = jsonResponse.description;
            this.spendCash = jsonResponse.spends_sum;
            this.specifiedSpendId = jsonResponse.id;
          });

    },

    // POST............................................
    // ...new Trip to DB
    saveTripToDatabase () {
      
      // var for saving body for POST request
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
            // cache new Trip info
            this.tripsList.push(jsonResponse.trip);
            // refresh the specified Trip ID
            this.specifiedTripId = jsonResponse.trip.id;
          });
        
    },

    // ...new Spend to DB
    saveSpendToDatabase () {
      
      // var for saving body for POST request  
      const newSpend = {
        tripId: this.specifiedTripId, // this ID taken from specified by User Trip 
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
            // cache new Spend info
            this.spendsList.push(jsonResponse.spend);
          });
        
    },

    // DELETE...........................................
    // ...Trip from DB
    removeTripFromDatabase (target) {
         
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
            // overwrite cached Trip List by filtering deleted Trip
            this.tripsList = this.tripsList.filter(trip => trip.id !== target.tripId);            
            // clear the Spending List
            this.spendsList.length = 0;
            return;          
        });

    },

      // ...Spend from DB
    removeSpendFromDatabase (target) {
      
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
            return;          
        });

    },

    // UPDATE...........................................
    // ...Trip in DB
    saveTripChangesToDatabase () {

      // var for saving body for PUT request
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
            
            // refresh cached Trips List
            this.tripsList.forEach(trip => {

              if (trip.id === jsonResponse.trip.id) {
                let indexOfUpdatedTrip = this.tripsList.indexOf(trip);
                this.tripsList.splice(indexOfUpdatedTrip, 1, jsonResponse.trip);
              }
             
            });
                       
          });
                     
    },

    // ...Spend in DB
    saveSpendChangesToDatabase () {
      
      // var for saving body for PUT request
      const updatedSpend = {
        description: this.spendDescription,
        date: this.spendDate,
        spendCash: this.spendCash,
      };

      const fetchOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'                     
        },
        body: JSON.stringify({ spend: updatedSpend })
      };
      
      fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends/${this.specifiedSpendId}`, fetchOptions).
      then(response => {
      
        if (response.ok){
          return response.json();
        }
      
        throw new Error('Request failed!');
      
      }, networkError => console.log(networkError.message)).
      
        then((jsonResponse) => {
          
          // refresh cached Spends List
          this.spendsList.forEach(spend => {
            
            if (spend.id === jsonResponse.spend.id) {
              let indexOfUpdatedSpend = this.spendsList.indexOf(spend);
              this.spendsList.splice(indexOfUpdatedSpend, 1, jsonResponse.spend);
            }
              
          });
                       
        });
                     
    },     

  },
    
  watch: {
    
    // when user clicks on prefered Trip, specifiedTripId changes
    // this automatically refreshes the SpendsList for prefered Trip
    specifiedTripId () {
      
      if (this.specifiedTripId !== 0) {
        
        fetch(`http://localhost:4001/api/trips/${this.specifiedTripId}/spends`).
          then(response => {
        
            if (response.ok){
              return response.json();
            }
        
            throw new Error('Request failed!');
        
          }, networkError => console.log(networkError.message)).
          
            then(jsonResponse => {
              
              // refresh cached Spends List with rows from DB
              this.spendsList = jsonResponse;
            
            });
          
        }

    },

  },
      
  // cache all Trips from DB at the very start of the App
  created () {
    this.getAllTrips();
  },
  
  // control Trip status at the every User's step
  updated () {
    
    if (this.startFormIsValid) {
      
      if (this.dayNow() - this.dayStart < 0) {
        this.status.notStarted = true;
        this.status.inProcess = false;
        this.status.finished = false;
  
      } else if (this.dayNow() - this.dayStart >= 0 && this.dayNow() - this.dayEnd <= 0) {
        this.status.notStarted = false;
        this.status.inProcess = true;
        this.status.finished = false;

      } else if (this.dayNow() - this.dayEnd > 0) { 
        this.status.notStarted = false;
        this.status.inProcess = false;
        this.status.finished = true;

      }
    
    }

  }

});