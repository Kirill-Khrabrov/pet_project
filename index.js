//test section

const app = new Vue({
    el: '#app',
    data: {
      description: '',      //description ==> text
      dateStart: '',        //Date object ==> parsed to date format for sqllite
      dateEnd: '',          //Date object ==> parsed to date format for sqllite
      totalCash: 0,      //Total Budjet ==> parsed to Number
      todaySpendings: 0,   //Todays spendings 
      tripId: 0,
      spendId: 0,
      tripList: [],
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
        if (this.daysLeft == 0) {
          return 'finished';
        } else {
          return 'in process';
        }
      },

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

      dayNow: {
        get: function() {
          return Math.floor(new Date() / (1000 * 3600 * 24));
        }
      },

      dateNow: {
        get: function() {
          return new Date().toString();
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
        return this.dayEnd - this.dayNow + 1;
      },

      cashLeft: function() {
        //counting remaining budjet
      },

      everydayCash: function() {
        //counting average sum for day
        return Math.round(this.totalCash / this.daysLeft);
      },

      
    },
    
    methods: {

      startTrip: function() {
        //functions that starts trip and makes the SpndVis section  active
      },

      resetStrtForm: function() {
        //reset StrtForm 
        this.description = '';
        this.dateStart = '';
        this.dateEnd = '';
        this.totalBudject = 0;
      },

      saveTrip: function() {
        //saves the trip info to database
        const tripObject = {};

        tripObject.id = this.tripId++;
        tripObject.description = this.description;
        tripObject.start = this.dateStart;
        tripObject.end = this.dateEnd;
        tripObject.cash = this.totalCash;
        tripObject.listOfSpendings = [];

        this.tripList.push(tripObject);
        

      },

      showSavedTrips: function() {
        //retrieves the saved trips from database and renders them
      },

      saveSpending: function() {
        //saves the daily spending to database for current trip
        const todaySpendsObject = {};

        todaySpendsObject.id = this.spendId++;
        todaySpendsObject.cash = this.todaySpendings;

        this.spendingList.push(todaySpendsObject);
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
          Today is ${this.dateNow}
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
        trip ID: ${this.tripId},
        spend ID: ${this.spendId},
      `)
    }
  });