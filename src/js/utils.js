
    // GET.............................................. 
    // ...all Trips form DB
    const getAllTrips = () => {     
      
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
      };
  
      // ...specific Trip from DB
      const getSpecificTrip = (target) => {
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
  
      };
  
      // ...specific Spend form DB
      const getSpecificSpend = (target) => {
        
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
  
      };
  
      // POST............................................
      // ...new Trip to DB
     const saveTripToDatabase = () => {
        
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
          
      };
  
      // ...new Spend to DB
      const saveSpendToDatabase = () => {
        
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
          
      };
  
      // DELETE...........................................
      // ...Trip from DB
      const removeTripFromDatabase = (target) => {
           
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
  
      };
  
        // ...Spend from DB
      const removeSpendFromDatabase = (target) => {
        
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
  
      };
  
      // UPDATE...........................................
      // ...Trip in DB
      const saveTripChangesToDatabase = () => {
  
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
                       
      };
  
      // ...Spend in DB
      const saveSpendChangesToDatabase = () => {
        
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
                       
      };     

export { getAllTrips, 
         getSpecificTrip, 
         getSpecificSpend,
         saveTripToDatabase,
         saveSpendToDatabase, 
         removeTripFromDatabase,
         removeSpendFromDatabase,
         saveTripChangesToDatabase,
         saveSpendChangesToDatabase }