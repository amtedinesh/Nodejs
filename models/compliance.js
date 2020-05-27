const mongoose=require('mongoose');

//Compliance schema
const complianceSchema=mongoose.Schema({
    cloudid: {type:mongoose.Schema.Types.ObjectId,
    ref:"cloud" //cloudid of Cloud schema used as reference in Compliance Schema
    },  
    complianceDate:{
        type:Date,
        default:Date.now() //Current date
    },
    control:{
        type:String,
        required:true
    },
    subservice:{
        type:String,
        required:true
    },
    resourcetype:{
        type:String,
        required:true
    },
    severity:{
        type:String,
        required:true
    },
    impactedresources:{
        type:String,
        required:true
    },
    region:{
        type:String,
        required:true
    },
    resourcename:{
        type:String,
        required:true
    },
    errorlength:{
        type:String,
        required:true
    },

})
mongoose.model('compliance',complianceSchema);

module.exports = mongoose.model('compliance');
