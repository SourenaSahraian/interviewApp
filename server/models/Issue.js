 var mongoose= require('mongoose');

 var issue_schema= new mongoose.Schema({

 	title :{
 		type: String,
 		required:true
 	},
 	content:{
 		type: String,
 		required:true
 	}

 })

 //exporting this model
module.exports= issue_schema;