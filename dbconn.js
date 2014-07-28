
// The first thing we want to do is create the local
// database (if it doesn't exist) or open the connection
// if it does exist. Let's define some options for our
// test database.
var databaseOptions = {
		fileName: "fuzzydb",
		version: "1.0",
		displayName: "infolist",
		maxSize: 1024
};
 
// Now that we have our database properties defined, let's
// creaete or open our database, getting a reference to the
// generated connection.
//
// NOTE: This might throw errors, but we're not going to
// worry about that for this Hello World example.
var database = openDatabase(
		databaseOptions.fileName,
		databaseOptions.version,
		databaseOptions.displayName,
		databaseOptions.maxSize
);
 
 
// -------------------------------------------------- //
// -------------------------------------------------- //
 
 
// Now that we have the databse connection, let's create our
// first table if it doesn't exist. According to Safari, all
// queries must be part of a transaction. To execute a
// transaction, we have to call the transaction() function
// and pass it a callback that is, itself, passed a reference
// to the transaction object.
database.transaction(
		function( transaction ){
 
// Create table if it doesn't exist.
		transaction.executeSql(
				"CREATE TABLE IF NOT EXISTS infolist (" +
						"id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
						"nonce INTEGER NOT NULL" +
            "nym TEXT NOT NULL" +
						"contact TEXT NOT NULL" +
						"lat REAL NOT NULL" +
						"longi REAL NOT NULL" +
						"radius REAL NOT NULL" +
						");"
		);
		
}
);
 
 
// -------------------------------------------------- //
// -------------------------------------------------- //
 
 
// Now that we have our database table created, let's
// create some "service" functions
// NOTE: Since SQLite database interactions are performed
// asynchronously by default (it seems), we have to provide
// callbacks to execute when the results are available.
 
 
var saveEntry = function( name, callback ){
		// Insert a new entry.
		database.transaction(
				function( transaction ){
 
						// Insert a new entry with the given values.
						transaction.executeSql(
								(
										"INSERT INTO infolist (" +
												"nonce " +
												" ) VALUES ( " +
												"? " +
												");"
								),
								[
										nonce, nym, contact, lat, longi, radius
								],
								function( transaction, results ){
										// Execute the success callback,
										// passing back the newly created ID.
										callback( results.insertId );
								}
						);
						
				}
		);
};


// retrieve all entries
var getEntries = function( callback ){
		database.transaction(
				function( transaction ){
						
						// Get all the entries in the table.
						transaction.executeSql(
								(
										"SELECT " +
												"* " +
												"FROM " +
												"infolist " +
												"ORDER BY " +
												"nym ASC"
								),
								[],
								function( transaction, results ){
										// Return the results set.
										callback( results );
								}
						);
						
				}
		);
};
 
 
// Delete all entries
var deleteEntries = function( callback ){
		database.transaction(
				function( transaction ){
 
						transaction.executeSql(
								(
										"DELETE FROM " +
												"infolist "
								),
								[],
								function(){
										// Execute the success callback.
										callback();
								}
						);
						
				}
		);
};
 

// -------------------------------------------------- //
// -------------------------------------------------- //
 
 
// When the DOM is ready, init the scripts.
$(function(){
		// Get the form.
		var form = $( "form" );
		
		// Get the list.
		var list = $( "#infolist" );
		
		// Get the clear list link.
		var clearList = $( "#clearlist" );
 
 
		// Reinitialize list
		var refreshList = function( results ){
				// Clear out the list.
				list.empty();
				
				// Check to see if we have any results.
				if (!results){
						return;
				}
 
				// Loop over the current list and add them
				// to the visual list.
				$.each(
						results.rows,
						function( rowIndex ){
		var row = results.rows.item( rowIndex );
								
								// Append the list item.
								list.append( "<li>" + row.name + "</li>" );
						}
				);
		};
 
		
		// Bind the form to save entry.
		form.submit(
				function( event ){
						// Prevent the default submit.
						event.preventDefault();
						
						// Save the entry.
						saveEntry(
								form.find( "input.nym" ).val(),
								function(){
										// Reset the form and focus the input.
										form.find( "input.nym" )
												.val( "" )
												.focus();
										
										// Refresh the list.
										getEntries( refreshList );
								}
						);
				}
		);
		
		
		// Bind to the clear link.
		clearEntries.click(
				function( event ){
						// Prevent default click.
						event.preventDefault();
						
						// Clear the list
						deleteEntries( refreshList );
				}
		);
		
		
		// Refresh the list - this will pull the persisted
		// list data out of the SQLite database and put it into
		// the UL element.
		getEntries( refreshList );
});
