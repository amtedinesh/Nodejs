const mongoose=require('mongoose');
const assert=require('assert');
const db_url=process.env.DB_URL;

mongoose.connect(
    db_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology:true,
        useCreateIndex:true,
        //useFindAndModify:false
    },
    function(error,link){
        assert.equal(error,null,'DB connect fail....');   //check error
        console.log('DB connect success');
       // console.log(link);
    }

);
